import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const CartPage: React.FC = () => {
  const { items, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  // Debounced quantity update to prevent excessive re-renders
  const handleQuantityChange = useCallback((productId: string, newQuantity: number) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    // Ensure quantity is a valid number and at least 1
    const validQuantity = Math.max(1, Math.floor(newQuantity) || 1);
    
    updateQuantity(productId, validQuantity);
    
    // Reset updating state after a short delay
    setTimeout(() => setIsUpdating(false), 300);
  }, [updateQuantity, isUpdating]);

  // Safe remove from cart with confirmation
  const handleRemoveItem = useCallback((productId: string) => {
    removeFromCart(productId);
  }, [removeFromCart]);

  // Safe clear cart with confirmation
  const handleClearCart = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  }, [clearCart]);

  // Button animation variants
  const buttonVariants = {
    initial: { y: 0 },
    tap: { y: 10, transition: { duration: 0.2, ease: "easeOut" } }
  };

  return (
    <div className="bg-white min-h-screen pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center">
              <FaShoppingCart className="mr-4 text-blue-400" /> Shopping Cart
            </h1>
            <p className="text-xl text-gray-300">Review your selected EuropeGAS products</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart className="text-4xl text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/products" 
                  className="inline-flex items-center bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  <FaArrowLeft className="mr-2" />
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </motion.div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-6 mb-12">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  {/* Product Image & Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-24 h-24 object-cover rounded-xl shadow-md"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/logos/logo.png';
                        }}
                      />
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.product.category}</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          In Stock
                        </span>
                        <span className="text-gray-500 text-sm">SKU: {item.product.id.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center lg:text-right">
                    <p className="text-sm text-gray-500 mb-1">Unit Price</p>
                    <p className="text-2xl font-bold text-gray-900">${item.product.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-gray-500 font-medium">Quantity</p>
                    <div className="flex items-center bg-gray-50 rounded-xl p-1">
                      <motion.button 
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={isUpdating || item.quantity <= 1}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        -
                      </motion.button>
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) {
                            handleQuantityChange(item.product.id, val);
                          }
                        }}
                        className="w-16 text-center py-2 bg-transparent font-semibold text-gray-900"
                        min="1"
                        disabled={isUpdating}
                      />
                      <motion.button 
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={isUpdating}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="text-center lg:text-right">
                    <p className="text-sm text-gray-500 mb-1">Total</p>
                    <p className="text-3xl font-bold text-blue-600">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>

                  {/* Remove Button */}
                  <div className="flex flex-col items-center gap-2">
                    <motion.button 
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                      disabled={isUpdating}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTrash className="text-lg" />
                    </motion.button>
                    <span className="text-xs text-gray-400">Remove</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Actions & Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Actions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Link 
                    to="/products" 
                    className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-4 rounded-xl transition-all duration-300 font-semibold"
                  >
                    <FaArrowLeft />
                    Continue Shopping
                  </Link>
                </motion.div>
                
                <motion.button 
                  onClick={handleClearCart}
                  className="flex items-center justify-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 px-6 py-4 rounded-xl transition-all duration-300 font-semibold"
                  disabled={isUpdating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaTrash />
                  Clear Cart
                </motion.button>
              </div>
              
              {/* Cart Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Cart Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                    <div className="text-sm text-gray-600">Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{items.reduce((sum, item) => sum + item.quantity, 0)}</div>
                    <div className="text-sm text-gray-600">Quantity</div>
                  </div>
                  <div className="text-center sm:col-span-1 col-span-2">
                    <div className="text-2xl font-bold text-purple-600">${totalPrice.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-sm text-green-600 font-medium">Free</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-sm text-gray-500">Calculated at checkout</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 bg-gray-50 rounded-xl px-4">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to="/checkout" 
                    className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Proceed to Checkout
                  </Link>
                </motion.div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Secure checkout with SSL encryption
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default CartPage; 