
DROP FUNCTION IF EXISTS public.increment_blog_click(TEXT);

CREATE POLICY "Anyone can insert blog clicks" ON public.blog_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update blog clicks" ON public.blog_clicks FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
