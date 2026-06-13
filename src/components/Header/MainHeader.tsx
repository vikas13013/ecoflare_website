import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/mainlogo.png';
import DesktopNav from './DesktopNav';
import SearchBar from './SearchBar';
import { FiUser, FiMenu, X } from 'react-icons/fi';

const MainHeader: React.FC<{
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  setShowLoginModal: (show: boolean) => void;
}> = ({ isMenuOpen, setIsMenuOpen, setShowLoginModal }) => {
  return (
    <div className="max-full mx-auto px-2 py-2 sm:px-2 lg:px-2">
      <div className="flex justify-between items-center md:py-0">
        <Link to="/" className="flex-shrink-0" aria-label="EcoFlare Home">
          <img src={logo} alt="EcoFlare Logo" className="w-24 md:w-28 hover:opacity-90 transition-opacity" />
        </Link>

        <div className="hidden md:flex flex-1 items-center flex-col gap-3 justify-between ml-10">
          <DesktopNav />
        </div>

        <div className="flex items-center md:hidden space-x-4">
          <button
            onClick={() => setShowLoginModal(true)}
            className="p-2 text-gray-700 hover:text-green-700"
            aria-label="Login"
          >
            <FiUser size={20} />
          </button>
          <button
            onClick={() => setIsMenuOpen(o => !o)}
            className="p-2 text-gray-700 hover:text-green-700"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;