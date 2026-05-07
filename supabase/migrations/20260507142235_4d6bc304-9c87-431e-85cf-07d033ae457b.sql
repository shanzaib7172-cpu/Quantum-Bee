
REVOKE EXECUTE ON FUNCTION public.deduct_bee_coins(NUMERIC, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.add_bee_coins(UUID, NUMERIC, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.deduct_bee_coins(NUMERIC, TEXT, TEXT) TO authenticated;
