BEGIN;
ALTER TABLE public.cms_partners ADD COLUMN main_partner boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX cms_partners_one_main_idx ON public.cms_partners(main_partner) WHERE main_partner;
CREATE TABLE public.cms_seasons (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, year integer NOT NULL CHECK(year BETWEEN 1900 AND 2200),
 archived boolean NOT NULL DEFAULT false, scoring_mode text NOT NULL DEFAULT 'position' CHECK(scoring_mode IN ('position','run_sum','manual')),
 points_scale text NOT NULL DEFAULT '40,32,26,20,18,16,12,10', best_rounds integer NOT NULL DEFAULT 0 CHECK(best_rounds BETWEEN 0 AND 100),
 team_best integer NOT NULL DEFAULT 0 CHECK(team_best BETWEEN 0 AND 100), published boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.cms_classes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), season_id uuid NOT NULL REFERENCES public.cms_seasons(id) ON DELETE RESTRICT,
 name text NOT NULL, sort_order integer NOT NULL DEFAULT 0, published boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(id,season_id), UNIQUE(season_id,name)
);
CREATE TABLE public.cms_rounds (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), season_id uuid NOT NULL REFERENCES public.cms_seasons(id) ON DELETE RESTRICT,
 event_id uuid REFERENCES public.cms_events(id) ON DELETE SET NULL, name text NOT NULL, event_date date NOT NULL, sort_order integer NOT NULL DEFAULT 0,
 published boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,season_id)
);
CREATE TABLE public.cms_racing_teams (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL UNIQUE, car_brand text NOT NULL DEFAULT '',
 published boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.cms_participants (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), first_name text NOT NULL, last_name text NOT NULL, car text NOT NULL DEFAULT '',
 team_id uuid REFERENCES public.cms_racing_teams(id) ON DELETE RESTRICT, published boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.cms_entries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), season_id uuid NOT NULL REFERENCES public.cms_seasons(id) ON DELETE RESTRICT,
 class_id uuid NOT NULL, participant_id uuid NOT NULL REFERENCES public.cms_participants(id) ON DELETE RESTRICT,
 team_id uuid REFERENCES public.cms_racing_teams(id) ON DELETE RESTRICT, start_number text NOT NULL DEFAULT '', car text NOT NULL DEFAULT '',
 published boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(class_id,season_id) REFERENCES public.cms_classes(id,season_id) ON DELETE RESTRICT,
 UNIQUE(id,season_id), UNIQUE(season_id,class_id,participant_id)
);
CREATE TABLE public.cms_results (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), season_id uuid NOT NULL REFERENCES public.cms_seasons(id) ON DELETE RESTRICT,
 round_id uuid NOT NULL, entry_id uuid NOT NULL,
 position integer CHECK(position BETWEEN 1 AND 10000), points numeric CHECK(points BETWEEN -100000 AND 100000),
 status text NOT NULL DEFAULT 'OK' CHECK(status IN ('OK','DNS','DNF','DSQ')), notes text NOT NULL DEFAULT '',
 published boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(round_id,season_id) REFERENCES public.cms_rounds(id,season_id) ON DELETE RESTRICT,
 FOREIGN KEY(entry_id,season_id) REFERENCES public.cms_entries(id,season_id) ON DELETE RESTRICT,
 UNIQUE(round_id,entry_id)
);
CREATE TABLE public.cms_runs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), result_id uuid NOT NULL REFERENCES public.cms_results(id) ON DELETE RESTRICT,
 run_number integer NOT NULL CHECK(run_number BETWEEN 1 AND 50), time_ms integer CHECK(time_ms BETWEEN 0 AND 86400000),
 penalty_ms integer CHECK(penalty_ms BETWEEN 0 AND 86400000), result_ms integer CHECK(result_ms BETWEEN 0 AND 172800000),
 points numeric CHECK(points BETWEEN -100000 AND 100000), status text NOT NULL DEFAULT 'OK' CHECK(status IN ('OK','DNS','DNF','DSQ')),
 published boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(result_id,run_number)
);
CREATE INDEX ON public.cms_classes(season_id);
CREATE INDEX ON public.cms_rounds(season_id);
CREATE INDEX ON public.cms_rounds(event_id);
CREATE INDEX ON public.cms_participants(team_id);
CREATE INDEX ON public.cms_entries(season_id);
CREATE INDEX ON public.cms_entries(class_id);
CREATE INDEX ON public.cms_entries(participant_id);
CREATE INDEX ON public.cms_entries(team_id);
CREATE INDEX ON public.cms_results(season_id);
CREATE INDEX ON public.cms_results(entry_id);
CREATE INDEX ON public.cms_runs(result_id);
DO $$ DECLARE tab text; BEGIN
 FOREACH tab IN ARRAY ARRAY['cms_seasons','cms_classes','cms_rounds','cms_racing_teams','cms_participants','cms_entries','cms_results','cms_runs'] LOOP
 EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',tab);
 EXECUTE format('REVOKE ALL ON public.%I FROM anon,authenticated',tab);
 EXECUTE format('GRANT SELECT ON public.%I TO anon,authenticated',tab);
 EXECUTE format('GRANT INSERT,UPDATE,DELETE ON public.%I TO authenticated',tab);
 EXECUTE format('GRANT ALL ON public.%I TO service_role',tab);
 EXECUTE format('CREATE POLICY cms_editor ON public.%I FOR ALL TO authenticated USING (EXISTS(SELECT 1 FROM public.cms_users WHERE id=(SELECT auth.uid()) AND active)) WITH CHECK (EXISTS(SELECT 1 FROM public.cms_users WHERE id=(SELECT auth.uid()) AND active))',tab);
 END LOOP;
END $$;
CREATE POLICY public_seasons ON public.cms_seasons FOR SELECT TO anon,authenticated USING(published);
CREATE POLICY public_classes ON public.cms_classes FOR SELECT TO anon,authenticated USING(published AND EXISTS(SELECT 1 FROM public.cms_seasons WHERE id=season_id AND published));
CREATE POLICY public_rounds ON public.cms_rounds FOR SELECT TO anon,authenticated USING(published AND EXISTS(SELECT 1 FROM public.cms_seasons WHERE id=season_id AND published));
CREATE POLICY public_racing_teams ON public.cms_racing_teams FOR SELECT TO anon,authenticated USING(published);
CREATE POLICY public_participants ON public.cms_participants FOR SELECT TO anon,authenticated USING(published);
CREATE POLICY public_entries ON public.cms_entries FOR SELECT TO anon,authenticated USING(published AND EXISTS(SELECT 1 FROM public.cms_seasons WHERE id=season_id AND published) AND EXISTS(SELECT 1 FROM public.cms_classes WHERE id=class_id AND published) AND EXISTS(SELECT 1 FROM public.cms_participants WHERE id=participant_id AND published));
CREATE POLICY public_results ON public.cms_results FOR SELECT TO anon,authenticated USING(published AND EXISTS(SELECT 1 FROM public.cms_rounds WHERE id=round_id AND published) AND EXISTS(SELECT 1 FROM public.cms_entries WHERE id=entry_id AND published));
CREATE POLICY public_runs ON public.cms_runs FOR SELECT TO anon,authenticated USING(published AND EXISTS(SELECT 1 FROM public.cms_results WHERE id=result_id AND published));
COMMIT;
