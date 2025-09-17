import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FaHistory, FaUsers, FaAward, FaHandshake, FaGlobe, FaLeaf, FaLightbulb, FaHandHoldingHeart } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  
  const isMissionInView = useInView(missionRef, { once: false, amount: 0.3 });
  const isValuesInView = useInView(valuesRef, { once: false, amount: 0.3 });
  const isTeamInView = useInView(teamRef, { once: false, amount: 0.3 });
  
  // Parallax effect for hero section
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  
  // Fade-in animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  // Staggered children animation
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  // Card hover animation
  const cardHover = {
    rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: { 
      scale: 1.02, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };
  
  return (
    <div className="bg-white overflow-hidden pt-16">
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
        style={{ opacity: heroOpacity }}
      >
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY }}
        >
          <img 
            src="/images/about-hero.jpg" 
            alt={t('about_hero_alt')} 
            className="w-full h-full object-cover opacity-50"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/pattern.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90"></div>
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-semibold mb-6 text-white tracking-tight">
              {t('about_page_title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              {t('about_hero_description')}
            </p>
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
      </motion.div>
      
      {/* Mission Section */}
      <section ref={missionRef} className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            animate={isMissionInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="max-w-6xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">{t('our_mission')}</h2>
              <p className="text-2xl text-gray-600 font-light leading-relaxed mb-16 max-w-4xl mx-auto">
                {t('empowering_mission')}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-left group hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <FaLightbulb className="text-white text-3xl" />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">{t('innovation')}</h3>
                <p className="text-gray-600 font-light leading-relaxed text-lg">
                  {t('innovation_description')}
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-left group hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <FaHandHoldingHeart className="text-white text-3xl" />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">{t('customer_focus')}</h3>
                <p className="text-gray-600 font-light leading-relaxed text-lg">
                  {t('customer_focus_description')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Company History Section */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">{t('our_journey')}</h2>
              <p className="text-2xl text-gray-300 font-light leading-relaxed max-w-4xl mx-auto">
                {t('journey_description')}
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-700 group hover:border-gray-600 transition-all duration-500"
              >
                <div className="text-6xl font-bold text-white mb-6 group-hover:text-gray-200 transition-colors">2005</div>
                <h3 className="text-2xl font-bold mb-4 text-white">{t('foundation')}</h3>
                <p className="text-gray-300 font-light leading-relaxed text-lg">
                  {t('foundation_description')}
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-700 group hover:border-gray-600 transition-all duration-500"
              >
                <div className="text-6xl font-bold text-white mb-6 group-hover:text-gray-200 transition-colors">2010</div>
                <h3 className="text-2xl font-bold mb-4 text-white">{t('expansion')}</h3>
                <p className="text-gray-300 font-light leading-relaxed text-lg">
                  {t('expansion_description')}
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-700 group hover:border-gray-600 transition-all duration-500"
              >
                <div className="text-6xl font-bold text-white mb-6 group-hover:text-gray-200 transition-colors">2024</div>
                <h3 className="text-2xl font-bold mb-4 text-white">{t('today')}</h3>
                <p className="text-gray-300 font-light leading-relaxed text-lg">
                  {t('today_description')}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section ref={valuesRef} className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            animate={isValuesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div 
              variants={fadeIn}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 tracking-tight">{t('our_values')}</h2>
              <p className="text-2xl text-gray-600 font-light leading-relaxed max-w-4xl mx-auto">
                {t('values_description')}
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                variants={fadeIn}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex items-start group hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center mr-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaHistory className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('integrity')}</h3>
                  <p className="text-gray-600 font-light leading-relaxed text-lg">
                    {t('integrity_description')}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeIn}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex items-start group hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center mr-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaUsers className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('teamwork')}</h3>
                  <p className="text-gray-600 font-light leading-relaxed text-lg">
                    {t('teamwork_description')}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeIn}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex items-start group hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center mr-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaAward className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('excellence')}</h3>
                  <p className="text-gray-600 font-light leading-relaxed text-lg">
                    {t('excellence_description')}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeIn}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex items-start group hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center mr-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaLeaf className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('sustainability')}</h3>
                  <p className="text-gray-600 font-light leading-relaxed text-lg">
                    {t('sustainability_description')}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">{t('join_our_journey')}</h2>
            <p className="text-2xl text-gray-300 mb-12 font-light leading-relaxed">
              {t('join_journey_description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <a href="/contact" className="inline-flex items-center px-12 py-5 rounded-2xl bg-white text-black font-bold text-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl">
                  {t('get_in_touch')}
                </a>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <a href="/products" className="inline-flex items-center px-12 py-5 rounded-2xl bg-transparent border-2 border-white text-white font-bold text-xl hover:bg-white hover:text-black transition-all duration-300">
                  {t('view_products')}
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 