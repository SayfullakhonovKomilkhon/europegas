import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where, CollectionReference, Query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product } from '../types/Product';
import allProducts from '../data/products'; // Import for fallback
import ProductCard from '../components/products/ProductCard';
import { motion } from 'framer-motion';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const ProductsPage: React.FC = () => {
  const { t } = useLanguage();
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [firebaseLoading, setFirebaseLoading] = useState(false);

  // Format category from URL parameter to match our data structure
  const formatCategoryForQuery = (categoryParam?: string): string | undefined => {
    if (!categoryParam) return undefined;
    
    // Map URL parameters to actual category names
    const categoryMap: Record<string, string> = {
      'ecu-control-units': 'ECU Control Units',
      'rail-injectors': 'Rail Injectors',
      'gas-reducers': 'Gas Reducers'
    };
    
    return categoryMap[categoryParam] || categoryParam;
  };

  // Format category name for display
  const formatCategoryName = (categoryName?: string) => {
    if (!categoryName) return t('all_products');
    return categoryName;
  };

  // Immediately load local data first
  useEffect(() => {
    setLoading(true);
    
    // Format the category parameter to match our data structure
    const formattedCategory = formatCategoryForQuery(category);
    
    // Filter local products by category if provided
    const filteredProducts = formattedCategory 
      ? allProducts.filter(p => p.category === formattedCategory)
      : allProducts;
    
    // Set products from local data immediately
    setProducts(filteredProducts);
    setLoading(false);
    
    // Then try to fetch from Firebase in the background
    fetchFirebaseProducts(formattedCategory);
  }, [category]);

  // Separate function to fetch from Firebase
  const fetchFirebaseProducts = async (formattedCategory?: string) => {
    setFirebaseLoading(true);
    
    try {
      // Try to fetch from Firebase
      const productsRef = collection(db, 'products');
      let productsQuery: CollectionReference | Query = productsRef;
      
      // Filter by category if provided
      if (formattedCategory) {
        productsQuery = query(productsRef, where('category', '==', formattedCategory));
      }
      
      const querySnapshot = await getDocs(productsQuery);
      const fetchedProducts: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        fetchedProducts.push({ ...doc.data() } as Product);
      });
      
      // If we got products from Firebase, update the state
      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        console.log('Updated products from Firebase');
      }
    } catch (error) {
      console.error('Error fetching products from Firebase:', error);
      // We already have local data loaded, so no need to do anything here
    } finally {
      setFirebaseLoading(false);
    }
  };

  // Memoize filtered and sorted products to avoid recalculation on every render
  const filteredAndSortedProducts = useMemo(() => {
    // Filter products based on search term and price range
    const filtered = products
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );

    // Sort products based on selected option
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [products, searchTerm, priceRange, sortOption]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 // Reduced from 0.1 for faster animation
      }
    }
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
        <motion.div 
          className="absolute inset-0 z-0"
        >
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
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-semibold mb-6 text-white tracking-tight">
              {formatCategoryName(formatCategoryForQuery(category))}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              {t('product_page_description', { category: formatCategoryName(formatCategoryForQuery(category)).toLowerCase() })}
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <div className="animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-24">
      
      {/* Search and Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }} // Reduced from 0.5, 0.2
        className="bg-white p-4 rounded-lg shadow-md mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
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
            {/* Sort Dropdown */}
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
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FaFilter />
              <span>{t('filters')}</span>
            </button>
          </div>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} // Reduced from 0.3
            className="mt-4 pt-4 border-t"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-2">{t('price_range')}</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full accent-primary"
                  />
                  <span className="whitespace-nowrap">${priceRange[0]} - ${priceRange[1]}</span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
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
        transition={{ duration: 0.3, delay: 0.15 }} // Reduced from 0.5, 0.3
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
        <Link 
          to="/products/ecu-control-units" 
          className={`px-4 py-2 rounded-full transition-colors ${
            category === 'ecu-control-units' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {t('ecu_control_units')}
        </Link>
        <Link 
          to="/products/rail-injectors" 
          className={`px-4 py-2 rounded-full transition-colors ${
            category === 'rail-injectors' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {t('rail_injectors')}
        </Link>
        <Link 
          to="/products/gas-reducers" 
          className={`px-4 py-2 rounded-full transition-colors ${
            category === 'gas-reducers' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {t('gas_reducers')}
        </Link>
      </motion.div>
      
      {/* Category Banner */}
      {category && (
        <motion.div 
          className="mb-8 bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {category === 'rail-injectors' && (
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0 md:mr-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Rail Injectors</h2>
                <p className="text-gray-600">
                  High-quality rail injectors for optimal fuel delivery and engine performance.
                  Our injectors are designed for durability and precision.
                </p>
              </div>
              <img 
                src="/images/logos/railgroup.png" 
                alt="Rail Group" 
                className="h-24 w-auto object-contain"
              />
            </div>
          )}
          
          {category === 'ecu-control-units' && (
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">ECU Control Units</h2>
                <p className="text-gray-600">
                  Advanced electronic control units for precise management of your vehicle's systems.
                </p>
              </div>
            </div>
          )}
          
          {category === 'gas-reducers' && (
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Gas Reducers</h2>
                <p className="text-gray-600">
                  Efficient gas reducers for optimal pressure regulation in LPG/CNG systems.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
      
      {/* Firebase Loading Indicator - Only shown when refreshing data in background */}
      {firebaseLoading && !loading && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full flex items-center gap-2 z-10">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          <span className="text-sm">{t('updating_products')}</span>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductsPage; 