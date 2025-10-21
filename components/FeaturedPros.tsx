import React from 'react';
import { PROFESSIONALS, SERVICE_CATEGORIES } from '../constants';
import { Language } from '../types';
import ProCard from './ProCard';

interface FeaturedProsProps {
  t: (key: string) => string;
  currentLang: Language;
  selectedCategory: string | null;
  searchQuery: string;
}

const FeaturedPros: React.FC<FeaturedProsProps> = ({ t, currentLang, selectedCategory, searchQuery }) => {
  
  const lowercasedQuery = searchQuery.toLowerCase().trim();

  let filteredPros = PROFESSIONALS;

  // 1. Filter by the selected category, if one is active
  if (selectedCategory) {
    filteredPros = filteredPros.filter(pro => pro.serviceId === selectedCategory);
  }

  // 2. Then, filter by the search query, if there is one
  if (lowercasedQuery) {
    filteredPros = filteredPros.filter(pro => {
      const service = SERVICE_CATEGORIES.find(s => s.id === pro.serviceId)!;
      const serviceNameInCurrentLang = service.name[currentLang].toLowerCase();
      const proName = pro.name.toLowerCase();
      const proLocation = pro.location.toLowerCase();
      
      return proName.includes(lowercasedQuery) ||
             proLocation.includes(lowercasedQuery) ||
             serviceNameInCurrentLang.includes(lowercasedQuery);
    });
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t('find_a_pro')}</h2>
      
      {filteredPros.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPros.map((pro) => (
            <ProCard
              key={pro.id}
              pro={pro}
              t={t}
              currentLang={currentLang}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-12">
          <p className="text-lg">{t('no_pros_found')}</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedPros;