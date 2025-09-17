import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaTools, FaMapMarkedAlt, FaShieldAlt, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

// Components
import FeaturedProducts from '../components/products/FeaturedProducts';
import TestimonialSlider from '../components/home/TestimonialSlider';
import BranchesMap from '../components/branches/BranchesMap';
import { Branch } from '../types/Product';
import { branchesData, citiesWithCoordinates } from '../data/branchesData';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  
  // Use centralized cities data with branch counts
  const cities = citiesWithCoordinates;

  useEffect(() => {
    // Use centralized branches data - 150 branches total
    setBranches(branchesData);
    setFilteredBranches(branchesData);
    if (branchesData.length > 0) {
      setSelectedBranchId(branchesData[0].id);
    }
  }, []);

  // Filter branches based on selected city
  useEffect(() => {
    if (branches.length === 0) return;
    
    let filtered = [...branches];
    
    if (selectedCity !== 'all') {
      filtered = filtered.filter(branch => branch.city === selectedCity);
    }
    
    setFilteredBranches(filtered);
    
    if (filtered.length > 0 && (!selectedBranchId || !filtered.some(b => b.id === selectedBranchId))) {
      setSelectedBranchId(filtered[0].id);
    }
  }, [selectedCity, branches, selectedBranchId]);

  const handleBranchSelect = (branchId: string) => {
    console.log('🎯 HomePage branch selected:', branchId);
    setSelectedBranchId(branchId);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="pt-16 bg-white text-gray-900">
      {/* Hero Section - Apple Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/images/hero-bg.jpg" 
            alt={t('home_hero_alt')}
            className="w-full h-full object-cover opacity-80"
          />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight"
              variants={heroTextVariants}
            >
              {t('home_hero_title')}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-10 text-white/90 font-light max-w-3xl mx-auto leading-relaxed"
              variants={heroTextVariants}
            >
              {t('home_hero_subtitle')}
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-6 justify-center"
              variants={heroTextVariants}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/products" className="px-8 py-4 rounded-full bg-white text-black font-medium text-lg transition-all hover:bg-gray-100">
                  {t('explore_products')}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/gas-installation" className="px-8 py-4 rounded-full bg-transparent border border-white text-white font-medium text-lg transition-all hover:bg-white/10">
                  {t('learn_more')}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <div className="animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>
      
      {/* Innovation Section - Apple Style */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-5xl font-semibold mb-6 tracking-tight">{t('innovation_section_title')}</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
              {t('innovation_section_description')}
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {/* Feature 1 */}
            <motion.div 
              className="text-center"
              variants={fadeIn}
              whileHover={{ y: -10 }}
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="text-black text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('feature_1_title')}</h3>
              <p className="text-gray-500 font-light">
                {t('feature_1_description')}
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="text-center"
              variants={fadeIn}
              whileHover={{ y: -10 }}
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <FaTools className="text-black text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('feature_2_title')}</h3>
              <p className="text-gray-500 font-light">
                {t('feature_2_description')}
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="text-center"
              variants={fadeIn}
              whileHover={{ y: -10 }}
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <FaMapMarkedAlt className="text-black text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('feature_3_title')}</h3>
              <p className="text-gray-500 font-light">
                {t('feature_3_description')}
              </p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div 
              className="text-center"
              variants={fadeIn}
              whileHover={{ y: -10 }}
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-black text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('feature_4_title')}</h3>
              <p className="text-gray-500 font-light">
                {t('feature_4_description')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Products Section - Apple Style */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-5xl font-semibold mb-6 tracking-tight">Featured Products</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
              Discover our most popular automotive gas equipment, designed with precision and built to last.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FeaturedProducts />
          </motion.div>
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link to="/products" className="inline-flex items-center text-lg font-medium">
              View All Products <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section - Apple Style */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-5xl font-semibold mb-6 tracking-tight">What Our Customers Say</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
              Don't just take our word for it. Hear from our satisfied customers across Uzbekistan.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <TestimonialSlider />
          </motion.div>
        </div>
      </section>
      
      {/* Branches Section - Apple Style */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-5xl font-semibold mb-6 tracking-tight">Find Us Nearby</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
              150 branches across Uzbekistan - We're never far away. Visit us today.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="p-8 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold">Our Branches</h3>
                  <span className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full font-medium">
                    {filteredBranches.length} found
                  </span>
                </div>
                
                {/* City Filter */}
                <div className="mb-6">
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all"
                    value={selectedCity}
                    onChange={handleCityChange}
                  >
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.displayName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-4">
                  {filteredBranches.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-300 text-3xl mb-3">🏢</div>
                      <p className="text-gray-500 mb-4">No branches found in this city</p>
                      <button 
                        onClick={() => setSelectedCity('all')}
                        className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Show All Cities
                      </button>
                    </div>
                  ) : (
                    filteredBranches.map(branch => (
                      <div 
                        key={branch.id}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${selectedBranchId === branch.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        onClick={() => handleBranchSelect(branch.id)}
                      >
                        <h4 className="font-medium text-lg">{branch.name}</h4>
                        <p className="text-gray-500 text-sm mt-1">{branch.address}, {branch.city}</p>
                        <p className="text-gray-500 text-sm mt-1">{branch.phone}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="lg:col-span-2 h-[500px]">
                {filteredBranches.length > 0 ? (
                  <BranchesMap 
                    branches={filteredBranches} 
                    selectedBranchId={selectedBranchId}
                    centerCoordinates={cities.find(city => city.name === selectedCity)?.coordinates}
                    selectedCity={selectedCity}
                    onBranchSelect={handleBranchSelect}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                    <div className="text-center p-8">
                      <div className="text-gray-300 text-4xl mb-4">🗺️</div>
                      <p className="text-gray-500 text-lg">No branches found in selected city</p>
                      <button 
                        onClick={() => setSelectedCity('all')}
                        className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Show All Cities
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section - Apple Style */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-semibold mb-6 tracking-tight">Ready to upgrade your vehicle?</h2>
            <p className="text-xl text-white/80 mb-10 font-light leading-relaxed">
              Experience the difference with EuropeGAS & Rail Group Uzbekistan's premium automotive gas equipment.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact" className="px-8 py-4 rounded-full bg-white text-black font-medium text-lg inline-block">
                Contact Us Today
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 