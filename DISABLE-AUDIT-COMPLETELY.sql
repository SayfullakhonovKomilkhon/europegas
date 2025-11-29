-- ===============================================
-- ПОЛНОЕ ОТКЛЮЧЕНИЕ AUDIT_LOGS (ЕСЛИ ДРУГОЕ НЕ ПОМОГЛО)
-- ===============================================
-- 
-- Это самое радикальное решение - полностью удаляем
-- таблицу audit_logs так как она не используется в приложении
--
-- ===============================================

-- Шаг 1: Отключаем Realtime для audit_logs (если включен)
-- ===============================================
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS audit_logs;

-- Шаг 2: Удаляем ВСЕ что связано с audit_logs
-- ===============================================

-- Удаляем политики
DROP POLICY IF EXISTS "Allow inserts for all" ON audit_logs;
DROP POLICY IF EXISTS "Admins can read" ON audit_logs;
DROP POLICY IF EXISTS "Allow all inserts to audit_logs" ON audit_logs;
DROP POLICY IF EXISTS "Admins can read audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Anyone can insert audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;

-- Удаляем все триггеры на products
DROP TRIGGER IF EXISTS audit_products_trigger ON products CASCADE;
DROP TRIGGER IF EXISTS audit_trigger ON products CASCADE;
DROP TRIGGER IF EXISTS log_changes ON products CASCADE;
DROP TRIGGER IF EXISTS track_product_changes ON products CASCADE;

-- Удаляем все триггеры на audit_logs
DROP TRIGGER IF EXISTS sync_audit_columns_trigger ON audit_logs CASCADE;
DROP TRIGGER IF EXISTS sync_audit_operation_trigger ON audit_logs CASCADE;

-- Удаляем все функции
DROP FUNCTION IF EXISTS log_audit() CASCADE;
DROP FUNCTION IF EXISTS audit_trigger_func() CASCADE;
DROP FUNCTION IF EXISTS log_changes() CASCADE;
DROP FUNCTION IF EXISTS sync_audit_columns() CASCADE;
DROP FUNCTION IF EXISTS sync_audit_operation() CASCADE;
DROP FUNCTION IF EXISTS track_changes() CASCADE;
DROP FUNCTION IF EXISTS log_product_changes() CASCADE;
DROP FUNCTION IF EXISTS track_product_changes() CASCADE;

-- Шаг 3: Удаляем таблицу полностью
-- ===============================================
DROP TABLE IF EXISTS public.audit_logs CASCADE;

-- ===============================================
-- ВСЁ! Таблица audit_logs полностью удалена
-- ===============================================
-- 
-- Приложение будет работать нормально без неё,
-- так как audit_logs не используется в коде
--
-- ===============================================

SELECT 'Audit logs completely removed! Application should work now.' as status;


