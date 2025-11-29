import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Product } from '../../types/Product';
import ProductCard from '../products/ProductCard';
import { motion } from 'framer-motion';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!isSupabaseConfigured) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:product_categories(name)')
        .eq('is_featured', true)
        .limit(4);

      if (error) {
        console.warn('Supabase error:', error.message);
        setProducts([]);
        setLoading(false);
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
        console.log('✅ Loaded', mappedProducts.length, 'featured products');
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
