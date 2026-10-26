-- Historic results can be imported without inventing event dates.
ALTER TABLE public.cms_rounds ALTER COLUMN event_date DROP NOT NULL;
