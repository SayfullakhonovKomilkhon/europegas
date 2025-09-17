import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTelegram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const socialVariants = {
    hover: {
      scale: 1.2,
      y: -5,
      transition: { type: 'spring', stiffness: 300 }
    }
  };

  const linkVariants = {
    hover: {
      x: 5,
      color: '#fff',
      transition: { type: 'spring', stiffness: 300 }
    }
  };
  
  return (
    <footer className="bg-gradient-to-b from-black via-gray-900 to-black text-white pt-20 pb-10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600"></div>
      <div className="absolute top-0 right-10 w-20 h-20 bg-gray-800 rounded-full opacity-30"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-gray-700 rounded-full opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-900/50 to-transparent"></div>
      
      {/* Scroll to top button */}
      <motion.button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-white p-4 rounded-full shadow-2xl text-black hover:bg-gray-100 z-50 border-2 border-gray-200"
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FaArrowUp size={20} />
      </motion.button>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="flex items-center mb-8">
              <motion.img 
                src="/images/logos/logo.png" 
                alt="EuropeGAS Logo" 
                className="h-12 w-12" 
                whileHover={{ rotate: 5, scale: 1.1 }}
              />
              <div className="ml-4">
                <h3 className="text-2xl font-bold tracking-tight text-white">EuropeGAS</h3>
                <p className="text-sm text-gray-300 font-light">National Prime Gas</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8 text-base font-light leading-relaxed">
              {t('company_description')}
            </p>
            <div className="flex space-x-6">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300"
                variants={socialVariants}
                whileHover="hover"
              >
                <FaFacebook size={20} />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300"
                variants={socialVariants}
                whileHover="hover"
              >
                <FaInstagram size={20} />
              </motion.a>
              <motion.a 
                href="https://t.me/europegasuz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300"
                variants={socialVariants}
                whileHover="hover"
              >
                <FaTelegram size={20} />
              </motion.a>
              <motion.a 
                href="https://wa.me/998901234567" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300"
                variants={socialVariants}
                whileHover="hover"
              >
                <FaWhatsapp size={20} />
              </motion.a>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10"
          >
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider text-white">{t('quick_links')}</h3>
            <ul className="space-y-4">
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-base flex items-center group">
                  <span className="w-0 h-0.5 bg-gray-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-3"></span>
{t('home')}
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-base flex items-center group">
                  <span className="w-0 h-0.5 bg-gray-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-3"></span>
{t('products')}
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/branches" className="text-gray-300 hover:text-white transition-colors text-base flex items-center group">
                  <span className="w-0 h-0.5 bg-gray-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-3"></span>
{t('branches')}
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors text-base flex items-center group">
                  <span className="w-0 h-0.5 bg-gray-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-3"></span>
{t('services')}
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-base flex items-center group">
                  <span className="w-0 h-0.5 bg-gray-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-3"></span>
{t('contact')}
                </Link>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Product Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10"
          >
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider text-white">{t('product_categories')}</h3>
            <ul className="space-y-4">
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-base flex items-center group">
                  <span className="w-0 h-0.5 bg-gray-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-3"></span>
{t('ecu_control_units')}
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-base flex items-center group">
                  <span className="w-0 h-0.5 bg-gray-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-3"></span>
{t('rail_injectors')}
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-base flex items-center group">
                  <span className="w-0 h-0.5 bg-gray-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-3"></span>
                  Gas Reducers
                </Link>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-base flex items-center group">
                  <span className="w-0 h-0.5 bg-gray-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-3"></span>
                  All Products
                </Link>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative z-10"
          >
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider text-white">{t('contact_us')}</h3>
            <ul className="space-y-5">
              <motion.li 
                className="flex items-start group"
                whileHover={{ x: 5 }}
              >
                <FaMapMarkerAlt className="mt-1 mr-4 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all" size={18} />
                <span className="text-gray-300 text-base font-light group-hover:text-white transition-colors">123 Main Street, Tashkent, National Prime Gas</span>
              </motion.li>
              <motion.li 
                className="flex items-center group"
                whileHover={{ x: 5 }}
              >
                <FaPhone className="mr-4 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all" size={18} />
                <span className="text-gray-300 text-base font-light group-hover:text-white transition-colors">+998 90 123 45 67</span>
              </motion.li>
              <motion.li 
                className="flex items-center group"
                whileHover={{ x: 5 }}
              >
                <FaEnvelope className="mr-4 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all" size={18} />
                <span className="text-gray-300 text-base font-light group-hover:text-white transition-colors">info@europegas.uz</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>
        
        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-700 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0 font-light">
            &copy; {currentYear} EuropeGAS National Prime Gas. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <motion.div whileHover={{ y: -2 }}>
              <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 