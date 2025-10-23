import React from 'react';
import { Professional, Language } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import { MapPin, Star, Phone } from './icons';

interface ProCardProps {
  pro: Professional;
  t: (key: string) => string;
  currentLang: Language;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 text-amber-400 fill-current" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-600" />
      ))}
      <span className="ml-2 text-sm text-gray-300">{rating.toFixed(1)}</span>
    </div>
  );
};


const ProCard: React.FC<ProCardProps> = ({ pro, t, currentLang }) => {
  const service = SERVICE_CATEGORIES.find(s => s.id === pro.serviceId);
  const serviceName = service ? service.name[currentLang] : 'Specialist';

  const primaryCity = pro.serviceCities[0] || '';
  const locationString = [pro.address, primaryCity].filter(Boolean).join(', ');

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col">
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-white mb-1">{pro.name}</h3>
        <p className="text-amber-400 text-sm mb-3">{serviceName}</p>
        <div className="flex justify-center items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">{locationString}</span>
        </div>
        <div className="flex justify-center items-center gap-2 mb-3">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">{pro.phone}</span>
        </div>
        <div className="flex justify-center mb-4">
          <StarRating rating={pro.rating} />
        </div>
      </div>
      <button className="mt-auto w-full bg-amber-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-300">
        {t('view_profile')}
      </button>
    </div>
  );
};

export default ProCard;