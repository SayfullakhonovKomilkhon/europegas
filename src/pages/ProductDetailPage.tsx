import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaArrowLeft } from 'react-icons/fa';
import { Product } from '../types/Product';
import { useLanguage } from '../context/LanguageContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    
    if (!isSupabaseConfigured || !id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:product_categories(name, slug)')
        .eq('id', id)
        .single();

      if (error) {
        console.warn('Supabase error:', error.message);
        setProduct(null);
        setLoading(false);
        return;
      }

      if (data) {
        const mappedProduct: Product = {
          id: data.id,
          name: data.name,
          price: data.price || 0,
          category: data.category?.name || 'Other',
          description: data.description || '',
          imageUrl: data.image_url || '/images/products/productlogo.png',
          inStock: data.in_stock ?? true,
          isFeatured: data.is_featured ?? false,
          discount: data.discount || 0,
          rating: data.rating || 4.8,
          reviewCount: data.review_count || 24,
          features: data.features || [],
          specifications: data.specifications || {
            'Dimensions': '120 x 80 x 30 mm',
            'Weight': '250g',
            'Input Voltage': '12V',
            'Operating Temperature': '-40°C to +125°C',
            'Warranty': '2 years'
          },
        };
        setProduct(mappedProduct);
        console.log('✅ Loaded product:', mappedProduct.name);
      } else {
        setProduct(null);
      }
    } catch (err) {
      console.warn('Failed to load product from Supabase');
      setProduct(null);
    } finally {
      setLoading(false);
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
      <div className="container mx-auto px-6 py-24 pt-32">
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            {!isSupabaseConfigured ? 'Please configure Supabase to view products.' : 'Product not found.'}
          </p>
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
          
          <p className="text-2xl font-bold text-primary mb-6">
            {product.price > 0 ? `${product.price.toLocaleString('ru-RU')} so'm` : '— — —'}
          </p>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <p className="font-semibold text-gray-800 mb-2">{t('availability')}:</p>
            <p className={`${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? t('in_stock') : t('out_of_stock')}
            </p>
          </div>
          
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
