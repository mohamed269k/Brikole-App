import React from 'react';
import { ChevronDown } from './icons';

interface CityFilterProps {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  t: (key: string) => string;
}

const CityFilter: React.FC<CityFilterProps> = ({ cities, selectedCity, onCityChange, t }) => {
  return (
    <div className="relative w-full max-w-xs mx-auto">
      <label htmlFor="city-filter" className="sr-only">{t('filter_by_city')}</label>
      <select
        id="city-filter"
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="block w-full appearance-none bg-gray-800 border border-gray-600 text-white py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-700 focus:border-amber-500"
      >
        {cities.map(city => (
          <option key={city} value={city}>
            {city === 'All' ? t('all_cities') : city}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <ChevronDown className="w-5 h-5" />
      </div>
    </div>
  );
};

export default CityFilter;
