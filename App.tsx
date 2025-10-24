import React, { useState, useEffect, useMemo } from 'react';
import { Language } from './types';
import { TRANSLATIONS, SERVICE_CATEGORIES, PROFESSIONALS } from './constants';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ServiceGrid from './components/ServiceGrid';
import Footer from './components/Footer';
import FeaturedPros from './components/FeaturedPros';
import CityFilter from './components/CityFilter';
import MapSection from './components/MapSection';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('fr');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  const t = (key: string) => TRANSLATIONS[language][key] || key;

  const cities = ['All', 'Casablanca', 'Rabat', 'Salé', 'Marrakech', 'Agadir', 'Tanger'];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    const lowercasedQuery = query.toLowerCase().trim();
    // Check if the search query matches a category to auto-select it
    if (lowercasedQuery.length > 2) { // Threshold to prevent matching too early
      const matchedCategory = SERVICE_CATEGORIES.find(cat => 
        Object.values(cat.name).some((name: string) => name.toLowerCase().includes(lowercasedQuery))
      );

      if (matchedCategory) {
        setSelectedCategory(matchedCategory.id);
      }
    }
  };

  const professionalsForMap = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }
    return PROFESSIONALS.filter(pro => pro.serviceId === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="bg-[#1a1a1a] text-gray-100 min-h-screen flex flex-col">
      <Header currentLang={language} setLang={setLanguage} t={t} />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-amber-400" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {t('main_heading')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            {t('sub_heading')}
          </p>
          <SearchBar t={t} query={searchQuery} onSearchChange={handleSearchChange} />
        </div>
        
        <div className="mt-8 flex justify-center">
            <CityFilter 
                cities={cities}
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
                t={t}
            />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t('our_services')}</h2>
          <ServiceGrid 
            currentLang={language} 
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </div>

        <MapSection 
          t={t}
          currentLang={language}
          professionals={professionalsForMap}
          selectedCategory={selectedCategory}
        />

        <FeaturedPros 
          t={t} 
          currentLang={language} 
          selectedCategory={selectedCategory} 
          selectedCity={selectedCity}
          searchQuery={searchQuery}
        />
      </main>
      
      <Footer t={t} />
    </div>
  );
};

export default App;