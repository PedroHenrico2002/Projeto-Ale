-- Adicionar 2 novos itens de menu para cada restaurante

-- Açaí Amazon Bowl (2 novos itens)
INSERT INTO menu_items (name, description, price, category, restaurant_id, image_url, preparation_time, is_available)
VALUES 
  ('Açaí com Granola e Banana', 'Açaí cremoso com granola crocante, banana e mel', 18.90, 'Açaí', '00000000-0000-0000-0000-000000000208', '/src/assets/menu-items/acai-bowl.jpg', '10-15 min', true),
  ('Bowl Tropical', 'Açaí batido com frutas tropicais, coco ralado e castanhas', 22.90, 'Açaí', '00000000-0000-0000-0000-000000000208', '/src/assets/menu-items/acai-bowl.jpg', '10-15 min', true);

-- Cantina da Nonna (2 novos itens)
INSERT INTO menu_items (name, description, price, category, restaurant_id, image_url, preparation_time, is_available)
VALUES 
  ('Lasanha à Bolonhesa', 'Lasanha tradicional com molho bolonhesa caseiro e queijos', 45.90, 'Massas', '00000000-0000-0000-0000-000000000204', '/src/assets/menu-items/pasta-carbonara.jpg', '30-40 min', true),
  ('Risotto de Funghi', 'Risotto cremoso com mix de cogumelos frescos e parmesão', 52.90, 'Pratos Principais', '00000000-0000-0000-0000-000000000204', '/src/assets/menu-items/pasta-carbonara.jpg', '25-30 min', true);

-- Churrascaria Gaúcha Tradição (2 novos itens)
INSERT INTO menu_items (name, description, price, category, restaurant_id, image_url, preparation_time, is_available)
VALUES 
  ('Picanha Premium (400g)', 'Picanha argentina grelhada no ponto, acompanha farofa e vinagrete', 89.90, 'Carnes', '00000000-0000-0000-0000-000000000203', '/src/assets/menu-items/picanha.jpg', '35-45 min', true),
  ('Maminha com Alho', 'Maminha suculenta temperada com alho, arroz, feijão tropeiro', 75.90, 'Carnes', '00000000-0000-0000-0000-000000000203', '/src/assets/menu-items/picanha.jpg', '30-40 min', true);

-- Doce Encanto Confeitaria (2 novos itens)
INSERT INTO menu_items (name, description, price, category, restaurant_id, image_url, preparation_time, is_available)
VALUES 
  ('Torta de Morango', 'Torta delicada com creme de confeiteiro e morangos frescos', 38.90, 'Doces Finos', '00000000-0000-0000-0000-000000000207', '/src/assets/menu-items/chocolate-cake.jpg', '5-10 min', true),
  ('Brownie com Sorvete', 'Brownie quente de chocolate belga com bola de sorvete de baunilha', 28.90, 'Doces Finos', '00000000-0000-0000-0000-000000000207', '/src/assets/menu-items/chocolate-cake.jpg', '10-15 min', true);

-- Gelateria Artigianale (2 novos itens)
INSERT INTO menu_items (name, description, price, category, restaurant_id, image_url, preparation_time, is_available)
VALUES 
  ('Gelato de Pistache', 'Gelato artesanal de pistache siciliano, textura cremosa', 24.90, 'Gelatos', '00000000-0000-0000-0000-000000000206', '/src/assets/menu-items/gelato.jpg', '5-10 min', true),
  ('Gelato de Limão Siciliano', 'Gelato refrescante de limão siciliano com raspas de limão', 22.90, 'Gelatos', '00000000-0000-0000-0000-000000000206', '/src/assets/menu-items/gelato.jpg', '5-10 min', true);

-- Pizzaria Bella Napoli (2 novos itens)
INSERT INTO menu_items (name, description, price, category, restaurant_id, image_url, preparation_time, is_available)
VALUES 
  ('Pizza Quattro Formaggi', 'Mussarela, gorgonzola, parmesão e provolone', 58.90, 'Pizzas', '00000000-0000-0000-0000-000000000201', '/src/assets/menu-items/pizza-margherita.jpg', '25-35 min', true),
  ('Pizza Calabresa Premium', 'Calabresa artesanal, cebola roxa, azeitonas e oregano', 54.90, 'Pizzas', '00000000-0000-0000-0000-000000000201', '/src/assets/menu-items/pizza-margherita.jpg', '25-35 min', true);

-- Sushi House Premium (2 novos itens)
INSERT INTO menu_items (name, description, price, category, restaurant_id, image_url, preparation_time, is_available)
VALUES 
  ('Hot Roll Filadélfia', 'Hot roll empanado com salmão, cream cheese e cebolinha', 48.90, 'Hot Rolls', '00000000-0000-0000-0000-000000000202', '/src/assets/menu-items/sushi-combo.jpg', '20-30 min', true),
  ('Temaki de Atum Picante', 'Temaki cone com atum fresco, molho picante e gergelim', 32.90, 'Temakis', '00000000-0000-0000-0000-000000000202', '/src/assets/menu-items/sushi-combo.jpg', '15-20 min', true);