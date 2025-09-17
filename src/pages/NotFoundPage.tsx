import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaShoppingCart, FaPhone } from 'react-icons/fa';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <FaExclamationTriangle className="text-yellow-500 text-6xl mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        
        <p className="text-lg mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">What you can do:</h2>
          
          <ul className="text-left space-y-3">
            <li className="flex items-center">
              <FaHome className="text-blue-600 mr-3" />
              <span>Go back to our <Link to="/" className="text-blue-600 hover:underline font-medium">homepage</Link></span>
            </li>
            
            <li className="flex items-center">
              <FaShoppingCart className="text-blue-600 mr-3" />
              <span>Browse our <Link to="/products" className="text-blue-600 hover:underline font-medium">products</Link></span>
            </li>
            
            <li className="flex items-center">
              <FaPhone className="text-blue-600 mr-3" />
              <span>Contact our <Link to="/contact" className="text-blue-600 hover:underline font-medium">support team</Link></span>
            </li>
          </ul>
        </div>
        
        <Link 
          to="/" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 