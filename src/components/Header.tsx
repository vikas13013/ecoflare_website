import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Headset, X, ChevronDown, ChevronUp, UserRound, BadgeInfo, PhoneCall } from 'lucide-react';
import { ShoppingBasket, Package, Scale } from 'lucide-react';
import { FiUser, FiMenu } from 'react-icons/fi';
import { DollarSign, Handshake, Truck, FileText, Users } from 'lucide-react';
import { Banknote, Check, ArrowRight } from "lucide-react";
import pricewise from "../assets/images/flogo.jpg";
import { UserPlus, Store, User } from "lucide-react";




import {
  Mail,
  Info,
  ShoppingCart,
  Settings,
  CalendarCheck,
  RefreshCw,
  Award,
  Newspaper,
  Tractor
} from "lucide-react";

import logo from '../assets/images/mainlogo.png';
import LanguageToggle from './LanguageToggle';
import LoginOrProfileLink from '../pages/profileDashboard/LoginOrProfileLink';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileMarketOpen, setMobileMarketOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  // console.log("userheader:", user);





  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close Marketplace dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsMarketplaceOpen(false);
      }

      // Close Services dropdown
      if (servicesRef.current && !servicesRef.current.contains(target)) {
        setIsServicesOpen(false);
      }

      // Close Currency dropdown
      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setCurrencyDropdown(false);
      }

      // Close Register dropdown
      if (registerRef.current && !registerRef.current.contains(target)) {
        setIsRegisterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      // You would typically navigate to search results page here
    }
  };

  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const headerRef = useRef(null);

  const SCROLL_HIDE_THRESHOLD = 50;
  const TRIGGER_SCROLL_Y = 205;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > TRIGGER_SCROLL_Y) {
        // Hide header only if user scrolled down by more than threshold
        if (currentScrollY > lastScrollY + SCROLL_HIDE_THRESHOLD) {
          setIsVisible(false);
        }
        // Show immediately when scrolling up
        else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
      } else {
        // Always show if not past trigger
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const { t } = useTranslation();


  return (
    <header
      ref={headerRef}
      className={`w-full bg-white z-50 transition-transform duration-300 ${window.scrollY > 0
        ? `fixed top-0 left-0 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`
        : ''
        }`}

    >
      <header className={`bg-white sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        {/* Top Bar */}
        {/* <div className="hidden md:flex justify-between items-center py-1 px-5 sm:px-2 lg:px-5 text-sm bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            
          </div>

     
        </div> */}

        {/* Main Header */}

        <div className="max-w-full mx-auto px-2 py-2 sm:px-2 lg:px-2">
          <div className="flex justify-between items-center md:py-0">
            {/* Logo - Left */}
            <Link to="/" className="flex-shrink-0" aria-label="EcoFlare Home">
              <img src={logo} alt="EcoFlare Logo" className="w-24 md:w-28 hover:opacity-90 transition-opacity" />
            </Link>

            {/* Navigation Links - Centered */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <nav className="flex items-center space-x-6">
                <div className="flex space-x-6">
                  {/* why eco flare */}
                  <Link
                    to="/pricewise"
                    className={`flex items-center text-sm text-black font-medium py-2 border-b-2 relative group ${location.pathname === '/pricewise'
                      ? 'text-white border-transparent'
                      : ' border-transparent hover:font-bold hover:text-white'
                      } transition-colors duration-200`}
                  >
                    {/* Permanent highlight background */}
                    <span className={`absolute inset-0 rounded-full text-black shadow-md ${location.pathname === '/pricewise'
                      ? 'bg-gradient-to-r from-green-800 to-primary text-white shadow-md'
                      : 'group-hover:bg-secondary group-hover:text-white group-hover:shadow-md '} 
              transition-all duration-300 -z-10 -mx-2 px-2`}></span>

                    {/* Logo instead of icon */}
                    <span className={`w-5 h-5 mr-1 rounded-full overflow-hidden shadow-xl`}>
                      <img src={pricewise} alt=" w-5 h-5 mr-1 rounded-full shadow-5xl" />
                    </span>

                    {t("pricewise")}
                  </Link>

                  <Link
                    to="/about"
                    className={`flex items-center text-sm font-medium py-2 border-b-2 ${location.pathname === '/about'
                      ? 'text-green-700 border-green-700'
                      : 'text-gray-700 hover:text-green-700 border-transparent hover:border-gray-200'
                      } transition-colors duration-200`}
                  >
                    <BadgeInfo className="w-4 h-4 mr-1" />
                    {t("about")}
                  </Link>

                  {/* Services dropdown */}
                  <div className="relative" ref={servicesRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsServicesOpen(!isServicesOpen);
                        setIsMarketplaceOpen(false); // Close other dropdown when opening this one
                      }}
                      className={`inline-flex items-center text-sm font-medium py-2 border-b-2 ${location.pathname.startsWith('/services')
                        ? 'text-green-700 border-green-700'
                        : 'text-gray-700 hover:text-green-700 border-transparent hover:border-gray-200'
                        } transition-colors duration-200`}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      {t("our_solutions")}
                      <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''
                        }`} />
                    </button>

                    {/* dropdown panel */}
                    {isServicesOpen && (
                      <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                        <div className="py-2">
                          <Link
                            to={'/preorderproduce'}
                            onClick={() => setIsServicesOpen(false)}
                            className="flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-green-700 transition-colors"
                          >
                            <CalendarCheck className="w-4 h-4 mr-3 text-green-600" />
                            <span>{t("pre_order_produce")}</span>
                          </Link>
                          <Link
                            to={'/flexiblebuying'}
                            onClick={() => setIsServicesOpen(false)}
                            className="flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-green-700 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4 mr-3 text-green-600" />
                            <span>{t("flexible_buying")}</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Marketplace with mega-dropdown → Only for Buyer or BulkBuyer */}
                  {user?.roles?.toLowerCase() !== "seller" && (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMarketplaceOpen(!isMarketplaceOpen);
                          setIsServicesOpen(false); // Close other dropdown when opening this one
                        }}
                        className={`inline-flex items-center text-sm font-medium py-2 border-b-2 ${location.pathname.startsWith("/marketplace") ||
                          location.pathname.startsWith("/buyer") ||
                          location.pathname.startsWith("/seller")
                          ? "text-green-700 border-green-700"
                          : "text-gray-700 hover:text-green-700 border-transparent hover:border-gray-200"
                          } transition-colors duration-200`}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {t("marketplace")}
                        <ChevronDown
                          className={`ml-1 w-4 h-4 transition-transform ${isMarketplaceOpen ? "rotate-180" : ""
                            }`}
                        />
                      </button>

                      {/* dropdown panel */}
                      {isMarketplaceOpen && (
                        <div className="absolute top-full -left-20 transform -translate-x-1/2 mt-2 w-screen max-w-3xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-0">
                            {/* Buyers */}
                            <Link
                              to="/buyer"
                              onClick={() => setIsMarketplaceOpen(false)}
                              className="group flex flex-col items-start hover:bg-green-50 p-5 rounded-lg transition-all duration-200 border border-transparent hover:border-green-100"
                            >
                              <div className="flex items-start mb-4">
                                <div className="bg-green-600/10 p-3 rounded-lg mr-4">
                                  <ShoppingBasket className="w-6 h-6 text-green-700" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg text-gray-800 group-hover:text-green-700">
                                    {t("for_buyers")}
                                  </h4>
                                  <p className="mt-2 text-sm text-gray-600">
                                    {t(
                                      "get_farm_fresh_produce_with_transparent_pricing_and_flexible_options"
                                    )}
                                  </p>
                                  <div className="mt-4 inline-flex items-center text-green-600 group-hover:text-green-700 font-medium">
                                    {t("explore_marketplace")}
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </div>
                              </div>
                            </Link>

                            {/* Sellers */}
                            <Link
                              to="/seller"
                              onClick={() => setIsMarketplaceOpen(false)}
                              className="group flex flex-col items-start hover:bg-green-50 p-5 rounded-lg transition-all duration-200 border border-transparent hover:border-green-100"
                            >
                              <div className="flex items-start mb-4">
                                <div className="bg-green-600/10 p-3 rounded-lg mr-4">
                                  <Package className="w-6 h-6 text-green-700" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg text-gray-800 group-hover:text-green-700">
                                    {t("for_farmers_and_sellers")}
                                  </h4>
                                  <p className="mt-2 text-sm text-gray-600">
                                    {t(
                                      "sell_directly_to_buyers_earn_fair_prices_and_grow_with_our_wide_network"
                                    )}
                                  </p>
                                  <div className="mt-4 inline-flex items-center text-green-600 group-hover:text-green-700 font-medium">
                                    {t("start_selling_today")}
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>

                          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                            <div className="flex items-center">
                              <Scale className="w-5 h-5 text-green-600 mr-2" />
                              <span className="text-sm text-gray-700">
                                {t(
                                  "trasparent_pricing_quality_assurance_secure_transactions"
                                )}
                              </span>
                            </div>
                            <Link
                              to="/marketplace"
                              onClick={() => setIsMarketplaceOpen(false)}
                              className="text-sm font-medium text-green-700 hover:text-green-800 inline-flex items-center px-4 py-2 hover:bg-green-100 rounded-lg transition-colors"
                            >
                              {t("view_full_marketplace")}
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Link
                    to="/blog"
                    className={`flex items-center text-sm font-medium py-2 border-b-2 ${location.pathname === '/blog'
                      ? 'text-green-700 border-green-700'
                      : 'text-gray-700 hover:text-green-700 border-transparent hover:border-gray-200'
                      } transition-colors duration-200`}
                  >
                    <Newspaper className="w-4 h-4 mr-1" />
                    {t("blog")}
                  </Link>

                  <Link
                    to="/contact"
                    className={`flex items-center text-sm font-medium py-2 border-b-2 ${location.pathname === '/contact'
                      ? 'text-green-700 border-green-700'
                      : 'text-gray-700 hover:text-green-700 border-transparent hover:border-gray-200'
                      } transition-colors duration-200`}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    {t("contact")}
                  </Link>
                </div>
              </nav>
            </div>

            {/* Right side items (Language toggle and Login/Profile) */}
            <div className="hidden md:flex items-center gap-6">
              <LanguageToggle />
              <LoginOrProfileLink />
            </div>

            {/* Mobile buttons - Right (visible on mobile) */}
            <div className="flex items-center md:hidden space-x-4">
                            <LanguageToggle />

              <button
                onClick={() => setIsMenuOpen(o => !o)}
                className="p-2 text-gray-700 hover:text-green-700"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search (visible only on mobile) */}
          {/* <div className="md:hidden mt-3">
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
    </form>
  </div> */}
        </div>


        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden bg-white shadow-lg rounded-b-lg px-4 pb-4 pt-2 space-y-2 border-t border-gray-100 
               max-h-[80vh] overflow-y-auto"   // 👈 yeh line add kari hai
            ref={dropdownRef}
          >
                                      <LoginOrProfileLink />

            <Link
              to="/pricewise"
              onClick={() => setIsMenuOpen(false)}
              className={`relative flex items-center text-sm font-medium py-2 px-3 rounded-lg z-10 overflow-hidden ${location.pathname === '/pricewise'
                ? 'text-white font-bold'
                : 'text-gray-800 hover:text-white'
                }`}
            >
              {/* Background highlight */}
              <span
                className={`absolute inset-0 -z-10 rounded-full transition-all duration-300 ${location.pathname === '/pricewise'
                  ? 'bg-gradient-to-r from-green-800 to-primary'
                  : 'group-hover:bg-secondary'
                  }`}
              ></span>

              {/* Icon */}
              <span className="w-5 h-5 mr-2 rounded-full overflow-hidden shadow-lg shrink-0">
                <img src={pricewise} alt="Pricewise Icon" className="w-full h-full object-cover" />
              </span>

              {t("pricewise")}
            </Link>
            <Link
              to="/about"
              className="block py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("about")}
            </Link>
            {/* Mobile Marketplace section → Only for Buyer or BulkBuyer */}
            {/* {(user?.roles === "Buyer" || user?.roles?.toLowerCase() === "bulkbuyer") && ( */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setMobileMarketOpen(o => !o)}
                className="w-full flex justify-between items-center py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span>{t("marketplace")}</span>
                {mobileMarketOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {mobileMarketOpen && (
                <div className="pl-4 space-y-2 py-2">
                  <Link
                    to="/buyer"
                    className="block py-2 px-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBasket className="w-4 h-4 mr-2 text-green-600" />
                    {t("for_buyers")}
                  </Link>

                  <Link
                    to="/seller"
                    className="block py-2 px-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package className="w-4 h-4 mr-2 text-green-600" />
                    {t("for_sellers")}
                  </Link>

                  <Link
                    to="/marketplace"
                    className="block py-2 px-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ArrowRight className="w-4 h-4 mr-2 text-green-600" />
                    {t("view_full_marketplace")}
                  </Link>
                </div>
              )}
            </div>
            {/* )} */}
            {/* Mobile Services section */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setMobileServicesOpen(o => !o)}
                className="w-full flex justify-between items-center py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span>{t("our_solutions")}</span>
                {mobileServicesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {mobileServicesOpen && (
                <div className="pl-4 space-y-2 py-2">
                  <Link
                    to="/preorderproduce"
                    className="block py-2 px-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBasket className="w-4 h-4 mr-2 text-green-600" />
                    {t("pre_order_produce")}
                  </Link>
                  <Link
                    to="/flexiblebuying"
                    className="block py-2 px-2 text-gray-600 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Truck className="w-4 h-4 mr-2 text-green-600" />
                    {t("flexible_buying")}
                  </Link>


                </div>
              )}
            </div>
            <Link
              to="/blog"
              className="block py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("blog")}
            </Link>
            <Link
              to="/contact"
              className="block py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("contact")}
            </Link>

          </div>
        )}

      </header>
    </header>
  );
};

export default Header;