import React, { useEffect, useRef, useState } from 'react';
import { Professional, Language } from '../types';
import { PROFESSIONALS, SERVICE_CATEGORIES } from '../constants';
import { MapPin, Phone, Navigation, Loader, Star, ArrowUp } from './icons';

declare const L: any;

interface MapSectionProps {
  t: (key: string) => string;
  currentLang: Language;
  professionals: Professional[];
  selectedCategory: string | null;
}

const haversineDistance = (
  coords1: { lat: number; lng: number },
  coords2: { lat: number; lng: number }
) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const dLon = ((coords2.lng - coords1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.lat * Math.PI) / 180) *
      Math.cos((coords2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const MapSection: React.FC<MapSectionProps> = ({ t, currentLang, professionals, selectedCategory }) => {
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const userMarkerRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [nearbyPros, setNearbyPros] = useState<(Professional & { distance: number })[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize map if it doesn't exist and the container is available
        if (mapContainerRef.current && !mapRef.current) {
            const moroccoBounds = L.latLngBounds(
                [21, -17], // Southwest corner of Morocco
                [36, -1]   // Northeast corner of Morocco
            );
            
            mapRef.current = L.map(mapContainerRef.current, {
                maxBounds: moroccoBounds,
                maxBoundsViscosity: 1.0,
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                minZoom: 5,
            }).addTo(mapRef.current);
            
            // Set initial view to fit all professional locations in Morocco
            const allProBounds = L.latLngBounds(PROFESSIONALS.map(pro => [pro.lat, pro.lng]));
            if (allProBounds.isValid()) {
                mapRef.current.fitBounds(allProBounds.pad(0.1));
            } else {
                 // Fallback if there are no professionals to calculate bounds from
                mapRef.current.setView([31.7917, -7.0926], 6);
            }
        }

        if (mapRef.current) {
            // Clear existing markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
    
            if (professionals.length > 0) {
                const service = SERVICE_CATEGORIES.find(s => s.id === selectedCategory);
                const serviceName = service ? service.name[currentLang] : '';
    
                const newMarkers = professionals.map(pro => {
                    const marker = L.marker([pro.lat, pro.lng]).addTo(mapRef.current);
                    marker.bindPopup(`
                        <div class="font-sans">
                            <h3 class="font-bold text-base text-amber-400 mb-1">${pro.name}</h3>
                            <p class="text-sm text-gray-200 mb-2">${serviceName}</p>
                            <p class="text-sm text-gray-300 flex items-center"><span class="mr-2">📍</span> ${pro.address || pro.serviceCities[0]}</p>
                            <p class="text-sm text-gray-300 flex items-center"><span class="mr-2">📞</span> ${pro.phone}</p>
                        </div>
                    `);
                    return marker;
                });
                markersRef.current = newMarkers;
    
                // Adjust map bounds to fit the professionals from the selected category
                const group = L.featureGroup(newMarkers);
                if (group.getBounds().isValid()){
                    mapRef.current.fitBounds(group.getBounds().pad(0.2));
                }
            }
            // Use a timeout to ensure the map container has been sized by the browser's layout engine.
            setTimeout(() => mapRef.current?.invalidateSize(), 100);
        }
    }, [professionals, currentLang, selectedCategory]);
    
    // Invalidate map size when sidebar content changes to prevent rendering issues.
    useEffect(() => {
        if(mapRef.current) {
            // Give the browser a moment to update the layout before telling Leaflet to resize.
            setTimeout(() => mapRef.current?.invalidateSize(), 100);
        }
    }, [nearbyPros]);

    const handleFindNearMe = () => {
        setIsLoading(true);
        setError(null);
        setNearbyPros([]);

        if (!mapRef.current) {
            setIsLoading(false);
            setError("Map not initialized.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const location = { lat: latitude, lng: longitude };
                setUserLocation(location);

                if (userMarkerRef.current) userMarkerRef.current.remove();
                
                const userIcon = L.divIcon({
                    html: `<div class="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/50"></div>`,
                    className: 'bg-transparent border-none',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                });

                userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(mapRef.current);
                mapRef.current.flyTo([latitude, longitude], 13);

                const prosWithDistance = professionals
                    .map(pro => ({
                        ...pro,
                        distance: haversineDistance(location, { lat: pro.lat, lng: pro.lng })
                    }))
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, 5);
                
                setNearbyPros(prosWithDistance);
                setIsLoading(false);
            },
            (err) => {
                setError(err.message);
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    if (!selectedCategory) {
        return (
            <div className="group mt-16 text-center bg-gray-900 border border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden map-placeholder-bg z-0">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                
                {/* Orbiting Icons */}
                <div className="absolute w-full h-full animate-orbit group-hover:[animation-play-state:paused]">
                    {SERVICE_CATEGORIES.map((category, index) => {
                        const Icon = category.icon;
                        const angle = index * (360 / SERVICE_CATEGORIES.length);
                        return (
                            <div
                                key={category.id}
                                className="absolute top-1/2 left-1/2 transition-transform duration-500 group-hover:scale-110"
                                style={{ transform: `rotate(${angle}deg) translate(clamp(7rem, 22vw, 12rem)) rotate(-${angle}deg)` }}
                            >
                                <div className="p-3 bg-gray-800/60 border border-gray-700/80 rounded-full shadow-lg">
                                    <Icon className="w-8 h-8 text-amber-400/60" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                 {/* Central Content */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="relative w-28 h-28 mb-6 flex items-center justify-center animate-pulse-glow rounded-full">
                        <MapPin className="relative w-24 h-24 text-amber-400 animate-bob" style={{ filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))' }}/>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                        {t('map_title')}
                    </h2>
                    <div className="flex items-center gap-2 text-lg text-gray-300 animate-pulse">
                        <ArrowUp className="w-5 h-5" />
                        <span>{t('map_select_category_prompt')}</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-16 relative z-0">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t('map_title')}</h2>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-6 min-h-[600px]">
                <div className="w-full md:w-1/3 flex flex-col">
                    <button
                        onClick={handleFindNearMe}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-amber-400 text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
                        {isLoading ? t('finding_location') : t('find_near_me')}
                    </button>
                    {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
                    
                    {nearbyPros.length > 0 && (
                        <div className="mt-4 flex-grow overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-2">{t('nearby_professionals')}</h3>
                            <ul className="space-y-3">
                                {nearbyPros.map(pro => (
                                    <li 
                                        key={pro.id} 
                                        className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                                        onClick={() => mapRef.current.flyTo([pro.lat, pro.lng], 15)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-white">{pro.name}</h4>
                                                <div className="flex items-center text-xs text-amber-400 mt-1">
                                                    {[...Array(Math.floor(pro.rating))].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                                    <span className="ml-1 text-gray-300">{pro.rating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-400 whitespace-nowrap">{t('distance_km').replace('{dist}', pro.distance.toFixed(1))}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                                            <Phone className="w-3 h-3" />
                                            <span>{pro.phone}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div ref={mapContainerRef} className="w-full min-h-[400px] md:h-auto md:w-2/3 rounded-lg flex-grow md:flex-grow-0" />
            </div>
        </div>
    );
};

export default MapSection;
