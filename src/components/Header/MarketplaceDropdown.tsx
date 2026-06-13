import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { ShoppingBasket, Package, Scale } from 'lucide-react';

const MarketplaceDropdown: React.FC<{ location: any }> = ({ location }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative group" ref={dropdownRef}>
      <Link
        to="/buyer"
        className={`inline-flex items-center text-sm font-medium py-2 border-b-2 ${location.pathname.startsWith('/marketplace') ||
          location.pathname.startsWith('/buyer') ||
          location.pathname.startsWith('/seller')
          ? 'text-green-700 border-green-700'
          : 'text-gray-700 hover:text-green-700 border-transparent hover:border-gray-200'
          } transition-colors duration-200`}
      >
        <ShoppingCart className="w-4 h-4 mr-1" />
        Marketplace
        <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform" />
      </Link>
      
      <div className="absolute top-full left-[80%] transform -translate-x-1/2 mt-2 w-screen max-w-3xl bg-white rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 border border-gray-200 overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/buyer"
            className="group flex flex-col items-start hover:bg-green-50 p-5 rounded-lg transition-all duration-200 border border-transparent hover:border-green-100"
          >
            <div className="flex items-start mb-4">
              <div className="bg-green-600/10 p-3 rounded-lg mr-4">
                <ShoppingBasket className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-800 group-hover:text-green-700">For Buyers</h4>
                <p className="mt-2 text-gray-600">
                  Access farm-fresh produce with transparent pricing, quality assurance, and flexible purchasing options.
                </p>
                <div className="mt-4 inline-flex items-center text-green-600 group-hover:text-green-700 font-medium">
                  Explore marketplace
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/seller"
            className="group flex flex-col items-start hover:bg-green-50 p-5 rounded-lg transition-all duration-200 border border-transparent hover:border-green-100"
          >
            <div className="flex items-start mb-4">
              <div className="bg-green-600/10 p-3 rounded-lg mr-4">
                <Package className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-800 group-hover:text-green-700">For Farmers & Sellers</h4>
                <p className="mt-2 text-gray-600">
                  Connect directly with buyers, get fair prices, and expand your market reach with our nationwide network.
                </p>
                <div className="mt-4 inline-flex items-center text-green-600 group-hover:text-green-700 font-medium">
                  Start selling today
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Scale className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm text-gray-700">Transparent pricing • Quality assurance • Secure transactions</span>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-medium text-green-700 hover:text-green-800 inline-flex items-center px-4 py-2 hover:bg-green-100 rounded-lg transition-colors"
          >
            View full marketplace
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceDropdown;