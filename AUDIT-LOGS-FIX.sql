-- ===============================================
-- ИСПРАВЛЕНИЕ ОШИБКИ: column "operation" of relation "audit_logs" does not exist
-- ===============================================
-- 
-- ПРИЧИНА ОШИБКИ:
-- Таблица audit_logs была создана с колонкой "action", но какой-то код 
-- (возможно Supabase Realtime или внешний сервис) пытался вставить данные
-- используя колонку "operation".
--
-- РЕШЕНИЕ:
-- 1. Добавлена колонка "operation" в таблицу audit_logs
-- 2. Колонка "action" сделана nullable
-- 3. Создан триггер sync_audit_columns который синхронизирует обе колонки
--
-- ===============================================

-- Если нужно применить вручную, выполните в Supabase SQL Editor:

-- 1. Удаляем старый триггер
DROP TRIGGER IF EXISTS sync_audit_operation_trigger ON audit_logs;
DROP TRIGGER IF EXISTS sync_audit_columns_trigger ON audit_logs;
DROP FUNCTION IF EXISTS sync_audit_operation() CASCADE;
DROP FUNCTION IF EXISTS sync_audit_columns() CASCADE;

-- 2. Удаляем constraint NOT NULL с action
ALTER TABLE audit_logs ALTER COLUMN action DROP NOT NULL;

-- 3. Добавляем колонку operation если её нет
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'audit_logs' 
        AND column_name = 'operation'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE audit_logs ADD COLUMN operation TEXT;
    END IF;
END $$;

-- 4. Создаём триггер синхронизации
CREATE OR REPLACE FUNCTION sync_audit_columns()
RETURNS TRIGGER AS $$
BEGIN
    -- Если operation задан, но action нет - копируем в action
    IF NEW.operation IS NOT NULL AND NEW.action IS NULL THEN
        NEW.action := NEW.operation;
    END IF;
    
    -- Если action задан, но operation нет - копируем в operation
    IF NEW.action IS NOT NULL AND NEW.operation IS NULL THEN
        NEW.operation := NEW.action;
    END IF;
    
    -- Если оба NULL - ставим значение по умолчанию
    IF NEW.action IS NULL AND NEW.operation IS NULL THEN
        NEW.action := 'unknown';
        NEW.operation := 'unknown';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_audit_columns_trigger
    BEFORE INSERT ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION sync_audit_columns();

-- 5. Обновляем RLS политики
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Anyone can insert audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;

CREATE POLICY "Anyone can insert audit logs" ON audit_logs 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view audit logs" ON audit_logs 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
    );

-- ===============================================
-- ГОТОВО! Ошибка исправлена.
-- ===============================================


