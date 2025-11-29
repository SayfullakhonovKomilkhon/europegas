import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/SupabaseAuthContext';
import {
    FaHome,
    FaBox,
    FaMapMarkerAlt,
    FaEnvelope,
    FaSignOutAlt,
    FaChartLine,
    FaTags,
    FaExclamationTriangle,
    FaSpinner,
    FaBars,
    FaTimes,
} from 'react-icons/fa';

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { 
        profile, 
        signOut, 
        loading, 
        isAdmin, 
        isSupabaseConfigured, 
        user,
        isAuthenticated 
    } = useAuth();
    
    // Force stop loading after 2 seconds max
    const [forceLoaded, setForceLoaded] = useState(false);
    // Mobile sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setForceLoaded(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Close sidebar on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    // Show loading spinner (max 2 seconds)
    if (loading && !forceLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-gray-400 mx-auto mb-4" />
                    <div className="text-xl text-gray-600">Загрузка...</div>
                </div>
            </div>
        );
    }

    // Show configuration error if Supabase is not configured
    if (!isSupabaseConfigured) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <FaExclamationTriangle className="text-yellow-500 text-6xl mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Требуется настройка</h1>
                    <p className="text-gray-600 mb-6">
                        Админ-панель требует настройки Supabase. 
                        Добавьте учетные данные в файл <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>:
                    </p>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-left text-sm mb-6 font-mono">
                        <p>REACT_APP_SUPABASE_URL=https://xxx.supabase.co</p>
                        <p>REACT_APP_SUPABASE_ANON_KEY=your_anon_key</p>
                    </div>
                    <Link to="/" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 inline-block transition-colors">
                        На главную
                    </Link>
                </div>
            </div>
        );
    }

    // Show access denied if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Требуется авторизация</h1>
                    <p className="text-gray-600 mb-6">
                        Пожалуйста, войдите в систему для доступа к админ-панели.
                    </p>
                    <div className="space-x-4">
                        <Link 
                            to="/admin/login" 
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 inline-block transition-colors"
                        >
                            Войти
                        </Link>
                        <Link 
                            to="/" 
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 inline-block transition-colors"
                        >
                            На главную
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Show access denied if authenticated but not admin
    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <FaExclamationTriangle className="text-orange-500 text-6xl mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Доступ запрещен</h1>
                    <p className="text-gray-600 mb-4">
                        У вас нет прав для доступа к админ-панели.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Текущий пользователь: {user?.email}<br/>
                        Роль: {profile?.role || 'не определена'}
                    </p>
                    <div className="space-x-4">
                        <button
                            onClick={handleSignOut}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-block transition-colors"
                        >
                            Выйти
                        </button>
                        <Link 
                            to="/" 
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 inline-block transition-colors"
                        >
                            На главную
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const navItems = [
        { path: '/admin', icon: FaChartLine, label: 'Панель управления', exact: true },
        { path: '/admin/products', icon: FaBox, label: 'Продукты' },
        { path: '/admin/categories', icon: FaTags, label: 'Категории' },
        { path: '/admin/branches', icon: FaMapMarkerAlt, label: 'Филиалы' },
        { path: '/admin/messages', icon: FaEnvelope, label: 'Сообщения' },
    ];

    const isActive = (path: string, exact?: boolean) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path) && location.pathname !== '/admin';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden bg-black text-white p-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
            >
                {isSidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-black text-white flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-800">
                    <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <FaHome className="text-2xl" />
                        <div>
                            <h1 className="text-xl font-bold">EuropeGAS</h1>
                            <p className="text-xs text-gray-400">Админ-панель</p>
                        </div>
                    </Link>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {profile?.full_name?.charAt(0)?.toUpperCase() || 
                             profile?.email?.charAt(0)?.toUpperCase() || 
                             'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {profile?.full_name || profile?.email || 'Администратор'}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                                {profile?.role === 'superadmin' ? 'Супер-админ' : 'Администратор'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-6 py-3 transition-colors ${
                                isActive(item.path, item.exact)
                                    ? 'bg-gray-800 text-white border-l-4 border-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent'
                                }`}
                        >
                            <item.icon className="text-lg" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Sign Out */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Выйти</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 overflow-auto min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
