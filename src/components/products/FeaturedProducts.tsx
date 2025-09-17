import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Product } from '../../types/Product';
import ProductCard from '../products/ProductCard';
import allProducts from '../../data/products'; // Import for fallback
import { motion } from 'framer-motion';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [firebaseLoading, setFirebaseLoading] = useState(false);

  // Helper function to get fallback products
  const getFallbackProducts = () => {
    // Get featured products from allProducts
    return allProducts.filter(product => product.isFeatured).slice(0, 4);
  };

  useEffect(() => {
    // Immediately set products from local data
    const localFeaturedProducts = getFallbackProducts();
    setProducts(localFeaturedProducts);
    
    // Then try to fetch from Firebase in the background
    const fetchFeaturedProducts = async () => {
      setFirebaseLoading(true);
      try {
        // Try to fetch from Firebase
        const productsRef = collection(db, 'products');
        const featuredQuery = query(
          productsRef,
          where('isFeatured', '==', true),
          limit(4)
        );
        
        const querySnapshot = await getDocs(featuredQuery);
        const fetchedProducts: Product[] = [];
        
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ ...doc.data() } as Product);
        });
        
        // If we got products from Firebase, use them
        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
          console.log('Successfully loaded products from Firestore');
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // We already have local data loaded, so no need to do anything here
      } finally {
        setFirebaseLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      {products.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="animate-pulse">
              <div className="bg-gray-100 h-64 rounded-2xl mb-4"></div>
              <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
            </div>
          ))}
        </motion.div>
      ) : (
        <>
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
          
          {firebaseLoading && (
            <div className="text-center text-xs text-gray-400 mt-4 font-light">
              Syncing with latest data...
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FeaturedProducts; 