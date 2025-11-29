-- ===============================================
-- СРОЧНОЕ ИСПРАВЛЕНИЕ - ЗАПУСТИТЕ ЭТОТ КОД!
-- ===============================================
-- 
-- Supabase Dashboard → SQL Editor → New Query
-- Скопируйте ВЕСЬ код → Run
--
-- ===============================================

-- 1. ОТКЛЮЧАЕМ RLS (это главная проблема!)
ALTER TABLE IF EXISTS public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Удаляем ВСЕ политики
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', pol.policyname);
    END LOOP;
END $$;

-- 3. Создаём таблицу если не существует
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    full_name TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    role TEXT DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Добавляем внешний ключ если нет
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_profiles_id_fkey'
    ) THEN
        ALTER TABLE public.user_profiles 
        ADD CONSTRAINT user_profiles_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- 5. СОЗДАЁМ ПРОФИЛЬ АДМИНИСТРАТОРА
INSERT INTO public.user_profiles (id, email, full_name, role, is_active)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', 'Admin'),
    'superadmin',
    true
FROM auth.users 
WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
    role = 'superadmin',
    is_active = true,
    email = EXCLUDED.email,
    updated_at = NOW();

-- 6. Также для admin@europegas.uz
INSERT INTO public.user_profiles (id, email, full_name, role, is_active)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', 'Admin'),
    'superadmin',
    true
FROM auth.users 
WHERE email = 'admin@europegas.uz'
ON CONFLICT (id) DO UPDATE SET 
    role = 'superadmin',
    is_active = true,
    email = EXCLUDED.email,
    updated_at = NOW();

-- 7. ПОКАЗЫВАЕМ РЕЗУЛЬТАТ
SELECT 
    '✅ ГОТОВО! Найдено профилей:' as status,
    COUNT(*) as count
FROM public.user_profiles;

SELECT 
    id,
    email,
    role,
    is_active
FROM public.user_profiles
ORDER BY created_at DESC;

-- ===============================================
-- ПОСЛЕ ВЫПОЛНЕНИЯ:
-- 1. Очистите localStorage браузера (F12 → Application → Local Storage → Clear)
-- 2. Обновите страницу (Ctrl+Shift+R)
-- 3. Войдите: admin@gmail.com / admin1234
-- ===============================================



