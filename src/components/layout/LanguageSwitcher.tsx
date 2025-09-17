import React, { useState, useRef, useEffect } from 'react';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, Language } from '../../context/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  // Get current language data
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  // Animation variants
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

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        className="flex items-center text-sm px-3 py-2 rounded-full hover:bg-white/10 transition-colors duration-200"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label={t('language')}
      >
        <FaGlobe className="mr-2" />
        <span className="hidden md:inline-block">{currentLanguage.flag} {currentLanguage.name}</span>
        <span className="md:hidden">{currentLanguage.flag}</span>
        <FaChevronDown 
          className={`ml-1 h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden w-48"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
          >
            <div className="py-1">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                    language === lang.code
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors duration-150`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher; 