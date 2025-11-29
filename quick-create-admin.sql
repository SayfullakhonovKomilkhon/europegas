-- ===============================================
-- БЫСТРОЕ СОЗДАНИЕ ТЕСТОВОГО АДМИНИСТРАТОРА
-- ===============================================

-- Проверим, есть ли уже пользователь с этим email
DO $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    -- Проверяем существующих пользователей
    SELECT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'admin@europegas.uz'
    ) INTO user_exists;
    
    IF user_exists THEN
        RAISE NOTICE '✅ Пользователь admin@europegas.uz уже существует';
        RAISE NOTICE '   Обновляем роль на superadmin...';
        
        -- Обновляем роль
        UPDATE public.user_profiles 
        SET role = 'superadmin' 
        WHERE email = 'admin@europegas.uz';
        
        RAISE NOTICE '✅ Роль обновлена на superadmin!';
    ELSE
        RAISE NOTICE '⚠️ Пользователь не найден.';
        RAISE NOTICE '';
        RAISE NOTICE '📝 Чтобы создать администратора:';
        RAISE NOTICE '   1. Откройте: Authentication → Users → Add user';
        RAISE NOTICE '   2. Email: admin@europegas.uz';
        RAISE NOTICE '   3. Password: ваш_пароль (минимум 6 символов)';
        RAISE NOTICE '   4. Auto Confirm: ✅';
        RAISE NOTICE '   5. Затем запустите этот скрипт снова';
    END IF;
END $$;



