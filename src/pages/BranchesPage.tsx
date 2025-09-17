import React, { useState, useEffect, useCallback } from 'react';
import { FaClock, FaSearch, FaStore } from 'react-icons/fa';
import BranchesMap from '../components/branches/BranchesMap';
import { Branch } from '../types/Product';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { branchesData, citiesWithCoordinates } from '../data/branchesData';

// Extended Branch type for this page
interface BranchWithImage extends Branch {
  imageUrl: string;
  region: string;
}

const BranchesPage: React.FC = () => {
  const { t } = useLanguage();
  const [branches, setBranches] = useState<BranchWithImage[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<BranchWithImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchWithImage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  
  // Use centralized cities data with branch counts
  const cities = citiesWithCoordinates;
  
  useEffect(() => {
    const fetchBranches = async () => {
      setIsLoading(true);
      
      try {
        setTimeout(() => {
          // Convert centralized branch data to BranchWithImage format
          const mockBranches: BranchWithImage[] = branchesData.map(branch => ({
            ...branch,
            region: branch.city, // Use city as region for simplicity
            imageUrl: `/images/branches/${branch.id}.jpg` // Generate image URL based on branch ID
          }));
          
          setBranches(mockBranches);
          setFilteredBranches(mockBranches);
          setSelectedBranch(mockBranches[0]);
          setIsLoading(false);
          
          setTimeout(() => {
            setMapLoaded(true);
          }, 1500);
        }, 1000);
      } catch (error) {
        console.error('Error fetching branches:', error);
        setIsLoading(false);
      }
    };
    
    fetchBranches();
    
    return () => {
      setMapLoaded(false);
    };
  }, []);
  
  // Filter branches based on search term and selected city
  useEffect(() => {
    if (branches.length === 0) return;
    
    let filtered = [...branches];
    
    if (searchTerm) {
      filtered = filtered.filter(branch => 
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCity !== 'all') {
      filtered = filtered.filter(branch => branch.city === selectedCity);
    }
    
    setFilteredBranches(filtered);
    
    if (filtered.length > 0 && selectedBranch && !filtered.some(b => b.id === selectedBranch.id)) {
      setSelectedBranch(filtered[0]);
    } else if (filtered.length === 0) {
      setSelectedBranch(null);
    }
  }, [searchTerm, selectedCity, branches, selectedBranch]);
  
  // Find the selected city's coordinates - moved outside useMemo to prevent recreation
  const selectedCityData = cities.find(city => city.name === selectedCity);
  const centerCoordinates = selectedCityData ? selectedCityData.coordinates : cities[0].coordinates;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
  };

  // Memoize the branch select handler to prevent unnecessary re-renders
  const handleBranchSelect = useCallback((branchId: string) => {
    console.log('🎯 Branch selected:', branchId);
    
    // Find branch from the current filtered list
    const branch = filteredBranches.find(b => b.id === branchId);
    if (branch) {
      console.log('📍 Setting selected branch:', branch.name);
      setSelectedBranch(branch);
    } else {
      console.warn('Branch not found in filtered list:', branchId);
    }
  }, [filteredBranches]);
  
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
            src="/images/branches-hero.jpg" 
            alt="Our Branches" 
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
        {t('our_branches')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              150 branches across Uzbekistan - Find your nearest EuropeGAS location
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
      
      {/* Main Content - Professional Layout */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
      
      {/* Search and Filter */}
      <motion.div 
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
                placeholder="Search branches..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
            <div className="flex items-center gap-3">
              <select
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all min-w-[150px]"
                value={selectedCity}
                onChange={handleCityChange}
              >
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.displayName}
                  </option>
                ))}
              </select>
              
              {(searchTerm || selectedCity !== 'all') && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearFilters}
                  className="px-4 py-3 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
              >
                  Clear
              </motion.button>
            )}
          </div>
        </div>
        </motion.div>
        
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 min-h-[600px]">
          {/* Branches List - Professional Sidebar */}
            <motion.div 
            className="xl:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Branches</h2>
                  <span className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full font-medium">
                    {filteredBranches.length} found
                  </span>
                </div>
              </div>
              
              <div className="p-2 max-h-[500px] overflow-y-auto">
            {isLoading ? (
                  <div className="p-4 space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredBranches.length === 0 ? (
                      <div className="text-center py-12">
                        <FaStore className="text-gray-300 text-4xl mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No branches found</p>
                    <button 
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      onClick={clearFilters}
                    >
                          Clear filters
                    </button>
                      </div>
                ) : (
                      <div className="space-y-2">
                      {filteredBranches.map((branch) => (
                        <motion.div 
                          key={branch.id}
                            className={`p-4 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedBranch?.id === branch.id 
                                ? 'bg-black text-white shadow-sm' 
                                : 'hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            console.log('🎯 Sidebar branch clicked:', branch.name, branch.id);
                            console.log('📍 Branch coordinates:', branch.coordinates);
                            setSelectedBranch(branch);
                            // Also trigger the map navigation by calling the same handler
                            handleBranchSelect(branch.id);
                          }}
                            whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          layout
                        >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-medium text-sm leading-tight ${
                                  selectedBranch?.id === branch.id ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {branch.name}
                                </h3>
                                <p className={`text-xs mt-1 ${
                                  selectedBranch?.id === branch.id ? 'text-white/80' : 'text-gray-500'
                                }`}>
                                  {branch.address}
                                </p>
                                <p className={`text-xs mt-1 ${
                                  selectedBranch?.id === branch.id ? 'text-white/70' : 'text-gray-400'
                                }`}>
                                  {branch.city} • {branch.region}
                                </p>
                                
                                {/* Working Hours */}
                                <div className="mt-2 space-y-1">
                                  <div className={`text-xs flex items-center ${
                                    selectedBranch?.id === branch.id ? 'text-white/80' : 'text-gray-600'
                                  }`}>
                                    <FaClock className="mr-1" />
                                    <span className="font-medium">Mon-Fri:</span>
                                    <span className="ml-1">{branch.workingHours.weekdays}</span>
                                  </div>
                                  <div className={`text-xs flex items-center ${
                                    selectedBranch?.id === branch.id ? 'text-white/80' : 'text-gray-600'
                                  }`}>
                                    <span className="ml-3 font-medium">Sat:</span>
                                    <span className="ml-1">{branch.workingHours.saturday}</span>
                                  </div>
                                  <div className={`text-xs flex items-center ${
                                    selectedBranch?.id === branch.id ? 'text-white/80' : 'text-gray-600'
                                  }`}>
                                    <span className="ml-3 font-medium">Sun:</span>
                                    <span className="ml-1">{branch.workingHours.sunday}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className={`text-xs font-medium px-2 py-1 rounded ${
                                selectedBranch?.id === branch.id 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                Open
                              </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </>
            )}
              </div>
          </div>
        </motion.div>
        
          {/* Map Section - Professional Layout */}
          <motion.div 
            className="xl:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Interactive Map</h2>
              </div>
              <div className="h-[600px] rounded-b-2xl overflow-hidden">
                {mapLoaded && (
                  <>
                    {console.log('🗺️ Rendering BranchesMap with', filteredBranches.length, 'branches')}
                    <BranchesMap 
                        branches={filteredBranches} 
                        selectedBranchId={selectedBranch?.id || ''} 
                        centerCoordinates={centerCoordinates}
                        selectedCity={selectedCity}
                        onBranchSelect={handleBranchSelect}
                    />
                  </>
                )}

                {!mapLoaded && (
                    <div className="flex items-center justify-center h-full bg-gray-50">
                        <div className="text-center p-8">
                            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                            <p className="text-gray-600 font-medium">Loading map...</p>
                        </div>
                    </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BranchesPage; 