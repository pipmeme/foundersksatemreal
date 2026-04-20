
ALTER TABLE public.founder_applications
DROP COLUMN cofounder_names,
ADD COLUMN cofounder_details jsonb NULL;
