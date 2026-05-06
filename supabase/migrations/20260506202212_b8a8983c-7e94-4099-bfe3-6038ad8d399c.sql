DROP POLICY IF EXISTS "Channels viewable by authenticated" ON public.channels;
CREATE POLICY "Channels viewable by anyone" ON public.channels FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Messages viewable by authenticated" ON public.community_messages;
CREATE POLICY "Messages viewable by anyone" ON public.community_messages FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Profiles viewable by authenticated" ON public.profiles;
CREATE POLICY "Profiles viewable by anyone" ON public.profiles FOR SELECT TO anon, authenticated USING (true);