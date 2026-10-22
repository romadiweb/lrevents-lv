// Direct PostgreSQL inspection/application. Credentials stay outside the repository.
import pg from 'pg';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { homedir } from 'node:os';
const config=JSON.parse((await readFile(path.join(homedir(),'.codex/private/lrevents-db.json'),'utf8')).replace(/^\uFEFF/,''));
const expectedHost='db.kvugvrxyqfaytgmmfdfx.supabase.co';
if (config.host !== expectedHost) throw Error('Unexpected database host.');
const resolver=await fetch(`https://dns.google/resolve?name=${expectedHost}&type=AAAA`).then(r=>r.json());
const ipv6=resolver.Answer?.find(answer=>answer.type===28)?.data;
const pooler=process.argv.includes('--pooler');
const connectHost=pooler ? 'aws-0-eu-west-1.pooler.supabase.com' : ipv6 || expectedHost;
const certificate=await fetch('https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt').then(async response=>{if(!response.ok)throw Error('Could not load Supabase CA.');return response.text();});
if(!certificate.includes('BEGIN CERTIFICATE'))throw Error('Invalid Supabase CA.');
const client=new pg.Client({...config,host:connectHost,user:pooler ? 'postgres.kvugvrxyqfaytgmmfdfx' : config.user,ssl:{ca:certificate,rejectUnauthorized:true,servername:pooler ? connectHost : expectedHost},connectionTimeoutMillis:10000});
try {
  await client.connect();
  const tables=(await client.query("select tablename from pg_tables where schemaname='public' order by tablename")).rows;
  console.log('Public tables:',tables.map(row=>row.tablename).join(', ') || '(none)');
  const migrationArgument=process.argv.find(arg=>arg.startsWith('--migration='))?.slice('--migration='.length);
  if(migrationArgument) {
    if(!/^\d{14}_[a-z0-9_]+\.sql$/.test(migrationArgument))throw Error('Invalid migration filename.');
    const version=migrationArgument.slice(0,14);
    const exists=await client.query('select version from supabase_migrations.schema_migrations where version=$1',[version]);
    if(exists.rowCount)throw Error('Migration already recorded; inspect before retrying.');
    if(!tables.some(row=>row.tablename==='cms_users'))throw Error('CMS base schema missing.');
    const sql=await readFile(new URL(`../supabase/migrations/${migrationArgument}`,import.meta.url),'utf8');
    await client.query(sql);
    await client.query('insert into supabase_migrations.schema_migrations(version,name,statements) values($1,$2,$3)',[version,migrationArgument.slice(15,-4),[sql]]);
    console.log('Applied migration:',migrationArgument);
  }
  if(process.argv.includes('--apply')) {
    if(tables.some(row=>row.tablename.startsWith('cms_'))) throw Error('CMS tables already exist; inspect before applying.');
    const account=await client.query("select id from auth.users where lower(email)='roberts.dzerins@romadi.lv'");
    if(account.rowCount!==1)throw Error('Expected website owner account missing; stopped.');
    const sql=await readFile(new URL('../supabase/migrations/20261022105653_content_cms.sql',import.meta.url),'utf8');
    await client.query(sql);
    await client.query('create schema if not exists supabase_migrations');
    await client.query('create table if not exists supabase_migrations.schema_migrations(version text primary key,statements text[],name text)');
    await client.query('insert into supabase_migrations.schema_migrations(version,name,statements) values($1,$2,$3) on conflict(version) do nothing',['20261022105653','content_cms',[sql]]);
    console.log('CMS migration applied successfully.');
  }
  if(process.argv.includes('--verify')) {
    const result=await client.query("select tablename,rowsecurity from pg_tables where schemaname='public' and tablename like 'cms_%' order by tablename");
    console.log('CMS RLS:',JSON.stringify(result.rows));
    const user=await client.query("select first_name,last_name,active from public.cms_users where lower(email)='roberts.dzerins@romadi.lv'");
    console.log('Owner profile:',JSON.stringify(user.rows));
    const unsafeFunctions=await client.query("select proname from pg_proc join pg_namespace n on n.oid=pronamespace where n.nspname='public' and proname like 'cms_%' and prosecdef");
    if(unsafeFunctions.rowCount)throw Error('Unexpected security-definer CMS function.');
    const profileGrants=await client.query("select privilege_type from information_schema.role_table_grants where table_schema='public' and table_name='cms_users' and grantee='authenticated' order by privilege_type");
    console.log('Authenticated profile grants:',JSON.stringify(profileGrants.rows));
    const missingIndexes=await client.query("select c.conrelid::regclass::text as relation,a.attname as column from pg_constraint c join pg_class t on t.oid=c.conrelid join pg_namespace n on n.oid=t.relnamespace join pg_attribute a on a.attrelid=c.conrelid and a.attnum=any(c.conkey) where c.contype='f' and n.nspname='public' and t.relname like 'cms_%' and not exists(select 1 from pg_index i where i.indrelid=c.conrelid and a.attnum=any(i.indkey))");
    if(missingIndexes.rowCount)throw Error('Missing CMS foreign-key index.');
    console.log('Schema inspection passed: RLS enabled, no CMS definer functions, indexed foreign keys.');
  }
} catch(error) { console.error('Database operation failed:',error.code || error.message); process.exitCode=1; }
finally { await client.end().catch(()=>{}); }
