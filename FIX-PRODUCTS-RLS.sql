-- ===============================================
-- ИСПРАВЛЕНИЕ: Показывать все продукты независимо от цены
-- ===============================================
-- 
-- Проблема: RLS политика фильтрует продукты по in_stock = true
-- Решение: Изменить политику чтобы показывать все продукты
--
-- ===============================================

-- Удаляем старую политику
DROP POLICY IF EXISTS "Anyone can view in-stock products" ON products;
DROP POLICY IF EXISTS "Anyone can view products" ON products;

-- Создаем новую политику - показывать ВСЕ продукты
CREATE POLICY "Anyone can view all products" 
ON products FOR SELECT 
USING (true);

-- Проверяем результат
SELECT 'Products RLS policy updated successfully!' as status;


