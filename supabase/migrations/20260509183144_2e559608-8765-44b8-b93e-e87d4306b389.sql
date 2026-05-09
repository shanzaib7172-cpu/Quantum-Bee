
-- Replace insert policy on community_messages with channel restriction
DROP POLICY IF EXISTS "Members can post own messages" ON public.community_messages;

CREATE POLICY "Members can post own messages"
ON public.community_messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND ((is_announcement = false) OR public.has_role(auth.uid(), 'admin'::app_role))
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR channel_id IN (
      SELECT id FROM public.channels WHERE name IN ('welcome', 'general')
    )
  )
);

-- Storage bucket for community uploads (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-uploads', 'community-uploads', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "community uploads public read" ON storage.objects;
CREATE POLICY "community uploads public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-uploads');

DROP POLICY IF EXISTS "community uploads admin insert" ON storage.objects;
CREATE POLICY "community uploads admin insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'community-uploads' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "community uploads admin delete" ON storage.objects;
CREATE POLICY "community uploads admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'community-uploads' AND public.has_role(auth.uid(), 'admin'::app_role));
