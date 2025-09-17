import React, { useState, useEffect, useRef } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaClock, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    ymaps: any;
  }
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };
  
  // Initialize Yandex Maps
  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;
    
    const loadYandexMaps = () => {
      try {
        // Check if Yandex Maps is already loaded
        if (window.ymaps) {
          initMap();
          return;
        }
        
        // Create script element
        scriptElement = document.createElement('script');
        scriptElement.src = 'https://api-maps.yandex.ru/2.1/?apikey=3d6c77dc-aaeb-4f9c-9e12-614650b5949a&lang=en_US';
        scriptElement.async = true;
        
        // Handle successful loading
        scriptElement.onload = () => {
          console.log('Yandex Maps script loaded successfully');
          initMap();
        };
        
        // Handle loading error
        scriptElement.onerror = (e) => {
          console.error('Failed to load Yandex Maps script:', e);
          setMapError(true);
        };
        
        document.body.appendChild(scriptElement);
      } catch (error) {
        console.error('Error initializing Yandex Maps:', error);
        setMapError(true);
      }
    };
    
    function initMap() {
      if (!mapRef.current || !window.ymaps) return;
      
      try {
        window.ymaps.ready(() => {
          console.log('Yandex Maps is ready');
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.destroy();
          }
          
          // Create a new map instance with the specified coordinates
          const map = new window.ymaps.Map(mapRef.current, {
            center: [41.259395, 69.162595],
            zoom: 15,
            controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
          });
          
          // Add custom styling to the map
          map.behaviors.disable('scrollZoom');
          
          // Add placemark for the office location
          const placemark = new window.ymaps.Placemark(
            [41.259395, 69.162595],
            {
              hintContent: 'EuropeGAS Headquarters',
              balloonContent: `
                <div class="branch-balloon p-3">
                  <h3 class="font-bold text-lg mb-2">EuropeGAS Headquarters</h3>
                  <p class="mb-1"><strong>Address:</strong> 123 Amir Temur Street</p>
                  <p class="mb-1"><strong>City:</strong> Tashkent</p>
                  <p class="mb-1"><strong>Phone:</strong> +998 77 201 7778</p>
                  <p><strong>Email:</strong> senatorbux@gmail.com</p>
                </div>
              `
            },
            {
              preset: 'islands#redDotIconWithCaption',
              iconColor: '#FF0000',
              iconCaption: 'EuropeGAS',
              iconCaptionMaxWidth: '200'
            }
          );
          
          map.geoObjects.add(placemark);
          
          // Save map instance to ref
          mapInstanceRef.current = map;
          setMapLoaded(true);
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    }
    
    loadYandexMaps();
    
    // Cleanup function
    return () => {
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
      
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error('Error destroying map instance:', error);
        }
      }
    };
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const mapContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        delay: 0.3
      }
    }
  };
  
  return (
    <div className="bg-white overflow-hidden pt-16">
      {/* Hero Section */}
      <motion.div 
        className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute inset-0 z-0"
        >
          <img 
            src="/images/contact-hero.jpg" 
            alt="Contact Us" 
            className="w-full h-full object-cover opacity-70"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/pattern.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-semibold mb-6 text-white tracking-tight">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              We'd love to hear from you. Get in touch with our team.
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
      
      {/* Main Content */}
      <motion.div 
        className="container mx-auto px-6 py-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Information */}
        <motion.div 
          className="lg:col-span-1"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-br from-black to-gray-900 p-10 rounded-3xl shadow-2xl h-full text-white">
            <h2 className="text-3xl font-bold mb-10 text-white">Get In Touch</h2>
            
            <div className="space-y-8">
              <motion.div 
                className="flex items-start group"
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl mr-6 group-hover:bg-white/20 transition-all duration-300">
                  <FaMapMarkerAlt className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-white">Our Location</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">123 Amir Temur Street<br />Tashkent, Uzbekistan</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start group"
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl mr-6 group-hover:bg-white/20 transition-all duration-300">
                  <FaPhone className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-white">Phone Numbers</h3>
                  <p className="text-gray-300 text-lg">+998 77 201 7778</p>
                  <p className="text-gray-300 text-lg">+998 99 889 6888</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start group"
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl mr-6 group-hover:bg-white/20 transition-all duration-300">
                  <FaEnvelope className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-white">Email Address</h3>
                  <p className="text-gray-300 text-lg">senatorbux@gmail.com</p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-12 pt-8 border-t border-white/20"
              whileHover={{ x: 5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-start group">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl mr-6 group-hover:bg-white/20 transition-all duration-300">
                  <FaClock className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4 text-white">Working Hours</h3>
                  <div className="space-y-3">
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                      <p className="text-gray-200"><span className="font-semibold text-white">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                      <p className="text-gray-200"><span className="font-semibold text-white">Saturday:</span> 10:00 AM - 4:00 PM</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                      <p className="text-gray-200"><span className="font-semibold text-white">Sunday:</span> Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Contact Form */}
        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
        >
          <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">Send Us a Message</h2>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Have a question or want to work together? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            
            <AnimatePresence>
              {submitSuccess && (
                <motion.div 
                  className="bg-green-50 border-2 border-green-200 text-green-800 px-8 py-6 rounded-2xl mb-8 flex items-center shadow-lg"
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <FaCheckCircle className="text-green-600 text-2xl mr-4" />
                  <div>
                    <h3 className="font-bold text-lg">Message Sent Successfully!</h3>
                    <p className="text-green-700">Thank you for your message! We will get back to you soon.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {submitError && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-8 py-6 rounded-2xl mb-8 shadow-lg">
                <h3 className="font-bold text-lg mb-2">Error</h3>
                <p>{submitError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="block text-gray-900 mb-3 font-semibold text-lg">Your Name *</label>
                  <motion.input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 focus:border-black transition-all text-lg bg-gray-50 hover:bg-white"
                    required
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-900 mb-3 font-semibold text-lg">Your Email *</label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 focus:border-black transition-all text-lg bg-gray-50 hover:bg-white"
                    required
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gray-900 mb-3 font-semibold text-lg">Subject *</label>
                <motion.input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 focus:border-black transition-all text-lg bg-gray-50 hover:bg-white"
                  required
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  placeholder="What is this message about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-900 mb-3 font-semibold text-lg">Your Message *</label>
                <motion.textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={8}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 focus:border-black transition-all text-lg bg-gray-50 hover:bg-white resize-none"
                  required
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  placeholder="Tell us more about your inquiry..."
                ></motion.textarea>
              </div>
              
              <motion.button
                type="submit"
                className="w-full bg-black text-white py-5 px-8 rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center text-xl font-bold shadow-2xl hover:shadow-3xl"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span>Sending Message...</span>
                  </div>
                ) : (
                  <>
                    <FaPaperPlane className="mr-3 text-lg" /> Send Message
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
      
      {/* Map Section */}
      <motion.div 
        className="mt-20"
        variants={itemVariants}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Find Us on the Map</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Visit our headquarters in the heart of Tashkent. We're easily accessible and always ready to welcome you.
          </p>
        </div>
        
        <motion.div 
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          variants={mapContainerVariants}
        >
          {mapError ? (
            <div className="h-96 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMapMarkerAlt className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Map Unavailable</h3>
                <p className="text-gray-500">Unable to load the map at this time.</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div 
                ref={mapRef} 
                className="h-96 w-full"
                style={{ minHeight: '400px' }}
              />
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    
      </motion.div>
    </div>
  );
};

export default ContactPage; 