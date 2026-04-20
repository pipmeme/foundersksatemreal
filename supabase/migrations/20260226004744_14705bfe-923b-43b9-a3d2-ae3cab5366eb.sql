
CREATE TABLE public.kickstart_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  business_idea TEXT NOT NULL,
  help_needed TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.kickstart_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a kickstart signup"
ON public.kickstart_signups
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can view kickstart signups"
ON public.kickstart_signups
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);
