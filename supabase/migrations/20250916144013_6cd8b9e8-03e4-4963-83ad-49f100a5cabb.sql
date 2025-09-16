-- Criar tabela para métodos de pagamento dos usuários
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'pix', 'cash')),
  card_number TEXT,
  card_name TEXT,
  expiry_date TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para payment_methods
CREATE POLICY "Users can view their own payment methods" 
ON public.payment_methods 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods" 
ON public.payment_methods 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods" 
ON public.payment_methods 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods" 
ON public.payment_methods 
FOR DELETE 
USING (auth.uid() = user_id);

-- Criar tabela para restaurantes favoritos
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);

-- Habilitar RLS
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_favorites
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" 
ON public.user_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger para updated_at em payment_methods
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();