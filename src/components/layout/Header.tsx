import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const { t } = useLanguage();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect with improved visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Always show header when at the top of the page
      if (currentScrollPos <= 10) {
        setVisible(true);
        setIsScrolled(false);
      } else {
        // Show/hide based on scroll direction with a threshold
        const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 70;
        setVisible(isVisible);
        setIsScrolled(true);
      }

      // Close dropdown when scrolling
      if (isProductsDropdownOpen) {
        setIsProductsDropdownOpen(false);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, isProductsDropdownOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
  }, [location]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  // Mobile dropdown animation variants
  const mobileDropdownVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg py-3' : 'bg-black py-4'
        } ${!visible ? '-translate-y-full' : 'translate-y-0'}`}
      style={{ top: 0 }}
    >
      <div className="container mx-auto px-4 lg:px-6 py-1">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/images/logos/logo.png"
              alt="EuropeGAS Logo"
              className="h-10 w-auto mr-3"
            />
            <div>
              <h1 className="font-medium text-xl tracking-tight text-white">
                EuropeGAS
              </h1>
              <p className="text-xs font-light text-gray-300">
                National Prime Gas
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            <Link
              to="/"
              className="text-white text-sm font-medium hover:opacity-70 transition-opacity"
            >
              {t('home')}
            </Link>
            <div className="relative group" ref={dropdownRef}>
              <button
                className="flex items-center text-white text-sm font-medium hover:opacity-70 transition-opacity"
                onClick={toggleProductsDropdown}
                aria-expanded={isProductsDropdownOpen}
                aria-haspopup="true"
              >
                {t('products')}
                <FaChevronDown className={`ml-1 h-3 w-3 transition-transform duration-300 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isProductsDropdownOpen && (
                  <motion.div
                    className="absolute left-0 mt-3 w-56 rounded-xl shadow-lg bg-white/90 backdrop-blur-md ring-1 ring-black/5 z-50 overflow-hidden"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                  >
                    <div className="py-1">
                      <Link
                        to="/products/ecu-control-units"
                        className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        {t('ecu_control_units')}
                      </Link>
                      <Link
                        to="/products/rail-injectors"
                        className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        {t('rail_injectors')}
                      </Link>
                      <Link
                        to="/products/gas-reducers"
                        className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        {t('gas_reducers')}
                      </Link>
                      <Link
                        to="/products"
                        className="block px-5 py-3 text-sm font-medium text-black hover:bg-gray-50 transition-colors duration-150"
                      >
                        {t('all_products')}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link
              to="/services"
              className="text-white text-sm font-medium hover:opacity-70 transition-opacity"
            >
              {t('services')}
            </Link>
            <Link
              to="/branches"
              className="text-white text-sm font-medium hover:opacity-70 transition-opacity"
            >
              {t('branches')}
            </Link>
            <Link
              to="/about"
              className="text-white text-sm font-medium hover:opacity-70 transition-opacity"
            >
              {t('about_us')}
            </Link>
            <Link
              to="/contact"
              className="text-white text-sm font-medium hover:opacity-70 transition-opacity"
            >
              {t('contact')}
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Language Switcher */}
            <div className="text-white">
              <LanguageSwitcher />
            </div>

            {/* Search */}
            <button
              className="text-white hover:opacity-70 transition-opacity text-lg md:text-base"
              aria-label={t('search')}
            >
              <FaSearch />
            </button>



            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white hover:text-gray-300 transition text-lg"
              onClick={toggleMobileMenu}
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white absolute w-full left-0 shadow-lg overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/"
                className="block text-gray-800 hover:text-blue-500 transition py-2"
              >
                {t('home')}
              </Link>
              <div>
                <button
                  className="flex items-center justify-between w-full text-gray-800 hover:text-blue-500 transition py-2"
                  onClick={toggleProductsDropdown}
                  aria-expanded={isProductsDropdownOpen}
                >
                  {t('products')}
                  <FaChevronDown className={`ml-1 h-3 w-3 transition-transform duration-300 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isProductsDropdownOpen && (
                    <motion.div
                      className="pl-4 space-y-2 mt-2 overflow-hidden"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={mobileDropdownVariants}
                    >
                      <Link
                        to="/products/ecu-control-units"
                        className="block text-gray-700 hover:text-blue-500 transition py-1"
                      >
                        {t('ecu_control_units')}
                      </Link>
                      <Link
                        to="/products/rail-injectors"
                        className="block text-gray-700 hover:text-blue-500 transition py-1"
                      >
                        {t('rail_injectors')}
                      </Link>
                      <Link
                        to="/products/gas-reducers"
                        className="block text-gray-700 hover:text-blue-500 transition py-1"
                      >
                        {t('gas_reducers')}
                      </Link>
                      <Link
                        to="/products"
                        className="block text-blue-600 hover:text-blue-700 transition py-1"
                      >
                        {t('all_products')}
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                to="/services"
                className="block text-gray-800 hover:text-blue-500 transition py-2"
              >
                {t('services')}
              </Link>
              <Link
                to="/branches"
                className="block text-gray-800 hover:text-blue-500 transition py-2"
              >
                {t('branches')}
              </Link>
              <Link
                to="/about"
                className="block text-gray-800 hover:text-blue-500 transition py-2"
              >
                {t('about_us')}
              </Link>
              <Link
                to="/contact"
                className="block text-gray-800 hover:text-blue-500 transition py-2"
              >
                {t('contact')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 