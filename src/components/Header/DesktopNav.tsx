import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Info, ShoppingCart, Settings, Award, Newspaper, Mail, Tractor,
  ShoppingBasket, Package, Scale, CalendarCheck, RefreshCw, FileText
} from 'lucide-react';
import MarketplaceDropdown from './MarketplaceDropdown';
import ServicesDropdown from './ServicesDropdown';
import SearchBar from './SearchBar';

const DesktopNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex space-x-6">
        <Link
          to="/about"
          className={`flex items-center text-sm font-medium py-2 border-b-2 ${location.pathname === '/about'
            ? 'text-green-700 border-green-700'
            : 'text-gray-700 hover:text-green-700 border-transparent hover:border-gray-200'
            } transition-colors duration-200`}
        >
          <Info className="w-4 h-4 mr-1" />
          About
        </Link>

        <MarketplaceDropdown location={location} />
        <ServicesDropdown location={location} />

        <Link
          to="/ecoflare"
          className={`flex items-center text-sm font-medium py-2 border-b-2 ${location.pathname === '/ecoflare'
            ? 'text-green-700 border-green-700'
            : 'text-gray-700 hover:text-green-700 border-transparent hover:border-gray-200'
            } transition-colors duration-200`}
        >
          <Award className="w-4 h-4 mr-1" />
          Why EcoFlare
        </Link>
        <Link
          to="/blog"
          className={`flex items-center text-sm font-medium py-2 border-b-2 ${location.pathname === '/blog'
            ? 'text-green-700 border-green-700'
            : 'text-gray-700 hover:text-green-700 border-transparent hover:border-gray-200'
            } transition-colors duration-200`}
        >
          <Newspaper className="w-4 h-4 mr-1" />
          Blog
        </Link>
        <Link
          to="/contact"
          className={`flex items-center text-sm font-medium py-2 border-b-2 ${location.pathname === '/contact'
            ? 'text-green-700 border-green-700'
            : 'text-gray-700 hover:text-green-700 border-transparent hover:border-gray-200'
            } transition-colors duration-200`}
        >
          <Mail className="w-4 h-4 mr-1" />
          Contact
        </Link>
      </div>

      <div className="flex items-center justify-end space-x-6">
        <SearchBar />
        <Link
          to="/farmers"
          className="text-sm font-medium text-gray-700 hover:text-green-700 flex items-center"
        >
          <Tractor className="w-4 h-4 mr-1" />
          For Farmers
        </Link>
      </div>
    </nav>
  );
};

export default DesktopNav;