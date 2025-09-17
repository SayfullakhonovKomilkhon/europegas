import React, { useEffect, useRef, useState, memo } from 'react';
import { FaMapMarked } from 'react-icons/fa';
import { Branch } from '../../types/Product';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

interface BranchesMapProps {
  branches: Branch[];
  selectedBranchId: string;
  centerCoordinates?: { lat: number; lng: number };
  selectedCity?: string;
  onBranchSelect: (branchId: string) => void;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

const BranchesMap: React.FC<BranchesMapProps> = ({ 
  branches, 
  selectedBranchId, 
  centerCoordinates, 
  selectedCity = 'all',
  onBranchSelect 
}) => {
  const { t } = useLanguage();
  
  // Debug: Log props received
  console.log('🎯 BranchesMap received props:', {
    branchesCount: branches.length,
    selectedBranchId,
    selectedCity,
    centerCoordinates
  });
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const placemarkMapRef = useRef<Map<string, any>>(new Map()); // Store placemark references by branch ID
  const [mapError, setMapError] = useState<boolean>(false);
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  const [mapInitialized, setMapInitialized] = useState<boolean>(false);

  // Find the selected branch or default to the first one if available
  const selectedBranch = branches.length > 0 
    ? (branches.find(branch => branch.id === selectedBranchId) || branches[0])
    : null;

  // Initialize Yandex Maps - ONLY ONCE (never reinitialize)
  useEffect(() => {
    // CRITICAL: Skip if already initialized - prevent reloading
    if (mapInstanceRef.current) {
      console.log('⚡ Map already exists, skipping initialization');
      return;
    }
    
    let scriptElement: HTMLScriptElement | null = null;
    
    const loadYandexMaps = () => {
      try {
        // Check if Yandex Maps is already loaded and ready
        if (window.ymaps && window.ymaps.Map) {
          console.log('✅ Yandex Maps already loaded');
          initMap();
          return;
        }
        
        // Check if script is already loading
        const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
        if (existingScript) {
          console.log('⏳ Yandex Maps script already loading, waiting...');
          // Wait for the existing script to load
          existingScript.addEventListener('load', () => {
            console.log('✅ Existing Yandex Maps script loaded');
            setTimeout(initMap, 100); // Small delay to ensure API is ready
          });
          existingScript.addEventListener('error', (e) => {
            console.error('❌ Existing Yandex Maps script failed to load:', e);
            setMapError(true);
            setMapLoading(false);
          });
          return;
        }
        
        // Create script element
        scriptElement = document.createElement('script');
        // Use a specific API key for better reliability
        scriptElement.src = 'https://api-maps.yandex.ru/2.1/?apikey=3d6c77dc-aaeb-4f9c-9e12-614650b5949a&lang=en_US';
        scriptElement.async = true;
        
        // Handle successful loading
        scriptElement.onload = () => {
          console.log('✅ Yandex Maps script loaded successfully');
          // Add a small delay to ensure the API is fully initialized
          setTimeout(() => {
            if (window.ymaps && window.ymaps.Map) {
              console.log('✅ Yandex Maps API confirmed ready');
          setMapLoading(false);
          initMap();
            } else {
              console.error('❌ Yandex Maps API not ready after script load');
              setMapError(true);
              setMapLoading(false);
            }
          }, 200);
        };
        
        // Handle loading error
        scriptElement.onerror = (e) => {
          console.error('❌ Failed to load Yandex Maps script:', e);
          setMapError(true);
          setMapLoading(false);
        };
        
        document.body.appendChild(scriptElement);
      } catch (error) {
        console.error('❌ Error initializing Yandex Maps:', error);
        setMapError(true);
        setMapLoading(false);
      }
    };
    
    function initMap() {
      if (!mapRef.current || !window.ymaps) {
        console.log('❌ initMap conditions not met:', { 
          mapRef: !!mapRef.current, 
          ymaps: !!window.ymaps
        });
        return;
      }
      
      try {
        window.ymaps.ready(() => {
          console.log('✅ Yandex Maps is ready');
          
          // Only create new map if one doesn't exist - DON'T destroy existing maps
          if (mapInstanceRef.current && mapInitialized) {
            console.log('⚡ Map already exists, skipping recreation');
            return;
          }
          
          if (mapInstanceRef.current) {
            try {
            mapInstanceRef.current.destroy();
            } catch (e) {
              console.warn('Error destroying existing map:', e);
            }
          }
          
          // Verify ymaps.Map constructor exists
          if (!window.ymaps.Map) {
            console.error('❌ window.ymaps.Map constructor not available');
            setMapError(true);
            setMapLoading(false);
            return;
          }
          
          // Create a new map instance with default center (Tashkent, National Prime Gas)
          const mapCenter = centerCoordinates && selectedCity !== 'all' 
            ? [centerCoordinates.lat, centerCoordinates.lng]
            : [41.2995, 69.2401]; // Default to Tashkent coordinates
            
          console.log('🗺️ Creating map with center:', mapCenter);
          
          const map = new window.ymaps.Map(mapRef.current, {
            center: mapCenter,
            zoom: selectedCity !== 'all' ? 11 : 12,
            controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
          });
          
          // Add custom styling to the map
          map.behaviors.disable('scrollZoom');
          
          // Map is now initialized - placemarks will be added by separate useEffect
          
          // Save map instance to ref
          mapInstanceRef.current = map;
          setMapInitialized(true);
          setMapLoading(false);
          
          console.log('✅ Map initialized successfully, ready for placemarks');
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        setMapLoading(false);
      }
    }
    
    loadYandexMaps();
    
    // Cleanup function - DON'T destroy map on every re-render
    return () => {
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
      // DON'T destroy map instance - let it persist
    };
  }, []); // Initialize map only once

  // Update placemarks when branches change (without recreating the map)
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInitialized || !window.ymaps) {
      console.log('⏳ Waiting for map to be ready for placemark updates');
      return;
    }

    if (branches.length === 0) {
      console.log('⚠️ No branches available to display');
      return;
    }

    console.log('🔄 Updating placemarks for', branches.length, 'branches');

    try {
      // Clear existing placemarks
      mapInstanceRef.current.geoObjects.removeAll();
      
      // Verify Clusterer constructor exists
      if (!window.ymaps.Clusterer) {
        console.error('❌ window.ymaps.Clusterer constructor not available');
        return;
      }
      
      // Create a new clusterer
      const clusterer = new window.ymaps.Clusterer({
        preset: 'islands#blueClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: false,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false
      });

      const placemarks: any[] = [];
      const placemarkMap = new Map();

      // Add placemark for each branch
      branches.forEach((branch, index) => {
        try {
          console.log(`📍 Creating placemark ${index + 1}/${branches.length}: ${branch.name}`);
          const isSelected = branch.id === selectedBranchId;
        
        const placemark = new window.ymaps.Placemark(
          [branch.coordinates.lat, branch.coordinates.lng],
          {
            hintContent: branch.name,
            balloonContent: `
              <div class="branch-balloon p-4 min-w-[300px]">
                <div class="flex items-center mb-3">
                  <img src="/images/logos/logo.png" alt="EuropeGAS" class="w-8 h-8 mr-2">
                  <h3 class="font-bold text-lg text-gray-900">${branch.name}</h3>
                </div>
                <div class="space-y-2">
                  <div class="flex items-start">
                    <svg class="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <p class="font-medium text-gray-700">${t('address') || 'Address'}</p>
                      <p class="text-gray-600 text-sm">${branch.address}, ${branch.city}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <p class="font-medium text-gray-700">${t('phone') || 'Phone'}</p>
                      <p class="text-gray-600 text-sm">${branch.phone}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <svg class="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div>
                      <p class="font-medium text-gray-700">${t('email') || 'Email'}</p>
                      <p class="text-gray-600 text-sm">${branch.email}</p>
                    </div>
                  </div>
                  <div class="pt-2 border-t border-gray-100">
                    <div class="flex items-start">
                      <svg class="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                      <div>
                        <p class="font-medium text-gray-700 mb-1">${t('working_hours') || 'Working Hours'}</p>
                        <div class="grid grid-cols-1 gap-1 text-xs">
                          <div class="flex justify-between">
                            <span class="font-medium">Mon-Fri:</span>
                            <span>${branch.workingHours.weekdays}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="font-medium">Saturday:</span>
                            <span>${branch.workingHours.saturday}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="font-medium">Sunday:</span>
                            <span>${branch.workingHours.sunday}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          },
          {
            iconLayout: 'default#image',
            iconImageHref: '/images/logos/logo.png',
            iconImageSize: isSelected ? [42, 42] : [28, 28],
            iconImageOffset: isSelected ? [-21, -42] : [-14, -28],
            iconShadow: true,
            iconShadowImageHref: isSelected 
              ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTQiIGhlaWdodD0iNTQiIHZpZXdCb3g9IjAgMCA1NCA1NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjciIGN5PSIyNyIgcj0iMjciIGZpbGw9IiNGRjAwMDAiIGZpbGwtb3BhY2l0eT0iMC40Ii8+Cjwvc3ZnPgo='
              : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+Cjwvc3ZnPgo=',
            iconShadowSize: isSelected ? [54, 54] : [40, 40],
            iconShadowOffset: isSelected ? [-27, -54] : [-20, -40],
            balloonAutoPan: false,
            balloonCloseButton: true,
            balloonMaxWidth: 350
          }
        );
        
        placemarkMap.set(branch.id, placemark);
        
        // Add click event with proper event handling
        placemark.events.add('click', (e: any) => {
          try {
            // CRITICAL: Prevent default behavior (stops page reload)
            if (e && e.preventDefault) {
              e.preventDefault();
            }
            
            console.log('🎯 Map marker clicked:', branch.name);
            
            // Open balloon immediately - no double click needed
            if (placemark.balloon && !placemark.balloon.isOpen()) {
              placemark.balloon.open();
            }
            
            // Update state without causing re-render
            onBranchSelect(branch.id);
            
          } catch (error) {
            console.error('Error handling placemark click:', error);
          }
        });
        
          placemarks.push(placemark);
        } catch (error) {
          console.error(`❌ Error creating placemark for branch ${branch.name}:`, error);
        }
      });

      // Store the placemark map in ref for later use
      placemarkMapRef.current = placemarkMap;
      
      clusterer.add(placemarks);
      mapInstanceRef.current.geoObjects.add(clusterer);

      // Fit map to show all placemarks if there are multiple
      if (placemarks.length > 1) {
        mapInstanceRef.current.setBounds(clusterer.getBounds(), {
          checkZoomRange: true,
          zoomMargin: 30
        });
      }

      console.log('✅ Placemarks updated successfully');
    } catch (error) {
      console.error('❌ Error updating placemarks:', error);
    }
  }, [branches, mapInitialized, selectedBranchId, t, onBranchSelect]); // Update when branches or map state changes

  // Navigate map to selected city when city changes
  useEffect(() => {
    if (!centerCoordinates || !window.ymaps || mapError || !mapInitialized || !mapInstanceRef.current) return;
    
    try {
      // Navigate to the selected city center
      if (selectedCity !== 'all') {
        mapInstanceRef.current.setCenter(
          [centerCoordinates.lat, centerCoordinates.lng],
          11,
          { duration: 800, timingFunction: 'ease-in-out' }
        );
      } else if (branches.length > 0) {
        // If "All Cities" is selected, fit to show all branches
        const clusterer = mapInstanceRef.current.geoObjects.get(0);
        if (clusterer && clusterer.getBounds) {
          mapInstanceRef.current.setBounds(clusterer.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 30,
            duration: 800
          });
        }
      }
    } catch (error) {
      console.error('Error navigating to city:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, centerCoordinates, mapError, mapInitialized]); // Reduced dependencies

  // Update marker visuals and center map (without recreating placemarks)
  useEffect(() => {
    if (!selectedBranch || !window.ymaps || !mapInitialized || !mapInstanceRef.current) {
      return;
    }

    console.log('🗺️ Updating selected branch:', selectedBranch.name);

    try {
      // Update marker visuals for all placemarks
      placemarkMapRef.current.forEach((placemark, branchId) => {
        const isSelected = branchId === selectedBranchId;
        
        // Update marker size based on selection
        placemark.options.set('iconImageSize', isSelected ? [42, 42] : [28, 28]);
        placemark.options.set('iconImageOffset', isSelected ? [-21, -42] : [-14, -28]);
        placemark.options.set('iconShadowSize', isSelected ? [54, 54] : [40, 40]);
        placemark.options.set('iconShadowOffset', isSelected ? [-27, -54] : [-20, -40]);
      });

      // Center map on selected branch with smooth animation
      mapInstanceRef.current.setCenter(
        [selectedBranch.coordinates.lat, selectedBranch.coordinates.lng],
        15, // Closer zoom for better visibility
        { duration: 1000, timingFunction: 'ease-in-out' }
      );

      console.log('✅ Branch visuals and centering updated');

    } catch (error) {
      console.error('Error updating branch selection:', error);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranchId, mapInitialized]); // Only update visuals when selection changes

  // Animation variant for map container
  const mapContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.2
      }
    }
  };

  // Handle the case when branches array is empty
  if (branches.length === 0) {
    return (
      <motion.div 
        className="flex justify-center items-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <FaMapMarked className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">No branch locations available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* Full Size Map */}
      <motion.div 
        className="w-full h-full rounded-lg overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={mapContainerVariants}
      >
        <div className="h-full relative">
            <div ref={mapRef} className="w-full h-full">
              {/* Yandex Map will be rendered here */}
              <AnimatePresence>
                {mapLoading && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-center p-4">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                      <p className="text-gray-600 font-medium">Loading map...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {mapError && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
                      <div className="text-red-500 text-5xl mb-4 mx-auto">
                        <FaMapMarked className="mx-auto" />
                      </div>
                      <h3 className="text-lg font-bold text-red-500 mb-2">Map Loading Failed</h3>
                      <p className="text-gray-600 mb-4">We couldn't load the map. Please check your internet connection and try again.</p>
                      <button 
                        onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Reload Page
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
    </div>
  );
};

export default memo(BranchesMap); 