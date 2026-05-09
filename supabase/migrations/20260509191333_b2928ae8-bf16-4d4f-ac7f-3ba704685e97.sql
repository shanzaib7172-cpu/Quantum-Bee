
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS suspended BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS blocked BOOLEAN NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Admins update any profile" ON public.profiles;
CREATE POLICY "Admins update any profile" ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete any profile" ON public.profiles;
CREATE POLICY "Admins delete any profile" ON public.profiles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  icon TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications viewable by anyone" ON public.notifications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update notifications" ON public.notifications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete notifications" ON public.notifications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
