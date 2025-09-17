
import React from 'react';
import { Icon } from './Icon';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, placeholder = "Buscar posts..." }) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-brand-gray border-2 border-brand-light-gray/30 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Icon name="search" className="h-6 w-6 text-gray-500" />
      </div>
    </div>
  );
};

export default SearchBar;