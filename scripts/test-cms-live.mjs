// Opt-in integration test: creates clearly labelled temporary records, then removes them.
import assert from 'node:assert/strict';
import nextEnv from '@next/env';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import {randomBytes} from 'node:crypto';
import sharp from 'sharp';
nextEnv.loadEnvConfig(process.cwd());
if(!process.argv.includes('--run'))throw Error('Explicit --run required for temporary live test records.');
const base=process.env.CMS_TEST_ORIGIN || 'http://localhost:3000';
if(!/^http:\/\/localhost:3\d{3}$/.test(base))throw Error('Live tests must target a local preview.');
const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const admin=createClient(url,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const testerEmail=`cms-run-${randomBytes(6).toString('hex')}@example.test`;
const password=randomBytes(24).toString('base64url');
const {data:tester,error:testerError}=await admin.auth.admin.createUser({email:testerEmail,password,email_confirm:true});
assert.ifError(testerError);
const testerId=tester.user.id;
const {error:profileError}=await admin.from('cms_users').insert({id:testerId,email:testerEmail,first_name:'CMS',last_name:'Integration test'});
if(profileError){await admin.auth.admin.deleteUser(testerId);assert.ifError(profileError);}
const jar=new Map();
const client=createServerClient(url,key,{cookies:{getAll:()=>[...jar].map(([name,value])=>({name,value})),setAll:values=>values.forEach(({name,value})=>jar.set(name,value))}});
const {error:loginError}=await client.auth.signInWithPassword({email:testerEmail,password});
if(loginError){await admin.auth.admin.deleteUser(testerId);assert.ifError(loginError);}
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
  const adminPage=await fetch(`${base}/admin/komanda`,{headers:{Cookie:cookie()}});assert.equal(adminPage.status,200);assert.ok((await adminPage.text()).includes('CMS sadaļas'));
  await save('kategorijas',{name:title,slug:`cms-check-${suffix}`});
  const category=await find('cms_categories','slug',`cms-check-${suffix}`);
  const image=await sharp({create:{width:1400,height:700,channels:4,background:{r:129,g:1,b:0,alpha:0.5}}}).png().toBuffer();
  const upload=new FormData();upload.set('file',new File([image],'cms-check.png',{type:'image/png'}));upload.set('kind','logo');
  const uploadResponse=await fetch(`${base}/api/admin/upload`,{method:'POST',headers:{Origin:base,Cookie:cookie()},body:upload});
  const uploaded=await uploadResponse.json();assert.equal(uploadResponse.status,200,JSON.stringify(uploaded));
  const mediaPath=uploaded.url.split('/cms-media/')[1];media.push(mediaPath);
  const output=Buffer.from(await(await fetch(uploaded.url)).arrayBuffer());const meta=await sharp(output).metadata();assert.equal(meta.format,'webp');assert.ok(meta.width<=640);assert.equal(meta.hasAlpha,true);assert.ok(output.length<image.length);
  const svgSource='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="8" viewBox="0 0 16 8"><path fill="#810100" d="M0 0h8v8H0z"/></svg>';
  const svgUpload=new FormData();svgUpload.set('file',new File([svgSource],'partner-logo.svg',{type:'image/svg+xml'}));svgUpload.set('kind','logo');
  const svgResponse=await fetch(`${base}/api/admin/upload`,{method:'POST',headers:{Origin:base,Cookie:cookie()},body:svgUpload});
  const svgResult=await svgResponse.json();assert.equal(svgResponse.status,200,JSON.stringify(svgResult));media.push(svgResult.url.split('/cms-media/')[1]);
  const svgOutput=Buffer.from(await(await fetch(svgResult.url)).arrayBuffer());const svgMeta=await sharp(svgOutput).metadata();assert.equal(svgMeta.format,'webp');assert.equal(svgMeta.width,640);assert.equal(svgMeta.height,320);assert.equal(svgMeta.hasAlpha,true);
  const svgPhoto=new FormData();svgPhoto.set('file',new File([svgSource],'photo.svg',{type:'image/svg+xml'}));svgPhoto.set('kind','photo');
  assert.equal((await fetch(`${base}/api/admin/upload`,{method:'POST',headers:{Origin:base,Cookie:cookie()},body:svgPhoto})).status,400);
  await save('galerija',{title:'',alt:title,image:uploaded.url,image_source:'url',category_id:'',sort_order:-100,published:false});
  const gallery=await find('cms_gallery','alt',title);
  assert.equal(gallery.category_id,null);
  assert.equal((await anon.from('cms_gallery').select('id').eq('id',gallery.id)).data.length,0);
  assert.equal((await request('galerija',{...gallery,image:'https://example.test/image.jpg',image_source:'upload'})).status,400);
  await save('galerija',{...gallery,title,category_id:category.id,published:true});
  assert.equal((await anon.from('cms_gallery').select('id').eq('id',gallery.id)).data.length,1);
  const galleryHtml=await(await fetch(`${base}/galerija?kategorija=${category.slug}`)).text();assert.ok(galleryHtml.includes(title));assert.ok(galleryHtml.includes(uploaded.url));
  await save('galerija',{...gallery,image_source:'upload',title,published:true});
  await save('partneri',{name:title,url:'https://example.test/partner',image:uploaded.url,published:false});
  const partner=await find('cms_partners','name',title);
  assert.equal((await anon.from('cms_partners').select('id').eq('id',partner.id)).data.length,0);
  assert.equal(partner.belt_image,'');
  await save('partneri',{...partner,belt_image:svgResult.url,published:true});
  const partnerLogos=(await anon.from('cms_partners').select('image,belt_image').eq('id',partner.id).single()).data;
  assert.equal(partnerLogos.image,uploaded.url);assert.equal(partnerLogos.belt_image,svgResult.url);
  const logoHtml=await(await fetch(base)).text();
  const beltHtml=logoHtml.match(/<section class="sponsor-belt"[\s\S]*?<\/section>/)?.[0] || '';
  const footerHtml=logoHtml.match(/<section class="footer-sponsors"[\s\S]*?<\/section>/)?.[0] || '';
  assert.ok(beltHtml.includes(encodeURIComponent(svgResult.url)));
  assert.ok(footerHtml.includes(encodeURIComponent(uploaded.url)));
  assert.ok(!footerHtml.includes(encodeURIComponent(svgResult.url)));
  const existingMain=await admin.from('cms_partners').select('id').eq('main_partner',true);assert.ifError(existingMain.error);
  if(!existingMain.data.length){await save('partneri',{...partner,belt_image:svgResult.url,published:true,main_partner:true});const mainHtml=await(await fetch(base)).text();assert.ok(mainHtml.includes('Galvenais partneris'));}
  await save('partneri',{...partner,belt_image:'',published:true});
  const fallbackHtml=await(await fetch(base)).text();
  const fallbackBelt=fallbackHtml.match(/<section class="sponsor-belt"[\s\S]*?<\/section>/)?.[0] || '';
  if(!fallbackBelt.includes(encodeURIComponent(uploaded.url))){const {writeFile}=await import('node:fs/promises');await writeFile('.next/logo-test-failure.html',fallbackHtml);}
  assert.ok(fallbackBelt.includes(encodeURIComponent(uploaded.url)));
  assert.ok(!fallbackBelt.includes(encodeURIComponent(svgResult.url)));
  assert.equal((await anon.from('cms_partners').select('id').eq('id',partner.id)).data.length,1);
  const seasonPayload={name:title,year:2026,archived:false,scoring_mode:'position',points_scale:'10,8,6',best_rounds:0,team_best:0,published:true};
  await save('sezonas',seasonPayload);const season=await find('cms_seasons','name',title);
  await save('klases',{name:title,season_id:season.id,sort_order:0,published:true});const racingClass=await find('cms_classes','name',title);
  await save('posmi',{name:title,season_id:season.id,event_date:'2026-10-23',event_id:'',sort_order:0,published:true});const round=await find('cms_rounds','name',title);
  await save('komandas',{name:title,car_brand:'bmw',published:true});const racingTeam=await find('cms_racing_teams','name',title);
  await save('dalibnieki',{first_name:title,last_name:'Test',car:'BMW',team_id:racingTeam.id,published:true});const participant=await find('cms_participants','first_name',title);
  await save('starti',{season_id:season.id,class_id:racingClass.id,participant_id:participant.id,team_id:racingTeam.id,start_number:'77',car:'BMW',published:true});const entry=await find('cms_entries','participant_id',participant.id);
  await save('rezultati',{season_id:season.id,round_id:round.id,entry_id:entry.id,position:1,points:'',status:'OK',notes:'Integration',published:false});const score=await find('cms_results','entry_id',entry.id);
  assert.equal((await anon.from('cms_results').select('id').eq('id',score.id)).data.length,0);
  await save('rezultati',{...score,published:true});
  await save('braucieni',{result_id:score.id,run_number:1,time_ms:120000,penalty_ms:500,result_ms:'',points:10,status:'OK',published:true});await find('cms_runs','result_id',score.id);
  for(const path of ['/rezultati','/rezultati/kopvertejums','/rezultati/live']){const response=await fetch(base+path);assert.equal(response.status,200);assert.ok((await response.text()).includes(title),`${path} missing live result`);}
  await save('sezonas',{...season,...seasonPayload,archived:true});
  assert.ok((await(await fetch(base+'/rezultati/arhivs')).text()).includes(title));
  const activeResultsHtml=(await(await fetch(base+'/rezultati')).text()).match(/<main[\s\S]*?<\/main>/)?.[0]||'';assert.ok(!activeResultsHtml.includes(title),'archived season should leave active results');
  // A score must not attach an entry to a different season's round.
  await save('sezonas',{...seasonPayload,name:title+' other'});const otherSeason=await find('cms_seasons','name',title+' other');
  assert.equal((await request('rezultati',{...score,season_id:otherSeason.id})).status,400);
  const passwordRequest=async(payload,authenticated=true,origin=base)=>fetch(base+'/api/admin/password',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(authenticated?{Cookie:cookie()}:{})},body:JSON.stringify(payload)});
  assert.equal((await passwordRequest({password:'New-pass-12345'},false)).status,401);
  assert.equal((await passwordRequest({password:'New-pass-12345'},true,'https://example.test')).status,403);
  assert.equal((await passwordRequest({password:'short'})).status,400);
  const newPassword=randomBytes(18).toString('base64url');assert.equal((await passwordRequest({password:newPassword})).status,200);
  const verifyLogin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});const changed=await verifyLogin.auth.signInWithPassword({email:testerEmail,password:newPassword});assert.ifError(changed.error);await verifyLogin.auth.signOut({scope:'local'});
  const refreshed=await client.auth.signInWithPassword({email:testerEmail,password:newPassword});assert.ifError(refreshed.error);
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
  const home=await(await fetch(base)).text();assert.ok(home.includes(title));assert.ok(home.includes('https://example.test/partner'));assert.ok(home.includes('href="/galerija"'));
  await save('komanda',{first_name:'CMS pārbaude',last_name:suffix,position:'Pārbaude',email:`cms-${suffix}@example.test`,image:uploaded.url,sort_order:999,published:false});
  await find('cms_team','email',`cms-${suffix}@example.test`);
  await save('lietotaji',{first_name:'CMS',last_name:'Pārbaude',email:`cms-${suffix}@example.test`,password:`Cms-test-${suffix}-temporary`,active:true});
  const user=await find('cms_users','email',`cms-${suffix}@example.test`);
  await save('lietotaji',{...user,active:false});
  assert.equal((await admin.from('cms_users').select('active').eq('id',user.id).single()).data.active,false);
  console.log('Live CMS integration passed: authentication, CSRF, access protection, uploads/compression, categories, drafts/publication, dynamic article/event pages, related documents, partner links, team records, results/scoring publication and archive, direct password changes, and user creation/deactivation.');
}finally{
  for(const [table,id] of ids.reverse().sort((a,b)=>["cms_runs","cms_results","cms_entries","cms_participants","cms_racing_teams","cms_rounds","cms_classes","cms_seasons"].indexOf(a[0])-["cms_runs","cms_results","cms_entries","cms_participants","cms_racing_teams","cms_rounds","cms_classes","cms_seasons"].indexOf(b[0]))){
    if(table==='cms_users'){await admin.from(table).delete().eq('id',id);await admin.auth.admin.deleteUser(id);}
    else {const section={cms_team:'komanda',cms_events:'pasakumi',cms_documents:'dokumenti',cms_articles:'raksti',cms_partners:'partneri',cms_categories:'kategorijas',cms_gallery:'galerija',cms_seasons:'sezonas',cms_classes:'klases',cms_rounds:'posmi',cms_racing_teams:'komandas',cms_participants:'dalibnieki',cms_entries:'starti',cms_results:'rezultati',cms_runs:'braucieni'}[table];await request(section,{id,action:'delete'});await admin.from(table).delete().eq('id',id);}
  }
  if(media.length)await admin.storage.from('cms-media').remove(media);
  await client.auth.signOut({scope:'local'});
  await admin.auth.admin.deleteUser(testerId);
  console.log('Temporary test content and uploaded media removed.');
}
