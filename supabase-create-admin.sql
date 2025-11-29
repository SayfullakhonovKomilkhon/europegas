-- ===============================================
-- CREATE ADMIN USER FOR EUROPEGAS
-- Run this AFTER running supabase-schema-fix.sql
-- ===============================================

-- ===============================================
-- OPTION 1: Make an existing user a superadmin
-- Replace 'your-email@example.com' with real email
-- ===============================================

-- First, check existing users:
SELECT id, email, role, created_at 
FROM user_profiles 
ORDER BY created_at DESC;

-- Make a user superadmin:
UPDATE user_profiles 
SET role = 'superadmin' 
WHERE email = 'admin@europegas.uz';

-- Or make a user regular admin:
-- UPDATE user_profiles 
-- SET role = 'admin' 
-- WHERE email = 'manager@europegas.uz';

-- ===============================================
-- OPTION 2: Check if authentication trigger works
-- Create a test user via Supabase Auth, then verify:
-- ===============================================

-- After creating a user in Supabase Auth dashboard,
-- verify the profile was created:
SELECT 
    au.id,
    au.email,
    au.created_at as auth_created,
    up.id as profile_id,
    up.email as profile_email,
    up.role,
    up.created_at as profile_created
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
ORDER BY au.created_at DESC;

-- ===============================================
-- OPTION 3: Manually create profile if missing
-- (In case trigger didn't work)
-- ===============================================

-- Find users without profiles:
SELECT au.id, au.email
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles up WHERE up.id = au.id
);

-- Manually insert profile for a user:
-- INSERT INTO user_profiles (id, email, full_name, role)
-- SELECT id, email, '', 'superadmin'
-- FROM auth.users 
-- WHERE email = 'admin@europegas.uz'
-- ON CONFLICT (id) DO UPDATE SET role = 'superadmin';

-- ===============================================
-- DIAGNOSTIC QUERIES
-- ===============================================

-- Check RLS policies on user_profiles:
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Check if trigger exists:
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check all user roles:
SELECT role, COUNT(*) as count
FROM user_profiles
GROUP BY role;

-- ===============================================
-- TEST THE AUTHENTICATION FLOW
-- ===============================================

-- Test the is_admin() function (run as authenticated user):
-- SELECT public.is_admin();

-- Test the is_superadmin() function:
-- SELECT public.is_superadmin();

-- Test get_user_role() function:
-- SELECT public.get_user_role(auth.uid());

-- ===============================================
-- SAMPLE DATA FOR TESTING
-- ===============================================

-- Insert sample products (if needed):
INSERT INTO products (name, slug, category_id, price, description, in_stock, is_featured)
SELECT 
    'ECU SET EG24.4 BASICO',
    'ecu-eg24-4-basico',
    pc.id,
    72.00,
    'Basic ECU control unit for 4-cylinder engines with essential functionality.',
    true,
    true
FROM product_categories pc 
WHERE pc.slug = 'ecu-control-units'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, category_id, price, description, in_stock, is_featured)
SELECT 
    'ECU SET EG48.4 AVANCE',
    'ecu-eg48-4-avance',
    pc.id,
    130.00,
    'Advanced ECU control unit for 4-cylinder engines with premium features.',
    true,
    true
FROM product_categories pc 
WHERE pc.slug = 'ecu-control-units'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, category_id, price, description, in_stock, is_featured)
SELECT 
    'RAILGAS 4 CYL.',
    'railgas-4-cyl',
    pc.id,
    32.00,
    'Standard rail injector for 4-cylinder engines with reliable performance.',
    true,
    true
FROM product_categories pc 
WHERE pc.slug = 'rail-injectors'
ON CONFLICT (slug) DO NOTHING;

-- Insert sample branch:
INSERT INTO branches (name, address, city, phone, email, latitude, longitude)
VALUES (
    'EuropeGAS Tashkent Headquarters',
    '7 Bunyodkor Avenue',
    'Tashkent',
    '+998 71 200 0001',
    'headquarters@europegas.uz',
    41.311081,
    69.240562
)
ON CONFLICT DO NOTHING;

-- ===============================================
-- VERIFY EVERYTHING IS WORKING
-- ===============================================

-- Count records in all tables:
SELECT 
    'user_profiles' as table_name, COUNT(*) as count FROM user_profiles
UNION ALL
SELECT 'product_categories', COUNT(*) FROM product_categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'branches', COUNT(*) FROM branches
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages;

-- ===============================================
-- SUCCESS CHECK
-- ===============================================

DO $$
DECLARE
    user_count INTEGER;
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM user_profiles;
    SELECT COUNT(*) INTO admin_count FROM user_profiles WHERE role IN ('admin', 'superadmin');
    
    RAISE NOTICE '';
    RAISE NOTICE '📊 Current Status:';
    RAISE NOTICE '   Total users: %', user_count;
    RAISE NOTICE '   Admins/Superadmins: %', admin_count;
    
    IF admin_count = 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  No admin users found!';
        RAISE NOTICE '   Run: UPDATE user_profiles SET role = ''superadmin'' WHERE email = ''your-email@example.com'';';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '✅ Admin users configured!';
    END IF;
END $$;




