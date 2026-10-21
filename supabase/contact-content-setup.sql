-- Apply once through the project SQL editor or authenticated project MCP.
-- Contact information is public; editing is restricted to trusted project/server access.
begin;
create table public.site_content (
  slug text primary key,
  content jsonb not null check (jsonb_typeof(content) = 'object')
);
alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant all on public.site_content to service_role;
create policy "Read published contacts" on public.site_content
  for select to anon, authenticated using (slug = 'contacts');
insert into public.site_content (slug, content) values ('contacts',
'{"associationName":"Biedrība “LR Events”","introduction":"Ja tev ir jautājumi vai idejas sadarbībai — droši sazinies ar mums!","email":"kasparsbite@lrevents.lv","associationDetails":[{"label":"Adrese","value":"Brīvības iela 82 – 10/14, Liepāja, LV-3401"},{"label":"Reģistrācijas numurs","value":"40008320544"},{"label":"PVN numurs","value":"LV40008320544"},{"label":"Banka","value":"A/S “Swedbank”"},{"label":"Bankas konts","value":"LV07HABA0551064338924"}],"team":[{"name":"Kaspars Bite","role":"Biedrības vadītājs","email":"kasparsbite@lrevents.lv"},{"name":"Mārtiņš Zviedris","role":"Drošības un operatīvās koordinācijas vadītājs","email":"martinszviedris@lrevents.lv"},{"name":"Mārtiņš Zudavs","role":"Tehniskās nodrošināšanas vadītājs","email":"martinszudavs@lrevents.lv"},{"name":"Kārlis Ķipsts","role":"Mārketinga un reklāmas speciālists","email":"karliskipsts@lrevents.lv"}]}'::jsonb);
commit;
