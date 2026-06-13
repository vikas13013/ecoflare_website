import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiTruck,
  FiCheckCircle,
  FiPrinter,
  FiMessageSquare,
  FiPackage,
  FiCalendar,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiDollarSign,
  FiClock,
  FiRefreshCw,
  FiAlertCircle,
  FiChevronRight,
  FiDownload,
  FiMail,
  FiPhone,
  FiStar,
  FiEdit,
} from "react-icons/fi";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  User,
  DollarSign,
  CreditCard,
  Calendar,
  RefreshCw,
  Printer,
  Download,
  Mail,
  Phone,
  AlertCircle,
  ChevronRight,
  Star,
  Box,
  TrendingUp,
  Shield,
  Award,
  FileText,
  ArrowDownNarrowWide,
  ArrowDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import InvoiceGenerator from "../user/InvoiceGenerator";
import { useTranslation } from "react-i18next";

// Status timeline configuration
const STATUS_FLOW = [
  {
    id: 1,
    status: "Confirmed",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    id: 2,
    status: "Processing",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    id: 3,
    status: "Shipped",
    icon: Truck,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100",
  },
  {
    id: 4,
    status: "Out for Delivery",
    icon: Truck,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  {
    id: 5,
    status: "Delivered",
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100",
  },
  {
    id: 6,
    status: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
  {
    id: 7,
    status: "Refunded",
    icon: DollarSign,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
  },
];

// API Base URL
const API_BASE_URL = "https://api.ecoflaresolutions.com";

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem("accessToken");
    const { t } = useTranslation();

  // State
  const [order, setOrder] = useState<any>(null);
  console.log(order, "order data ");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const [trackingUpdates, setTrackingUpdates] = useState<any[]>([]);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] =
    useState<string>("");


    // Add these constants and functions after your useState declarations

// Status flow order (define the sequence)
const STATUS_SEQUENCE = [
  "Confirmed",
  "Processing", 
  "Shipped",
  "Out for Delivery",
  "Delivered"
];

// Terminal states (states that cannot be changed further)
const TERMINAL_STATES = ["Delivered", "Cancelled", "Refunded"];

// Get index of status in sequence
const getStatusIndex = (status) => {
  return STATUS_SEQUENCE.indexOf(status);
};

// Check if status can be updated to next status
const isValidNextStatus = (currentStatus, nextStatus) => {
  // If current status is terminal, no further updates allowed
  if (TERMINAL_STATES.includes(currentStatus)) {
    return false;
  }

  // If trying to cancel or refund, always allow (special cases)
  if (nextStatus === "Cancelled" || nextStatus === "Refunded") {
    return true;
  }

  // Check if next status is exactly one step ahead in sequence
  const currentIndex = getStatusIndex(currentStatus);
  const nextIndex = getStatusIndex(nextStatus);
  
  return nextIndex === currentIndex + 1;
};

// Get available next statuses based on current status
const getNextAvailableStatuses = (currentStatus) => {
  // If no current status or terminal state, return empty
  if (!currentStatus || TERMINAL_STATES.includes(currentStatus)) {
    return [];
  }

  const availableStatuses = [];
  
  // Add the next status in sequence if it exists
  const currentIndex = getStatusIndex(currentStatus);
  if (currentIndex !== -1 && currentIndex < STATUS_SEQUENCE.length - 1) {
    availableStatuses.push(STATUS_SEQUENCE[currentIndex + 1]);
  }
  
  // Always allow Cancelled and Refunded as options (special cases)
  // But don't show them if they are the same as current status
  if (currentStatus !== "Cancelled") {
    availableStatuses.push("Cancelled");
  }
  if (currentStatus !== "Refunded") {
    availableStatuses.push("Refunded");
  }
  
  return availableStatuses;
};

  // Fetch order details
  useEffect(() => {
    if (!id || !token) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/orders/order-items/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status !== 0) {
          throw new Error(result.message || "Failed to fetch order details");
        }

        setOrder(result.data);

        // Set initial status
        setSelectedStatus(result.data.item_order_status);

        // Calculate estimated delivery date if not present
        if (!result.data.expected_delivery_date) {
          const deliveryDate = new Date(result.data.created_at);
          deliveryDate.setDate(deliveryDate.getDate() + 7); // Default 7 days delivery
          setEstimatedDeliveryDate(deliveryDate.toISOString().split("T")[0]);
        }

        // Generate mock tracking updates based on status
        generateTrackingUpdates(result.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load order details";
        setError(errorMessage);
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, token]);

  // Generate mock tracking updates
  const generateTrackingUpdates = (orderData: any) => {
    const updates = [];
    const createdDate = new Date(orderData.created_at);

    // Order confirmed
    updates.push({
      id: 1,
      status: "Confirmed",
      description: "Order confirmed and payment received",
      date: new Date(createdDate.getTime() + 5 * 60000).toISOString(), // +5 minutes
      icon: CheckCircle,
      color: "text-green-500",
    });

    // Processing
    updates.push({
      id: 2,
      status: "Processing",
      description: "Order is being processed by the seller",
      date: new Date(createdDate.getTime() + 30 * 60000).toISOString(), // +30 minutes
      icon: Package,
      color: "text-blue-500",
    });

    // If shipped or beyond
    if (
      ["Shipped", "Out for Delivery", "Delivered"].includes(
        orderData.item_order_status,
      )
    ) {
      updates.push({
        id: 3,
        status: "Shipped",
        description: "Package has been shipped",
        date: new Date(createdDate.getTime() + 24 * 60 * 60000).toISOString(), // +24 hours
        icon: Truck,
        color: "text-indigo-500",
      });
    }

    // If out for delivery or beyond
    if (
      ["Out for Delivery", "Delivered"].includes(orderData.item_order_status)
    ) {
      updates.push({
        id: 4,
        status: "Out for Delivery",
        description: "Package is out for delivery",
        date: new Date(createdDate.getTime() + 48 * 60 * 60000).toISOString(), // +48 hours
        icon: Truck,
        color: "text-purple-500",
      });
    }

    // If delivered
    if (orderData.item_order_status === "Delivered") {
      updates.push({
        id: 5,
        status: "Delivered",
        description: "Package has been delivered",
        date: new Date(createdDate.getTime() + 72 * 60 * 60000).toISOString(), // +72 hours
        icon: CheckCircle,
        color: "text-emerald-500",
      });
    }

    setTrackingUpdates(
      updates.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    );
  };

  // Update order status
// Update order status
const updateOrderStatus = async () => {
  if (
    !order ||
    !selectedStatus ||
    !token ||
    selectedStatus === order.item_order_status
  )
    return;

  // Validate if the status update is allowed
  if (!isValidNextStatus(order?.item_order_status, selectedStatus)) {
    alert("Invalid status update. Please follow the correct sequence: Confirmed → Processing → Shipped → Out for Delivery → Delivered");
    return;
  }

  setUpdatingStatus(true);

  try {
    const formData = new FormData();
    formData.append("item_order_status", selectedStatus);

    if (selectedStatus === "Shipped" && estimatedDeliveryDate) {
      formData.append("expected_delivery_date", estimatedDeliveryDate);
    }

    const response = await fetch(
      `${API_BASE_URL}/orders/order-items/${id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status !== 0) {
      throw new Error(result.message || "Failed to update order status");
    }

    // Update local order state
    setOrder((prev: any) => ({
      ...prev,
      item_order_status: selectedStatus,
      expected_delivery_date:
        result.data.expected_delivery_date || prev.expected_delivery_date,
      updated_at: new Date().toISOString(),
    }));

    // Add tracking update
    const newUpdate = {
      id: trackingUpdates.length + 1,
      status: selectedStatus,
      description: `Status updated to ${selectedStatus}`,
      date: new Date().toISOString(),
      icon:
        STATUS_FLOW.find((s) => s.status === selectedStatus)?.icon || Clock,
      color:
        STATUS_FLOW.find((s) => s.status === selectedStatus)?.color ||
        "text-gray-500",
    };

    setTrackingUpdates((prev) => [newUpdate, ...prev]);
    setShowStatusModal(false);
    setSelectedStatus("");
    setEstimatedDeliveryDate("");

    alert(`Order status updated to ${selectedStatus} successfully!`);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update order status";
    alert(`Error: ${errorMessage}`);
    console.error("Error updating order status:", err);
  } finally {
    setUpdatingStatus(false);
  }
};

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const amountNum = typeof amount === "string" ? parseFloat(amount) : amount;
    return `CAD ${amountNum.toFixed(2)}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: CheckCircle,
        };
      case "processing":
        return { bg: "bg-blue-100", text: "text-blue-800", icon: Package };
      case "shipped":
        return { bg: "bg-indigo-100", text: "text-indigo-800", icon: Truck };
      case "out for delivery":
        return { bg: "bg-purple-100", text: "text-purple-800", icon: Truck };
      case "delivered":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          icon: CheckCircle,
        };
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-800", icon: XCircle };
      case "refunded":
        return { bg: "bg-gray-100", text: "text-gray-800", icon: DollarSign };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", icon: Clock };
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "succeeded":
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!order) return 0;

    const statusIndex = STATUS_FLOW.findIndex(
      (s) => s.status === order.item_order_status,
    );
    return Math.max(20, (statusIndex + 1) * 20);
  };

  // Print order details
  const printOrderDetails = () => {
    window.print();
  };

  // Contact customer (mock function)
  const contactCustomer = () => {
    if (order?.order_user?.email) {
      window.location.href = `mailto:${order.order_user.email}?subject=Regarding Order ${order.sub_order_number}`;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t("loading_order_details")}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("unable_load_order")}
          </h2>
          <p className="text-gray-600 mb-4">{error || "Order not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <button>
  {t("back_to_orders")}
</button>
          </button>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(order.item_order_status);
  const paymentStatusColor = getPaymentStatusColor(order.item_payment_status);
  const progressPercentage = calculateProgress();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 print:bg-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4 mb-6 print:shadow-none">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-green-600 hover:text-green-800 mb-4 transition-colors print:hidden"
                >
                  <FiArrowLeft />
                 <button>
  {t("back_to_orders")}
</button>
                </button>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-green-600" />
                  </div>

                  <div>
                    <h1 className="text-lg md:text-xl font-bold text-gray-900">
                      Order #{order.sub_order_number}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusColor.bg} ${statusColor.text}`}
                      >
                        {React.createElement(statusColor.icon, {
                          className: "w-4 h-4",
                        })}
                        {order.item_order_status}
                      </span>

                      <span className="text-gray-600">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {formatDate(order.created_at)}
                      </span>

                      <span className="text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                       {t("last_updated")}  {formatDate(order.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 print:hidden">
                {/* <button
                  onClick={() => setShowInvoice(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Invoice
                </button> */}

                {order.item_order_status === "Delivered" ? (
                  <button
                    onClick={() => setShowInvoice(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                   {t("generate_invoice")}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                    <FileText className="w-4 h-4" />
                    {t("invoice_after_delivery")}
                  </div>
                )}

                {/* <button
                  onClick={contactCustomer}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </button> */}

                {/* <button
                  onClick={printOrderDetails}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button> */}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Timeline & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Details */}
              {/* Product Details */}
<div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
  {/* Left Content */}
  <div className="flex-1">
    <h3 className="text-sm font-semibold text-gray-900 leading-snug">
      {order.product.name}
    </h3>

    <p className="text-gray-600 mb-4">
      {order.product.description}
    </p>
    
    {/* Quantity */}
    <div>
      <span className="text-gray-500">{t("quantity")}:</span>
      <p className="font-medium">
        {order.quantity} {order.product.unit}
      </p>
    </div>

    {/* Price Breakdown */}
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{t("base_price")}:</span>
        <span className="text-sm">{formatCurrency(order.base_price)}</span>
        {parseFloat(order.discount_percentage) > 0 && (
          <span className="text-xs text-green-600">
            ({order.discount_percentage}% {t("off")})
          </span>
        )}
      </div>
      {parseFloat(order.discount_percentage) > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{t("discounted_price")}:</span>
          <span className="text-sm font-medium text-green-600">
            {formatCurrency(order.discounted_price)}
          </span>
        </div>
      )}
    </div>

    <p className="text-xs text-gray-500 mt-1">
      {t("seller")}: {order.seller_user.first_name}{" "}
      {order.seller_user.last_name}
    </p>

    {/* Total with Tax */}
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-gray-900">
          {formatCurrency(order.item_payment_amount_with_tax || 
            (parseFloat(order.total_price) + parseFloat(order.taxable_amount || 0) + parseFloat(order.shipping_charges)))}
        </span>
        {order.taxable_amount && parseFloat(order.taxable_amount) > 0 && (
          <span className="text-xs text-gray-500">
            ({t("incl_tax")})
          </span>
        )}
      </div>
      {order.tax_breakdown && (
        <p className="text-xs text-gray-400 mt-1">
          {order.tax_breakdown.province} - {order.tax_breakdown.total_tax_rate}% {t("tax_rate")}
        </p>
      )}
    </div>
  </div>

  {/* Right Image */}
  <div className="w-16 h-20 flex-shrink-0 border border-gray-200 rounded-md overflow-hidden bg-gray-50">
    <img
      src={order.product.product_image}
      alt={order.product.name}
      className="w-full h-full object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/placeholder-product.png";
      }}
    />
  </div>
</div>
              {/* Order Progress Timeline */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    {t("order_progress")}
                  </h2>

                 <button
  onClick={() => setShowStatusModal(true)}
  className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition"
>
  <FiEdit className="w-4 h-4" />
 {t("update_order_status")}
</button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">
                     {t("order_confirmed")}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {progressPercentage}% {t("complete")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-6">
                  {trackingUpdates.map((update, index) => {
                    const Icon = update.icon;
                    return (
                      <div key={update.id} className="flex gap-4">
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full ${update.color.replace("text-", "bg-")} bg-opacity-20 flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className={`w-5 h-5 ${update.color}`} />
                          </div>
                          {index < trackingUpdates.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                          )}
                        </div>

                        <div className="flex-1 pb-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {update.status}
                              </h4>
                              <p className="text-gray-600 text-sm mt-1">
                                {update.description}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {formatDate(update.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary & Actions */}
            <div className="space-y-6">
              {/* Order Summary */}
              {/* Order Summary */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
    {t("order_summary")}
  </h2>

  <div className="space-y-3">
    {/* Subtotal without tax */}
    <div className="flex justify-between">
      <span className="text-gray-600">{t("subtotal_without_tax")}</span>
      <span className="font-medium">
        {formatCurrency(order.amount_without_tax || order.total_price)}
      </span>
    </div>

    {/* Shipping */}
    <div className="flex justify-between">
      <span className="text-gray-600">{t("shipping")}</span>
      <span
        className={
          parseFloat(order.shipping_charges) === 0
            ? "text-green-600 font-medium"
            : ""
        }
      >
        {parseFloat(order.shipping_charges) === 0
          ? t("free")
          : formatCurrency(order.shipping_charges)}
      </span>
    </div>

    {/* Discount */}
    {parseFloat(order.discount_percentage) > 0 && (
      <div className="flex justify-between">
        <span className="text-gray-600">
          {t("discount")} ({order.discount_percentage}%)
        </span>
        <span className="text-green-600 font-medium">
          - {formatCurrency(order.item_summary?.total_discount || 0)}
        </span>
      </div>
    )}

    {/* Tax Breakdown */}
    {order.tax_breakdown && (
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
          <span>{t("tax_details")}:</span>
          <span></span>
        </div>
        
        {/* GST */}
        {order.tax_breakdown.gst && order.tax_breakdown.gst.amount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              GST ({order.tax_breakdown.gst.rate}%):
            </span>
            <span className="font-medium">
              {formatCurrency(order.tax_breakdown.gst.amount)}
            </span>
          </div>
        )}
        
        {/* PST */}
        {order.tax_breakdown.pst && order.tax_breakdown.pst.amount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              PST ({order.tax_breakdown.pst.rate}%):
            </span>
            <span className="font-medium">
              {formatCurrency(order.tax_breakdown.pst.amount)}
            </span>
          </div>
        )}
        
        {/* HST */}
        {order.tax_breakdown.hst && order.tax_breakdown.hst.amount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              HST ({order.tax_breakdown.hst.rate}%):
            </span>
            <span className="font-medium">
              {formatCurrency(order.tax_breakdown.hst.amount)}
            </span>
          </div>
        )}
        
        {/* Total Tax */}
        <div className="flex justify-between text-sm pt-1 border-t border-gray-100 mt-1">
          <span className="text-gray-600 font-medium">{t("total_tax")}:</span>
          <span className="font-medium text-amber-600">
            {formatCurrency(order.taxable_amount || order.tax_breakdown.total_tax_amount)}
          </span>
        </div>
        
        {/* Amount with Tax */}
        <div className="flex justify-between text-sm pt-1">
          <span className="text-gray-600">{t("amount_with_tax")}:</span>
          <span className="font-medium">
            {formatCurrency(order.amount_with_tax || (parseFloat(order.amount_without_tax) + parseFloat(order.taxable_amount)))}
          </span>
        </div>
      </div>
    )}

    <div className="border-t-2 border-gray-200 pt-3 mt-3">
      <div className="flex justify-between font-bold text-lg">
        <span>{t("total_paid")}</span>
        <span className="text-green-600">
          {formatCurrency(order.item_payment_amount_with_tax || 
            (parseFloat(order.amount_without_tax || order.total_price) + 
             parseFloat(order.taxable_amount || 0) + 
             parseFloat(order.shipping_charges)))}
        </span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{t("payment_method")}:</span>
        <span>{order.item_payment_method}</span>
      </div>
    </div>
  </div>
</div>

              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 m-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  {t("customer_information")}
                </h2>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.order_user.first_name}{" "}
                        {order.order_user.last_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {/* {order.order_user.email} */}
                        <span>{order.order_user.phone_number}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{order.order_user.phone_number}</span>
                    </div> */}

                    <div className="flex items-start gap-2 text-gray-600">
  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
  <div className="flex flex-col">
    <div className="flex flex-wrap items-center gap-1">
      <p className="font-medium">
        {order.order_address.address}
      </p>
      <span className="text-gray-400">,</span>
      <p className="text-sm">
        {order.order_address.postal_code}
      </p>
      <span className="text-gray-400">,</span>
      <p className="text-sm">{order.order_address.country}</p>
    </div>
    
    {/* Optional: Add city if needed */}
    {/* {order.order_address.city && (
      <p className="text-sm text-gray-500 mt-1">
        {order.order_address.city}
      </p>
    )} */}
    
    {/* Optional: Rural delivery indicator */}
    {/* {order.order_address.is_rural && (
      <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
        <span>🚚</span>
        Rural delivery area
      </p>
    )} */}
  </div>
</div>
                  </div>
                </div>
              </div>

            {/* Tax Information */}
{order.tax_breakdown && (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <FileText className="w-5 h-5 text-green-600" />
      {t("tax_information")}
    </h2>

    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">{t("province")}:</span>
        <span className="font-medium">{order.tax_breakdown.province}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">{t("total_tax_rate")}:</span>
        <span className="font-medium">{order.tax_breakdown.total_tax_rate}%</span>
      </div>

      <div className="border-t pt-3 mt-2">
        <div className="space-y-2">
          {order.tax_breakdown.gst && order.tax_breakdown.gst.amount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">GST ({order.tax_breakdown.gst.rate}%):</span>
              <span>{formatCurrency(order.tax_breakdown.gst.amount)}</span>
            </div>
          )}
          {order.tax_breakdown.pst && order.tax_breakdown.pst.amount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">PST ({order.tax_breakdown.pst.rate}%):</span>
              <span>{formatCurrency(order.tax_breakdown.pst.amount)}</span>
            </div>
          )}
          {order.tax_breakdown.hst && order.tax_breakdown.hst.amount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">HST ({order.tax_breakdown.hst.rate}%):</span>
              <span>{formatCurrency(order.tax_breakdown.hst.amount)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between font-medium pt-2 border-t">
        <span className="text-gray-600">{t("total_tax_paid")}:</span>
        <span className="text-amber-600 font-bold">
          {formatCurrency(order.tax_breakdown.total_tax_amount)}
        </span>
      </div>
    </div>
  </div>
)}

              {/* Payment Information */}
              {/* Payment Information */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
    <CreditCard className="w-5 h-5 text-green-600" />
    {t("payment_information")}
  </h2>

  <div className="space-y-3">
    <div className="flex justify-between">
      <span className="text-gray-600">{t("payment_method")}</span>
      <span className="font-medium">
        {order.item_payment_method}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-600">{t("payment_status")}</span>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColor}`}
      >
        {order.item_payment_status}
      </span>
    </div>

    {/* Show actual paid amount */}
    <div className="flex justify-between">
      <span className="text-gray-600">{t("paid_amount")}</span>
      <span className="font-bold text-green-600">
        {formatCurrency(order.item_payment_amount_with_tax || order.item_payment_amount)}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-600">{t("order_date")}</span>
      <span className="font-medium">
        {formatDate(order.created_at)}
      </span>
    </div>

    {order.expected_delivery_date && (
      <div className="flex justify-between">
        <span className="text-gray-600">{t("expected_delivery")}</span>
        <span className="font-medium">
          {formatDate(order.expected_delivery_date)}
        </span>
      </div>
    )}
  </div>
</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
     {/* Status Update Modal */}
{showStatusModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {t("update_order_status")}
        </h3>
        <button
          onClick={() => {
            setShowStatusModal(false);
            setSelectedStatus("");
            setEstimatedDeliveryDate("");
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Current Status Display */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">{t("current_status")}:</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                getStatusColor(order?.item_order_status).bg
              } ${getStatusColor(order?.item_order_status).text}`}
            >
              {React.createElement(
                getStatusColor(order?.item_order_status).icon,
                { className: "w-4 h-4" }
              )}
              {order?.item_order_status}
            </span>
            
            {/* Show if order is in terminal state */}
            {TERMINAL_STATES.includes(order?.item_order_status) && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {t("final_status")}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("select_next_status")}
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">{t("select_next_status")}</option>
            {getNextAvailableStatuses(order?.item_order_status).map((status) => {
              const statusInfo = STATUS_FLOW.find(s => s.status === status);
              return (
                <option key={status} value={status}>
                  {status}
                </option>
              );
            })}
          </select>
          
          {/* Show message if no next status available */}
          {getNextAvailableStatuses(order?.item_order_status).length === 0 && (
            <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {t("no_further_status")}
            </p>
          )}
        </div>

        {/* Status Flow Visualization */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">Status Flow:</p>
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {STATUS_FLOW.filter(s => !["Cancelled", "Refunded"].includes(s.status)).map((status, index) => {
              const isCurrent = status.status === order?.item_order_status;
              const isPast = getStatusIndex(status.status) < getStatusIndex(order?.item_order_status);
              const isNext = getNextAvailableStatuses(order?.item_order_status).includes(status.status);
              
              return (
                <React.Fragment key={status.id}>
                  {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400" />}
                  <span
                    className={`px-2 py-1 rounded-full flex items-center gap-1 ${
                      isCurrent
                        ? "bg-green-100 text-green-800 font-semibold"
                        : isPast
                        ? "bg-gray-100 text-gray-600"
                        : isNext
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {React.createElement(status.icon, { className: "w-3 h-3" })}
                    {status.status}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Cancellation/Refund Note */}
        {(selectedStatus === "Cancelled" || selectedStatus === "Refunded") && (
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {selectedStatus === "Cancelled" 
                ? "Warning: Cancelling order will stop all further processing."
                : "Note: Refund will be processed to customer's original payment method."}
            </p>
          </div>
        )}

        {selectedStatus === "Shipped" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Delivery Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={estimatedDeliveryDate}
              onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => {
              setShowStatusModal(false);
              setSelectedStatus("");
              setEstimatedDeliveryDate("");
            }}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            {t("cancel")}
          </button>
          <button
            onClick={updateOrderStatus}
            disabled={
              updatingStatus ||
              !selectedStatus ||
              selectedStatus === order?.item_order_status ||
              !isValidNextStatus(order?.item_order_status, selectedStatus) ||
              (selectedStatus === "Shipped" && !estimatedDeliveryDate)
            }
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {updatingStatus ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                {t("updating")}
              </span>
            ) : (
              t("update_status")
            )}
          </button>
        </div>

        {/* Status Update History Note */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
          <p>Status updates follow sequence: Confirmed → Processing → Shipped → Out for Delivery → Delivered</p>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Invoice Modal */}
      {showInvoice && order && user && (
        <InvoiceGenerator
          orderItem={order}
          user={user}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </>
  );
};

export default OrderDetailsPage;
