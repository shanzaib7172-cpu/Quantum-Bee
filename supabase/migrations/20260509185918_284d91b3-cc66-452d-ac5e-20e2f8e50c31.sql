
-- Coupons
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  description TEXT,
  max_uses INTEGER,
  uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert coupons" ON public.coupons
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update coupons" ON public.coupons
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete coupons" ON public.coupons
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Blogs
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  author_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blogs viewable by anyone" ON public.blogs
  FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert blogs" ON public.blogs
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update blogs" ON public.blogs
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete blogs" ON public.blogs
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
