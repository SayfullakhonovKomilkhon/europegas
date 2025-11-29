import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/SupabaseAuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { signIn, isSupabaseConfigured, isAdmin, loading: authLoading, user, profile } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in as admin
    useEffect(() => {
        // Only redirect if we have a user AND profile is loaded AND user is admin
        if (!authLoading && user && profile && isAdmin) {
            console.log('✅ User is admin, redirecting to /admin');
            navigate('/admin');
        }
    }, [authLoading, user, profile, isAdmin, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('🔐 Attempting login...');
            const { data, error: signInError } = await signIn(email, password);

            if (signInError) {
                // Handle specific error messages
                let errorMessage = signInError.message;
                if (errorMessage.includes('Invalid login credentials')) {
                    errorMessage = 'Неверный email или пароль';
                } else if (errorMessage.includes('Email not confirmed')) {
                    errorMessage = 'Email не подтвержден. Проверьте почту.';
                }
                throw new Error(errorMessage);
            }

            if (data?.user) {
                console.log('✅ Login successful!');
                // Wait a moment for profile to be set, then navigate
                setTimeout(() => {
                    navigate('/admin');
                }, 100);
            }
        } catch (err: any) {
            console.error('❌ Login error:', err);
            setError(err.message || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    // Show configuration error if Supabase is not configured
    if (!isSupabaseConfigured) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-4">Требуется настройка</h1>
                        <p className="text-gray-600 mb-6">
                            Supabase не настроен. Добавьте учетные данные в файл <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>:
                        </p>
                        <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-left text-sm mb-6 font-mono">
                            <p>REACT_APP_SUPABASE_URL=https://xxx.supabase.co</p>
                            <p>REACT_APP_SUPABASE_ANON_KEY=your_anon_key</p>
                        </div>
                        <a 
                            href="/" 
                            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            На главную
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading only briefly while checking initial auth state
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-white text-4xl mx-auto mb-4" />
                    <p className="text-gray-400">Проверка авторизации...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">EuropeGAS</h1>
                    <p className="text-gray-400">Вход в панель администратора</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                                <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-colors"
                                    placeholder="admin@europegas.uz"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Пароль
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="pl-10 pr-12 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Вход...
                                </>
                            ) : (
                                'Войти'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                            ← Вернуться на сайт
                        </a>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Только авторизованные администраторы могут войти.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
