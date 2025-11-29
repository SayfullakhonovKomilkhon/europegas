import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../types/Product';
import ProductCard from '../components/products/ProductCard';
import { motion } from 'framer-motion';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ProductsPage: React.FC = () => {
  const { t } = useLanguage();
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  const formatCategoryName = (categorySlug?: string) => {
    if (!categorySlug) return t('all_products');
    const cat = categories.find(c => c.slug === categorySlug);
    return cat?.name || t('all_products');
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, categories]);

  const fetchCategories = async () => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.warn('Failed to load categories from Supabase');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('products')
        .select('*, category:product_categories(name, slug)')
        .order('created_at', { ascending: false });

      // Filter by category if specified
      if (category && categories.length > 0) {
        const cat = categories.find(c => c.slug === category);
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.warn('Supabase error:', error.message);
        setProducts([]);
        return;
      }

      if (data && data.length > 0) {
        const mappedProducts: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price || 0,
          category: p.category?.name || 'Other',
          description: p.description || '',
          imageUrl: p.image_url || '/images/products/productlogo.png',
          inStock: p.in_stock ?? true,
          isFeatured: p.is_featured ?? false,
          discount: p.discount || 0,
          rating: p.rating || 0,
          reviewCount: p.review_count || 0,
          features: p.features || [],
          specifications: p.specifications || {},
        }));
        setProducts(mappedProducts);
        console.log('✅ Loaded', mappedProducts.length, 'products from Supabase');
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.warn('Failed to load from Supabase');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  }, [products, searchTerm, priceRange, sortOption]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <div className="bg-white overflow-hidden pt-16">
      {/* Hero Section */}
      <motion.div 
        className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/products-hero.jpg" 
            alt="Our Products" 
            className="w-full h-full object-cover opacity-70"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/pattern.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-semibold mb-6 text-white tracking-tight">
              {formatCategoryName(category)}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              {t('product_page_description', { category: formatCategoryName(category).toLowerCase() })}
            </p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-24">
        {/* Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-md mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-grow max-w-md w-full">
              <input
                type="text"
                placeholder={t('search_products_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-gray-100 px-4 py-2 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="default">{t('sort_by')}</option>
                  <option value="price-asc">{t('price_low_to_high')}</option>
                  <option value="price-desc">{t('price_high_to_low')}</option>
                  <option value="name-asc">{t('name_a_to_z')}</option>
                  <option value="name-desc">{t('name_z_to_a')}</option>
                </select>
                <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FaFilter />
                <span>{t('filters')}</span>
              </button>
            </div>
          </div>
          
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">{t('price_range')}</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full accent-primary"
                    />
                    <span className="whitespace-nowrap">{priceRange[0].toLocaleString('ru-RU')} - {priceRange[1].toLocaleString('ru-RU')} so'm</span>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Category Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          <Link 
            to="/products" 
            className={`px-4 py-2 rounded-full transition-colors ${
              !category ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {t('all_products')}
          </Link>
          {categories.map(cat => (
            <Link 
              key={cat.id}
              to={`/products/${cat.slug}`}
              className={`px-4 py-2 rounded-full transition-colors ${
                category === cat.slug ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </motion.div>
        
        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !isSupabaseConfigured ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Supabase not configured</h3>
            <p className="text-gray-500">Please configure Supabase environment variables to load products.</p>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">{t('no_products_found')}</h3>
            <p className="text-gray-500">{t('try_different_search')}</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
