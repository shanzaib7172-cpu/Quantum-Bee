
-- Balances table
CREATE TABLE public.bee_coin_balances (
  user_id UUID PRIMARY KEY,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bee_coin_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own balance select" ON public.bee_coin_balances
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Ledger
CREATE TABLE public.bee_coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  kind TEXT NOT NULL,
  reason TEXT,
  agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bee_coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own tx select" ON public.bee_coin_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Deduct function
CREATE OR REPLACE FUNCTION public.deduct_bee_coins(_amount NUMERIC, _reason TEXT, _agent TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid UUID := auth.uid();
  _bal NUMERIC;
BEGIN
  IF _uid IS NULL THEN RETURN FALSE; END IF;
  IF _amount <= 0 THEN RETURN FALSE; END IF;

  INSERT INTO public.bee_coin_balances(user_id, balance) VALUES (_uid, 0)
    ON CONFLICT (user_id) DO NOTHING;

  SELECT balance INTO _bal FROM public.bee_coin_balances WHERE user_id = _uid FOR UPDATE;
  IF _bal < _amount THEN RETURN FALSE; END IF;

  UPDATE public.bee_coin_balances
    SET balance = balance - _amount, updated_at = now()
    WHERE user_id = _uid;

  INSERT INTO public.bee_coin_transactions(user_id, amount, kind, reason, agent)
    VALUES (_uid, -_amount, 'spend', _reason, _agent);

  RETURN TRUE;
END;
$$;

-- Add function (for signup bonus + future purchases)
CREATE OR REPLACE FUNCTION public.add_bee_coins(_user_id UUID, _amount NUMERIC, _reason TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.bee_coin_balances(user_id, balance) VALUES (_user_id, _amount)
    ON CONFLICT (user_id) DO UPDATE SET balance = bee_coin_balances.balance + _amount, updated_at = now();
  INSERT INTO public.bee_coin_transactions(user_id, amount, kind, reason)
    VALUES (_user_id, _amount, 'credit', _reason);
END;
$$;

-- Update signup trigger to grant 50 free coins
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1), 'Bee'));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member');
  PERFORM public.add_bee_coins(NEW.id, 50, 'Signup bonus');
  RETURN NEW;
END;
$$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill: give 50 coins to existing users who have none
INSERT INTO public.bee_coin_balances (user_id, balance)
SELECT id, 50 FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
