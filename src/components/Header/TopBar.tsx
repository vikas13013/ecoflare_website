import React from 'react';
import { Mail, Headset, Banknote, ArrowRight } from 'lucide-react';
import { FiUser } from 'react-icons/fi';
import LanguageToggle from '../LanguageToggle';
import CurrencySelector from './CurrencySelector';

const TopBar: React.FC<{
  setShowLoginModal: (show: boolean) => void;
}> = ({ setShowLoginModal }) => {
  return (
    <div className="hidden md:flex justify-between items-center py-1 px-2 sm:px-2 lg:px-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
      <div className="flex items-center space-x-6">
        <a href="tel:18005551234" className="flex items-center text-gray-700 hover:text-green-600 transition-colors group">
          <div className="p-1.5 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors mr-2">
            <Headset className="w-4 h-4 text-green-700" />
          </div>
          <span className="font-medium">1-800-555-1234</span>
        </a>
        <a href="mailto:support@ecoflare.com" className="flex items-center text-gray-700 hover:text-green-600 transition-colors group">
          <div className="p-1.5 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors mr-2">
            <Mail className="w-4 h-4 text-green-700" />
          </div>
          <span className="font-medium">support@ecoflare.com</span>
        </a>
      </div>

      <div className="flex items-center gap-6">
        <LanguageToggle />
        <CurrencySelector />
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center text-white px-5 py-2 rounded-full text-sm transition-all duration-200 shadow-md hover:shadow-lg group"
          aria-label="Login"
        >
          <div className="p-1 mr-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
            <FiUser size={14} className="text-white" />
          </div>
          <span className="font-medium">Login / Register</span>
          <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;