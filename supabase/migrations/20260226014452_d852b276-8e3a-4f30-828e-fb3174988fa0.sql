CREATE POLICY "Admins can update kickstart signups"
ON public.kickstart_signups
FOR UPDATE
USING (public.is_admin(auth.uid()));