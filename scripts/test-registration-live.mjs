// Temporary, clearly labelled fixtures. Never submits as a real competitor or sends messages.
import assert from 'node:assert/strict';
import nextEnv from '@next/env';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import {randomBytes} from 'node:crypto';
import {createInterface} from 'node:readline/promises';
nextEnv.loadEnvConfig(process.cwd());
if(!process.argv.includes('--run'))throw Error('Explicit --run required.');
const base=process.env.CMS_TEST_ORIGIN||'http://localhost:3002';
if(!/^http:\/\/localhost:3\d{3}$/.test(base))throw Error('Use local preview only.');
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const admin=createClient(url,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const anon=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const token=randomBytes(5).toString('hex'),slug=`registration-check-${token}`,email=`registration-test-${token}@example.test`,password=randomBytes(24).toString('base64url');
let userId,season,event,personIds=[];const jars=new Map();
const auth=createServerClient(url,key,{cookies:{getAll:()=>[...jars].map(([name,value])=>({name,value})),setAll:values=>values.forEach(({name,value})=>jars.set(name,value))}});
const cookie=()=>[...jars].map(([name,value])=>`${name}=${value}`).join('; ');
async function insert(table,row){const{data,error}=await admin.from(table).insert(row).select('*').single();assert.ifError(error);return data;}
async function http(path,body,staff=false,origin=base){const response=await fetch(`${base}${path}`,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json',Origin:origin}:{}),...(staff?{Cookie:cookie()}:{})},...(body?{body:JSON.stringify(body)}:{})});return{status:response.status,data:await response.json()};}
async function approve(id,person=null){return http('/api/admin/registrations',{id,decision:'accepted',person_id:person,payment:'paid',number:'99',new_person:false},true);}
try{
  const{data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true});assert.ifError(error);userId=data.user.id;
  await insert('cms_users',{id:userId,email,first_name:'Registration',last_name:'Integration test'});
  assert.ifError((await auth.auth.signInWithPassword({email,password})).error);
  season=await insert('cms_seasons',{name:`Registration TEST ${token}`,year:2099,published:true});
  const cls=await insert('cms_classes',{season_id:season.id,name:'TEST FWD',published:true});
  const round=await insert('cms_rounds',{season_id:season.id,name:'TEST round',published:true});
  const eventInput={title:`Reģistrācijas pārbaude ${token}`,slug,image:'/images/event-track.jpg',venue:'TEST trase',city:'Rīga',event_date:'2099-12-31',start_time:'10:00',description:'Pagaidu testa pasākums. Tiks dzēsts pēc pārbaudes.',participant_description:'Tikai sistēmas pārbaudei.',document_ids:[],published:true,registration_status:'open',registration_capacity:1,registration_round_id:round.id,registration_opens_on:'2020-01-01',registration_closes_on:'2099-12-29',registration_rules_url:'https://drive.google.com/file/d/1fVtnBwwBigGPqNknJToy2xzcgMJ5QOVQ/view'};
  const saved=await http('/api/admin/pasakumi',eventInput,true);assert.equal(saved.status,200,JSON.stringify(saved));
  event=(await admin.from('cms_events').select('*').eq('slug',slug).single()).data;assert.ok(event);
  const snapshot=await http(`/api/registrations?event=${slug}`);assert.equal(snapshot.status,200);assert.equal(snapshot.data.state,'open');assert.equal(snapshot.data.capacity,1);assert.ok(snapshot.data.classes.some(c=>c.id===cls.id));
  const formPage=await fetch(`${base}/pasakumi/${slug}/registracija`);assert.equal(formPage.status,200);assert.ok((await formPage.text()).includes('Pieteikšanās pasākumam'));
  const body={event_id:event.id,first_name:'Testa',last_name:`Dalībnieks ${token}`,email:`driver-${token}@example.test`,phone:'+37120000000',car:'TEST auto',class_ids:[cls.id],team_id:'',start_number:'99',licence_number:'TEST-private-licence',rules_url:event.registration_rules_url,consent:true,website:''};
  assert.equal((await http('/api/registrations',body,false,'https://other.example.test')).status,403);
  assert.equal((await http('/api/registrations',{...body,class_ids:[]})).status,400);
  assert.equal((await http('/api/registrations',{...body,website:'spam'})).status,400);
  const submitted=await http('/api/registrations',body);assert.equal(submitted.status,201,JSON.stringify(submitted));assert.ok(submitted.data.reference);
  assert.equal((await http('/api/registrations',body)).status,409);
  const second=await http('/api/registrations',{...body,first_name:'Otrais',email:`other-${token}@example.test`});assert.equal(second.status,201);
  assert.equal((await http('/api/admin/registrations?count=1')).status,401);
  const badge=await http('/api/admin/registrations?count=1',null,true);assert.equal(badge.status,200);assert.ok(badge.data.pending>=2);
  const inbox=await http(`/api/admin/registrations?event=${event.id}`,null,true);assert.equal(inbox.status,200);assert.equal(inbox.data.total,2);assert.equal(inbox.data.rows[0].licence_number,'TEST-private-licence');
  const cmsPage=await fetch(`${base}/admin/pieteikumi`,{headers:{Cookie:cookie()}});assert.equal(cmsPage.status,200);assert.ok((await cmsPage.text()).includes('Sacensību pieteikumi'));
  const request=inbox.data.rows.find(row=>row.email===body.email),other=inbox.data.rows.find(row=>row.email!==body.email);
  const concurrent=await Promise.all([approve(request.id),approve(other.id)]);
  assert.deepEqual(concurrent.map(result=>result.status).sort(),[200,409],'simultaneous approvals cannot overbook the last place');
  const accepted=(await admin.from('cms_event_registrations').select('*').eq('event_id',event.id).eq('status','accepted').single()).data;
  personIds.push(accepted.participant_id);
  const publicSnapshot=await http(`/api/registrations?event=${slug}`);assert.equal(publicSnapshot.data.state,'full');assert.equal(publicSnapshot.data.accepted,1);assert.equal(publicSnapshot.data.participants.length,1);
  assert.ok(!JSON.stringify(publicSnapshot.data).includes('@example.test'));assert.ok(!JSON.stringify(publicSnapshot.data).includes('TEST-private-licence'));
  const privateRead=await anon.from('cms_event_registrations').select('*');assert.ok(privateRead.error||privateRead.data.length===0);
  const rawPublic=await anon.from('cms_event_participants').select('*').eq('event_id',event.id);assert.equal(rawPublic.data.length,1);assert.ok(!('email'in rawPublic.data[0]));
  const eventHtml=await(await fetch(`${base}/pasakumi/${slug}`)).text();assert.ok(eventHtml.includes('Apstiprinātie dalībnieki'));assert.ok(eventHtml.includes(accepted.first_name));assert.ok(!eventHtml.includes('TEST-private-licence'));
  const invalidCapacity=await http('/api/admin/pasakumi',{...eventInput,id:event.id,registration_capacity:0},true);assert.equal(invalidCapacity.status,400);
  assert.equal((await http('/api/admin/registrations',{id:accepted.id,decision:'cancelled',payment:'paid',number:'99'},true)).status,200);
  const released=await http(`/api/registrations?event=${slug}`);assert.equal(released.data.state,'open');assert.equal(released.data.accepted,0);
  assert.equal((await approve(accepted.id,accepted.participant_id)).status,200);
  assert.equal((await admin.from('cms_entries').select('id').eq('season_id',season.id)).data.length,1);
  const closed=await http('/api/admin/pasakumi',{...eventInput,id:event.id,registration_status:'closed'},true);assert.equal(closed.status,200);
  assert.equal((await http('/api/registrations',{...body,first_name:'Trešais',email:`third-${token}@example.test`})).status,409);
  console.log('Live registration passed: event settings, form rendering, CSRF/validation, CMS badge/private inbox, concurrent last-place approval, public privacy, full/closed status, cancellation and entry preservation.');
  if(process.argv.includes('--hold')){
    // For manual browser checks, an open form with one accepted competitor.
    assert.equal((await http('/api/admin/pasakumi',{...eventInput,id:event.id,registration_capacity:80},true)).status,200);
    console.log(`QA fixture: ${base}/pasakumi/${slug}/registracija`);
    const rl=createInterface({input:process.stdin,output:process.stdout});await rl.question('Press Enter to remove temporary fixtures.');rl.close();
  }
}finally{
  if(event){const all=await admin.from('cms_event_registrations').select('participant_id').eq('event_id',event.id);personIds.push(...(all.data||[]).map(row=>row.participant_id).filter(Boolean));await admin.from('cms_event_participants').delete().eq('event_id',event.id);assert.ifError((await admin.from('cms_event_registrations').delete().eq('event_id',event.id)).error);}
  if(event)assert.equal((await http('/api/admin/pasakumi',{id:event.id,action:'delete'},true)).status,200);
  if(season){assert.ifError((await admin.from('cms_entries').delete().eq('season_id',season.id)).error);assert.ifError((await admin.from('cms_rounds').delete().eq('season_id',season.id)).error);assert.ifError((await admin.from('cms_classes').delete().eq('season_id',season.id)).error);}
  for(const id of new Set(personIds)){await admin.from('cms_participant_identities').delete().eq('participant_id',id);assert.ifError((await admin.from('cms_participants').delete().eq('id',id)).error);}
  if(season)assert.ifError((await admin.from('cms_seasons').delete().eq('id',season.id)).error);
  if(userId){await auth.auth.signOut({scope:'local'});await admin.from('cms_users').delete().eq('id',userId);await admin.auth.admin.deleteUser(userId);}
  console.log('Temporary registration fixtures removed.');
}
