-- Optional logo for the homepage belt; footer keeps the main image.
BEGIN;
ALTER TABLE public.cms_partners ADD COLUMN belt_image text NOT NULL DEFAULT '';
COMMIT;
