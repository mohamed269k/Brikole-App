import React from 'react';

interface CategoryCardProps {
  id: string;
  icon: React.ElementType;
  name: string;
  onClick: (id: string) => void;
  isActive: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, icon: Icon, name, onClick, isActive }) => {
  const baseClasses = "group bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ease-in-out";
  const inactiveClasses = "hover:bg-amber-400/10 hover:border-amber-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10";
  const activeClasses = "bg-amber-400/20 border-amber-400 -translate-y-2 shadow-2xl shadow-amber-500/20 ring-2 ring-amber-400";
  
  return (
    <div 
      onClick={() => onClick(id)}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      role="button"
      aria-pressed={isActive}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(id)}
    >
      <div className={`mb-4 p-4 rounded-full transition-colors duration-300 ${isActive ? 'bg-amber-400' : 'bg-gray-700/50 group-hover:bg-amber-400'}`}>
        <Icon className={`w-8 h-8 transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-amber-400 group-hover:text-gray-900'}`} />
      </div>
      <h3 className="font-semibold text-white text-md">{name}</h3>
    </div>
  );
};

export default CategoryCard;