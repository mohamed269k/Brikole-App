import React from 'react';
import { Search } from './icons';

interface SearchBarProps {
  t: (key: string) => string;
  query: string;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ t, query, onSearchChange }) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <form className="relative flex flex-col sm:flex-row items-center gap-2" onSubmit={(e) => e.preventDefault()}>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="search"
            id="service-search"
            className="block w-full p-4 ps-12 text-md text-gray-100 border border-gray-600 rounded-lg bg-gray-800 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-400 transition-colors"
            placeholder={t('search_placeholder')}
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto text-gray-900 bg-amber-400 hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-amber-300 font-semibold rounded-lg text-md px-6 py-4 transition-colors duration-300"
        >
          {t('search_button')}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;