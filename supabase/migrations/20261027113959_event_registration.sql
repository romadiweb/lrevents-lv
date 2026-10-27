begin;

alter table public.cms_events
  add column registration_status text not null default 'closed' check(registration_status in ('closed','open','full')),
  add column registration_capacity integer not null default 80 check(registration_capacity between 1 and 10000),
  add column registration_round_id uuid references public.cms_rounds(id) on delete restrict,
  add column registration_rules_url text not null default '',
  add column registration_opens_on date,
  add column registration_closes_on date;
create index cms_events_registration_round on public.cms_events(registration_round_id);

-- Names are suggestions, never proof of identity. Explicit homonyms are allowed.
alter table public.cms_participants add column same_name_person boolean not null default false;
create index cms_participants_name on public.cms_participants(lower(regexp_replace(trim(first_name || ' ' || last_name), '\s+', ' ', 'g')));

create table public.cms_participant_identities (
  name_key text not null,
  email_key text not null,
  participant_id uuid not null references public.cms_participants(id) on delete restrict,
  primary key(name_key,email_key)
);
create index cms_participant_identities_participant on public.cms_participant_identities(participant_id);

create table public.cms_event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.cms_events(id) on delete restrict,
  first_name text not null check(length(first_name) between 1 and 80),
  last_name text not null check(length(last_name) between 1 and 80),
  name_key text not null,
  email text not null check(length(email) between 3 and 254),
  phone text not null check(length(phone) between 5 and 40),
  car text not null check(length(car) between 1 and 120),
  class_ids uuid[] not null check(cardinality(class_ids) between 1 and 3),
  team_id uuid references public.cms_racing_teams(id) on delete restrict,
  start_number text not null default '' check(length(start_number)<=20),
  licence_number text not null default '' check(length(licence_number)<=80),
  status text not null default 'pending' check(status in ('pending','accepted','waitlisted','rejected','cancelled')),
  payment_status text not null default 'unpaid' check(payment_status in ('unpaid','paid','exempt')),
  participant_id uuid references public.cms_participants(id) on delete restrict,
  rules_url text not null,
  consent_at timestamptz not null default now(),
  privacy_version text not null default '2026-10-27',
  reviewed_by uuid references public.cms_users(id) on delete restrict,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index cms_registration_active on public.cms_event_registrations(event_id,name_key,email) where status in ('pending','accepted','waitlisted');
create unique index cms_registration_accepted_person on public.cms_event_registrations(event_id,participant_id) where status='accepted';
create index cms_registration_inbox on public.cms_event_registrations(status,created_at desc);
create index cms_registration_event on public.cms_event_registrations(event_id,status);
create index cms_registration_participant on public.cms_event_registrations(participant_id);
create index cms_registration_team on public.cms_event_registrations(team_id);
create index cms_registration_reviewer on public.cms_event_registrations(reviewed_by);

-- A separate public projection cannot accidentally expose contact or licence details.
create table public.cms_event_participants (
  registration_id uuid primary key references public.cms_event_registrations(id) on delete cascade,
  event_id uuid not null references public.cms_events(id) on delete cascade,
  participant_id uuid not null references public.cms_participants(id) on delete restrict,
  driver text not null,
  car text not null,
  class_names text[] not null,
  team_name text not null default '',
  start_number text not null default '',
  unique(event_id,participant_id)
);
create index cms_event_participants_person on public.cms_event_participants(participant_id);
create table public.cms_registration_limits (fingerprint text not null, bucket timestamptz not null, requests integer not null, primary key(fingerprint,bucket));

alter table public.cms_participant_identities enable row level security;
alter table public.cms_event_registrations enable row level security;
alter table public.cms_event_participants enable row level security;
alter table public.cms_registration_limits enable row level security;
revoke all on public.cms_participant_identities,public.cms_event_registrations,public.cms_event_participants,public.cms_registration_limits from anon,authenticated;
grant select on public.cms_event_participants to anon,authenticated;
grant select on public.cms_event_registrations,public.cms_participant_identities to authenticated;
grant all on public.cms_participant_identities,public.cms_event_registrations,public.cms_event_participants,public.cms_registration_limits to service_role;
create policy registration_staff_read on public.cms_event_registrations for select to authenticated using(exists(select 1 from public.cms_users where id=(select auth.uid()) and active));
create policy identities_staff_read on public.cms_participant_identities for select to authenticated using(exists(select 1 from public.cms_users where id=(select auth.uid()) and active));
create policy event_participants_public on public.cms_event_participants for select to anon,authenticated using(exists(select 1 from public.cms_events where id=event_id and published));

-- Every save locks the event, so closing registration/capacity edits and approvals serialize.
alter function public.cms_save_event(jsonb,uuid[]) rename to cms_save_event_content;
create function public.cms_save_event(entry jsonb, document_ids uuid[]) returns uuid language plpgsql security invoker set search_path='' as $$
declare eid uuid; old_round uuid; accepted integer; rid uuid; cap integer; state text;
begin
  if not exists(select 1 from public.cms_users where id=(select auth.uid()) and active) then raise insufficient_privilege; end if;
  if entry->>'id' is not null then
    select registration_round_id into old_round from public.cms_events where id=(entry->>'id')::uuid for update;
  end if;
  rid:=nullif(entry->>'registration_round_id','')::uuid;
  cap:=coalesce(nullif(entry->>'registration_capacity','')::integer,80);
  state:=coalesce(nullif(entry->>'registration_status',''),'closed');
  if old_round is distinct from rid and exists(select 1 from public.cms_event_registrations where event_id=(entry->>'id')::uuid) then raise exception 'REG_ROUND_LOCKED'; end if;
  if rid is not null and not exists(select 1 from public.cms_rounds r join public.cms_seasons s on s.id=r.season_id where r.id=rid and r.published and s.published and (r.event_id is null or r.event_id=(entry->>'id')::uuid)) then raise exception 'REG_ROUND'; end if;
  if state='open' and (rid is null or coalesce(entry->>'registration_rules_url','') !~ '^https?://' or not exists(select 1 from public.cms_classes c join public.cms_rounds r on r.season_id=c.season_id where r.id=rid and c.published)) then raise exception 'REG_CONFIG'; end if;
  if nullif(entry->>'registration_opens_on','')::date > coalesce(nullif(entry->>'registration_closes_on','')::date,(entry->>'event_date')::date-2) then raise exception 'REG_DATES'; end if;
  eid:=public.cms_save_event_content(entry,document_ids);
  select count(*) into accepted from public.cms_event_registrations where event_id=eid and status='accepted';
  if cap<accepted then raise exception 'REG_CAPACITY'; end if;
  update public.cms_events set registration_status=state,registration_capacity=cap,registration_round_id=rid,registration_rules_url=coalesce(entry->>'registration_rules_url',''),registration_opens_on=nullif(entry->>'registration_opens_on','')::date,registration_closes_on=nullif(entry->>'registration_closes_on','')::date where id=eid;
  if rid is not null then update public.cms_rounds set event_id=eid where id=rid and event_id is null; end if;
  return eid;
end $$;
revoke all on function public.cms_save_event(jsonb,uuid[]) from public,anon;
grant execute on function public.cms_save_event(jsonb,uuid[]) to authenticated;

create function public.cms_submit_event_registration(payload jsonb, fingerprint text) returns uuid language plpgsql security invoker set search_path='' as $$
declare ev public.cms_events; rid uuid; classes uuid[]; result uuid; local_now timestamp; n integer; key text; mail text; season uuid;
begin
  select * into ev from public.cms_events where id=(payload->>'event_id')::uuid for update;
  local_now:=now() at time zone 'Europe/Riga';
  if ev.id is null or not ev.published or ev.registration_status<>'open' or ev.event_date<local_now::date or local_now < coalesce(ev.registration_opens_on,ev.event_date-30)::timestamp or local_now >= coalesce(ev.registration_closes_on,ev.event_date-2)::timestamp+interval '18 hours' then raise exception 'REG_CLOSED'; end if;
  if (select count(*) from public.cms_event_registrations where event_id=ev.id and status='accepted')>=ev.registration_capacity then raise exception 'REG_FULL'; end if;
  select r.season_id into season from public.cms_rounds r join public.cms_seasons s on s.id=r.season_id where r.id=ev.registration_round_id and r.published and s.published and r.event_id=ev.id;
  if season is null or ev.registration_rules_url='' then raise exception 'REG_CONFIG'; end if;
  select array_agg(distinct value::uuid) into classes from jsonb_array_elements_text(payload->'class_ids');
  if cardinality(classes) not between 1 and 3 or classes is null or exists(select 1 from unnest(classes) c where not exists(select 1 from public.cms_classes where id=c and season_id=season and published)) then raise exception 'REG_CLASSES'; end if;
  if payload->>'team_id' is not null and not exists(select 1 from public.cms_racing_teams where id=(payload->>'team_id')::uuid and published) then raise exception 'REG_TEAM'; end if;
  if payload->>'rules_url' is distinct from ev.registration_rules_url or payload->>'consent' is distinct from 'true' then raise exception 'REG_CONSENT'; end if;
  if length(fingerprint)<>64 then raise exception 'REG_LIMIT'; end if;
  delete from public.cms_registration_limits where bucket<now()-interval '1 day';
  insert into public.cms_registration_limits values(fingerprint,date_trunc('hour',now()),1) on conflict on constraint cms_registration_limits_pkey do update set requests=public.cms_registration_limits.requests+1 returning requests into n;
  if n>30 then raise exception 'REG_LIMIT'; end if;
  key:=lower(regexp_replace(trim((payload->>'first_name') || ' ' || (payload->>'last_name')),'\s+',' ','g'));
  mail:=lower(trim(payload->>'email'));
  if mail !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'REG_EMAIL'; end if;
  insert into public.cms_event_registrations(event_id,first_name,last_name,name_key,email,phone,car,class_ids,team_id,start_number,licence_number,rules_url)
  values(ev.id,trim(payload->>'first_name'),trim(payload->>'last_name'),key,mail,trim(payload->>'phone'),trim(payload->>'car'),classes,(payload->>'team_id')::uuid,coalesce(payload->>'start_number',''),coalesce(payload->>'licence_number',''),ev.registration_rules_url) returning id into result;
  return result;
end $$;
revoke all on function public.cms_submit_event_registration(jsonb,text) from public,anon,authenticated;
grant execute on function public.cms_submit_event_registration(jsonb,text) to service_role;

create function public.cms_review_event_registration(request_id uuid, decision text, actor uuid, person_id uuid default null, payment text default 'unpaid', number text default '', new_person boolean default false) returns uuid language plpgsql security invoker set search_path='' as $$
declare reg public.cms_event_registrations; ev public.cms_events; pid uuid; known uuid; season uuid; cid uuid; names text[];
begin
  if not exists(select 1 from public.cms_users where id=actor and active) then raise insufficient_privilege; end if;
  select e.* into ev from public.cms_events e join public.cms_event_registrations r on r.event_id=e.id where r.id=request_id for update of e;
  select * into reg from public.cms_event_registrations where id=request_id for update;
  if reg.id is null then raise exception 'REG_MISSING'; end if;
  if decision not in ('accepted','waitlisted','rejected','cancelled') or payment not in ('unpaid','paid','exempt') or length(number)>20 then raise exception 'REG_DECISION'; end if;
  if decision='accepted' then
    if payment='unpaid' then raise exception 'REG_PAYMENT'; end if;
    if reg.status<>'accepted' and (select count(*) from public.cms_event_registrations where event_id=ev.id and status='accepted')>=ev.registration_capacity then raise exception 'REG_FULL'; end if;
    perform pg_advisory_xact_lock(hashtextextended(reg.name_key,0));
    select participant_id into known from public.cms_participant_identities where name_key=reg.name_key and email_key=reg.email;
    pid:=coalesce(reg.participant_id,known,person_id);
    if (known is not null and person_id is not null and known<>person_id) or (reg.participant_id is not null and person_id is not null and reg.participant_id<>person_id) then raise exception 'REG_IDENTITY'; end if;
    if pid is null then
      if not new_person and exists(select 1 from public.cms_participants where lower(regexp_replace(trim(first_name || ' ' || last_name),'\s+',' ','g'))=reg.name_key) then raise exception 'REG_MATCH'; end if;
      insert into public.cms_participants(first_name,last_name,car,team_id,published,same_name_person) values(reg.first_name,reg.last_name,reg.car,reg.team_id,true,new_person) returning id into pid;
    else
      if not exists(select 1 from public.cms_participants where id=pid) then raise exception 'REG_IDENTITY'; end if;
      update public.cms_participants set published=true where id=pid;
    end if;
    insert into public.cms_participant_identities values(reg.name_key,reg.email,pid) on conflict(name_key,email_key) do nothing;
    select r.season_id into season from public.cms_rounds r join public.cms_seasons s on s.id=r.season_id where r.id=ev.registration_round_id and r.published and s.published and r.event_id=ev.id;
    if season is null or exists(select 1 from unnest(reg.class_ids) c where not exists(select 1 from public.cms_classes where id=c and season_id=season and published)) then raise exception 'REG_CLASSES'; end if;
    foreach cid in array reg.class_ids loop
      insert into public.cms_entries(season_id,class_id,participant_id,team_id,start_number,car,published) values(season,cid,pid,reg.team_id,number,reg.car,true) on conflict(season_id,class_id,participant_id) do nothing;
    end loop;
    select array_agg(name order by sort_order,name) into names from public.cms_classes where id=any(reg.class_ids);
    insert into public.cms_event_participants(registration_id,event_id,participant_id,driver,car,class_names,team_name,start_number)
    values(reg.id,ev.id,pid,reg.first_name || ' ' || reg.last_name,reg.car,names,coalesce((select name from public.cms_racing_teams where id=reg.team_id),''),number)
    on conflict(registration_id) do update set car=excluded.car,class_names=excluded.class_names,team_name=excluded.team_name,start_number=excluded.start_number;
  else
    pid:=reg.participant_id;
    delete from public.cms_event_participants where registration_id=reg.id;
  end if;
  update public.cms_event_registrations set status=decision,payment_status=payment,participant_id=pid,start_number=number,reviewed_by=actor,reviewed_at=now() where id=reg.id;
  return pid;
end $$;
revoke all on function public.cms_review_event_registration(uuid,text,uuid,uuid,text,text,boolean) from public,anon,authenticated;
grant execute on function public.cms_review_event_registration(uuid,text,uuid,uuid,text,text,boolean) to service_role;

-- Prevent accidental duplicate profiles from the generic CMS as well.
create function public.cms_participant_duplicate_guard() returns trigger language plpgsql security invoker set search_path='' as $$
declare key text;
begin
  key:=lower(regexp_replace(trim(new.first_name || ' ' || new.last_name),'\s+',' ','g'));
  perform pg_advisory_xact_lock(hashtextextended(key,0));
  if not new.same_name_person and exists(select 1 from public.cms_participants where id<>new.id and lower(regexp_replace(trim(first_name || ' ' || last_name),'\s+',' ','g'))=key) then raise exception 'REG_DUPLICATE_PERSON'; end if;
  return new;
end $$;
create trigger cms_participant_duplicate before insert or update of first_name,last_name,same_name_person on public.cms_participants for each row execute function public.cms_participant_duplicate_guard();
notify pgrst,'reload schema';
commit;
