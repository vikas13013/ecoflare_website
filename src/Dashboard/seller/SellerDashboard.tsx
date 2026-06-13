import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserProfile } from "../../features/auth/authThunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { toast } from "react-toastify";
import {
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiUsers,
  FiPieChart,
  FiChevronRight,
  FiPlusCircle,
  FiBox,
  FiCheckCircle,
  FiStar,
  FiPhone,
  FiMail,
  FiCalendar,
} from "react-icons/fi";
import SellerAnalyticsDashboard from "./SellerAnalyticsDashboard";
import { useTranslation } from "react-i18next";

// Fallback image
const fallbackProfileImg =
  "https://media.ecoflaresolutions.com/profile_pictures/default-avatar.jpg";

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { userprofile: userData, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const [profileImgError, setProfileImgError] = useState(false);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Handle image error
  const handleImageError = () => {
    setProfileImgError(true);
  };

  // Format phone number
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "N/A";
    if (phone.length === 10) {
      return `${phone.slice(0, 5)} ${phone.slice(5)}`;
    }
    return phone;
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!userData) return "AS";
    const firstName = userData.first_name || "";
    const lastName = userData.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "AS";
  };

  // Get verified badge color
  const getVerifiedColor = () => {
    return userData?.is_verified_seller
      ? "bg-green-500 text-white"
      : "bg-yellow-500 text-gray-800";
  };

  // Get verified text
  const getVerifiedText = () => {
    return userData?.is_verified_seller
  ? t("verified_seller")
  : t("verification_pending");
  };

  // Navigation cards data
  const navCards = [
    {
      id: 1,
      title: t("manage_products"),
    description: t("manage_products_desc"),
    actionText: t("view_products"),
      icon: FiPackage,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      route: "/seller/products",
    },
    {
      id: 2,
      title: t("order_management"),
    description: t("order_management_desc"),
    actionText: t("view_orders"),
      icon: FiTruck,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      route: "/seller/orders",
    },
    {
      id: 3,
      title: t("add_new_product"),
    description: t("add_product_desc"),
    actionText: t("create_listing"),
      icon: FiPlusCircle,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      route: "/seller/add-product",
    },
    {
      id: 4,
      title: t("negotiation_requests"),
    description: t("negotiation_requests_desc"),
    actionText: t("view_requests"),
      icon: FiUsers,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      route: "/seller/requests",
    },
    // {
    //   id: 5,
    //   title: "Transaction History",
    //   description: "Review your past sales and transactions",
    //   icon: FiUsers,
    //   iconColor: "text-yellow-600",
    //   bgColor: "bg-yellow-100",
    //   actionText: "View Transactions",
    //   route: "/transactions",
    // },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">{t("loading_dashboard")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-secondary to-primary h-48 md:h-64">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
             {t("seller_dashboard")}
            </h1>
            <p className="text-white text-opacity-90 mt-2">
              {t("seller_dashboard_description")}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 -mt-12 md:-mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-8 md:p-6">
            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
              {/* Profile Image Container */}
              <div className="relative lg:flex-shrink-0">
                <div className="relative group">
                  {/* Main Profile Image */}
                  <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl">
                    {userData?.profile_picture && !profileImgError ? (
                      <img
                        src={userData.profile_picture}
                        alt={`${userData?.first_name || "Seller"} ${userData?.last_name || ""}`}
                        className="w-full h-full object-cover    transition-transform duration-700 group-hover:scale-110"
                        onError={() => setProfileImgError(true)}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-purple-600 flex items-center justify-center animate-gradient">
                        <span className="text-white text-5xl md:text-6xl font-bold">
                          {getInitials()}
                        </span>
                      </div>
                    )}

                    {/* Profile Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Verification Badge with Animation */}
                  <div
                    className={`absolute -bottom-3 -right-3 ${getVerifiedColor()} text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl z-10`}
                  >
                    {userData?.is_verified_seller ? (
                      <>
                        <div className="relative">
                          <FiCheckCircle className="text-sm animate-pulse" />
                          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                        </div>
                        <span className="whitespace-nowrap">
                          {getVerifiedText()}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="whitespace-nowrap">
                          {getVerifiedText()}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Online Status Indicator */}
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                  </div>

                  {/* Camera Icon for Upload */}
                  <button
                    onClick={() => navigate("/profiledashboard")}
                    className="absolute bottom-4 left-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                    title="Change Profile Picture"
                  >
                    📷
                  </button>
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1">
                {/* Welcome Section */}
                <div className="">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {t("welcome_back_seller", {
  name: userData?.first_name || t("seller")
})}! 👋
                    </h1>
                    {/* <div className="hidden md:flex items-center gap-2 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
            <FiStar className="text-yellow-500" />
            <span className="font-semibold">4.8/5</span>
          </div> */}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {userData?.occupation || "Professional Seller"}
                      </span>
                      <span className="text-gray-400">•</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-primary" />
                      <span>
                        {t("member_since")}{" "}
                        {userData?.created_at
                          ? new Date(userData.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                              },
                            )
                          : "2025"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
                  {/* Email */}
                  <div className="group bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                        <FiMail className="text-blue-600 text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">
                          {t("email_address")}
                        </p>
                        <p className="font-medium text-gray-800 truncate">
                          {userData?.email || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Phone */}
                  <div className="group bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                        <FiPhone className="text-green-600 text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">
                          {t("primary_phone")}
                        </p>
                        <p className="font-medium text-gray-800">
                          {formatPhoneNumber(userData?.phone_number || "")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp if available */}
                  {userData?.whatsapp_number && (
                    <div className="group bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                          <div className="text-green-600 text-lg">📱</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">
                            {t("whatsapp_business")}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-800">
                              {formatPhoneNumber(userData.whatsapp_number)}
                            </p>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                             {t("connected")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Account Status */}
                  <div className="group bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                        <div className="text-purple-600 text-lg">⚡</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">
                          {t("account_status")}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-800">
                            {t("active_seller")}
                          </p>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-500">
                              {t("online")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {navCards.map((card) => (
            <div
              key={card.id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 cursor-pointer border-l-4 border-primary hover:-translate-y-1"
              onClick={() => navigate(card.route)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`${card.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                >
                  <card.icon className={`${card.iconColor} text-2xl`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {card.description}
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>{card.actionText}</span>
                    <FiChevronRight className="ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="border-b border-gray-100">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between px-6 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("business_analytics")}
                </h2>
                <p className="text-gray-600 mt-1">
                  {t("analytics_description")}
                </p>
              </div>
            </div>
            <SellerAnalyticsDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
