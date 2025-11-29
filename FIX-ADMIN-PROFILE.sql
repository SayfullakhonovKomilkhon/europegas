-- ===============================================
-- ИСПРАВЛЕНИЕ ПРОФИЛЯ АДМИНИСТРАТОРА
-- ===============================================
-- 
-- Запустите этот SQL в Supabase SQL Editor
-- Dashboard → SQL Editor → New Query
--

-- Шаг 1: Посмотреть всех пользователей из auth.users
SELECT id, email, created_at 
FROM auth.users
ORDER BY created_at DESC;

-- Шаг 2: Посмотреть существующие профили
SELECT * FROM public.user_profiles;

-- ===============================================
-- Шаг 3: СОЗДАТЬ профиль администратора
-- Замените 'admin@gmail.com' на ваш email
-- ===============================================

-- Вариант A: Если профиль НЕ существует - создать новый
INSERT INTO public.user_profiles (id, email, full_name, role)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', 'Administrator'),
    'superadmin'
FROM auth.users 
WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE SET
    role = 'superadmin',
    updated_at = NOW();

-- ===============================================
-- Или если знаете ID пользователя напрямую:
-- ===============================================

-- Вариант B: Обновить существующий профиль по ID
-- UPDATE public.user_profiles 
-- SET role = 'superadmin' 
-- WHERE id = '3998987a-771f-46e1-bfd2-125855eba020';

-- ===============================================
-- Шаг 4: Проверить что профиль создан
-- ===============================================
SELECT * FROM public.user_profiles WHERE role IN ('admin', 'superadmin');

-- ===============================================
-- ГОТОВО! Теперь перезайдите в админ-панель
-- ===============================================


