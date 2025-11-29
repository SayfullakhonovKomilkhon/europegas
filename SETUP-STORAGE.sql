-- ===============================================
-- НАСТРОЙКА ХРАНИЛИЩА ДЛЯ ИЗОБРАЖЕНИЙ
-- ===============================================
-- 
-- Запустите в Supabase Dashboard → SQL Editor
--
-- ===============================================

-- 1. Создаём bucket для изображений
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'images',
    'images',
    true,  -- публичный доступ
    5242880, -- 5MB max
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- 2. Политики доступа для bucket

-- Удаляем старые политики
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Публичный доступ на чтение
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Авторизованные пользователи могут загружать
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Авторизованные пользователи могут обновлять
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Авторизованные пользователи могут удалять
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- ===============================================
-- ГОТОВО! Теперь можно загружать изображения.
-- ===============================================


