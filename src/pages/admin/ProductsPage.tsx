import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaSave } from 'react-icons/fa';

interface Product {
    id: string;
    name: string;
    slug: string;
    category_id: string | null;
    price: number;
    description: string | null;
    image_url: string | null;
    in_stock: boolean;
    is_featured: boolean;
    discount: number;
    rating: number;
    review_count: number;
    created_at: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ProductFormData {
    name: string;
    slug: string;
    category_id: string;
    price: string;
    description: string;
    image_url: string;
    in_stock: boolean;
    is_featured: boolean;
    discount: string;
}

const initialFormData: ProductFormData = {
    name: '',
    slug: '',
    category_id: '',
    price: '',
    description: '',
    image_url: '',
    in_stock: true,
    is_featured: false,
    discount: '0',
};

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<ProductFormData>(initialFormData);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error: any) {
            console.error('Error fetching products:', error.message);
            alert('Error loading products: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('product_categories')
                .select('id, name, slug')
                .eq('is_active', true)
                .order('display_order');

            if (error) throw error;
            setCategories(data || []);
        } catch (error: any) {
            console.error('Error fetching categories:', error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase.from('products').delete().eq('id', id);

            if (error) throw error;
            alert('Product deleted successfully!');
            fetchProducts();
        } catch (error: any) {
            console.error('Error deleting product:', error.message);
            alert('Error deleting product: ' + error.message);
        }
    };

    const handleToggleFeatured = async (product: Product) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ is_featured: !product.is_featured })
                .eq('id', product.id);

            if (error) throw error;
            fetchProducts();
        } catch (error: any) {
            console.error('Error updating product:', error.message);
            alert('Error updating product: ' + error.message);
        }
    };

    const handleToggleStock = async (product: Product) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ in_stock: !product.in_stock })
                .eq('id', product.id);

            if (error) throw error;
            fetchProducts();
        } catch (error: any) {
            console.error('Error updating product:', error.message);
            alert('Error updating product: ' + error.message);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const openModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                slug: product.slug,
                category_id: product.category_id || '',
                price: product.price.toString(),
                description: product.description || '',
                image_url: product.image_url || '',
                in_stock: product.in_stock,
                is_featured: product.is_featured,
                discount: product.discount.toString(),
            });
        } else {
            setEditingProduct(null);
            setFormData(initialFormData);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setFormData(initialFormData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            
            // Auto-generate slug from name
            if (name === 'name') {
                setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const productData = {
                name: formData.name,
                slug: formData.slug || generateSlug(formData.name),
                category_id: formData.category_id || null,
                price: parseFloat(formData.price) || 0,
                description: formData.description || null,
                image_url: formData.image_url || null,
                in_stock: formData.in_stock,
                is_featured: formData.is_featured,
                discount: parseFloat(formData.discount) || 0,
            };

            if (editingProduct) {
                // Update existing product
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);

                if (error) throw error;
                alert('Product updated successfully!');
            } else {
                // Create new product
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);

                if (error) throw error;
                alert('Product created successfully!');
            }

            closeModal();
            fetchProducts();
        } catch (error: any) {
            console.error('Error saving product:', error.message);
            alert('Error saving product: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === 'all' || product.category_id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your product catalog</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                    <FaPlus />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-gray-500 text-sm">Total Products</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-gray-500 text-sm">In Stock</p>
                    <p className="text-2xl font-bold text-green-600">
                        {products.filter((p) => p.in_stock).length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-gray-500 text-sm">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">
                        {products.filter((p) => !p.in_stock).length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-gray-500 text-sm">Featured</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {products.filter((p) => p.is_featured).length}
                    </p>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Featured
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => {
                                const category = categories.find((c) => c.id === product.category_id);
                                return (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt={product.name} className="h-8 w-8 object-cover rounded" />
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">No img</span>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-sm text-gray-500">{product.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {category?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${product.price.toFixed(2)}
                                            {product.discount > 0 && (
                                                <span className="ml-2 text-xs text-red-600">-{product.discount}%</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleStock(product)}
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.in_stock
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleFeatured(product)}
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_featured
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {product.is_featured ? 'Featured' : 'Regular'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => openModal(product)}
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No products found</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        {/* Overlay */}
                        <div 
                            className="fixed inset-0 bg-black/50 transition-opacity" 
                            onClick={closeModal}
                        ></div>

                        {/* Modal Content */}
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto z-10 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button 
                                    onClick={closeModal}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <FaTimes className="text-gray-500" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                                            placeholder="e.g. ECU SET EG24.4 BASICO"
                                        />
                                    </div>

                                    {/* Slug */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Slug (URL)
                                        </label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 bg-gray-50"
                                            placeholder="auto-generated-from-name"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price ($) *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {/* Discount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                                            placeholder="0"
                                        />
                                    </div>

                                    {/* Image URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Image URL
                                        </label>
                                        <input
                                            type="url"
                                            name="image_url"
                                            value={formData.image_url}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                                            placeholder="/images/products/product.png"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
                                            placeholder="Product description..."
                                        />
                                    </div>

                                    {/* Checkboxes */}
                                    <div className="md:col-span-2 flex space-x-6">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="in_stock"
                                                checked={formData.in_stock}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-black rounded focus:ring-black/20"
                                            />
                                            <span className="text-sm text-gray-700">In Stock</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="is_featured"
                                                checked={formData.is_featured}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-black rounded focus:ring-black/20"
                                            />
                                            <span className="text-sm text-gray-700">Featured Product</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end space-x-4 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        <FaSave />
                                        <span>{saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
