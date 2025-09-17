import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { Product } from '../../types/Product';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Preload image
  useEffect(() => {
    const img = new Image();
    img.src = product.imageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
  }, [product.imageUrl]);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };
  
  // Generate a color based on the product name for the fallback background
  const generateColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };
  
  const fallbackColor = generateColorFromString(product.name);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="relative overflow-hidden">
          {imageError ? (
            <div 
              className="w-full h-64 flex items-center justify-center rounded-t-2xl"
              style={{ backgroundColor: fallbackColor }}
            >
              <span className="text-white font-medium text-center p-4">{product.name}</span>
            </div>
          ) : (
            <div className="relative h-64 overflow-hidden bg-gray-50 rounded-t-2xl">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
                </div>
              )}
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          )}
          
          {/* Quick action buttons - simplified animation */}
          <div 
            className={`absolute right-4 top-4 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`p-3 rounded-full shadow-sm transition-colors ${
                product.inStock 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaShoppingCart size={14} />
            </button>
          </div>
          
          {!product.inStock && (
            <div className="absolute top-3 left-3 bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
              Out of Stock
            </div>
          )}
          
          {/* Category badge */}
          <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full">
            {product.category === 'ECU Control Units' ? 'ECU Control Unit' : 
             product.category === 'Rail Injectors' ? 'Rail Injector' : 
             product.category === 'Gas Reducers' ? 'Gas Reducer' : 'Other'}
          </div>
        </div>
        
        <div className="p-5">
          <Link to={`/product/${product.id}`} className="block">
            <div className="mb-3">
              <h3 className="font-medium text-lg tracking-tight group-hover:text-gray-700 transition-colors">
                {product.name}
              </h3>
              <p className="text-black font-medium mt-2">${product.price.toFixed(2)}</p>
            </div>
          
            <p className="text-gray-500 text-sm mb-5 line-clamp-2 font-light">
              {product.description}
            </p>
          </Link>
          
          <div className={`mt-5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div
              className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full w-full transition-colors text-sm font-medium"
            >
              <FaEye size={14} />
              <span>{t('view_details')}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard; 