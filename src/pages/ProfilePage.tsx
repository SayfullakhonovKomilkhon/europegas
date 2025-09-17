import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types/Product';

interface LocationState {
  orderSuccess?: boolean;
}

interface UserProfileUpdate {
  displayName: string;
  phoneNumber: string | null;
  address: string;
}

const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const [formData, setFormData] = useState<UserProfileUpdate>({
    displayName: currentUser?.displayName || '',
    phoneNumber: currentUser?.phoneNumber || '',
    address: currentUser?.address || ''
  });
  
  const location = useLocation();
  const state = location.state as LocationState;
  
  useEffect(() => {
    if (state?.orderSuccess) {
      setShowSuccessMessage(true);
      
      // Clear the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state]);
  
  useEffect(() => {
    // In a real app, this would fetch orders from Firebase
    // For now, we'll use mock data
    const fetchOrders = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Mock orders data
        const mockOrders: Order[] = [
          {
            id: '1001',
            userId: currentUser?.uid || '',
            items: [
              {
                product: {
                  id: '1',
                  name: 'EuropeGAS ECU-4',
                  price: 299.99,
                  category: 'ECU Control Units',
                  description: 'Advanced ECU control unit for optimal gas injection timing and performance.',
                  imageUrl: '/images/products/ecu-4.jpg',
                  inStock: true
                },
                quantity: 1
              }
            ],
            totalAmount: 299.99,
            status: 'delivered',
            shippingAddress: {
              fullName: currentUser?.displayName || '',
              address: '123 Main St',
              city: 'Tashkent',
              postalCode: '100000',
              country: 'Uzbekistan',
              phone: currentUser?.phoneNumber || ''
            },
            paymentMethod: 'credit-card',
            createdAt: new Date('2023-12-15'),
            updatedAt: new Date('2023-12-18')
          },
          {
            id: '1002',
            userId: currentUser?.uid || '',
            items: [
              {
                product: {
                  id: '2',
                  name: 'Rail Injector R-300',
                  price: 149.99,
                  category: 'Rail Injectors',
                  description: 'High-performance rail injector for precise gas delivery.',
                  imageUrl: '/images/products/injector-r300.jpg',
                  inStock: true
                },
                quantity: 2
              }
            ],
            totalAmount: 299.98,
            status: 'shipped',
            shippingAddress: {
              fullName: currentUser?.displayName || '',
              address: '123 Main St',
              city: 'Tashkent',
              postalCode: '100000',
              country: 'Uzbekistan',
              phone: currentUser?.phoneNumber || ''
            },
            paymentMethod: 'cash',
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-12')
          }
        ];
        
        setOrders(mockOrders);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchOrders();
  }, [currentUser]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateUserProfile({
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      });
      
      setIsEditing(false);
      setShowSuccessMessage(true);
      
      // Clear the success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'shipped':
        return 'text-purple-600';
      case 'delivered':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className="container-custom py-16 mt-16">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <FaCheck className="mr-2" />
          {state?.orderSuccess ? 'Your order has been placed successfully!' : 'Profile updated successfully!'}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-primary hover:text-primary-dark"
              >
                {isEditing ? 'Cancel' : <FaEdit />}
              </button>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="displayName" className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="address" className="block text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaUser className="text-primary mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{currentUser?.displayName || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaEnvelope className="text-primary mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{currentUser?.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaPhone className="text-primary mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{currentUser?.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-primary mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{currentUser?.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Order History */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Order History</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <p className="text-gray-600">You haven't placed any orders yet.</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex flex-wrap justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Order ID</p>
                          <p className="font-medium">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium">
                            {order.createdAt.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className={`font-medium ${getStatusColor(order.status)} capitalize`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium mb-3">Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.product.id} className="flex items-center">
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name} 
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} x ${item.product.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 