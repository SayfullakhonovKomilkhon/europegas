import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import StatCard from '../../components/admin/StatCard';
import { 
    FaBox, 
    FaEnvelope, 
    FaSpinner,
    FaExclamationTriangle,
    FaPlus,
    FaEye
} from 'react-icons/fa';

interface DashboardStats {
  totalProducts: number;
  totalMessages: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalMessages: 0,
  });
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
        if (isSupabaseConfigured) {
    fetchDashboardStats();
        } else {
            setLoading(false);
            setError('Supabase не настроен');
        }
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
            setError(null);

            console.log('📊 Fetching dashboard stats...');

            // Fetch only necessary stats
            const results = await Promise.allSettled([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      ]);

            // Extract counts safely
            const getCount = (result: PromiseSettledResult<any>, index: number): number => {
                if (result.status === 'fulfilled' && !result.value.error) {
                    return result.value.count || 0;
                }
                console.warn(`Failed to fetch stat ${index}:`, result);
                return 0;
            };

      setStats({
                totalProducts: getCount(results[0], 0),
                totalMessages: getCount(results[1], 1),
      });

            console.log('✅ Dashboard stats loaded');
        } catch (err: any) {
            console.error('❌ Error fetching dashboard stats:', err);
            setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-gray-400 mx-auto mb-4" />
                    <div className="text-xl text-gray-600">Загрузка панели управления...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center bg-red-50 p-8 rounded-xl max-w-md">
                    <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-700 mb-2">Ошибка загрузки</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchDashboardStats}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Повторить
                    </button>
                </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
                <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
                <p className="text-gray-500 mt-2">Добро пожаловать в админ-панель EuropeGAS</p>
      </div>

            {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
                    title="Всего продуктов"
          value={stats.totalProducts}
          icon={<FaBox className="text-2xl text-blue-600" />}
          linkTo="/admin/products"
                    linkText="Посмотреть все"
        />
        <StatCard
                    title="Сообщения"
          value={stats.totalMessages}
          icon={<FaEnvelope className="text-2xl text-purple-600" />}
          linkTo="/admin/messages"
                    linkText="Управлять"
        />
      </div>

            {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Быстрые действия</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/products"
                        className="flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
                        <FaPlus />
                        <span>Добавить продукт</span>
                    </Link>
                    <Link
                        to="/admin/branches"
                        className="flex items-center gap-3 px-6 py-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
                        <FaPlus />
                        <span>Добавить филиал</span>
                    </Link>
                    <Link
                        to="/admin/messages"
                        className="flex items-center gap-3 px-6 py-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
          >
                        <FaEye />
                        <span>Сообщения</span>
                    </Link>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-sm p-6 text-white">
                <h2 className="text-xl font-bold mb-2">Информация</h2>
                <p className="text-gray-300 mb-4">
                    Используйте боковое меню для навигации по разделам админ-панели.
                    Все изменения сохраняются автоматически в базу данных Supabase.
                </p>
                <div className="flex gap-4 text-sm">
                    <a 
                        href="https://supabase.com/dashboard" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Supabase Dashboard →
                    </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
