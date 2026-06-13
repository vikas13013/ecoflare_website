import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaClock, 
  FaLeaf, 
  FaBox, 
  FaChevronRight, 
  FaInfoCircle, 
  FaRegCalendarAlt, 
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCheckDouble,
  FaExclamationTriangle,
  FaUserTie,
  FaTag,
  FaWeightHanging,
  FaCalendarCheck,
  FaArrowRight
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface Product {
  id: number;
  name: string;
  description: string;
  category: number;
  product_image: string | null;
  status: string;
  user: number;
  product_availability: number | null;
  organic_certified: boolean;
  is_negotiable: boolean;
  is_flexible_buying: boolean;
  is_bulk_buying: boolean;
  is_preorder_produce: boolean;
  canada_grade: string | null;
  currency: string;
  base_price: string;
  hst_included: boolean;
  stock_quantity: string;
  min_order_quantity: string;
  unit: string;
  growing_session: string;
  expiry_date: string | null;
  harvest_date: string | null;
  food_safety_certification: string | null;
  is_top_products: boolean;
  quantity_discounts: Array<{
    id: number;
    min_quantity: number;
    max_quantity: number;
    discount_percentage: string;
    shipping_charges: string;
  }>;
}

interface Negotiation {
  id: number;
  product: Product;
  buyer: number;
  seller: number;
  buying_type: string | null;
  status: "Open" | "Expired" | "Closed" | "Accepted" | "Rejected";
  created_at: string;
  updated_at: string;
  seller_responded_at: string | null;
  expires_at: string | null;
  time_remaining: string | null;
  is_expired: boolean;
}

interface ApiResponse {
  status: number;
  message: string;
  total_items: number;
  page: number;
  current_page_size: number;
  total_pages_size: number;
  next: string | null;
  previous: string | null;
  data: Negotiation[];
}

interface TransformedRequest {
  id: number;
  title: string;
  image: string;
  created: string;
  createdRaw: string;
  quantity: string;
  method: string;
  packaging: string;
  deliveryDate: string;
  status: "pending" | "approved" | "rejected" | "completed";
  responses: number;
  supplier: string;
  isOrganic: boolean;
  price: string;
  currency: string;
  originalData: Negotiation;
}

const BuyerRequestsList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "status">("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch negotiations from API
  useEffect(() => {
    const fetchNegotiations = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(
          "https://api.ecoflaresolutions.com/negotiation/negotiations/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.status === 0) {
          setNegotiations(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch negotiations");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching negotiations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNegotiations();
  }, []);

  // Map API status to component status with enhanced details
  const mapStatus = (negotiation: Negotiation): { type: "pending" | "approved" | "rejected" | "completed", label: string, color: string, icon: React.ReactNode } => {
    switch (negotiation.status) {
      case "Open":
        return { 
          type: "pending", 
          label: "Awaiting Response", 
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <FaHourglassHalf className="w-3 h-3" />
        };
      case "Accepted":
        return { 
          type: "approved", 
          label: "Accepted", 
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <FaCheckCircle className="w-3 h-3" />
        };
      case "Rejected":
        return { 
          type: "rejected", 
          label: "Rejected", 
          color: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <FaTimesCircle className="w-3 h-3" />
        };
      case "Closed":
        return { 
          type: "completed", 
          label: "Completed", 
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <FaCheckDouble className="w-3 h-3" />
        };
      case "Expired":
        return { 
          type: "rejected", 
          label: "Expired", 
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: <FaExclamationTriangle className="w-3 h-3" />
        };
      default:
        return { 
          type: "pending", 
          label: "Pending", 
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <FaHourglassHalf className="w-3 h-3" />
        };
    }
  };

  // Format date to relative time with better formatting
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get default image based on product name
  const getDefaultImage = (productName: string): string => {
    const defaultImages: { [key: string]: string } = {
      "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      "carrots": "https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      "tomato": "https://images.unsplash.com/photo-1546470427-e212b7d31075?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      "cabbage": "https://images.unsplash.com/photo-1620236061022-2eab6bb1d175?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      "apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      "lettuce": "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      "potato": "https://images.unsplash.com/photo-1518977676601-b53f82c6553f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    };
    
    const lowerName = productName.toLowerCase();
    for (const [key, url] of Object.entries(defaultImages)) {
      if (lowerName.includes(key)) {
        return url;
      }
    }
    return "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
  };

  // Transform API data to match component interface
  const transformedRequests: TransformedRequest[] = negotiations.map(negotiation => {
    const statusInfo = mapStatus(negotiation);
    return {
      id: negotiation.id,
      title: negotiation.product.name,
      image: negotiation.product.product_image || getDefaultImage(negotiation.product.name),
      created: formatRelativeTime(negotiation.created_at),
      createdRaw: negotiation.created_at,
      quantity: `${parseFloat(negotiation.product.stock_quantity).toLocaleString()} ${negotiation.product.unit}`,
      method: negotiation.product.organic_certified ? "Organic" : "Conventional",
      packaging: "Bulk",
      deliveryDate: negotiation.product.harvest_date 
        ? new Date(negotiation.product.harvest_date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        : "Flexible",
      status: statusInfo.type,
      responses: negotiation.seller_responded_at ? 1 : 0,
      supplier: `Farm #${negotiation.seller}`,
      isOrganic: negotiation.product.organic_certified,
      price: parseFloat(negotiation.product.base_price).toFixed(2),
      currency: negotiation.product.currency || "CAD",
      originalData: negotiation
    };
  });

  // Apply filters and sorting
  const filteredAndSortedRequests = React.useMemo(() => {
    let filtered = activeFilter === "all" 
      ? transformedRequests 
      : transformedRequests.filter(req => req.status === activeFilter);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdRaw).getTime() - new Date(a.createdRaw).getTime();
        case "oldest":
          return new Date(a.createdRaw).getTime() - new Date(b.createdRaw).getTime();
        case "status":
          const statusOrder = { pending: 0, approved: 1, completed: 2, rejected: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });
  }, [transformedRequests, activeFilter, searchTerm, sortBy]);

  const handleViewRequest = (req: TransformedRequest) => {
    navigate(`/buyer/negotiation/${req.id}`);
  };

  const getStatusBadge = (req: TransformedRequest) => {
    const statusInfo = mapStatus(req.originalData);
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
        {statusInfo.icon}
        {statusInfo.label}
      </span>
    );
  };

  const getStatusCount = (status: string): number => {
    return transformedRequests.filter(req => req.status === status).length;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-100 rounded-full mb-6">
            <FaExclamationTriangle className="text-3xl text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              {t("my_negotiations")}
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <span className="inline-block w-1 h-1 bg-green-500 rounded-full"></span>
              {t("track_negotiations")}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-5 py-3 rounded-2xl border border-blue-100 shadow-sm">
              <FaInfoCircle className="text-blue-500" />
              <span className="font-medium">
                {transformedRequests.filter(r => r.status === "pending").length} pending • {transformedRequests.filter(r => r.status === "approved").length} approved
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product or farm..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${
                  showFilters 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaFilter className={showFilters ? 'text-green-600' : ''} />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="status">By Status</option>
              </select>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeFilter === "all" 
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-200" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                  onClick={() => setActiveFilter("all")}
                >
                  All ({transformedRequests.length})
                </button>
                <button 
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                    activeFilter === "pending" 
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-200" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                  onClick={() => setActiveFilter("pending")}
                >
                  <FaHourglassHalf />
                  Pending ({getStatusCount("pending")})
                </button>
                <button 
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                    activeFilter === "approved" 
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                  onClick={() => setActiveFilter("approved")}
                >
                  <FaCheckCircle />
                  Approved ({getStatusCount("approved")})
                </button>
                <button 
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                    activeFilter === "completed" 
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-200" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                  onClick={() => setActiveFilter("completed")}
                >
                  <FaCheckDouble />
                  Completed ({getStatusCount("completed")})
                </button>
                <button 
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                    activeFilter === "rejected" 
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-200" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                  onClick={() => setActiveFilter("rejected")}
                >
                  <FaTimesCircle />
                  Rejected ({getStatusCount("rejected")})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {filteredAndSortedRequests.map((req) => (
            <div
              key={req.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-green-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleViewRequest(req)}
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={req.image} 
                  alt={req.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                
                {/* Status Badge - Floating */}
                <div className="absolute top-3 left-3">
                  {getStatusBadge(req)}
                </div>

                {/* Organic Badge */}
                {req.isOrganic && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      <FaLeaf className="w-3 h-3" />
                      Organic
                    </span>
                  </div>
                )}

                {/* Gradient Overlay with Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <h3 className="font-bold text-lg text-white truncate">{req.title}</h3>
                  <p className="text-sm text-gray-200 flex items-center gap-1">
                    <FaUserTie className="w-3 h-3" />
                    {req.supplier}
                  </p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                {/* Meta Info */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    {req.created}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    ID: #{req.id}
                  </span>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                      <FaTag className="w-3 h-3" />
                      Price
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {req.currency} {req.price}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                      <FaWeightHanging className="w-3 h-3" />
                      Quantity
                    </p>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {req.quantity}
                    </p>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarCheck className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Delivery</p>
                      <p className="text-sm font-semibold text-gray-800">{req.deliveryDate}</p>
                    </div>
                  </div>
                  {req.responses > 0 && (
                    <span className="text-xs bg-white px-2 py-1 rounded-full text-green-700 font-medium">
                      {req.responses} {req.responses === 1 ? 'quote' : 'quotes'}
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200 group-hover:shadow-xl">
                  <span>View Details</span>
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredAndSortedRequests.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6">
              <FaRegCalendarAlt className="text-4xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {searchTerm ? "No matching negotiations" : `No ${activeFilter !== "all" ? activeFilter : ""} negotiations`}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? `We couldn't find any negotiations matching "${searchTerm}". Try adjusting your search or filters.`
                : `You don't have any ${activeFilter !== "all" ? activeFilter : ""} negotiations at the moment. They will appear here once available.`
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 text-green-600 hover:text-green-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerRequestsList;