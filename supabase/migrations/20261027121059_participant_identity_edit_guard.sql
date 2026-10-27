begin;
create or replace function public.cms_participant_duplicate_guard() returns trigger language plpgsql security invoker set search_path='' as $$
declare key text;
begin
  key:=lower(regexp_replace(trim(new.first_name || ' ' || new.last_name),'\s+',' ','g'));
  -- Once a verified homonym exists, ordinary edits to the original person must still work.
  if tg_op='UPDATE' then
    if key=lower(regexp_replace(trim(old.first_name || ' ' || old.last_name),'\s+',' ','g')) and new.same_name_person=old.same_name_person then return new; end if;
  end if;
  perform pg_advisory_xact_lock(hashtextextended(key,0));
  if not new.same_name_person and exists(select 1 from public.cms_participants where id<>new.id and lower(regexp_replace(trim(first_name || ' ' || last_name),'\s+',' ','g'))=key) then raise exception 'REG_DUPLICATE_PERSON'; end if;
  return new;
end $$;
commit;
