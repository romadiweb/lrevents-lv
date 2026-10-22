begin;
create table public.cms_gallery (
  id uuid primary key default gen_random_uuid(),
  image text not null check(length(image) between 1 and 2048),
  image_source text not null default 'upload' check(image_source in ('upload','url')),
  title text not null default '',
  alt text not null check(length(alt) between 1 and 2048),
  category_id uuid references public.cms_categories(id) on delete restrict,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  constraint gallery_source_matches_image check(
    (image_source='url' and image ~ '^https://') or
    (image_source='upload' and (image ~ '^/images/' or image like 'https://kvugvrxyqfaytgmmfdfx.supabase.co/storage/v1/object/public/cms-media/%'))
  )
);
create index cms_gallery_category_idx on public.cms_gallery(category_id);
create index cms_gallery_order_idx on public.cms_gallery(sort_order,created_at desc) where published;
alter table public.cms_gallery enable row level security;
revoke all on public.cms_gallery from anon,authenticated;
grant select on public.cms_gallery to anon,authenticated;
grant insert,update,delete on public.cms_gallery to authenticated;
grant all on public.cms_gallery to service_role;
create policy gallery_public_read on public.cms_gallery for select to anon using(published);
create policy gallery_read on public.cms_gallery for select to authenticated using(
  published or exists(select 1 from public.cms_users where id=(select auth.uid()) and active)
);
create policy gallery_insert on public.cms_gallery for insert to authenticated with check(exists(select 1 from public.cms_users where id=(select auth.uid()) and active));
create policy gallery_update on public.cms_gallery for update to authenticated using(exists(select 1 from public.cms_users where id=(select auth.uid()) and active)) with check(exists(select 1 from public.cms_users where id=(select auth.uid()) and active));
create policy gallery_delete on public.cms_gallery for delete to authenticated using(exists(select 1 from public.cms_users where id=(select auth.uid()) and active));
-- Preserve the existing homepage's four photographs as editable CMS entries.
insert into public.cms_gallery(image,alt,sort_order,published) values
('/images/event-paddock.jpg','Autosporta automašīna LR Events trasē',1,true),
('/images/event-action.jpg','Zila autosporta automašīna sacensību trasē',2,true),
('/images/event-start.jpg','Sacensību starts LR Events pasākumā',3,true),
('/images/event-track.jpg','Autosporta dalībnieks LR Events trasē',4,true);
commit;
