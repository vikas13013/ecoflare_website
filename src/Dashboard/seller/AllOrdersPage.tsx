import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import OrderTable from "./OrderTable";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getOrder, getOrderItemsByDate } from "../../features/order/orderThunk";
import { RootState } from "../../app/store";
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";

const AllOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux State
  const { data, loading, error } = useAppSelector(
    (state: RootState) => state.order?.order || {},
  );
  console.log("Fetched orders data:", data);
  const [isFiltering, setIsFiltering] = useState(false);

  // Local State
  const [filter, setFilter] = useState("all");
  const [originalOrders, setOriginalOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Initialize with API data
  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  // Process orders when data changes
  useEffect(() => {
    if (data) {
      let ordersArray: any[] = [];

      if (Array.isArray(data)) {
        ordersArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        ordersArray = data.data;
      } else if (data.order_items && Array.isArray(data.order_items)) {
        ordersArray = data.order_items;
      }

      setOriginalOrders(ordersArray); // ⭐ add this
      setFilteredOrders(ordersArray);
    }
  }, [data]);

  // Filter and search orders
  useEffect(() => {
    const filtered = originalOrders.filter((order) => {
      const statusFilter =
        filter === "all" ||
        order.item_order_status?.toLowerCase() === filter.toLowerCase();

      const searchFilter =
        searchQuery === "" ||
        order.sub_order_number
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.product?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (order.seller_user?.first_name + " " + order.seller_user?.last_name)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      let dateFilter = true;

      if (dateRange.start && dateRange.end) {
        const orderDate = new Date(order.created_at);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);

        endDate.setHours(23, 59, 59, 999);

        dateFilter = orderDate >= startDate && orderDate <= endDate;
      }

      return statusFilter && searchFilter && dateFilter;
    });

    setFilteredOrders(filtered);
  }, [filter, searchQuery, dateRange, originalOrders]);

  // Calculate statistics
  // Calculate statistics
const calculateStats = () => {
  if (!filteredOrders || filteredOrders.length === 0) {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      cancelledOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
    };
  }

  const stats = {
    totalOrders: filteredOrders.length,
    // FIX: Use item_payment_amount_with_tax as total paid amount
    totalRevenue: filteredOrders.reduce((sum, order) => {
      const amount = parseFloat(order.item_payment_amount_with_tax || 
                                order.item_payment_amount || 
                                order.total_price || 0);
      return sum + amount;
    }, 0),
    pendingOrders: filteredOrders.filter(
      (order) => order.item_order_status === "Pending",
    ).length,
    confirmedOrders: filteredOrders.filter(
      (order) => order.item_order_status === "Confirmed",
    ).length,
    cancelledOrders: filteredOrders.filter(
      (order) => order.item_order_status === "Cancelled",
    ).length,
    shippedOrders: filteredOrders.filter(
      (order) => order.item_order_status === "Shipped",
    ).length,
    deliveredOrders: filteredOrders.filter(
      (order) => order.item_order_status === "Delivered",
    ).length,
    averageOrderValue: 0,
  };

  stats.averageOrderValue = stats.totalRevenue / (stats.totalOrders || 1);

  return stats;
};

  const stats = calculateStats();

  // Handle date filter
  const handleDateFilter = async () => {
    if (!dateRange.start || !dateRange.end) return;

    setIsFiltering(true);
    try {
      const result = await dispatch(
        getOrderItemsByDate({
          startDate: dateRange.start,
          endDate: dateRange.end,
        }),
      ).unwrap();

      setFilteredOrders(result.data || result || []);
    } catch (error) {
      console.error("Error filtering orders:", error);
    } finally {
      setIsFiltering(false);
    }
  };



  const clearFilters = () => {
    setFilter("all");
    setSearchQuery("");
    setDateRange({ start: "", end: "" });

    setFilteredOrders(originalOrders);
  };

  // Export to CSV
  // Export to CSV
const exportToCSV = () => {
  if (filteredOrders.length === 0) {
    alert("No orders to export");
    return;
  }

  const headers = [
    "Order ID",
    "Sub Order #",
    "Product",
    "Customer",
    "Seller",
    "Quantity",
    "Amount Without Tax",
    "Tax Amount",
    "Total Amount",
    "Status",
    "Payment Status",
    "Order Date",
  ];

  const csvData = filteredOrders.map((order) => [
    order.order || "N/A",
    order.sub_order_number || "N/A",
    order.product?.name || "N/A",
    `${order.order_user?.first_name || ""} ${order.order_user?.last_name || ""}`.trim() ||
      "N/A",
    `${order.seller_user?.first_name || ""} ${order.seller_user?.last_name || ""}`.trim() ||
      "N/A",
    `${order.quantity} ${order.product?.unit || ""}`,
    `CAD ${parseFloat(order.amount_without_tax || order.total_price || 0).toFixed(2)}`,
    `CAD ${parseFloat(order.taxable_amount || 0).toFixed(2)}`,
    `CAD ${parseFloat(order.item_payment_amount_with_tax || order.item_payment_amount || 0).toFixed(2)}`,
    order.item_order_status || "N/A",
    order.item_payment_status || "N/A",
    new Date(order.created_at).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...csvData.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

  // Refresh data
  const refreshData = async () => {
    setLoading(true);
    try {
      await dispatch(getOrder());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Unable to Load Orders
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={refreshData}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                >
                  <FiArrowLeft className="mr-2" /> Back
                </button>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                All Orders
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage all your orders
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* <button
                onClick={refreshData}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg transition-all duration-200 
  ${loading ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"}`}
                title="Refresh orders"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiRefreshCw className={loading ? "animate-spin" : ""} />
                )}

                <span className="hidden md:inline">
                  {loading ? "Refreshing..." : "Refresh"}
                </span>
              </button> */}

              <button
                onClick={exportToCSV}
                disabled={filteredOrders.length === 0}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
              >
                <FiDownload />
                <span className="hidden md:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  CAD {stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  CAD {stats.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by order #, product, or customer..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
              {/* Status Filter */}
              <div className="flex items-center">
                <FiFilter className="text-gray-500 mr-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Start Date"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="End Date"
                />
                <button
                  onClick={handleDateFilter}
                  disabled={isFiltering || !dateRange.start || !dateRange.end}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {isFiltering ? "Filtering..." : "Apply"}
                </button>
              </div>

              {/* Clear Filters Button */}
              {(filter !== "all" ||
                searchQuery ||
                dateRange.start ||
                dateRange.end) && (
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Status Summary */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              {
                label: "All",
                value: "all",
                count: stats.totalOrders,
                color: "bg-gray-100 text-gray-800",
              },
              {
                label: "Pending",
                value: "pending",
                count: stats.pendingOrders,
                color: "bg-yellow-100 text-yellow-800",
              },
              {
                label: "Confirmed",
                value: "confirmed",
                count: stats.confirmedOrders,
                color: "bg-green-100 text-green-800",
              },
              {
                label: "Shipped",
                value: "shipped",
                count: stats.shippedOrders,
                color: "bg-blue-100 text-blue-800",
              },
              {
                label: "Delivered",
                value: "delivered",
                count: stats.deliveredOrders,
                color: "bg-emerald-100 text-emerald-800",
              },
              {
                label: "Cancelled",
                value: "cancelled",
                count: stats.cancelledOrders,
                color: "bg-red-100 text-red-800",
              },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === status.value
                    ? `${status.color} border-2 border-current`
                    : `${status.color} hover:opacity-90`
                }`}
              >
                <span>{status.label}</span>
                <span className="bg-white bg-opacity-50 px-1.5 py-0.5 rounded-full text-xs">
                  {status.count}
                </span>
              </button>
            ))}
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ||
                filter !== "all" ||
                dateRange.start ||
                dateRange.end
                  ? "No orders match your filters. Try changing your search criteria."
                  : "You haven't placed any orders yet."}
              </p>
              {(searchQuery ||
                filter !== "all" ||
                dateRange.start ||
                dateRange.end) && (
                <button
                  onClick={clearFilters}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <OrderTable orders={filteredOrders} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllOrdersPage;
