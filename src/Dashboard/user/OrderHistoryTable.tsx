import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getOrder, getOrderItemsByDate } from "../../features/order/orderThunk";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  MapPin,
  DollarSign,
  ShoppingCart,
  Calendar,
  User,
  Filter,
  Download,
  Search,
  FileText,
} from "lucide-react";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import InvoiceGenerator from "./InvoiceGenerator";
import { useTranslation } from "react-i18next";

// ====================== UTILITY FUNCTIONS ======================
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// const formatCurrency = (amount: string | number) => {
//   const amountNum = typeof amount === "string" ? parseFloat(amount) : amount;
//   return `CAD ${amountNum.toFixed(2)}`;
// };

const formatCurrency = (amount?: string | number) => {
  if (amount === null || amount === undefined || amount === "") {
    return "CAD 0.00";
  }

  const amountNum =
    typeof amount === "string" ? parseFloat(amount) : Number(amount);

  if (isNaN(amountNum)) {
    return "CAD 0.00";
  }

  return `CAD ${amountNum.toFixed(2)}`;
};
// ====================== STATUS BADGE COMPONENT ======================
const StatusBadge = ({
  status,
  type,
}: {
  status: string;
  type: "order" | "payment";
}) => {
  const getStatusConfig = (status: string, type: "order" | "payment") => {
    const config = {
      order: {
        Delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
        Completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
        Shipped: { color: "bg-blue-100 text-blue-800", icon: Truck },
        Processing: { color: "bg-blue-100 text-blue-800", icon: Package },
        Pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
        Confirmed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
        Cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
        Failed: { color: "bg-red-100 text-red-800", icon: XCircle },
      },
      payment: {
        Paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
        Completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
        Pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
        Failed: { color: "bg-red-100 text-red-800", icon: XCircle },
        Refunded: { color: "bg-purple-100 text-purple-800", icon: DollarSign },
      },
    };

    return (
      config[type][status] || {
        color: "bg-gray-100 text-gray-800",
        icon: Clock,
      }
    );
  };

  const { color, icon: Icon } = getStatusConfig(status, type);

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

// ====================== DATE FILTER COMPONENT ======================
interface DateFilterProps {
  onFilter: (startDate: string, endDate: string) => void;
  onClear: () => void;
  isLoading: boolean;
}

const DateFilter: React.FC<DateFilterProps> = ({
  onFilter,
  onClear,
  isLoading,
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { t } = useTranslation();

  // Set default dates (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onFilter(startDate, endDate);
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    onClear();
  };

  const quickFilters = [
    { label: t("today"), days: 0 },
    { label: t("last_7_days"), days: 7 },
    { label: t("last_30_days"), days: 30 },
    { label: t("last_90_days"), days: 90 },
  ];

  const applyQuickFilter = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
    onFilter(
      start.toISOString().split("T")[0],
      end.toISOString().split("T")[0],
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-green-600" />
          {t("filter_orders")}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{t("quick_filters")}</span>
          <div className="flex gap-2">
            {quickFilters.map((filter) => (
              <button
                key={filter.label}
                onClick={() => applyQuickFilter(filter.days)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                disabled={isLoading}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("start_date")}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("end_date")}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={isLoading || !startDate || !endDate}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("filtering")}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  {t("apply_filter")}
                </>
              )}
            </button>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              {t("clear_filters")}
            </button>
          </div>
        </div>

        {startDate && endDate && (
          <div className="text-sm text-gray-600">
            {t("showing_orders_from")}{" "}
            <span className="font-semibold">{startDate}</span> to{" "}
            <span className="font-semibold">{endDate}</span>
          </div>
        )}
      </form>
    </div>
  );
};

// ====================== STATS COMPONENT ======================
// ====================== STATS COMPONENT ======================
const OrderStats = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;
  const { t } = useTranslation();

  const stats = {
    totalOrders: data.length,
    totalItems: data.length,
    // Fix: Use item_payment_amount_with_tax instead of item_payment_amount
    totalAmount: data.reduce(
      (sum: number, item: any) =>
        sum + parseFloat(item.item_payment_amount_with_tax || item.item_payment_amount || 0),
      0,
    ),
    pendingOrders: data.filter(
      (item: any) => item.item_order_status === "Pending",
    ).length,
    confirmedOrders: data.filter(
      (item: any) => item.item_order_status === "Confirmed",
    ).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{t("total_orders")}</p>
            <p className="text-lg font-bold text-gray-900">
              {stats.totalOrders}
            </p>
          </div>
          <Package className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{t("total_amount")}</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(stats.totalAmount)}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-amber-600" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{t("confirmed")}</p>
            <p className="text-lg font-bold text-gray-900">
              {stats.confirmedOrders}
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{t("pending")}</p>
            <p className="text-lg font-bold text-gray-900">
              {stats.pendingOrders}
            </p>
          </div>
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>
      </div>
    </div>
  );
};

// ====================== ORDER HISTORY TABLE ======================
const OrderHistoryTable = ({
  orderItems,
  onViewDetails,
  isLoading,
}: {
  orderItems: any[];
  onViewDetails: (item: any) => void;
  isLoading: boolean;
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{t("loading_orders")}</p>
      </div>
    );
  }

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <ShoppingCart className="w-20 h-20 text-gray-300" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          {t("no_orders_found")}
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          {t("no_orders_description")}
        </p>
        <button
          onClick={() => (window.location.href = "/marketplace")}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          {t("browse_marketplace")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {orderItems.length} items
          </span>
        </div>

        {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Download className="w-4 h-4" />
          Export CSV
        </button> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                {t("order_number")}
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                {t("product")}
              </th>
              {/* <th className="py-3 px-4 text-left font-semibold text-gray-700">Seller</th> */}
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                {t("quantity")}
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                {t("amount")}
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                {t("status")}
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                {t("order_date")}
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orderItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">
                    {item.sub_order_number}
                  </div>
                  <div className="text-xs text-gray-500">
                    Order ID: {item.order}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border flex-shrink-0">
                      <img
                        src={
                          item.product?.product_image ||
                          "/placeholder-product.png"
                        }
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {item.product?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.product?.category?.name}
                      </div>
                    </div>
                  </div>
                </td>
                {/* <td className="py-4 px-4">
                  {item.seller_user ? (
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.seller_user.first_name} {item.seller_user.last_name}
                      </div>
                      <div className="text-xs text-gray-500">{item.seller_user.email}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td> */}
                <td className="py-4 px-4">
                  <span className="font-medium">{item.quantity}</span>
                  <span className="text-gray-500 text-sm ml-1">
                    {item.product?.unit}
                  </span>
                </td>
                <td className="py-4 px-4 font-semibold text-gray-900">
                  {formatCurrency(
                    parseFloat(item.base_price) * item.quantity 
                    // +
                    //   parseFloat(item.shipping_charges),
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1">
                    <StatusBadge status={item.item_order_status} type="order" />
                    {/* <StatusBadge status={item.item_payment_status} type="payment" /> */}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {formatDate(item.created_at)}
                </td>
                <td className="py-4 px-4">
                  <button
                    className="text-green-600 hover:text-green-800 font-medium text-sm bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition"
                    onClick={() => onViewDetails(item)}
                  >
                    {t("view")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ====================== ORDER DETAILS COMPONENT ======================
const OrderDetails = ({ item, onBack }: { item: any; onBack: () => void }) => {
  console.log("OrderDetails item:", item);
  const { t } = useTranslation();

  const [showInvoice, setShowInvoice] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
       {/* Header - Add Invoice Button */}
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 pb-4 border-b border-gray-200">
  <div>
    <button
      className="flex items-center gap-2 text-green-600 font-medium hover:text-green-800 mb-2 transition bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100"
      onClick={onBack}
    >
      <ArrowLeft className="w-4 h-4" />
      {t("back_to_orders")}
    </button>
    <h2 className="text-2xl font-bold text-gray-900">
      {t("order_number")}: {item.sub_order_number}
    </h2>
    <p className="text-gray-500 text-sm mt-1">
      {t("placed_on")}: {formatDate(item.created_at)}
    </p>
  </div>

  <div className="flex flex-wrap gap-3 items-start">
    {/* Invoice Button */}
    {item.item_payment_status === "Paid" ? (
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
        {t("invoice_after_payment")}
      </div>
    )}

    {/* <div className="text-right">
      <p className="text-sm text-gray-600">{t("total_paid_amount")}</p>
      <p className="text-xl font-bold text-green-600">
        {formatCurrency(item.item_payment_amount_with_tax || (parseFloat(item.total_price) + parseFloat(item.shipping_charges)))}
      </p>
    </div> */}
  </div>
</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Details */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                {t("product_details")}
              </h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border flex-shrink-0">
                    <img
                      src={
                        item.product?.product_image ||
                        "/placeholder-product.png"
                      }
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {item.product?.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                      {item.product?.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">{t("category")}:</span>
                        <span className="font-medium ml-2">
                          {item.product?.category?.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t("unit")}:</span>
                        <span className="font-medium ml-2">
                          {item.product?.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("base_price")}:
                        </span>
                        <span className="font-medium ml-2">
                          {formatCurrency(item.product?.base_price)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t("stock")}:</span>
                        <span className="font-medium ml-2">
                          {item.product?.stock_quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Item Details */}
           {/* Order Item Details */}
<div className="bg-gray-50 rounded-xl p-4">
  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
    <ShoppingCart className="w-5 h-5 text-green-600" />
    {t("order_details")}
  </h3>
  <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="text-gray-600">{t("quantity")}:</span>
        <span className="font-medium ml-2">
          {item.quantity} {item.product?.unit}
        </span>
      </div>
      <div>
        <span className="text-gray-600">{t("base_price_per_unit")}:</span>
        <span className="font-medium ml-2">
          {formatCurrency(item.base_price)}
        </span>
      </div>
      <div>
        <span className="text-gray-600">{t("discounted_price_per_unit")}:</span>
        <span className="font-medium ml-2">
          {formatCurrency(item.discounted_price)}
        </span>
      </div>
      <div>
        <span className="text-gray-600">{t("discount_percentage")}:</span>
        <span className="font-medium ml-2">
          {item.discount_percentage}%
        </span>
      </div>
      <div>
        <span className="text-gray-600">{t("shipping_charges")}:</span>
        <span className="font-medium ml-2">
          {formatCurrency(item.shipping_charges)}
        </span>
      </div>
      <div>
        <span className="text-gray-600">{t("total_before_tax")}:</span>
        <span className="font-medium ml-2">
          {formatCurrency(item.total_price)}
        </span>
      </div>
      {item.taxable_amount && parseFloat(item.taxable_amount) > 0 && (
        <>
          <div>
            <span className="text-gray-600">{t("tax_amount")}:</span>
            <span className="font-medium ml-2">
              {formatCurrency(item.taxable_amount)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">{t("total_with_tax")}:</span>
            <span className="font-medium ml-2 text-green-600">
              {formatCurrency(item.amount_with_tax || (parseFloat(item.total_price) + parseFloat(item.taxable_amount)))}
            </span>
          </div>
        </>
      )}
    </div>

    {/* Item Summary */}
    {item.item_summary && (
      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">
          {t("summary")}
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded">
          <div>
            <span className="text-gray-600">{t("product")}:</span>
            <span className="font-medium ml-2">
              {item.item_summary.product_name}
            </span>
          </div>
          <div>
            <span className="text-gray-600">{t("total_discount")}:</span>
            <span className="font-medium ml-2 text-green-600">
              - {formatCurrency(item.item_summary.total_discount)}
            </span>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

            {/* Seller Information */}
            {item.seller_user && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  {t("seller_information")}
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.seller_user.first_name}{" "}
                        {item.seller_user.last_name}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {item.seller_user.email}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {item.seller_user.phone_number}
                      </p>
                      {item.seller_user.is_verified_seller && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs mt-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified Seller
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Address */}
            {item.order_address && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  {t("delivery_address")}
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.order_address.address}
                      </p>
                      <p className="text-gray-600">
                        {item.order_address.city},{" "}
                        {item.order_address.postal_code}
                      </p>
                      <p className="text-gray-600">
                        {item.order_address.country}
                      </p>
                      {item.order_address.is_rural && (
                        <p className="text-amber-600 text-sm mt-1 font-medium">
                          🚚 Rural delivery area
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tax Information */}
{item.tax_breakdown && (
  <div className="bg-gray-50 rounded-xl p-4">
    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
      <FileText className="w-5 h-5 text-green-600" />
      {t("tax_information")}
    </h3>
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-600">{t("province")}:</span>
        <span className="font-medium">{item.tax_breakdown.province}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">{t("total_tax_rate")}:</span>
        <span className="font-medium">{item.tax_breakdown.total_tax_rate}%</span>
      </div>
    </div>
  </div>
)}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Status Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                {t("status_summary")}
              </h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t("order_status")}:</span>
                  <StatusBadge status={item.item_order_status} type="order" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t("payment_status")}:</span>
                  <StatusBadge
                    status={item.item_payment_status}
                    type="payment"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t("payment_method")}:</span>
                  <span className="font-medium">
                    {item.item_payment_method}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {/* Payment Information */}
<div className="bg-gray-50 rounded-xl p-4">
  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
    {/* <DollarSign className="w-5 h-5 text-green-600" /> */}
    {t("payment_information")}
  </h3>
  <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{t("subtotal_amount_without_tax")}:</span>
      <span className="font-medium">
        {formatCurrency(item.amount_without_tax || item.total_price)}
      </span>
    </div>

    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{t("shipping_charges")}:</span>
      <span
        className={
          parseFloat(item.shipping_charges) === 0
            ? "text-green-600 font-medium"
            : ""
        }
      >
        {parseFloat(item.shipping_charges) === 0
          ? "FREE"
          : formatCurrency(item.shipping_charges)}
      </span>
    </div>

    {item.discount_percentage && parseFloat(item.discount_percentage) > 0 && (
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          {t("discount")} ({item.discount_percentage}%):
        </span>
        <span className="text-green-600 font-medium">
          - {formatCurrency(item.item_summary?.total_discount || 0)}
        </span>
      </div>
    )}

    {/* Tax Breakdown Section */}
    {item.tax_breakdown && (
      <div className="border-t border-gray-200 pt-3 mt-2">
        <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
          <span>{t("tax_details")}:</span>
          <span></span>
        </div>
        
        {/* GST */}
        {item.tax_breakdown.gst && item.tax_breakdown.gst.amount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              GST ({item.tax_breakdown.gst.rate}%):
            </span>
            <span className="font-medium">
              {formatCurrency(item.tax_breakdown.gst.amount)}
            </span>
          </div>
        )}
        
        {/* PST */}
        {item.tax_breakdown.pst && item.tax_breakdown.pst.amount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              PST ({item.tax_breakdown.pst.rate}%):
            </span>
            <span className="font-medium">
              {formatCurrency(item.tax_breakdown.pst.amount)}
            </span>
          </div>
        )}
        
        {/* HST */}
        {item.tax_breakdown.hst && item.tax_breakdown.hst.amount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              HST ({item.tax_breakdown.hst.rate}%):
            </span>
            <span className="font-medium">
              {formatCurrency(item.tax_breakdown.hst.amount)}
            </span>
          </div>
        )}
        
        {/* Total Tax */}
        <div className="flex justify-between text-sm pt-1 border-t border-gray-100 mt-1">
          <span className="text-gray-600 font-medium">{t("total_tax")}:</span>
          <span className="font-medium text-amber-600">
            {formatCurrency(item.tax_breakdown.total_tax_amount || item.taxable_amount)}
          </span>
        </div>
        
        {/* Amount with Tax */}
        <div className="flex justify-between text-sm pt-1">
          <span className="text-gray-600">{t("amount_with_tax")}:</span>
          <span className="font-medium">
            {formatCurrency(item.amount_with_tax || (parseFloat(item.amount_without_tax) + parseFloat(item.taxable_amount)))}
          </span>
        </div>
      </div>
    )}

    {/* Total Paid Amount */}
    <div className="border-t-2 border-gray-200 pt-3 mt-2">
      <div className="flex justify-between font-bold text-lg">
        <span>{t("total_paid")}:</span>
        <span className="text-green-600">
          {formatCurrency(item.item_payment_amount_with_tax || 
            (parseFloat(item.amount_without_tax || item.total_price) + 
             parseFloat(item.taxable_amount || 0) + 
             parseFloat(item.shipping_charges)))}
        </span>
      </div>
      {item.item_payment_method && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{t("payment_method")}:</span>
          <span>{item.item_payment_method}</span>
        </div>
      )}
    </div>
  </div>
</div>

            {/* Expected Delivery */}
            {item.expected_delivery_date && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  {t("delivery_information")}
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      {t("expected_delivery")}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(item.expected_delivery_date)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                {t("order_timeline")}
              </h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Placed:</span>
                  <span className="font-medium">
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {formatDate(item.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Invoice Modal */}
      {showInvoice && user && (
        <InvoiceGenerator
          orderItem={item}
          user={user}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </>
  );
};

// ====================== MAIN COMPONENT ======================
const OrderHistoryPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { data, loading, error } = useAppSelector(
    (state) => state.order?.order || {},
  );
  console.log("OrderHistoryPage dataa:", data);

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showDateFilter, setShowDateFilter] = useState<boolean>(true);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  useEffect(() => {
    // Load initial orders
    dispatch(getOrder());
  }, [dispatch]);

  // Initialize filtered items with all order items
  useEffect(() => {
    if (data) {
      // Handle different response formats
      if (Array.isArray(data)) {
        // If data is already an array of order items
        setFilteredItems(data);
      } else if (data.data && Array.isArray(data.data)) {
        // If data has a data property with array
        setFilteredItems(data.data);
      } else if (data.order_items && Array.isArray(data.order_items)) {
        // If data has order_items property
        setFilteredItems(data.order_items);
      }
    }
  }, [data]);

  const handleDateFilter = async (startDate: string, endDate: string) => {
    setIsFiltering(true);
    try {
      const result = await dispatch(
        getOrderItemsByDate({ startDate, endDate }),
      ).unwrap();

      // The API returns an array of order items directly
      setFilteredItems(result.data || result || []);
    } catch (error) {
      console.error("Error filtering orders:", error);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleClearFilter = () => {
    // Reset to original data
    if (data) {
      if (Array.isArray(data)) {
        setFilteredItems(data);
      } else if (data.data && Array.isArray(data.data)) {
        setFilteredItems(data.data);
      }
    }
  };

  if (loading && !isFiltering) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error && !isFiltering) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Orders
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(getOrder())}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-2">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order History
          </h1> */}
          <p className="text-gray-600">{t("order_history_description")}</p>
        </div>

        {/* Filter Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="flex items-center gap-2 text-green-600 hover:text-green-800"
          >
            <Filter className="w-4 h-4" />
            {showDateFilter ? t("hide_filters") : t("show_filters")}
          </button>
        </div>

        {/* Date Filter Component */}
        {showDateFilter && (
          <DateFilter
            onFilter={handleDateFilter}
            onClear={handleClearFilter}
            isLoading={isFiltering}
          />
        )}

        {/* Order Stats */}
        <OrderStats data={filteredItems} />

        {/* Order History */}
        {selectedItem ? (
          <OrderDetails
            item={selectedItem}
            onBack={() => setSelectedItem(null)}
          />
        ) : (
          <OrderHistoryTable
            orderItems={filteredItems}
            onViewDetails={setSelectedItem}
            isLoading={isFiltering}
          />
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
