import React, { useEffect, useRef } from 'react';
import { Professional } from '../types';
import { X, MapPin, Phone, Star } from './icons';
import { SERVICE_CATEGORIES } from '../constants';

declare const L: any;

interface ProProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional | null;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-5 h-5 text-amber-400 fill-current" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-600" />
      ))}
      <span className="ml-2 text-md text-gray-300">{rating.toFixed(1)}</span>
    </div>
  );
};

const ProProfileModal: React.FC<ProProfileModalProps> = ({ isOpen, onClose, professional }) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && professional && mapContainerRef.current && !mapRef.current) {
      // Initialize map
      mapRef.current = L.map(mapContainerRef.current).setView([professional.lat, professional.lng], 15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(mapRef.current);
      L.marker([professional.lat, professional.lng]).addTo(mapRef.current);
    }

    // Cleanup on close
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen, professional]);
  
   // Invalidate map size after modal animation
  useEffect(() => {
    if (isOpen && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 300); // Should match modal transition duration
    }
  }, [isOpen]);


  if (!isOpen || !professional) return null;

  const service = SERVICE_CATEGORIES.find(s => s.id === professional.serviceId);
  // Defaulting to French as the main language for service names in profile
  const serviceName = service ? service.name['fr'] : 'Specialist';

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl shadow-black/30 w-full max-w-2xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s ease-out forwards' }}
      >
        <style>{`
          @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors z-20">
          <X className="w-6 h-6" />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-1">{professional.name}</h2>
                <p className="text-lg text-amber-400 mb-4">{serviceName}</p>
                <div className="mb-4">
                    <StarRating rating={professional.rating} />
                </div>
                
                <div className="space-y-3 text-gray-300">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                        <span>{professional.address || professional.serviceCities.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span>{professional.phone}</span>
                    </div>
                </div>

                <a 
                    href={`tel:${professional.phone.replace(/\s/g, '')}`} 
                    className="mt-6 w-full inline-block text-center bg-amber-400 text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-300"
                >
                    Call Now
                </a>
            </div>
            <div ref={mapContainerRef} className="w-full h-64 md:h-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProProfileModal;
