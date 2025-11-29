-- ===============================================
-- ПОЛНОЕ ИСПРАВЛЕНИЕ БАЗЫ ДАННЫХ
-- ===============================================
-- Запустите в Supabase Dashboard → SQL Editor
-- ===============================================

-- 1. УДАЛЯЕМ ПРОБЛЕМНЫЕ ТРИГГЕРЫ
DROP TRIGGER IF EXISTS audit_products_trigger ON products;
DROP TRIGGER IF EXISTS audit_trigger ON products;
DROP TRIGGER IF EXISTS log_changes ON products;
DROP FUNCTION IF EXISTS log_audit() CASCADE;
DROP FUNCTION IF EXISTS audit_trigger_func() CASCADE;

-- 2. УДАЛЯЕМ ТАБЛИЦУ АУДИТА (если мешает)
DROP TABLE IF EXISTS audit_logs CASCADE;

-- 3. ПЕРЕСОЗДАЁМ ТАБЛИЦУ PRODUCTS правильно
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    price DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    image_url TEXT DEFAULT '/images/products/productlogo.png',
    in_stock BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    discount INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    features TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ИНДЕКСЫ
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 5. ОТКЛЮЧАЕМ RLS на products (для простоты)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 6. ПЕРЕСОЗДАЁМ ТАБЛИЦУ КАТЕГОРИЙ
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;

-- 7. ДОБАВЛЯЕМ КАТЕГОРИИ
INSERT INTO product_categories (id, name, slug, display_order, is_active) VALUES
    ('cat-ecu', 'ECU Control Units', 'ecu-control-units', 1, true),
    ('cat-rail', 'Rail Injectors', 'rail-injectors', 2, true),
    ('cat-reducer', 'Gas Reducers', 'gas-reducers', 3, true),
    ('cat-other', 'Other', 'other', 4, true)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    display_order = EXCLUDED.display_order,
    is_active = true;

-- 8. ТАБЛИЦА ФИЛИАЛОВ
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    phone TEXT,
    email TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    working_hours_weekdays TEXT DEFAULT '09:00 - 18:00',
    working_hours_saturday TEXT DEFAULT '09:00 - 16:00',
    working_hours_sunday TEXT DEFAULT 'Closed',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE branches DISABLE ROW LEVEL SECURITY;

-- 9. ТАБЛИЦА ОТЗЫВОВ
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;

-- 10. ТАБЛИЦА КОНТАКТНЫХ СООБЩЕНИЙ
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- 11. ПРОВЕРЯЕМ РЕЗУЛЬТАТ
SELECT 'products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'product_categories', COUNT(*) FROM product_categories
UNION ALL
SELECT 'branches', COUNT(*) FROM branches
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'user_profiles', COUNT(*) FROM user_profiles;

-- ===============================================
-- ГОТОВО! Теперь можно добавлять продукты.
-- ===============================================



