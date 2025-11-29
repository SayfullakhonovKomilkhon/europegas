-- ===============================================
-- ИСПРАВЛЕНИЕ RLS ПОЛИТИК
-- ===============================================
-- 
-- ПРОБЛЕМА: RLS политики блокируют чтение профилей
-- РЕШЕНИЕ: Отключаем RLS или создаём правильные политики
--
-- Запустите в Supabase Dashboard → SQL Editor
-- ===============================================

-- ШАГ 1: Отключаем RLS на таблице user_profiles (временно)
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- ШАГ 2: Удаляем ВСЕ старые политики
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.user_profiles;
DROP POLICY IF EXISTS "public_profiles_select" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_policy" ON public.user_profiles;

-- ШАГ 3: Проверяем что таблица существует и создаём если нет
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'superadmin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ШАГ 4: Создаём профиль для admin@gmail.com
INSERT INTO public.user_profiles (id, email, full_name, role, is_active)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', 'Administrator'),
    'superadmin',
    true
FROM auth.users 
WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
    role = 'superadmin',
    is_active = true,
    updated_at = NOW();

-- ШАГ 5: Включаем RLS с правильными политиками
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Политика: РАЗРЕШИТЬ ВСЁ для аутентифицированных пользователей
CREATE POLICY "Allow all for authenticated"
ON public.user_profiles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Политика: РАЗРЕШИТЬ чтение для анонимных (нужно для проверки роли при входе)
CREATE POLICY "Allow select for anon"
ON public.user_profiles
FOR SELECT
TO anon
USING (true);

-- ШАГ 6: Проверяем результат
SELECT 
    id,
    email,
    role,
    is_active,
    created_at
FROM public.user_profiles;

-- ===============================================
-- ГОТОВО! Теперь:
-- 1. Очистите localStorage в браузере (F12 → Application → Local Storage → Clear)
-- 2. Обновите страницу
-- 3. Войдите снова
-- ===============================================


