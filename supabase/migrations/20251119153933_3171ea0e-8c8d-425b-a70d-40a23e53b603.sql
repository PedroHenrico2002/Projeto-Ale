-- Atualizar imagens dos itens de menu com imagens específicas de cada tipo de comida

-- Pizza
UPDATE menu_items SET image_url = '/src/assets/menu-items/pizza-margherita.jpg'
WHERE name LIKE '%Pizza%';

-- Sushi Combos
UPDATE menu_items SET image_url = '/src/assets/menu-items/sushi-combo.jpg'
WHERE name LIKE '%Sushi%' OR category = 'Combos';

-- Sashimi
UPDATE menu_items SET image_url = '/src/assets/menu-items/sashimi-salmon.jpg'
WHERE name LIKE '%Sashimi%' OR category = 'Sashimi';

-- Picanha / Carnes
UPDATE menu_items SET image_url = '/src/assets/menu-items/picanha.jpg'
WHERE name LIKE '%Picanha%' OR category = 'Carnes';

-- Massas (Carbonara, Fettuccine, etc)
UPDATE menu_items SET image_url = '/src/assets/menu-items/pasta-carbonara.jpg'
WHERE name LIKE '%Carbonara%' OR name LIKE '%Fettuccine%' OR category = 'Massas';

-- Gelato / Sorvetes
UPDATE menu_items SET image_url = '/src/assets/menu-items/gelato.jpg'
WHERE name LIKE '%Gelato%' OR name LIKE '%Sorvete%' OR category = 'Gelatos' OR category = 'Sorvetes';

-- Bolo de Chocolate e Doces
UPDATE menu_items SET image_url = '/src/assets/menu-items/chocolate-cake.jpg'
WHERE name LIKE '%Chocolate%' OR name LIKE '%Bolo%' OR category = 'Doces Finos';

-- Açaí
UPDATE menu_items SET image_url = '/src/assets/menu-items/acai-bowl.jpg'
WHERE name LIKE '%Açaí%' OR category = 'Açaí';

-- Gyoza
UPDATE menu_items SET image_url = '/src/assets/menu-items/gyoza.jpg'
WHERE name LIKE '%Gyoza%';

-- Yakisoba
UPDATE menu_items SET image_url = '/src/assets/menu-items/yakisoba.jpg'
WHERE name LIKE '%Yakisoba%';