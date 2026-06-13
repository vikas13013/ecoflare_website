import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

// Import Images
import logo from "../assets/images/mainlogo.png";
import profilePic from "../assets/images/buyer/profile.png";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import CartWishlistCount from "./CartWishlistCount";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import LogoutButton from "./LogoutButton";
import { getUserProfile } from "../features/auth/authThunk";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import LoginOrProfileLink from "../pages/profileDashboard/LoginOrProfileLink";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { t } = useTranslation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const { userprofile: userData, loading } = useSelector(
    (state: RootState) => state.auth,
  );


  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest("#profile-menu")) {
        setOpenDropdown(false);
      }

      // Close marketplace dropdown when clicking outside
      // if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      //   setIsMarketplaceOpen(false);
      // }

      // Close mobile menu when clicking outside
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest(".mobile-menu-toggle")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
  };

  const isLoggedIn = user && Object.keys(user).length > 0;
  // const isVerifiedSeller = user?.is_verified_seller === true;
  const isVerifiedSeller = user?.roles === "Seller";
  const isBulkBuyer = user?.roles === "BulkBuyer";
  let dashboardPath = "/userdashboard"; // default

  if (isVerifiedSeller) {
    dashboardPath = "/profiledashboard";
  } else if (isBulkBuyer) {
    dashboardPath = "/profiledashboard";
  } else {
    dashboardPath = "/userdashboard";
  }

  return (
    <nav className="bg-white shadow-md w-full px-4 py-2 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full mx-auto">
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center">
          <button
            className="mobile-menu-toggle md:hidden mr-2"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-12 md:h-16 cursor-pointer"
            />
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        {/* <div className="hidden md:flex flex-1 justify-center px-4">
          <form onSubmit={handleSearch} className="relative w-1/3 max-w-xl">
            <input
              type="text"
              placeholder={t("search_products")}
              className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-3 top-2 text-sm font-medium text-green-700 hover:text-green-800"
              aria-label="Search"
            >
              {t("go")}
            </button>
          </form>
        </div> */}

        {/* Right: Desktop Icons & Profile */}
        <div className="flex items-center space-x-4">
          {/* Marketplace dropdown - Desktop only → Only for Buyer or BulkBuyer */}
          {(user?.roles === "Buyer" ||
            user?.roles?.toLowerCase() === "bulkbuyer") && (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => {
                  navigate("/marketplace");
                }}
                className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location.pathname.startsWith("/marketplace") ||
                  location.pathname.startsWith("/buyer") ||
                  location.pathname.startsWith("/seller")
                    ? "bg-green-50 text-green-700 shadow-sm ring-1 ring-green-200"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t("marketplace")}
              </button>
            </div>
          )}

          {/* Seller Navigation Links - Only show for verified sellers */}
          {isVerifiedSeller && (
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/seller/add-product"
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location.pathname === "/seller/add-product"
                    ? "bg-green-50 text-green-700 shadow-sm ring-1 ring-green-200"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {t("Listing")}
              </Link>
              <Link
                to="/seller/orders"
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location.pathname === "/seller/orders"
                    ? "bg-green-50 text-green-700 shadow-sm ring-1 ring-green-200"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {t("Orders")}
              </Link>
              <Link
                to="/seller/requests"
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location.pathname === "/seller/requests"
                    ? "bg-green-50 text-green-700 shadow-sm ring-1 ring-green-200"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {t("Requests")}
              </Link>
              <Link
                to="/transactions"
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location.pathname === "/seller/analytics"
                    ? "bg-green-50 text-green-700 shadow-sm ring-1 ring-green-200"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {t("Transactions")}
              </Link>
            </div>
          )}

          {/* Notification Icons */}
          <div className="flex items-center space-x-4">
            {location.pathname !== "/dashboard/buyer" &&
              (user?.roles === "Buyer" ||
                user?.roles?.toLowerCase() === "bulkbuyer") && (
                <CartWishlistCount variant="desktop" />
              )}

            {/* Profile Dropdown */}
            <div className="relative" id="profile-menu">
              <div
                className="flex items-center cursor-pointer p-1 rounded-full hover:ring-2 hover:ring-green-100 transition-all duration-200"
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                {userData?.profile_picture ? (
                <img
                  src={userData?.profile_picture}
                  alt="User"
                  onError={(e) => {
                    e.currentTarget.src = profilePic;
                  }}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                ) : (
                  <User className="w-8 h-8 md:w-10 md:h-10 text-gray-400 rounded-full bg-gray-100 p-1" />
                )}
                <ChevronDown className="w-3 h-3 ml-1 text-gray-500" />
              </div>

              {/* Profile dropdown menu */}
              {openDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                  <Link
                    to={dashboardPath}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors duration-150"
                    onClick={() => setOpenDropdown(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t("profile")}
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                

                  
                  <div
                    onClick={() => {
                      setOpenDropdown(false);
                    }}
                    className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[9999] md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2">
            <img src={logo} alt="Logo" className="h-10" />
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Seller Navigation Links in Mobile Menu - Only show for verified sellers */}
          {isVerifiedSeller && (
            <div className="mb-4">
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">
                {t("seller")}
              </h3>
              <Link
                to="/seller/add-product"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("add_product")}
              </Link>
              <Link
                to="/seller/orders"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("orders")}
              </Link>
              <Link
                to="/seller/requests"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("request")}
              </Link>
              <Link
                to="/transactions"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("transactions")}
              </Link>
            </div>
          )}

          {/* Mobile Menu Links */}
          <div className="space-y-2">
            {/* Marketplace Section in Mobile Menu → Only for Buyer or BulkBuyer */}
            {(user?.roles === "Buyer" ||
              user?.roles?.toLowerCase() === "bulkbuyer") && (
              <div className="mb-4">
                <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">
                  {t("marketplace")}
                </h3>
                <Link
                  to="/marketplace"
                  className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("marketplace")}
                </Link>
              </div>
            )}

            <div className="mb-4">
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">
                {t("account")}
              </h3>
              <Link
                to={dashboardPath}
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("profile")}
              </Link>
              {location.pathname !== "/dashboard/buyer" &&
                (user?.roles === "Buyer" ||
                  user?.roles?.toLowerCase() === "bulkbuyer") && (
                  <CartWishlistCount
                    variant="mobile"
                    t={t}
                    setMobileMenuOpen={setMobileMenuOpen}
                  />
                )}
            </div>

            {/* <div className="mb-4">
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">
                {t("settings")}
              </h3>

            </div> */}

            {/* <div className="pt-4 border-t">
              <Link
                to="/logout"
                className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-4" />
                {t("logout")}
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
