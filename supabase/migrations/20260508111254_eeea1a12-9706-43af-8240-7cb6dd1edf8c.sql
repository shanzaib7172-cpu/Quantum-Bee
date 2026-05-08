CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'New chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own sessions select" ON public.chat_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own sessions insert" ON public.chat_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own sessions update" ON public.chat_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own sessions delete" ON public.chat_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER chat_sessions_updated BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own messages select" ON public.chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own messages insert" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own messages delete" ON public.chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id, created_at);
CREATE INDEX idx_chat_sessions_user ON public.chat_sessions(user_id, updated_at DESC);