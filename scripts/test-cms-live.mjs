// Opt-in integration test: creates clearly labelled temporary records, then removes them.
import assert from 'node:assert/strict';
import nextEnv from '@next/env';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import {readFile} from 'node:fs/promises';
import {homedir} from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
nextEnv.loadEnvConfig(process.cwd());
if(!process.argv.includes('--run'))throw Error('Explicit --run required for temporary live test records.');
const base='http://localhost:3000';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const credentials=await readFile(path.join(homedir(),'.codex/private/lrevents-first-login.txt'),'utf8');
const password=credentials.match(/Initial password: (.+)/)?.[1];
if(!password)throw Error('Initial local test credentials unavailable.');
const jar=new Map();
const client=createServerClient(url,key,{cookies:{getAll:()=>[...jar].map(([name,value])=>({name,value})),setAll:values=>values.forEach(({name,value})=>jar.set(name,value))}});
const {error:loginError}=await client.auth.signInWithPassword({email:'roberts.dzerins@romadi.lv',password});
assert.ifError(loginError);
const admin=createClient(url,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const anon=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const cookie=()=>[...jar].map(([name,value])=>`${name}=${value}`).join('; ');
const suffix=Date.now().toString(36), title=`CMS pārbaude ${suffix}`;
const ids=[], media=[];
async function request(section,payload,authenticated=true,origin=base){
  const response=await fetch(`${base}/api/admin/${section}`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(authenticated?{Cookie:cookie()}: {})},body:JSON.stringify(payload)});
  return {status:response.status,data:await response.json()};
}
async function save(section,payload){const r=await request(section,payload);assert.equal(r.status,200,`${section}: ${JSON.stringify(r.data)}`);}
async function find(table,column,value){const {data,error}=await admin.from(table).select('*').eq(column,value).single();assert.ifError(error);ids.push([table,data.id]);return data;}
try{
  assert.equal((await request('kategorijas',{name:title},false)).status,401);
  assert.equal((await request('kategorijas',{name:title},true,'https://example.test')).status,403);
  const denied=await anon.from('cms_users').select('*');assert.ok(denied.error);
  const adminPage=await fetch(`${base}/admin/komanda`,{headers:{Cookie:cookie()}});assert.equal(adminPage.status,200);assert.ok((await adminPage.text()).includes('Roberts'));
  await save('kategorijas',{name:title,slug:`cms-check-${suffix}`});
  const category=await find('cms_categories','slug',`cms-check-${suffix}`);
  const image=await sharp({create:{width:1400,height:700,channels:4,background:{r:129,g:1,b:0,alpha:0.5}}}).png().toBuffer();
  const upload=new FormData();upload.set('file',new File([image],'cms-check.png',{type:'image/png'}));upload.set('kind','logo');
  const uploadResponse=await fetch(`${base}/api/admin/upload`,{method:'POST',headers:{Origin:base,Cookie:cookie()},body:upload});
  const uploaded=await uploadResponse.json();assert.equal(uploadResponse.status,200,JSON.stringify(uploaded));
  const mediaPath=uploaded.url.split('/cms-media/')[1];media.push(mediaPath);
  const output=Buffer.from(await(await fetch(uploaded.url)).arrayBuffer());const meta=await sharp(output).metadata();assert.equal(meta.format,'webp');assert.ok(meta.width<=640);assert.equal(meta.hasAlpha,true);assert.ok(output.length<image.length);
  await save('partneri',{name:title,url:'https://example.test/partner',image:uploaded.url,published:false});
  const partner=await find('cms_partners','name',title);
  assert.equal((await anon.from('cms_partners').select('id').eq('id',partner.id)).data.length,0);
  await save('partneri',{...partner,published:true});
  assert.equal((await anon.from('cms_partners').select('id').eq('id',partner.id)).data.length,1);
  await save('raksti',{title,slug:`cms-check-${suffix}`,image:uploaded.url,category_id:category.id,body:'CMS pārbaudes teksts.\n\nOtrā rindkopa.',summary:'Automātiska CMS pārbaude.',published:false});
  const article=await find('cms_articles','slug',`cms-check-${suffix}`);
  assert.equal((await anon.from('cms_articles').select('id').eq('id',article.id)).data.length,0);
  await save('raksti',{...article,published:true});
  const published=(await anon.from('cms_articles').select('*').eq('id',article.id).single()).data;assert.ok(published.published_at);
  const articlePage=await fetch(`${base}/raksti/${article.slug}`);assert.equal(articlePage.status,200);assert.ok((await articlePage.text()).includes(title));
  const archive=await(await fetch(`${base}/raksti?kategorija=${category.slug}`)).text();assert.ok(archive.includes(title));
  assert.equal((await request('kategorijas',{action:'delete',id:category.id})).status,400);
  await save('dokumenti',{title,url:'https://example.test/document.pdf',file_type:'PDF',description:'CMS pārbaudes dokuments.',published:true});
  const document=await find('cms_documents','title',title);
  await save('pasakumi',{title,slug:`cms-check-${suffix}`,image:uploaded.url,venue:'CMS pārbaudes vieta',city:'Rīga',event_date:'2027-01-15',start_time:'10:30',description:'CMS pārbaudes pasākums.',participant_description:'CMS pārbaudes dalībnieku informācija.',document_ids:[document.id],published:true});
  const event=await find('cms_events','slug',`cms-check-${suffix}`);
  const eventPage=await fetch(`${base}/pasakumi/${event.slug}`);assert.equal(eventPage.status,200);const eventHtml=await eventPage.text();assert.ok(eventHtml.includes('CMS pārbaudes dalībnieku informācija.'));assert.ok(eventHtml.includes('https://example.test/document.pdf'));
  const home=await(await fetch(base)).text();assert.ok(home.includes(title));assert.ok(home.includes('https://example.test/partner'));
  await save('komanda',{first_name:'CMS pārbaude',last_name:suffix,position:'Pārbaude',email:`cms-${suffix}@example.test`,image:uploaded.url,sort_order:999,published:false});
  await find('cms_team','email',`cms-${suffix}@example.test`);
  await save('lietotaji',{first_name:'CMS',last_name:'Pārbaude',email:`cms-${suffix}@example.test`,password:`Cms-test-${suffix}-temporary`,active:true});
  const user=await find('cms_users','email',`cms-${suffix}@example.test`);
  await save('lietotaji',{...user,active:false});
  assert.equal((await admin.from('cms_users').select('active').eq('id',user.id).single()).data.active,false);
  console.log('Live CMS integration passed: authentication, CSRF, access protection, uploads/compression, categories, drafts/publication, dynamic article/event pages, related documents, partner links, team records, and user creation/deactivation.');
}finally{
  for(const [table,id] of ids.reverse()){
    if(table==='cms_users'){await admin.from(table).delete().eq('id',id);await admin.auth.admin.deleteUser(id);}
    else {const section={cms_team:'komanda',cms_events:'pasakumi',cms_documents:'dokumenti',cms_articles:'raksti',cms_partners:'partneri',cms_categories:'kategorijas'}[table];await request(section,{id,action:'delete'});await admin.from(table).delete().eq('id',id);}
  }
  if(media.length)await admin.storage.from('cms-media').remove(media);
  await client.auth.signOut({scope:'local'});
  console.log('Temporary test content and uploaded media removed.');
}
