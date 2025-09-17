import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../types/Product';

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    city: '',
    postalCode: '',
    country: 'National Prime Gas',
    phone: currentUser?.phoneNumber || '',
    paymentMethod: 'credit-card' as 'credit-card' | 'cash'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would submit the order to Firebase
    // For now, we'll just simulate a successful order
    setTimeout(() => {
      clearCart();
      navigate('/profile', { state: { orderSuccess: true } });
    }, 2000);
  };
  
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  return (
    <div className="container-custom py-16 mt-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="fullName" className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-gray-700 mb-2">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                  required
                >
                  <option value="National Prime Gas">National Prime Gas</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="credit-card"
                  name="paymentMethod"
                  value="credit-card"
                  checked={formData.paymentMethod === 'credit-card'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="credit-card" className="flex items-center">
                  <FaCreditCard className="mr-2 text-blue-500" /> Credit Card
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="cash" className="flex items-center">
                  <FaMoneyBillWave className="mr-2 text-green-500" /> Cash on Delivery
                </label>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <FaLock className="text-green-500 mr-2" />
              <p className="text-sm text-gray-600">Your personal data will be used to process your order, support your experience, and for other purposes described in our privacy policy.</p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item: CartItem) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="flex justify-between py-4 font-bold text-lg border-t mt-2">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 