
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  message TEXT,
  type TEXT NOT NULL DEFAULT 'subscription',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert submissions"
ON public.submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view submissions"
ON public.submissions
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete submissions"
ON public.submissions
FOR DELETE
USING (is_admin(auth.uid()));
