-- Criar bucket para imagens de menu items
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-items',
  'menu-items',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Política para permitir que qualquer pessoa veja as imagens
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-items');

-- Política para permitir upload de imagens (usuários autenticados)
CREATE POLICY "Authenticated users can upload menu item images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'menu-items' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir atualização de imagens (usuários autenticados)
CREATE POLICY "Authenticated users can update menu item images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'menu-items' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir exclusão de imagens (usuários autenticados)
CREATE POLICY "Authenticated users can delete menu item images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'menu-items' 
  AND auth.role() = 'authenticated'
);