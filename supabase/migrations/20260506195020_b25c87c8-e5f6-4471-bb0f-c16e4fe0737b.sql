CREATE TABLE public.channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text NOT NULL DEFAULT 'hash',
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Channels viewable by authenticated"
  ON public.channels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert channels"
  ON public.channels FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update channels"
  ON public.channels FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete channels"
  ON public.channels FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.channels (name, description, icon, position) VALUES
  ('welcome', 'Say hi to the hive 👋', 'sparkles', 0),
  ('general', 'General chat for the community', 'hash', 1),
  ('announcements', 'Major updates from the team', 'megaphone', 2),
  ('study-hall', 'Share what you''re learning', 'book-open', 3),
  ('off-topic', 'Memes, music, anything goes', 'coffee', 4);

ALTER TABLE public.community_messages
  ADD COLUMN channel_id uuid REFERENCES public.channels(id) ON DELETE CASCADE;

UPDATE public.community_messages
  SET channel_id = (SELECT id FROM public.channels WHERE name = 'general')
  WHERE channel_id IS NULL;

ALTER TABLE public.community_messages
  ALTER COLUMN channel_id SET NOT NULL;

CREATE INDEX idx_community_messages_channel ON public.community_messages(channel_id, created_at);

ALTER PUBLICATION supabase_realtime ADD TABLE public.channels;