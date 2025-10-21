import React from 'react';
import { SERVICE_CATEGORIES } from '../constants';
import { Language } from '../types';
import CategoryCard from './CategoryCard';

interface ServiceGridProps {
  currentLang: Language;
  onSelectCategory: (id: string) => void;
  selectedCategory: string | null;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ currentLang, onSelectCategory, selectedCategory }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      {SERVICE_CATEGORIES.map((category) => (
        <CategoryCard 
          key={category.id}
          id={category.id}
          icon={category.icon}
          name={category.name[currentLang]}
          onClick={onSelectCategory}
          isActive={selectedCategory === category.id}
        />
      ))}
    </div>
  );
};

export default ServiceGrid;