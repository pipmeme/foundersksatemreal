
-- Create founder applications table
CREATE TABLE public.founder_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Founder info
  founder_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  city TEXT,
  linkedin_url TEXT,
  
  -- Company info
  company_name TEXT NOT NULL,
  company_website TEXT,
  industry TEXT NOT NULL,
  one_liner TEXT NOT NULL,
  num_cofounders INTEGER NOT NULL DEFAULT 1,
  founded_date TEXT,
  
  -- Stage & funding
  stage TEXT NOT NULL, -- idea, mvp, pre_seed, seed, series_a, series_b_plus, profitable
  is_incubated BOOLEAN NOT NULL DEFAULT false,
  incubator_name TEXT,
  funding_amount TEXT,
  funding_type TEXT, -- bootstrapped, angel, vc, grant, mixed
  grants_received TEXT,
  
  -- Feature preference
  feature_type TEXT NOT NULL DEFAULT 'rising_founder', -- founder_story or rising_founder
  message TEXT,
  
  -- Admin tracking
  status TEXT NOT NULL DEFAULT 'new' -- new, reviewed, featured, archived
);

-- Enable RLS
ALTER TABLE public.founder_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an application
CREATE POLICY "Anyone can submit applications"
ON public.founder_applications
FOR INSERT
WITH CHECK (true);

-- Only admins can view applications
CREATE POLICY "Admins can view applications"
ON public.founder_applications
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Only admins can update applications
CREATE POLICY "Admins can update applications"
ON public.founder_applications
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Only admins can delete applications
CREATE POLICY "Admins can delete applications"
ON public.founder_applications
FOR DELETE
USING (public.is_admin(auth.uid()));
