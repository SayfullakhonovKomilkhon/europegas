-- ===============================================
-- ПОЛНОЕ ИСПРАВЛЕНИЕ СИСТЕМЫ АВТОРИЗАЦИИ
-- ===============================================
-- 
-- ИНСТРУКЦИЯ:
-- 1. Откройте Supabase Dashboard: https://supabase.com/dashboard
-- 2. Выберите ваш проект
-- 3. Перейдите в SQL Editor (левое меню)
-- 4. Создайте новый запрос (New Query)
-- 5. Вставьте ВЕСЬ этот код
-- 6. Нажмите Run (Ctrl+Enter)
--
-- ===============================================

-- ШАГ 1: Создаём таблицу user_profiles если её нет
-- ===============================================

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

-- Добавляем индексы
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- ШАГ 2: Включаем RLS и создаём политики
-- ===============================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики если есть
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.user_profiles;

-- Политика: Все могут читать профили (нужно для проверки роли)
CREATE POLICY "Anyone can read profiles"
ON public.user_profiles FOR SELECT
USING (true);

-- Политика: Пользователи могут обновлять свой профиль
CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = id);

-- Политика: Система может создавать профили
CREATE POLICY "System can insert profiles"
ON public.user_profiles FOR INSERT
WITH CHECK (true);

-- ШАГ 3: Создаём триггер для автоматического создания профилей
-- ===============================================

-- Функция для создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'customer'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Удаляем старый триггер если есть
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Создаём триггер
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ШАГ 4: Создаём профили для ВСЕХ существующих пользователей
-- ===============================================

INSERT INTO public.user_profiles (id, email, full_name, role)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', ''),
    'customer'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;

-- ШАГ 5: НАЗНАЧАЕМ РОЛЬ SUPERADMIN для admin@gmail.com
-- ===============================================

UPDATE public.user_profiles 
SET 
    role = 'superadmin',
    updated_at = NOW()
WHERE email = 'admin@gmail.com';

-- Также для admin@europegas.uz если есть
UPDATE public.user_profiles 
SET 
    role = 'superadmin',
    updated_at = NOW()
WHERE email = 'admin@europegas.uz';

-- ШАГ 6: Проверяем результат
-- ===============================================

-- Показываем всех пользователей и их роли
SELECT 
    up.id,
    up.email,
    up.full_name,
    up.role,
    up.is_active,
    up.created_at
FROM public.user_profiles up
ORDER BY up.created_at DESC;

-- ===============================================
-- ГОТОВО!
-- ===============================================
-- 
-- После выполнения этого скрипта:
-- 1. Закройте вкладку браузера с сайтом
-- 2. Откройте заново http://localhost:3000/admin/login
-- 3. Войдите с admin@gmail.com / admin1234
-- 4. Вы должны попасть в админ-панель!
--
-- Если все еще не работает:
-- 1. Очистите localStorage браузера (F12 → Application → Local Storage → Clear)
-- 2. Обновите страницу
-- 3. Попробуйте войти снова
--
-- ===============================================


