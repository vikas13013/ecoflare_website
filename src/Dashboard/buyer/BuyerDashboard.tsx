import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiSearch, FiPackage, FiChevronRight, FiMessageSquare, FiUser, FiCalendar, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { getUserProfile } from '../../features/auth/authThunk';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import BuyerAnalyticsDashboard from "./BuyerAnalyticsDashboard";

// Fallback image import
import fallbackProfileImg from "../../assets/images/buyer/manish.png";

const BuyerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userprofile: userData, loading } = useSelector((state: RootState) => state.auth);
  const [profileImgError, setProfileImgError] = useState(false);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Format phone number
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "N/A";
    if (phone.length === 10) {
      return `${phone.slice(0, 5)} ${phone.slice(5)}`;
    }
    return phone;
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!userData) return "BB";
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'BB';
  };

  // Get account age
  const getAccountAge = () => {
    if (!userData?.created_at) return "New Member";
    
    const created = new Date(userData.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return "New Member";
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} Months`;
    return `${Math.floor(diffDays / 365)} Years`;
  };

  // Navigation cards configuration
  const navCards = [
    {
      id: 1,
      title: "Marketplace",
      description: "Browse and buy fresh produce in just a few clicks",
      icon: FiShoppingCart,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-500",
      textColor: "text-orange-600",
      actionText: "Explore now",
      route: "/marketplace"
    },
    {
      id: 2,
      title: "Transaction Details",
      description: "View Your Purchase History and Track Orders",
      icon: FiSearch,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-500",
      textColor: "text-green-600",
      actionText: "View Transactions",
      route: "/transactions"
    },
    {
      id: 3,
      title: "My Orders",
      description: "Track your deliveries and order history",
      icon: FiPackage,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500",
      textColor: "text-blue-600",
      actionText: "View orders",
      route: "/buyer/orders"
    },
    {
      id: 4,
      title: "Negotiations",
      description: "Manage and track ongoing negotiations with sellers",
      icon: FiMessageSquare,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-500",
      textColor: "text-purple-600",
      actionText: "Go to negotiations",
      route: "/buyer/requests"
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 h-48 md:h-56 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-x-24 translate-y-24"></div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome to EcoFlare
            </h1>
            <p className="text-green-100 mt-2 text-lg">
              Fresh produce, delivered to your doorstep
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 -mt-12 md:-mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                {(userData?.profile_picture && !profileImgError) ? (
                  <img
                    src={userData.profile_picture}
                    alt={`${userData.first_name} ${userData.last_name}`}
                    className="w-full h-full object-cover"
                    onError={() => setProfileImgError(true)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-white text-4xl md:text-5xl font-bold">
                      {getInitials()}
                    </span>
                  </div>
                )}
              </div>
              {/* <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                {userData?.occupation || 'Farmer'}
              </div> */}
            </div>

            {/* Profile Information */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Hello, {userData?.first_name || 'Valued Customer'}! 👋
                </h1>
                <p className="text-gray-600">
                  Welcome back to your fresh produce marketplace
                </p>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FiUser className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">
                      {userData?.first_name || ''} {userData?.last_name || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiMail className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800 truncate">
                      {userData?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <FiPhone className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-800">
                      {formatPhoneNumber(userData?.phone_number || '')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <FiCalendar className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-800">
                      {getAccountAge()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Farm Info if available */}
              {userData?.farm_type && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <FiMapPin />
                    <span className="font-medium">Farm Type: </span>
                    <span>{userData.farm_type}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="container mx-auto px-4 mt-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Actions</h2>
          <p className="text-gray-600">Everything you need in one place</p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {navCards.map((card) => (
            <div
              key={card.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border-t-4 border-l border-l-gray-100 border-t-${card.borderColor.replace('border-', '')} hover:-translate-y-2"
              onClick={() => navigate(card.route)}
            >
              <div className="mb-5">
                <div className={`${card.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`${card.iconColor} text-2xl`} />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="flex items-center font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className={`${card.textColor}`}>{card.actionText}</span>
                <FiChevronRight className={`${card.textColor} ml-2`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="container mx-auto px-4 mt-16 mb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between px-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Your Activity Dashboard</h2>
                  <p className="text-gray-600 mt-1">Track your purchases and savings</p>
                </div>
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Real-time Updates
                </div>
              </div>
              <BuyerAnalyticsDashboard />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BuyerDashboard;