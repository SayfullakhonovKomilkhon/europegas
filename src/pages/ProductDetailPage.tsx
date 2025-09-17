import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import allProducts from '../data/products';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Find the actual product from our data
        const foundProduct = allProducts.find(p => p.id === id);
        
        if (foundProduct) {
          // Add additional properties for the detail page
          const productWithExtras: Product & {
            specifications?: Record<string, string>;
            relatedProducts?: string[];
            rating?: number;
            reviewCount?: number;
          } = {
            ...foundProduct,
            specifications: {
              'Dimensions': '120 x 80 x 30 mm',
              'Weight': '250g',
              'Input Voltage': '12V',
              'Operating Temperature': '-40°C to +125°C',
              'Warranty': '2 years'
            },
            relatedProducts: [],
            rating: 4.8,
            reviewCount: 24
          };
          
          setProduct(productWithExtras);
        } else {
          setProduct(null);
        }
        setLoading(false);
      }, 500); // Reduced delay for better UX
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-star-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="container-custom py-16 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Product not found.</p>
          <Link to="/products" className="text-primary hover:underline mt-4 inline-block">
{t('back_to_products')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pt-16">
      <div className="container mx-auto px-6 py-24">
        <Link to="/products" className="flex items-center text-primary mb-8 hover:underline">
          <FaArrowLeft className="mr-2" /> {t('back_to_products')}
        </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          {imageError ? (
            <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-blue-100">EuropeGAS Product</p>
              </div>
            </div>
          ) : (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-md"
              onError={() => setImageError(true)}
            />
          )}
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {product.rating && renderStars(product.rating)}
            </div>
            {product.reviewCount && (
              <span className="text-gray-600">({product.reviewCount} {t('reviews')})</span>
            )}
          </div>
          
          <p className="text-2xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <p className="font-semibold text-gray-800 mb-2">{t('availability')}:</p>
            <p className={`${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? t('in_stock') : t('out_of_stock')}
            </p>
          </div>
          
          {product.inStock && (
            <div className="flex items-center mb-8">
              <div className="mr-4">
                <label htmlFor="quantity" className="block text-gray-700 mb-1">{t('quantity')}:</label>
                <div className="flex items-center border rounded-md">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1 border-r"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center py-1"
                    min="1"
                  />
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-3 py-1 border-l"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="bg-primary text-white px-6 py-2 rounded-md flex items-center hover:bg-primary-dark transition"
              >
                <FaShoppingCart className="mr-2" /> {t('add_to_cart')}
              </button>
            </div>
          )}
          
          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t('key_features')}</h2>
              <ul className="list-disc pl-5 space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('specifications')}</h2>
              <div className="border rounded-md overflow-hidden">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div 
                    key={index} 
                    className={`flex ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <div className="w-1/3 p-3 border-r font-medium">{key}</div>
                    <div className="w-2/3 p-3">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 