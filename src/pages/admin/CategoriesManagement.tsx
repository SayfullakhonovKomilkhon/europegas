import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, ProductCategory } from '../../lib/supabase';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

const CategoriesManagement: React.FC = () => {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('product_categories')
                .select('*')
                .order('display_order');

            if (error) throw error;
            setCategories(data || []);
        } catch (error: any) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const categoryData = {
                ...formData,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
            };

            if (editingCategory) {
                // Update existing category
                const { error } = await supabase
                    .from('product_categories')
                    .update(categoryData)
                    .eq('id', editingCategory.id);

                if (error) throw error;
                alert('✅ Категория успешно обновлена!');
            } else {
                // Create new category
                const { error } = await supabase
                    .from('product_categories')
                    .insert([categoryData]);

                if (error) throw error;
                alert('✅ Категория успешно создана!');
            }

            resetForm();
            fetchCategories();
        } catch (error: any) {
            console.error('Error saving category:', error);
            alert('❌ Ошибка: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: ProductCategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            display_order: category.display_order,
            is_active: category.is_active,
        });
        setShowForm(true);
    };

    const handleDelete = async (categoryId: string) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту категорию? Все продукты этой категории станут без категории.')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('product_categories')
                .delete()
                .eq('id', categoryId);

            if (error) throw error;
            alert('✅ Категория успешно удалена!');
            fetchCategories();
        } catch (error: any) {
            console.error('Error deleting category:', error);
            alert('❌ Ошибка: ' + error.message);
        }
    };

    const toggleActive = async (category: ProductCategory) => {
        try {
            const { error } = await supabase
                .from('product_categories')
                .update({ is_active: !category.is_active })
                .eq('id', category.id);

            if (error) throw error;
            fetchCategories();
        } catch (error: any) {
            console.error('Error toggling category:', error);
            alert('❌ Ошибка: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            display_order: 0,
            is_active: true,
        });
        setEditingCategory(null);
        setShowForm(false);
    };

    if (!isSupabaseConfigured) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Supabase не настроен</p>
            </div>
        );
    }

    if (loading && categories.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-4xl text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Управление категориями</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    {showForm ? <><FaTimes /> Отмена</> : <><FaPlus /> Добавить категорию</>}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold mb-6">
                        {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Название *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/20"
                                    placeholder="Авто-генерируется из названия"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Порядок отображения</label>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/20"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    Активна
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Описание</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/20"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                            >
                                <FaSave /> {editingCategory ? 'Обновить' : 'Создать'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
                            category.is_active ? 'border-green-200' : 'border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                                <p className="text-sm text-gray-500">/{category.slug}</p>
                            </div>
                            <span
                                className={`px-2 py-1 text-xs rounded ${
                                    category.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                {category.is_active ? 'Активна' : 'Неактивна'}
                            </span>
                        </div>

                        {category.description && (
                            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                        )}

                        <div className="text-sm text-gray-500 mb-4">
                            Порядок: {category.display_order}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(category)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <FaEdit /> Изменить
                            </button>
                            <button
                                onClick={() => toggleActive(category)}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {category.is_active ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && !loading && (
                <div className="text-center py-12 bg-white rounded-xl">
                    <p className="text-gray-500">Нет категорий. Создайте первую!</p>
                </div>
            )}
        </div>
    );
};

export default CategoriesManagement;


