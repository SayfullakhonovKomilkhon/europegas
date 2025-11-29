-- ===============================================
-- EuropeGAS - Заполнение базы данных контентом
-- Этот скрипт добавляет все данные с сайта в Supabase
-- ===============================================

-- ===============================================
-- КАТЕГОРИИ ПРОДУКТОВ
-- ===============================================

INSERT INTO public.product_categories (name, slug, description, display_order, is_active) VALUES
('ECU Control Units', 'ecu-control-units', 'Electronic Control Units for precise gas system management', 1, true),
('Rail Injectors', 'rail-injectors', 'High-precision gas injectors for optimal fuel delivery', 2, true),
('Gas Reducers', 'gas-reducers', 'Gas pressure reducers and regulators for safe operation', 3, true),
('Other', 'other', 'Other gas system components and accessories', 4, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- ===============================================
-- ПРОДУКТЫ
-- ===============================================

-- ECU Control Units (10 продуктов)
INSERT INTO public.products (name, slug, category_id, price, description, image_url, in_stock, is_featured, discount, features) VALUES
-- 1. ECU SET EG24.4 BASICO
('ECU SET EG24.4 BASICO', 'ecu-eg24-4-basico', 
  (SELECT id FROM product_categories WHERE slug = 'ecu-control-units'),
  72.00, 
  'Basic ECU control unit for 4-cylinder engines with essential functionality. Features advanced microprocessor control and compatibility with most vehicle models. Provides reliable performance and easy installation.',
  '/images/products/productlogo.png',
  true, true, 0,
  '["4-cylinder compatibility", "Basic functionality", "Easy installation", "Compact design", "Diagnostic interface"]'::jsonb),

-- 2. ECU SET EG32.6 BASICO
('ECU SET EG32.6 BASICO', 'ecu-eg32-6-basico',
  (SELECT id FROM product_categories WHERE slug = 'ecu-control-units'),
  130.00,
  'Basic ECU control unit for 6-cylinder engines with essential functionality. Designed for larger engines requiring precise fuel management. Includes all necessary components for a complete installation.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["6-cylinder compatibility", "Basic functionality", "Easy installation", "Comprehensive kit", "Fuel mapping capability"]'::jsonb),

-- 3. ECU SET EG32.4 AVANCE
('ECU SET EG32.4 AVANCE', 'ecu-eg32-4-avance',
  (SELECT id FROM product_categories WHERE slug = 'ecu-control-units'),
  95.00,
  'Advanced ECU control unit for 4-cylinder engines with improved performance. Features enhanced fuel mapping capabilities and better response times. Ideal for vehicles requiring more precise control.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["4-cylinder compatibility", "Advanced functionality", "Improved performance", "Enhanced mapping", "OBD compatibility"]'::jsonb),

-- 4. ECU SET EG48.4 AVANCE
('ECU SET EG48.4 AVANCE', 'ecu-eg48-4-avance',
  (SELECT id FROM product_categories WHERE slug = 'ecu-control-units'),
  130.00,
  'Advanced ECU control unit for 4-cylinder engines with premium features. Includes advanced diagnostic capabilities and fine-tuning options for optimal performance in various conditions.',
  '/images/products/productlogo.png',
  true, true, 0,
  '["4-cylinder compatibility", "Advanced functionality", "Premium features", "Diagnostic software", "Temperature compensation"]'::jsonb),

-- 5. ECU SET EG48.6 AVANCE
('ECU SET EG48.6 AVANCE', 'ecu-eg48-6-avance',
  (SELECT id FROM product_categories WHERE slug = 'ecu-control-units'),
  155.00,
  'Advanced ECU control unit for 6-cylinder engines with premium features. Designed for high-performance vehicles requiring precise fuel management and optimal power delivery.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["6-cylinder compatibility", "Advanced functionality", "Premium features", "Performance optimization", "Extended warranty"]'::jsonb),

-- 6. ECU SET EG48.8 AVANCE
('ECU SET EG48.8 AVANCE', 'ecu-eg48-8-avance',
  (SELECT id FROM product_categories WHERE slug = 'ecu-control-units'),
  200.00,
  'Advanced ECU control unit for 8-cylinder engines with premium features. Our top-of-the-line solution for large engines, providing exceptional control and performance optimization.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["8-cylinder compatibility", "Advanced functionality", "Premium features", "Maximum performance", "Professional installation recommended"]'::jsonb),

-- 7. ECU SET EG48.4 SUPERIOR
('ECU SET EG48.4 SUPERIOR', 'ecu-eg48-4-superior',
  (SELECT id FROM product_categories WHERE slug = 'ecu-control-units'),
  140.00,
  'Superior ECU control unit for 4-cylinder engines with enhanced performance. Features the latest technology for optimal fuel efficiency and power delivery in all driving conditions.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["4-cylinder compatibility", "Superior functionality", "Enhanced performance", "Fuel efficiency optimization", "Advanced diagnostics"]'::jsonb),

-- 8. ECU SET EG48.4 INJECTO
('ECU SET EG48.4 INJECTO', 'ecu-eg48-4-injecto',
  (SELECT id FROM product_categories WHERE slug = 'ecu-control-units'),
  350.00,
  'Specialized ECU control unit for 4-cylinder engines with direct injection support. Designed specifically for modern direct injection engines, providing optimal performance and compatibility.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["4-cylinder compatibility", "Direct injection support", "High precision", "Modern engine compatibility", "Professional calibration"]'::jsonb),

-- 9. ECU SET EG48.6 INJECTO
('ECU SET EG48.6 INJECTO', 'ecu-eg48-6-injecto',
  (SELECT id FROM product_categories WHERE slug = 'ecu-control-units'),
  450.00,
  'Specialized ECU control unit for 6-cylinder engines with direct injection support. Our premium solution for larger direct injection engines, ensuring optimal performance and reliability.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["6-cylinder compatibility", "Direct injection support", "High precision", "Premium components", "Extended warranty"]'::jsonb),

-- 10. ECU SET EG48.4 INJECTO DUE
('ECU SET EG48.4 INJECTO DUE', 'ecu-eg48-4-injecto-due',
  (SELECT id FROM product_categories WHERE slug = 'ecu-control-units'),
  420.00,
  'Advanced dual ECU control unit for 4-cylinder engines with direct injection support. Features dual control systems for maximum precision and reliability in demanding applications.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["4-cylinder compatibility", "Dual system support", "Direct injection compatibility", "Redundant safety systems", "Professional installation required"]'::jsonb),

-- Rail Injectors (10 продуктов)
-- 11. RAILGAS 4 CYL
('RAILGAS 4 CYL.', 'railgas-4-cyl',
  (SELECT id FROM product_categories WHERE slug = 'rail-injectors'),
  32.00,
  'Standard rail injector for 4-cylinder engines with reliable performance. Designed for consistent fuel delivery and long-term reliability in various operating conditions.',
  '/images/products/productlogo.png',
  true, true, 0,
  '["4-cylinder compatibility", "Standard flow rate", "Durable construction", "Easy installation", "Compatible with most ECU systems"]'::jsonb),

-- 12. RAILGAS 3 CYL
('RAILGAS 3 CYL.', 'railgas-3-cyl',
  (SELECT id FROM product_categories WHERE slug = 'rail-injectors'),
  27.00,
  'Standard rail injector for 3-cylinder engines with reliable performance. Specifically designed for smaller engines while maintaining optimal fuel delivery and efficiency.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["3-cylinder compatibility", "Standard flow rate", "Durable construction", "Compact design", "Fuel-efficient operation"]'::jsonb),

-- 13. RAIL APACHE 4 CYL
('RAIL APACHE 4 CYL.', 'rail-apache-4-cyl',
  (SELECT id FROM product_categories WHERE slug = 'rail-injectors'),
  37.00,
  'Apache series rail injector for 4-cylinder engines with improved flow rate. Features enhanced design for better fuel atomization and more consistent delivery across all cylinders.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["4-cylinder compatibility", "Improved flow rate", "Enhanced durability", "Better atomization", "Reduced maintenance"]'::jsonb),

-- 14. RAIL APACHE 3 CYL
('RAIL APACHE 3 CYL.', 'rail-apache-3-cyl',
  (SELECT id FROM product_categories WHERE slug = 'rail-injectors'),
  32.00,
  'Apache series rail injector for 3-cylinder engines with improved flow rate. Brings the advanced features of the Apache series to smaller engine configurations.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["3-cylinder compatibility", "Improved flow rate", "Enhanced durability", "Compact design", "Optimized for small engines"]'::jsonb),

-- 15. RAIL DAKOTA 4 CYL
('RAIL DAKOTA 4 CYL.', 'rail-dakota-4-cyl',
  (SELECT id FROM product_categories WHERE slug = 'rail-injectors'),
  70.00,
  'Premium Dakota series rail injector for 4-cylinder engines with high precision. Our top-tier injector featuring advanced materials and precision manufacturing for optimal performance.',
  '/images/products/productlogo.png',
  true, true, 0,
  '["4-cylinder compatibility", "High precision", "Premium quality", "Maximum efficiency", "Extended lifespan"]'::jsonb),

-- 16. RAIL DAKOTA 3 CYL
('RAIL DAKOTA 3 CYL.', 'rail-dakota-3-cyl',
  (SELECT id FROM product_categories WHERE slug = 'rail-injectors'),
  60.00,
  'Premium Dakota series rail injector for 3-cylinder engines with high precision. Brings the premium features of the Dakota series to 3-cylinder engine applications.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["3-cylinder compatibility", "High precision", "Premium quality", "Compact design", "Optimal fuel delivery"]'::jsonb),

-- 17. RAIL DAKOTA 1 CYL
('RAIL DAKOTA 1 CYL.', 'rail-dakota-1-cyl',
  (SELECT id FROM product_categories WHERE slug = 'rail-injectors'),
  17.50,
  'Premium Dakota series rail injector for single-cylinder engines with high precision. Specialized solution for single-cylinder applications requiring precise fuel delivery.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["Single-cylinder compatibility", "High precision", "Premium quality", "Specialized design", "Ideal for small engines"]'::jsonb),

-- 18. EG 2000 4 CYL
('EG 2000 4 CYL.', 'eg-2000-4-cyl',
  (SELECT id FROM product_categories WHERE slug = 'rail-injectors'),
  65.00,
  'EG 2000 series rail injector for 4-cylinder engines with advanced features. The latest generation of injectors featuring improved technology and reliability.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["4-cylinder compatibility", "Advanced features", "Reliable performance", "Modern design", "Comprehensive warranty"]'::jsonb),

-- 19. EG 2000 3 CYL
('EG 2000 3 CYL.', 'eg-2000-3-cyl',
  (SELECT id FROM product_categories WHERE slug = 'rail-injectors'),
  55.00,
  'EG 2000 series rail injector for 3-cylinder engines with advanced features. Brings the technology of the EG 2000 series to 3-cylinder applications.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["3-cylinder compatibility", "Advanced features", "Reliable performance", "Efficient operation", "Easy maintenance"]'::jsonb),

-- 20. EG 2000 1 CYL
('EG 2000 1 CYL.', 'eg-2000-1-cyl',
  (SELECT id FROM product_categories WHERE slug = 'rail-injectors'),
  17.00,
  'EG 2000 series rail injector for single-cylinder engines with advanced features. Specialized solution for single-cylinder applications with the latest technology.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["Single-cylinder compatibility", "Advanced features", "Reliable performance", "Compact size", "Versatile applications"]'::jsonb),

-- Gas Reducers (10 продуктов)
-- 21. EG PREMO 150
('EG PREMO 150', 'eg-premo-150',
  (SELECT id FROM product_categories WHERE slug = 'gas-reducers'),
  50.00,
  'Premium gas reducer with 150 HP capacity for efficient gas conversion. Features advanced pressure regulation and temperature compensation for optimal performance in all conditions.',
  '/images/products/productlogo.png',
  true, true, 0,
  '["150 HP capacity", "Premium quality", "Efficient gas conversion", "Temperature compensation", "Durable construction"]'::jsonb),

-- 22. RAIL UNO
('RAIL UNO', 'rail-uno',
  (SELECT id FROM product_categories WHERE slug = 'gas-reducers'),
  45.00,
  'Basic gas reducer with reliable performance for standard applications. Our entry-level reducer providing consistent performance for everyday use in most vehicle types.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["Standard capacity", "Reliable performance", "Easy installation", "Cost-effective", "Wide compatibility"]'::jsonb),

-- 23. RAIL DUE
('RAIL DUE', 'rail-due',
  (SELECT id FROM product_categories WHERE slug = 'gas-reducers'),
  55.00,
  'Intermediate gas reducer with enhanced performance for demanding applications. Features improved pressure regulation and better response to changing engine demands.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["Enhanced capacity", "Improved performance", "Durable construction", "Better response", "Versatile applications"]'::jsonb),

-- 24. RAIL TRE
('RAIL TRE', 'rail-tre',
  (SELECT id FROM product_categories WHERE slug = 'gas-reducers'),
  90.00,
  'Advanced gas reducer with high capacity for high-performance applications. Our premium reducer designed for vehicles requiring maximum power and efficiency.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["High capacity", "Advanced performance", "Premium quality", "Maximum efficiency", "Professional installation recommended"]'::jsonb),

-- 25. RAIL TYRION
('RAIL TYRION', 'rail-tyrion',
  (SELECT id FROM product_categories WHERE slug = 'gas-reducers'),
  75.00,
  'Specialized gas reducer with compact design for limited space applications. Features innovative design allowing installation in vehicles with restricted engine bay space.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["Compact design", "Versatile mounting", "Reliable performance", "Space-saving solution", "Consistent pressure regulation"]'::jsonb),

-- 26. RAIL STARK
('RAIL STARK', 'rail-stark',
  (SELECT id FROM product_categories WHERE slug = 'gas-reducers'),
  110.00,
  'Heavy-duty gas reducer for commercial and high-demand applications. Designed for continuous operation in demanding conditions with minimal maintenance requirements.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["Heavy-duty construction", "Commercial grade", "Extended lifespan", "High reliability", "Continuous operation"]'::jsonb),

-- 27. RAIL LANNISTER
('RAIL LANNISTER', 'rail-lannister',
  (SELECT id FROM product_categories WHERE slug = 'gas-reducers'),
  120.00,
  'Premium gas reducer with gold-plated components for maximum durability. Our luxury model featuring corrosion-resistant components and premium materials throughout.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["Premium materials", "Corrosion resistance", "Luxury design", "Maximum durability", "Lifetime warranty"]'::jsonb),

-- 28. RAIL BARATHEON
('RAIL BARATHEON', 'rail-baratheon',
  (SELECT id FROM product_categories WHERE slug = 'gas-reducers'),
  95.00,
  'High-performance gas reducer with reinforced components for racing applications. Designed for competitive use with enhanced flow rates and rapid response to throttle changes.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["Racing specification", "Reinforced components", "High flow rate", "Rapid response", "Competition proven"]'::jsonb),

-- 29. RAIL TARGARYEN
('RAIL TARGARYEN', 'rail-targaryen',
  (SELECT id FROM product_categories WHERE slug = 'gas-reducers'),
  130.00,
  'Advanced gas reducer with heat-resistant design for extreme conditions. Features special alloys and cooling systems for operation in high-temperature environments.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["Heat-resistant design", "Extreme condition operation", "Advanced cooling", "Special alloys", "Temperature monitoring"]'::jsonb),

-- 30. RAIL SNOW
('RAIL SNOW', 'rail-snow',
  (SELECT id FROM product_categories WHERE slug = 'gas-reducers'),
  85.00,
  'Cold-weather optimized gas reducer for reliable performance in low temperatures. Specially designed for regions with harsh winters, ensuring consistent operation in freezing conditions.',
  '/images/products/productlogo.png',
  true, false, 0,
  '["Cold-weather optimized", "Low-temperature operation", "Rapid heating", "Freeze protection", "Winter reliability"]'::jsonb)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  in_stock = EXCLUDED.in_stock,
  is_featured = EXCLUDED.is_featured,
  discount = EXCLUDED.discount,
  features = EXCLUDED.features;

-- ===============================================
-- ФИЛИАЛЫ (первые 10 основных, вы можете добавить больше)
-- ===============================================

INSERT INTO public.branches (name, address, city, phone, email, latitude, longitude, working_hours_weekdays, working_hours_saturday, working_hours_sunday, is_active) VALUES
-- Ташкент
('EuropeGAS Tashkent Headquarters', '7 Bunyodkor Avenue', 'Tashkent', '+998 71 200 0001', 'headquarters@europegas.uz', 41.311081, 69.240562, '08:00 - 20:00', '09:00 - 18:00', '10:00 - 16:00', true),
('EuropeGAS Chilanzar Central', '45 Chilanzar Street, 12th Block', 'Tashkent', '+998 71 200 0002', 'chilanzar@europegas.uz', 41.275230, 69.203850, '09:00 - 19:00', '09:00 - 17:00', 'Closed', true),
('EuropeGAS Yunusabad', '23 Amir Temur Avenue', 'Tashkent', '+998 71 200 0003', 'yunusabad@europegas.uz', 41.338890, 69.288890, '08:30 - 19:30', '09:00 - 18:00', '10:00 - 15:00', true),
('EuropeGAS Sergeli', '78 Sergeli Highway', 'Tashkent', '+998 71 200 0004', 'sergeli@europegas.uz', 41.229170, 69.337500, '09:00 - 18:00', '09:00 - 16:00', 'Closed', true),
('EuropeGAS Mirzo Ulugbek', '156 Mirzo Ulugbek Street', 'Tashkent', '+998 71 200 0005', 'mirzo@europegas.uz', 41.318060, 69.328610, '08:00 - 19:00', '09:00 - 17:00', '10:00 - 15:00', true),

-- Самарканд
('EuropeGAS Samarkand Central', '22 Registan Square', 'Samarkand', '+998 66 223 0001', 'samarkand@europegas.uz', 39.654820, 66.975830, '08:00 - 19:00', '09:00 - 17:00', '10:00 - 15:00', true),

-- Бухара
('EuropeGAS Bukhara Historic', '15 Lyabi Hauz', 'Bukhara', '+998 65 224 0001', 'bukhara@europegas.uz', 39.775560, 64.421390, '08:00 - 18:00', '09:00 - 16:00', 'Closed', true),

-- Фергана
('EuropeGAS Fergana Central', '78 Al-Fergani Street', 'Fergana', '+998 73 244 0001', 'fergana@europegas.uz', 40.384470, 71.784760, '08:00 - 19:00', '09:00 - 17:00', '10:00 - 14:00', true),

-- Андижан
('EuropeGAS Andijan Central', '45 Babur Street', 'Andijan', '+998 74 223 0001', 'andijan@europegas.uz', 40.782780, 72.344450, '08:00 - 18:00', '09:00 - 16:00', 'Closed', true),

-- Наманган
('EuropeGAS Namangan Central', '12 Uychi Street', 'Namangan', '+998 69 234 0001', 'namangan@europegas.uz', 40.997780, 71.672220, '08:00 - 18:00', '09:00 - 16:00', 'Closed', true)

ON CONFLICT DO NOTHING;

-- ===============================================
-- УСПЕХ!
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ ===== Данные успешно добавлены! =====';
    RAISE NOTICE '';
    RAISE NOTICE '📦 Добавлено:';
    RAISE NOTICE '   ✓ 4 категории продуктов';
    RAISE NOTICE '   ✓ 30 продуктов (10 ECU, 10 Rail Injectors, 10 Gas Reducers)';
    RAISE NOTICE '   ✓ 10 основных филиалов';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Рекомендуемые продукты (is_featured = true):';
    RAISE NOTICE '   ✓ ECU SET EG24.4 BASICO';
    RAISE NOTICE '   ✓ ECU SET EG48.4 AVANCE';
    RAISE NOTICE '   ✓ RAILGAS 4 CYL.';
    RAISE NOTICE '   ✓ RAIL DAKOTA 4 CYL.';
    RAISE NOTICE '   ✓ EG PREMO 150';
    RAISE NOTICE '';
    RAISE NOTICE '📍 Филиалы добавлены в городах:';
    RAISE NOTICE '   ✓ Tashkent (5 филиалов)';
    RAISE NOTICE '   ✓ Samarkand, Bukhara, Fergana, Andijan, Namangan';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Теперь можете проверить сайт!';
    RAISE NOTICE '';
END $$;



