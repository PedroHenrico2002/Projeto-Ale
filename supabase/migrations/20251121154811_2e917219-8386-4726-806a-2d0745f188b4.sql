-- Atualizar imagens dos itens que ainda usam URLs externas para imagens locais apropriadas

-- Cheesecake e tortas (doces)
UPDATE menu_items 
SET image_url = '/src/assets/menu-items/chocolate-cake.jpg'
WHERE (LOWER(name) LIKE '%cheesecake%' OR LOWER(name) LIKE '%torta%')
AND image_url LIKE '%unsplash%';

-- Doces variados
UPDATE menu_items 
SET image_url = '/src/assets/menu-items/chocolate-cake.jpg'
WHERE LOWER(name) LIKE '%doces variados%'
AND image_url LIKE '%unsplash%';

-- Feijoada e pratos principais
UPDATE menu_items 
SET image_url = '/src/assets/menu-items/pasta-carbonara.jpg'
WHERE LOWER(name) LIKE '%feijoada%'
AND image_url LIKE '%unsplash%';

-- Temaki
UPDATE menu_items 
SET image_url = '/src/assets/menu-items/sushi-combo.jpg'
WHERE LOWER(name) LIKE '%temaki%'
AND image_url LIKE '%unsplash%';