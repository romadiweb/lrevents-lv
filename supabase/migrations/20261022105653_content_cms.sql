-- Additive CMS schema. Apply only to the website's configured Supabase project.
begin;
create table public.cms_users (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (length(first_name) between 1 and 200),
  last_name text not null check (length(last_name) between 1 and 200),
  email text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.cms_users enable row level security;
revoke all on public.cms_users from anon, authenticated;
grant select on public.cms_users to authenticated;
grant all on public.cms_users to service_role;
-- Profile writes are server-only; visitors cannot grant themselves CMS access.
create policy own_profile on public.cms_users for select to authenticated using (id = (select auth.uid()));
-- Bootstrap only the explicitly requested owner, after creating its Auth account.
insert into public.cms_users(id,first_name,last_name,email)
select id,'Roberts','Džeriņš',email from auth.users where lower(email)='roberts.dzerins@romadi.lv';

create table public.cms_categories (
  id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 1 and 200),
  slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), created_at timestamptz not null default now()
);
create table public.cms_team (
  id uuid primary key default gen_random_uuid(), first_name text not null, last_name text not null,
  position text not null, email text not null, image text not null default '', sort_order integer not null default 0,
  published boolean not null default false, created_at timestamptz not null default now()
);
create table public.cms_articles (
  id uuid primary key default gen_random_uuid(), title text not null,
  slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  image text not null, summary text not null default '', body text not null,
  category_id uuid not null references public.cms_categories(id) on delete restrict,
  published boolean not null default false, published_at timestamptz,
  created_at timestamptz not null default now()
);
create index cms_articles_category_idx on public.cms_articles(category_id);
create index cms_articles_publication_idx on public.cms_articles(published_at desc) where published;
create table public.cms_partners (
  id uuid primary key default gen_random_uuid(), name text not null, url text not null check(url ~ '^https?://'),
  image text not null, sort_order integer not null default 0, published boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.cms_documents (
  id uuid primary key default gen_random_uuid(), title text not null, url text not null check(url ~ '^https?://'),
  file_type text not null check(file_type in ('PDF','DOCX','XLSX','ZIP','Saite')), description text not null default '',
  published boolean not null default false, created_at timestamptz not null default now()
);
create table public.cms_events (
  id uuid primary key default gen_random_uuid(), title text not null,
  slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and slug <> 'arhivs'),
  image text not null, venue text not null, city text not null, event_date date not null, start_time time not null,
  description text not null default '', participant_description text not null default '',
  published boolean not null default false, created_at timestamptz not null default now()
);
create index cms_events_date_idx on public.cms_events(event_date);
create table public.cms_event_documents (
  event_id uuid not null references public.cms_events(id) on delete cascade,
  document_id uuid not null references public.cms_documents(id) on delete cascade,
  primary key(event_id,document_id)
);
create index cms_event_documents_document_idx on public.cms_event_documents(document_id);

do $$
declare tab text;
begin
  foreach tab in array array['cms_categories','cms_team','cms_articles','cms_partners','cms_documents','cms_events','cms_event_documents'] loop
    execute format('alter table public.%I enable row level security', tab);
    execute format('revoke all on public.%I from anon, authenticated', tab);
    execute format('grant select on public.%I to anon, authenticated', tab);
    execute format('grant insert,update,delete on public.%I to authenticated', tab);
    execute format('grant all on public.%I to service_role', tab);
    execute format('create policy cms_editor on public.%I for all to authenticated using (exists(select 1 from public.cms_users where id = (select auth.uid()) and active)) with check (exists(select 1 from public.cms_users where id = (select auth.uid()) and active))', tab);
  end loop;
end $$;
create policy public_categories on public.cms_categories for select to anon,authenticated using(true);
create policy public_team on public.cms_team for select to anon,authenticated using(published);
create policy public_articles on public.cms_articles for select to anon,authenticated using(published and published_at is not null and published_at <= now());
create policy public_partners on public.cms_partners for select to anon,authenticated using(published);
create policy public_documents on public.cms_documents for select to anon,authenticated using(published);
create policy public_events on public.cms_events for select to anon,authenticated using(published);
create policy public_event_documents on public.cms_event_documents for select to anon,authenticated using(
  exists(select 1 from public.cms_events where id=event_id and published)
  and exists(select 1 from public.cms_documents where id=document_id and published)
);

create function public.cms_article_publication() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if TG_OP='UPDATE' then new.published_at := old.published_at; else new.published_at := null; end if;
  if new.published and new.published_at is null then new.published_at := now(); end if;
  return new;
end $$;
revoke all on function public.cms_article_publication() from public,anon,authenticated;
create trigger cms_article_publication before insert or update on public.cms_articles for each row execute function public.cms_article_publication();

-- Event and document relations are saved together, under the caller's RLS.
create function public.cms_save_event(entry jsonb, document_ids uuid[]) returns uuid language plpgsql security invoker set search_path='' as $$
declare event_uuid uuid; requested_uuid uuid;
begin
  if not exists(select 1 from public.cms_users where id=(select auth.uid()) and active) then raise insufficient_privilege; end if;
  if cardinality(document_ids)>100 then raise exception 'Too many documents'; end if;
  requested_uuid := (entry->>'id')::uuid;
  if requested_uuid is null then
    insert into public.cms_events(title,slug,image,venue,city,event_date,start_time,description,participant_description,published)
    values(entry->>'title',entry->>'slug',entry->>'image',entry->>'venue',entry->>'city',(entry->>'event_date')::date,(entry->>'start_time')::time,entry->>'description',entry->>'participant_description',(entry->>'published')::boolean) returning id into event_uuid;
  else
    update public.cms_events set title=entry->>'title',slug=entry->>'slug',image=entry->>'image',venue=entry->>'venue',city=entry->>'city',event_date=(entry->>'event_date')::date,start_time=(entry->>'start_time')::time,description=entry->>'description',participant_description=entry->>'participant_description',published=(entry->>'published')::boolean where id=requested_uuid returning id into event_uuid;
    if event_uuid is null then raise exception 'Event not found'; end if;
  end if;
  delete from public.cms_event_documents where event_id=event_uuid;
  insert into public.cms_event_documents(event_id,document_id) select event_uuid, unnest(document_ids);
  return event_uuid;
end $$;
revoke all on function public.cms_save_event(jsonb,uuid[]) from public,anon;
grant execute on function public.cms_save_event(jsonb,uuid[]) to authenticated;

insert into public.cms_categories(name,slug) values ('Jaunumi','jaunumi'),('Sacensības','sacensibas'),('Aizkulises','aizkulises'),('Dalībnieki','dalibnieki');
insert into public.cms_team(first_name,last_name,position,email,sort_order,published) values
('Kaspars','Bite','Biedrības vadītājs','kasparsbite@lrevents.lv',1,true),
('Mārtiņš','Zviedris','Drošības un operatīvās koordinācijas vadītājs','martinszviedris@lrevents.lv',2,true),
('Mārtiņš','Zudavs','Tehniskās nodrošināšanas vadītājs','martinszudavs@lrevents.lv',3,true),
('Kārlis','Ķipsts','Mārketinga un reklāmas speciālists','karliskipsts@lrevents.lv',4,true);
insert into public.cms_documents(title,url,file_type,description,published) values
('Sezonas nolikums autosprintā 2026','https://drive.google.com/file/d/1fVtnBwwBigGPqNknJToy2xzcgMJ5QOVQ/view?usp=sharing','PDF','Viss par sacensību norisi un kārtību pilnas sezonas izklāstā.',true),
('Biļetens Nr. 1 (5. posms)','https://drive.google.com/file/d/1K4S04_A9yT9EA5xOjEu7Z4T5qnSiMp-I/view?usp=sharing','PDF','Informācija par piektā posma norisi un kārtību.',true),
('Biļetens Nr. 2 (5. posms)','https://drive.google.com/file/d/1JbCZWrsqC_b67jeJr9xP1DhZ4ERdHXlA/view?usp=sharing','PDF','Papildu informācija par piektā posma norisi un kārtību.',true),
('LR Events Kausa izcīņa autosprintā — 5. posma nolikums','https://drive.google.com/file/d/1sSYjogXj-C8UfgsCgpVzZvfW2kr4c5TC/view?usp=sharing','PDF','Vispārējie noteikumi, sacensību kārtība, punktu sistēma un apbalvošana.',true);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('cms-media','cms-media',true,10485760,array['image/webp']) on conflict(id) do nothing;
create policy cms_media_insert on storage.objects for insert to authenticated with check(bucket_id='cms-media' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.cms_users where id=(select auth.uid()) and active));
create policy cms_media_select on storage.objects for select to authenticated using(bucket_id='cms-media' and exists(select 1 from public.cms_users where id=(select auth.uid()) and active));
commit;
