
-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  package TEXT,
  bee_coins NUMERIC,
  status TEXT NOT NULL DEFAULT 'completed',
  provider TEXT,
  external_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own payments" ON public.payments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own payments" ON public.payments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update payments" ON public.payments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete payments" ON public.payments FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Blog clicks
CREATE TABLE IF NOT EXISTS public.blog_clicks (
  slug TEXT PRIMARY KEY,
  clicks BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog clicks viewable by anyone" ON public.blog_clicks FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.increment_blog_click(_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.blog_clicks(slug, clicks) VALUES (_slug, 1)
    ON CONFLICT (slug) DO UPDATE SET clicks = blog_clicks.clicks + 1, updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_blog_click(TEXT) TO anon, authenticated;

-- Coupon redemptions
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL,
  coupon_code TEXT NOT NULL,
  user_id UUID,
  order_amount NUMERIC,
  discount_amount NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own redemptions" ON public.coupon_redemptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own redemptions" ON public.coupon_redemptions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete redemptions" ON public.coupon_redemptions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
