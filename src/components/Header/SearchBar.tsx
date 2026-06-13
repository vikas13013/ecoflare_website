import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC<{
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  handleSearch?: (e: React.FormEvent) => void;
  mobile?: boolean;
}> = ({ searchQuery = '', setSearchQuery = () => {}, handleSearch = (e) => e.preventDefault(), mobile = false }) => {
  return (
    <form onSubmit={handleSearch} className={`relative ${mobile ? 'w-full mb-2' : 'flex-1 max-w-xl'}`}>
      <input
        type="text"
        placeholder={mobile ? "Search..." : "Search products...."}
        className={`w-full border border-gray-300 rounded-full px-4 py-2 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all ${mobile ? '' : 'pr-12'}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      {!mobile && (
        <button
          type="submit"
          className="absolute right-3 top-2 text-sm font-medium text-green-700 hover:text-green-800"
          aria-label="Search"
        >
          Go
        </button>
      )}
    </form>
  );
};

export default SearchBar;