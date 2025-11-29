import React, { useEffect, useRef, useState, memo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { FaMapMarked } from 'react-icons/fa';
import { Branch } from '../../types/Product';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

// Fix default marker icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface BranchesMapProps {
  branches: Branch[];
  selectedBranchId: string;
  centerCoordinates?: { lat: number; lng: number };
  selectedCity?: string;
  onBranchSelect: (branchId: string) => void;
}

// Component to add markers with clustering using native leaflet.markercluster
const MarkersLayer: React.FC<{
  branches: Branch[];
  selectedBranchId: string;
  onBranchSelect: (id: string) => void;
}> = ({ branches, selectedBranchId, onBranchSelect }) => {
  const map = useMap();
  const { t } = useLanguage();
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!map) return;

    // Create marker cluster group if it doesn't exist
    if (!markerClusterGroupRef.current) {
      markerClusterGroupRef.current = (L as any).markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 60,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        animate: true,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          let className = 'marker-cluster-small';
          if (count > 10) className = 'marker-cluster-medium';
          if (count > 25) className = 'marker-cluster-large';

          return L.divIcon({
            html: `<div class="cluster-inner"><span>${count}</span></div>`,
            className: `marker-cluster ${className}`,
            iconSize: L.point(40, 40)
          });
        }
      });

      if (markerClusterGroupRef.current) {
        map.addLayer(markerClusterGroupRef.current);
      }
    }

    const markerClusterGroup = markerClusterGroupRef.current;

    if (!markerClusterGroup) return;

    // Clear existing markers
    markerClusterGroup.clearLayers();
    markersRef.current.clear();

    // Add markers for each branch
    branches.forEach((branch) => {
      const isSelected = branch.id === selectedBranchId;

      // Create custom icon
      const icon = L.icon({
        iconUrl: '/images/logos/logo.png',
        iconSize: isSelected ? [42, 42] : [28, 28],
        iconAnchor: isSelected ? [21, 42] : [14, 28],
        popupAnchor: [0, isSelected ? -42 : -28],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: isSelected ? [54, 54] : [40, 40],
        shadowAnchor: isSelected ? [27, 54] : [20, 40],
      });

      const marker = L.marker([branch.coordinates.lat, branch.coordinates.lng], { icon });

      // Create popup content
      const popupContent = `
        <div class="branch-popup">
          <div class="flex items-center gap-2 mb-3 pb-3" style="border-bottom: 1px solid #f3f4f6;">
            <img src="/images/logos/logo.png" alt="EuropeGAS" style="width: 24px; height: 24px;" />
            <h3 style="font-weight: bold; font-size: 16px; color: #111827; line-height: 1.3; margin: 0;">${branch.name}</h3>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
            <div style="display: flex; gap: 8px;">
              <svg style="width: 16px; height: 16px; color: #ef4444; margin-top: 2px; flex-shrink: 0;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <span style="color: #4b5563;">${branch.address}, ${branch.city}</span>
            </div>
            
            <div style="display: flex; gap: 8px;">
              <svg style="width: 16px; height: 16px; color: #10b981; margin-top: 2px; flex-shrink: 0;" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <a href="tel:${branch.phone}" style="color: #2563eb; text-decoration: none;">${branch.phone}</a>
            </div>
            
            <div style="display: flex; gap: 8px;">
              <svg style="width: 16px; height: 16px; color: #f97316; margin-top: 2px; flex-shrink: 0;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <div style="color: #4b5563; font-size: 12px; line-height: 1.5;">
                <div>Пн-Пт: ${branch.workingHours.weekdays}</div>
                <div>Сб: ${branch.workingHours.saturday}</div>
                <div>Вс: ${branch.workingHours.sunday}</div>
              </div>
            </div>
          </div>
          
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${branch.coordinates.lat},${branch.coordinates.lng}"
            target="_blank"
            rel="noopener noreferrer"
            style="margin-top: 16px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background-color: #2563eb; color: #FFFFFF; font-weight: bold; font-size: 16px; padding: 12px 16px; border-radius: 8px; text-decoration: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05);"
          >
            <svg style="width: 20px; height: 20px;" fill="none" stroke="#FFFFFF" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Построить маршрут
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280, minWidth: 260 });

      // Handle marker click
      marker.on('click', () => {
        console.log('🎯 Map marker clicked:', branch.name);
        onBranchSelect(branch.id);
      });

      markerClusterGroup.addLayer(marker);
      markersRef.current.set(branch.id, marker);
    });

    // Cleanup on unmount
    return () => {
      if (markerClusterGroupRef.current && map.hasLayer(markerClusterGroupRef.current)) {
        map.removeLayer(markerClusterGroupRef.current);
        markerClusterGroupRef.current = null;
      }
    };
  }, [branches, map, t]); // Removed selectedBranchId from dependencies to prevent full re-render

  // Effect to handle zoom to selected branch
  useEffect(() => {
    if (!selectedBranchId || !markerClusterGroupRef.current) return;

    const marker = markersRef.current.get(selectedBranchId);
    if (marker) {
      // Use zoomToShowLayer to zoom in and spiderfy if needed
      markerClusterGroupRef.current.zoomToShowLayer(marker, () => {
        marker.openPopup();
      });
    }
  }, [selectedBranchId]);

  return null;
};

// Component to handle map view updates
const MapViewController: React.FC<{
  branches: Branch[];
  center: [number, number];
  zoom: number;
  selectedBranch: Branch | null;
}> = ({ branches, center, zoom, selectedBranch }) => {
  const map = useMap();
  const prevCenterRef = useRef(center);
  const prevBranchesRef = useRef<Branch[]>([]);

  useEffect(() => {
    if (!map || !branches.length) return;

    // Check if branches list changed (e.g. city filter changed)
    const branchesChanged = JSON.stringify(branches.map(b => b.id)) !== JSON.stringify(prevBranchesRef.current.map(b => b.id));

    if (branchesChanged) {
      // Fit bounds to show all branches in the list
      const bounds = L.latLngBounds(branches.map(b => [b.coordinates.lat, b.coordinates.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      prevBranchesRef.current = branches;
      // Update prevCenterRef to prevent setView from overriding fitBounds on next render
      prevCenterRef.current = center;
    } else if (
      prevCenterRef.current[0] !== center[0] ||
      prevCenterRef.current[1] !== center[1]
    ) {
      // Fallback to center/zoom if only center changed
      map.setView(center, zoom, { animate: true, duration: 0.8 });
      prevCenterRef.current = center;
    }
  }, [branches, center, zoom, map]);

  return null;
};

const BranchesMap: React.FC<BranchesMapProps> = ({
  branches,
  selectedBranchId,
  centerCoordinates,
  selectedCity = 'all',
  onBranchSelect
}) => {
  const { t } = useLanguage();
  const [mapError, setMapError] = useState<boolean>(false);

  console.log('🎯 BranchesMap received props:', {
    branchesCount: branches.length,
    selectedBranchId,
    selectedCity,
    centerCoordinates
  });

  const selectedBranch = branches.length > 0
    ? (branches.find(branch => branch.id === selectedBranchId) || branches[0])
    : null;

  const getMapCenter = (): [number, number] => {
    if (centerCoordinates && selectedCity !== 'all') {
      return [centerCoordinates.lat, centerCoordinates.lng];
    }
    return [41.2995, 69.2401];
  };

  const getMapZoom = (): number => {
    return selectedCity !== 'all' ? 11 : 7;
  };

  const center = getMapCenter();
  const zoom = getMapZoom();

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

  if (mapError) {
    return (
      <motion.div
        className="flex items-center justify-center h-full bg-gray-100"
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
    );
  }

  return (
    <div className="w-full h-full">
      <motion.div
        className="w-full h-full rounded-lg overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={mapContainerVariants}
      >
        <div className="h-full relative">
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            zoomControl={true}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            <MapViewController
              branches={branches}
              center={center}
              zoom={zoom}
              selectedBranch={selectedBranch}
            />

            <MarkersLayer
              branches={branches}
              selectedBranchId={selectedBranchId}
              onBranchSelect={onBranchSelect}
            />
          </MapContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(BranchesMap);