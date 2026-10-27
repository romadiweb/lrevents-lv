begin;
-- Protect the same invariants when an editor uses a direct CMS update instead of the event form RPC.
create function public.cms_registration_event_guard() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if new.registration_round_id is distinct from old.registration_round_id and exists(select 1 from public.cms_event_registrations where event_id=old.id) then raise exception 'REG_ROUND_LOCKED'; end if;
  if new.registration_capacity < (select count(*) from public.cms_event_registrations where event_id=old.id and status='accepted') then raise exception 'REG_CAPACITY'; end if;
  return new;
end $$;
create trigger cms_registration_event_guard before update of registration_round_id,registration_capacity on public.cms_events for each row execute function public.cms_registration_event_guard();
create function public.cms_registration_round_guard() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if (new.season_id is distinct from old.season_id or new.event_id is distinct from old.event_id) and exists(select 1 from public.cms_events e join public.cms_event_registrations r on r.event_id=e.id where e.registration_round_id=old.id) then raise exception 'REG_LINK_LOCKED'; end if;
  return new;
end $$;
create trigger cms_registration_round_guard before update of season_id,event_id on public.cms_rounds for each row execute function public.cms_registration_round_guard();
-- A manually matched legacy profile supplies the canonical sporting name.
create function public.cms_registration_public_name() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  select first_name || ' ' || last_name into new.driver from public.cms_participants where id=new.participant_id;
  return new;
end $$;
create trigger cms_registration_public_name before insert or update on public.cms_event_participants for each row execute function public.cms_registration_public_name();
notify pgrst,'reload schema';
commit;
