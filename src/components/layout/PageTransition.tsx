import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPathname, setPrevPathname] = useState('');

  useEffect(() => {
    // Only trigger loading animation when the path changes
    if (prevPathname !== location.pathname && prevPathname !== '') {
      setIsLoading(true);
      
      // Set exactly 0.7 seconds for the animation
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 700); // 0.7 seconds total animation time
      
      return () => clearTimeout(timer);
    }
    
    setPrevPathname(location.pathname);
  }, [location.pathname, prevPathname]);

  return (
    <>
      {/* Always render the children */}
      {children}
      
      {/* Overlay animation only when loading */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ 
              duration: 0.2,
              backdropFilter: { duration: 0.5, ease: "easeOut" }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-20"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ scale: 1.2 }}
              animate={{ scale: 0.9 }}
              transition={{ 
                duration: 0.7,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <img 
                src="/images/logos/logo.png" 
                alt="EuropeGAS Logo" 
                className="h-24 w-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageTransition; 