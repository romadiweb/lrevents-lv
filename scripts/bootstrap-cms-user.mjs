// Run locally with the website's ignored .env.local. Never prints credentials.
import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
nextEnv.loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url || new URL(url).hostname !== 'kvugvrxyqfaytgmmfdfx.supabase.co') throw Error('Wrong website project; bootstrap stopped.');
if (!process.env.SUPABASE_SECRET_KEY) throw Error('Missing server secret.');
const client = createClient(url, process.env.SUPABASE_SECRET_KEY, {auth:{persistSession:false,autoRefreshToken:false}});
const email = 'roberts.dzerins@romadi.lv';
let user;
for (let page=1; ;page++) {
  const {data,error} = await client.auth.admin.listUsers({page,perPage:100});
  if (error) throw Error(`Cannot inspect auth accounts: ${error.code || error.status}`);
  user = data.users.find(entry=>entry.email?.toLowerCase()===email);
  if (user || data.users.length < 100) break;
}
if (!user) {
  const password = randomBytes(24).toString('base64url');
  const {data,error} = await client.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{first_name:'Roberts',last_name:'Džeriņš'}});
  if (error || !data.user) throw Error(`Account creation failed: ${error?.code || error?.status}`);
  user = data.user;
  const directory = path.join(homedir(),'.codex','private');
  await mkdir(directory,{recursive:true,mode:0o700});
  const credentialsPath = path.join(directory,'lrevents-first-login.txt');
  await writeFile(credentialsPath,`LR Events CMS\nLogin: http://localhost:3000/login\nEmail: ${email}\nInitial password: ${password}\n\nAfter login, change the password at /auth/password.\n`,{mode:0o600,flag:'wx'});
  console.log('Auth account created. Initial credentials saved privately outside the repository.');
} else {
  const {error} = await client.auth.admin.updateUserById(user.id,{user_metadata:{...user.user_metadata,first_name:'Roberts',last_name:'Džeriņš'}});
  if (error) throw Error('Could not update account display name.');
  console.log('Existing account retained; no password changed. Display name updated.');
}
const {error} = await client.from('cms_users').upsert({id:user.id,email,first_name:'Roberts',last_name:'Džeriņš',active:true});
if (error) console.log(`CMS profile pending database migration (${error.code}). Run bootstrap again after applying the migration.`);
else console.log('CMS profile ready: Roberts Džeriņš.');
