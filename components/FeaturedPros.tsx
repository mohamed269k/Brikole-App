import React, { useState, useEffect } from 'react';
import { SERVICE_CATEGORIES } from '../constants';
import { Language, Professional } from '../types';
import ProCard from './ProCard';
//- Fix: Renamed icon imports for consistency with icons.tsx
import { ChevronLeft, ChevronRight } from './icons';

interface FeaturedProsProps {
  t: (key: string) => string;
  currentLang: Language;
  professionals: Professional[];
  selectedCategory: string | null;
  selectedCity: string;
  searchQuery: string;
  onViewProfile: (pro: Professional) => void;
}

const PROS_PER_PAGE = 5;

const FeaturedPros: React.FC<FeaturedProsProps> = ({ t, currentLang, professionals, selectedCategory, selectedCity, searchQuery, onViewProfile }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const lowercasedQuery = searchQuery.toLowerCase().trim();
  let filteredPros = professionals;

  // 1. Filter by the selected city
  if (selectedCity !== 'All') {
    filteredPros = filteredPros.filter(pro => 
      pro.serviceCities.some(city => city.toLowerCase() === selectedCity.toLowerCase())
    );
  }

  // 2. Filter by the selected category
  if (selectedCategory) {
    filteredPros = filteredPros.filter(pro => pro.serviceId === selectedCategory);
  }

  // 3. Filter by search query
  if (lowercasedQuery) {
    filteredPros = filteredPros.filter(pro => {
      const service = SERVICE_CATEGORIES.find(s => s.id === pro.serviceId)!;
      const serviceNameInCurrentLang = service.name[currentLang].toLowerCase();
      const proName = pro.name.toLowerCase();
      const proCities = pro.serviceCities.join(' ').toLowerCase();
      const proAddress = pro.address.toLowerCase();
      
      return proName.includes(lowercasedQuery) ||
             proCities.includes(lowercasedQuery) ||
             proAddress.includes(lowercasedQuery) ||
             serviceNameInCurrentLang.includes(lowercasedQuery);
    });
  }

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCity, searchQuery]);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredPros.length / PROS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROS_PER_PAGE;
  const endIndex = startIndex + PROS_PER_PAGE;
  const currentPros = filteredPros.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resultsText = filteredPros.length === 1
    ? t('results_found_one')
    : t('results_found_other').replace('{count}', filteredPros.length.toString());

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{t('find_a_pro')}</h2>
        {searchQuery || selectedCategory || selectedCity !== 'All' ? (
          <p className="text-gray-400 mt-2">{resultsText}</p>
        ) : null}
      </div>
      
      {filteredPros.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {currentPros.map((pro) => (
              <ProCard
                key={pro.id}
                pro={pro}
                t={t}
                currentLang={currentLang}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center flex-wrap gap-2 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-800 hover:bg-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={t('previous')}
              >
                {/* //- Fix: Use renamed ChevronLeft component */}
                <ChevronLeft className="w-5 h-5" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-amber-400 text-gray-900'
                      : 'bg-gray-800 hover:bg-amber-400/20'
                  }`}
                   aria-label={`Go to page ${i + 1}`}
                   aria-current={currentPage === i + 1 ? 'page' : undefined}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-gray-800 hover:bg-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={t('next')}
              >
                {/* //- Fix: Use renamed ChevronRight component */}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-400 mt-12">
          <p className="text-lg">{t('no_pros_found')}</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedPros;
