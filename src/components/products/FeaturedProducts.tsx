import React, { useState, useEffect, useRef } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { getFeaturedProducts } from '../../lib/productCache';
import { Product } from '../../types/Product';
import ProductCard from '../products/ProductCard';
import { motion } from 'framer-motion';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Prevent double fetch in strict mode
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!isSupabaseConfigured) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const { products: data, fromCache } = await getFeaturedProducts();
      
      if (fromCache) {
        // Show cached data immediately
        setProducts(data);
        setLoading(false);
      } else {
        setProducts(data);
        setLoading(false);
      }
    } catch (err) {
      console.warn('Failed to load featured products');
      setProducts([]);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-100 h-64 rounded-2xl mb-4"></div>
            <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {isSupabaseConfigured 
            ? 'Нет рекомендуемых продуктов. Добавьте продукты в админ-панели.'
            : 'Supabase не настроен. Настройте переменные окружения.'}
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {products.map(product => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturedProducts;
