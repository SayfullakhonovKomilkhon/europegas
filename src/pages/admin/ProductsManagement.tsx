import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured, Product, ProductCategory } from '../../lib/supabase';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes, FaUpload, FaImage } from 'react-icons/fa';

const ProductsManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category_id: '',
        price: '',
        description: '',
        image_url: '/images/products/productlogo.png',
        in_stock: true,
        is_featured: false,
        features: [] as string[],
    });
    const [featureInput, setFeatureInput] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, category:product_categories(name)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error: any) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('product_categories')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error) throw error;
            setCategories(data || []);
        } catch (error: any) {
            console.error('Error fetching categories:', error);
        }
    };

    // Upload image to Supabase Storage
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('❌ Файл слишком большой. Максимум 5MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('❌ Пожалуйста, выберите изображение');
            return;
        }

        setUploading(true);

        try {
            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `products/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                // If bucket doesn't exist, use local preview
                console.warn('Storage upload failed, using local preview:', uploadError.message);
                
                // Create local preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                    setFormData({ ...formData, image_url: reader.result as string });
                };
                reader.readAsDataURL(file);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: publicUrl });
            setImagePreview(publicUrl);
            console.log('✅ Image uploaded:', publicUrl);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            
            // Fallback to local preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData({ ...formData, image_url: reader.result as string });
            };
            reader.readAsDataURL(file);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                category_id: formData.category_id || null,
                description: formData.description,
                image_url: formData.image_url,
                in_stock: formData.in_stock,
                is_featured: formData.is_featured,
                features: formData.features,
                price: formData.price ? parseFloat(formData.price) : 0,
                discount: 0,
            };

            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);

                if (error) throw error;
                alert('✅ Продукт успешно обновлен!');
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);

                if (error) throw error;
                alert('✅ Продукт успешно создан!');
            }

            resetForm();
            fetchProducts();
        } catch (error: any) {
            console.error('Error saving product:', error);
            alert('❌ Ошибка: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            slug: product.slug,
            category_id: product.category_id || '',
            price: product.price?.toString() || '',
            description: product.description || '',
            image_url: product.image_url || '/images/products/productlogo.png',
            in_stock: product.in_stock,
            is_featured: product.is_featured,
            features: product.features || [],
        });
        setImagePreview(product.image_url || null);
        setShowForm(true);
    };

    const handleDelete = async (productId: string) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот продукт?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) throw error;
            alert('✅ Продукт успешно удален!');
            fetchProducts();
        } catch (error: any) {
            console.error('Error deleting product:', error);
            alert('❌ Ошибка: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            category_id: '',
            price: '',
            description: '',
            image_url: '/images/products/productlogo.png',
            in_stock: true,
            is_featured: false,
            features: [],
        });
        setFeatureInput('');
        setEditingProduct(null);
        setShowForm(false);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, featureInput.trim()],
            });
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    if (!isSupabaseConfigured) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Supabase не настроен</p>
            </div>
        );
    }

    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-4xl text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Управление продуктами</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    {showForm ? <><FaTimes /> Отмена</> : <><FaPlus /> Добавить продукт</>}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold mb-6">
                        {editingProduct ? 'Редактировать продукт' : 'Новый продукт'}
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
                                <label className="block text-sm font-medium mb-2">Категория *</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/20"
                                    required
                                >
                                    <option value="">Выберите категорию</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Цена (узб. сум)</label>
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/20"
                                    placeholder="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">Если не указано, цена не будет отображаться (— — —)</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Изображение</label>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg hover:border-black/50 transition-colors disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Загрузка...
                                            </>
                                        ) : (
                                            <>
                                                <FaUpload />
                                                Загрузить изображение
                                            </>
                                        )}
                                    </button>
                                </div>
                                {/* Image Preview */}
                                {(imagePreview || formData.image_url) && (
                                    <div className="mt-3 relative">
                                        <img
                                            src={imagePreview || formData.image_url}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setFormData({ ...formData, image_url: '/images/products/productlogo.png' });
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
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

                        <div>
                            <label className="block text-sm font-medium mb-2">Характеристики</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black/20"
                                    placeholder="Добавить характеристику"
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                                    >
                                        {feature}
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.in_stock}
                                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                В наличии
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                Рекомендуемый
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                            >
                                <FaSave /> {editingProduct ? 'Обновить' : 'Создать'}
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

            {/* Products List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Продукт</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категория</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img
                                                src={product.image_url || '/images/products/productlogo.png'}
                                                alt={product.name}
                                                className="w-12 h-12 rounded object-cover mr-4"
                                            />
                                            <div>
                                                <div className="font-medium">{product.name}</div>
                                                {product.is_featured && (
                                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                        Рекомендуемый
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {(product as any).category?.name || 'Без категории'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${
                                                product.in_stock
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {product.in_stock ? 'В наличии' : 'Нет в наличии'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <FaImage className="mx-auto text-4xl mb-4 opacity-50" />
                        <p>Нет продуктов. Добавьте первый!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsManagement;
