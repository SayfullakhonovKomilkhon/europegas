import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FaTools, FaWrench, FaUserTie, FaChartLine, FaTruck, FaUserCog } from 'react-icons/fa';
import { IoSpeedometer, IoShieldCheckmark } from 'react-icons/io5';
import { useLanguage } from '../context/LanguageContext';

const ServicesPage: React.FC = () => {
  const { t } = useLanguage();
  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const mainServicesRef = useRef<HTMLDivElement>(null);
  const additionalServicesRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Scroll animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  
  // InView animations
  const isMainServicesInView = useInView(mainServicesRef, { once: false, amount: 0.2 });
  const isAdditionalServicesInView = useInView(additionalServicesRef, { once: false, amount: 0.2 });
  const isProcessInView = useInView(processRef, { once: false, amount: 0.2 });
  const isCtaInView = useInView(ctaRef, { once: false, amount: 0.3 });
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    hover: { 
      scale: 1.03, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };
  
  const processStepVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black"
        style={{ 
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"
          style={{ y: heroY }}
        />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-3xl mx-auto"
            style={{ opacity: heroOpacity }}
          >
          <motion.h1 
            className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('our_services')}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('service_description')}
          </motion.p>
          <motion.button 
            className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-300 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('explore_our_services')}
          </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      <div className="container mx-auto px-4 py-16">
        {/* Main Services Section */}
        <motion.div 
          ref={mainServicesRef}
          className="mb-24"
          initial="hidden"
          animate={isMainServicesInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <motion.div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 text-black"
              variants={fadeIn}
            >
              {t('core_services')}
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              variants={fadeIn}
            >
              {t('core_services_description')}
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            {/* Equipment Installation */}
            <motion.div 
              className="bg-white rounded-2xl shadow-md overflow-hidden"
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
            >
              <div className="h-48 bg-black flex items-center justify-center">
                <FaTools className="text-white text-6xl" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{t('equipment_installation')}</h3>
                <p className="text-gray-600 mb-4">{t('equipment_installation_desc')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('gas_conversion_systems')}</span>
                  </li>
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('fuel_management_systems')}</span>
                  </li>
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('rail_equipment_setup')}</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Maintenance & Repair */}
            <motion.div 
              className="bg-white rounded-2xl shadow-md overflow-hidden"
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
            >
              <div className="h-48 bg-gray-800 flex items-center justify-center">
                <FaWrench className="text-white text-6xl" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{t('maintenance_repair')}</h3>
                <p className="text-gray-600 mb-4">{t('maintenance_repair_desc')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('preventive_maintenance')}</span>
                  </li>
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('emergency_repairs')}</span>
                  </li>
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('system_diagnostics')}</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Consultation Services */}
            <motion.div 
              className="bg-white rounded-2xl shadow-md overflow-hidden"
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
            >
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <FaUserTie className="text-white text-6xl" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{t('consultation_services')}</h3>
                <p className="text-gray-600 mb-4">{t('consultation_services_desc')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('system_design')}</span>
                  </li>
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('efficiency_analysis')}</span>
                  </li>
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('regulatory_compliance')}</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* System Optimization */}
            <motion.div 
              className="bg-white rounded-2xl shadow-md overflow-hidden"
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
            >
              <div className="h-48 bg-gray-600 flex items-center justify-center">
                <FaChartLine className="text-white text-6xl" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{t('system_optimization')}</h3>
                <p className="text-gray-600 mb-4">{t('system_optimization_desc')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('performance_tuning')}</span>
                  </li>
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('efficiency_upgrades')}</span>
                  </li>
                  <li className="flex items-start">
                    <IoShieldCheckmark className="text-blue-600 text-lg mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{t('system_integration')}</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Additional Services */}
        <motion.div 
          ref={additionalServicesRef}
          className="mb-24 py-16 px-8 bg-white rounded-3xl shadow-lg"
          initial="hidden"
          animate={isAdditionalServicesInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            variants={fadeIn}
          >
            {t('additional_services')}
          </motion.h2>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="flex items-start p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              variants={fadeIn}
            >
              <IoSpeedometer className="text-blue-600 text-3xl mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">{t('performance_testing')}</h3>
                <p className="text-gray-600">
                  {t('performance_testing_desc')}
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              variants={fadeIn}
            >
              <FaTruck className="text-blue-600 text-3xl mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">{t('delivery_logistics')}</h3>
                <p className="text-gray-600">
                  {t('delivery_logistics_desc')}
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              variants={fadeIn}
            >
              <FaTools className="text-blue-600 text-3xl mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">{t('equipment_testing')}</h3>
                <p className="text-gray-600">
                  {t('equipment_testing_desc')}
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              variants={fadeIn}
            >
              <FaUserCog className="text-blue-600 text-3xl mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">{t('training_programs')}</h3>
                <p className="text-gray-600">
                  {t('training_programs_desc')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Service Process */}
        <motion.div 
          ref={processRef}
          className="mb-24"
          initial="hidden"
          animate={isProcessInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <motion.h2 
            className="text-3xl font-bold mb-16 text-center"
            variants={fadeIn}
          >
            {t('our_service_process')}
          </motion.h2>
          
          <motion.div 
            className="relative"
            variants={staggerContainer}
          >
            {/* Process Steps */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <motion.div className="grid md:grid-cols-4 gap-8 relative z-10">
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-md text-center"
                custom={0}
                variants={processStepVariant}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">1</div>
                <h3 className="font-semibold text-xl mb-3">{t('consultation')}</h3>
                <p className="text-gray-600">{t('consultation_desc')}</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-md text-center"
                custom={1}
                variants={processStepVariant}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-gray-800 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">2</div>
                <h3 className="font-semibold text-xl mb-3">{t('assessment')}</h3>
                <p className="text-gray-600">{t('assessment_desc')}</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-md text-center"
                custom={2}
                variants={processStepVariant}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-gray-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">3</div>
                <h3 className="font-semibold text-xl mb-3">{t('implementation')}</h3>
                <p className="text-gray-600">{t('implementation_desc')}</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-md text-center"
                custom={3}
                variants={processStepVariant}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-gray-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">4</div>
                <h3 className="font-semibold text-xl mb-3">{t('follow_up')}</h3>
                <p className="text-gray-600">{t('follow_up_desc')}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* CTA */}
        <motion.div 
          ref={ctaRef}
          className="bg-black text-white p-12 rounded-3xl shadow-xl text-center mb-12 overflow-hidden relative"
          initial="hidden"
          animate={isCtaInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {t('ready_to_get_started')}
          </motion.h2>
          
          <motion.p 
            className="mb-8 text-lg max-w-2xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {t('cta_description')}
          </motion.p>
          
          <motion.button 
            className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-300 shadow-lg relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('contact_us')}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage; 