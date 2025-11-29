-- ===============================================
-- ПОЛНОЕ УДАЛЕНИЕ И ПЕРЕСОЗДАНИЕ AUDIT_LOGS
-- ===============================================
-- 
-- Это решение полностью удаляет таблицу audit_logs
-- и пересоздаёт её заново без проблемных триггеров
--
-- ===============================================

-- ШАГ 1: Удаляем ВСЕ триггеры на всех таблицах
-- ===============================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Находим и удаляем все триггеры связанные с audit
    FOR r IN (
        SELECT trigger_name, event_object_table 
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public' 
        AND (trigger_name LIKE '%audit%' OR trigger_name LIKE '%log%')
    ) LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I CASCADE', 
                      r.trigger_name, r.event_object_table);
    END LOOP;
END $$;

-- ШАГ 2: Удаляем все функции связанные с audit
-- ===============================================
DROP FUNCTION IF EXISTS log_audit() CASCADE;
DROP FUNCTION IF EXISTS audit_trigger_func() CASCADE;
DROP FUNCTION IF EXISTS log_changes() CASCADE;
DROP FUNCTION IF EXISTS sync_audit_columns() CASCADE;
DROP FUNCTION IF EXISTS sync_audit_operation() CASCADE;
DROP FUNCTION IF EXISTS track_changes() CASCADE;
DROP FUNCTION IF EXISTS log_product_changes() CASCADE;

-- ШАГ 3: Полностью удаляем таблицу audit_logs
-- ===============================================
DROP TABLE IF EXISTS audit_logs CASCADE;

-- ШАГ 4: Создаём таблицу заново (простая версия)
-- ===============================================
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT,
    table_name TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ШАГ 5: Настраиваем RLS (простые правила)
-- ===============================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Разрешаем всем вставлять (для системы)
CREATE POLICY "Allow inserts for all" 
ON audit_logs FOR INSERT 
WITH CHECK (true);

-- Только админы могут читать
CREATE POLICY "Admins can read" 
ON audit_logs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'superadmin')
    )
);

-- ===============================================
-- ГОТОВО! Таблица audit_logs пересоздана
-- ===============================================

SELECT 'Audit logs table recreated successfully!' as status;


