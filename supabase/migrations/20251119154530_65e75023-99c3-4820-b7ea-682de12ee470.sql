-- Corrigir a função com search_path seguro
CREATE OR REPLACE FUNCTION public.cleanup_expired_auth_codes()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.auth_codes
  WHERE expires_at < now() OR (used = true AND created_at < now() - interval '1 hour');
END;
$$;