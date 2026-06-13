import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  DollarSign, Handshake, Truck, FileText, Users,
  ShoppingBasket, CalendarCheck, RefreshCw, Award,
  Newspaper, Mail, Info
} from 'lucide-react';
import { FiUser } from 'react-icons/fi';
import LanguageToggle from '../LanguageToggle';

const MobileMenu: React.FC<{
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  setShowLoginModal: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  selectedCurrency: 'CAD' | 'EUR' | 'GBP';
  setSelectedCurrency: (currency: 'CAD' | 'EUR' | 'GBP') => void;
}> = ({
  isMenuOpen,
  setIsMenuOpen,
  setShowLoginModal,
  searchQuery,
  setSearchQuery,
  handleSearch,
  selectedCurrency,
  setSelectedCurrency
}) => {
  const [mobileMarketOpen, setMobileMarketOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const currencies = ['CAD', 'EUR', 'GBP'] as const;

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden bg-white shadow-lg rounded-b-lg px-4 pb-4 pt-2 space-y-2 border-t border-gray-100">
      <form onSubmit={handleSearch} className="relative mb-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      </form>

      <Link
        to="/about"
        className="block py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors flex items-center"
        onClick={() => setIsMenuOpen(false)}
      >
        <Info className="w-4 h-4 mr-2" />
        About
      </Link>

      {/* Mobile Marketplace section */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => setMobileMarketOpen(o => !o)}
          className="w-full flex justify-between items-center py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span className="flex items-center">
            <ShoppingBasket className="w-4 h-4 mr-2" />
            Marketplace
          </span>
          {mobileMarketOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {mobileMarketOpen && (
          <div className="pl-4 space-y-2 py-2">
            <Link
              to="/buyer"
              className="block py-2 px-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <DollarSign className="w-4 h-4 mr-2 text-green-600" />
              For Buyers
            </Link>
            <Link
              to="/seller"
              className="block py-2 px-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Handshake className="w-4 h-4 mr-2 text-green-600" />
              For Sellers
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Services section */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => setMobileServicesOpen(o => !o)}
          className="w-full flex justify-between items-center py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span className="flex items-center">
            <CalendarCheck className="w-4 h-4 mr-2" />
            Our Services
          </span>
          {mobileServicesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {mobileServicesOpen && (
          <div className="pl-4 space-y-2 py-2">
            <Link
              to="/services/pre-order"
              className="block py-2 px-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBasket className="w-4 h-4 mr-2 text-green-600" />
              Pre-Order Produce
            </Link>
            <Link
              to="/services/flexible-buying"
              className="block py-2 px-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Truck className="w-4 h-4 mr-2 text-green-600" />
              Flexible Buying
            </Link>
            <Link
              to="/services/smart-contracts"
              className="block py-2 px-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="w-4 h-4 mr-2 text-green-600" />
              Smart Contracts
            </Link>
          </div>
        )}
      </div>

      <Link
        to="/ecoflare"
        className="block py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 flex items-center"
        onClick={() => setIsMenuOpen(false)}
      >
        <Award className="w-4 h-4 mr-2" />
        Why EcoFlare
      </Link>
      <Link
        to="/blog"
        className="block py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 flex items-center"
        onClick={() => setIsMenuOpen(false)}
      >
        <Newspaper className="w-4 h-4 mr-2" />
        Blog
      </Link>
      <Link
        to="/contact"
        className="block py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 flex items-center"
        onClick={() => setIsMenuOpen(false)}
      >
        <Mail className="w-4 h-4 mr-2" />
        Contact
      </Link>
      <Link
        to="/farmers"
        className="block py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors flex items-center"
        onClick={() => setIsMenuOpen(false)}
      >
        <Users className="w-4 h-4 mr-2" />
        For Farmers
      </Link>

      <div className="pt-2">
        <button
          onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-lg flex items-center justify-center font-medium transition-colors shadow-sm"
        >
          <FiUser className="mr-2" /> Login / Register
        </button>
      </div>

      <div className="flex justify-between items-center pt-4 text-sm text-gray-500">
        <LanguageToggle mobile />
        <div className="flex items-center">
          <span className="mr-2">Currency:</span>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as 'CAD' | 'EUR' | 'GBP')}
            className="bg-transparent border-none focus:ring-0 focus:outline-none"
          >
            {currencies.map(cur => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;