import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { getProducts, getCategories } from '../lib/productCache';
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
  const categoriesFetchedRef = useRef(false);
  const lastCategoryRef = useRef<string | undefined>(undefined);

  const formatCategoryName = (categorySlug?: string) => {
    if (!categorySlug) return t('all_products');
    const cat = categories.find(c => c.slug === categorySlug);
    return cat?.name || t('all_products');
  };

  // Fetch categories once
  useEffect(() => {
    if (categoriesFetchedRef.current) return;
    categoriesFetchedRef.current = true;
    
    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    // Only refetch if category actually changed
    if (lastCategoryRef.current === category && products.length > 0) return;
    lastCategoryRef.current = category;
    
    fetchProducts();
  }, [category]);

  const fetchCategories = async () => {
    if (!isSupabaseConfigured) return;

    try {
      const { categories: data } = await getCategories();
      setCategories(data);
    } catch (err) {
      console.warn('Failed to load categories');
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
      const { products: data, fromCache } = await getProducts(category);
      setProducts(data);
      
      if (fromCache) {
        console.log('⚡ Loaded products from cache');
      }
    } catch (err) {
      console.warn('Failed to load products');
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
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };

  return (
    <div className="bg-white overflow-hidden pt-16">
      {/* Hero Section */}
      <motion.div 
        className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
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
            transition={{ duration: 0.6, delay: 0.1 }}
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
          <div className="flex flex-col gap-3">
            {/* Search Bar - Full Width on Mobile */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t('search_products_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Sort and Filter Controls - Grid on Mobile */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="relative w-full">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-gray-100 px-3 py-2.5 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-primary w-full text-sm"
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
                className="flex items-center justify-center gap-2 bg-gray-100 px-3 py-2.5 rounded-full hover:bg-gray-200 transition-colors w-full text-sm"
              >
                <FaFilter className="text-sm" />
                <span className="truncate">{t('filters')}</span>
              </button>
            </div>
          </div>
          
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3 text-sm">{t('price_range')}</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-600">{t('min_price')}</label>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="10000"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full accent-primary"
                      />
                      <span className="text-sm text-gray-700">{priceRange[0].toLocaleString('ru-RU')} so'm</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-600">{t('max_price')}</label>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="10000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-primary"
                      />
                      <span className="text-sm text-gray-700">{priceRange[1].toLocaleString('ru-RU')} so'm</span>
                    </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 h-64 rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
              </div>
            ))}
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
