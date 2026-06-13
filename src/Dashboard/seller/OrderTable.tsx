import React from "react";
import { useNavigate } from "react-router-dom";
import { FiTruck, FiCheckCircle, FiClock, FiXCircle, FiEye } from "react-icons/fi";
import { Package, User, Calendar, DollarSign, ShoppingBag, Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Order {
  id: number;
  sub_order_number: string;
  order: number;
  order_user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  seller_user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
    category: {
      name: string;
    };
    product_image: string;
    unit: string;
  };
  quantity: string;
  item_payment_amount: string;
  item_payment_amount_with_tax?: string;
  total_price: string;
  amount_without_tax?: string;
  taxable_amount?: string;
  item_order_status: string;
  item_payment_status: string;
  created_at: string;
  expected_delivery_date?: string;
  shipping_charges: string;
  discount_percentage: string;
}

interface OrderTableProps {
  orders: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(amountNum)) return "CAD 0.00";
    return `CAD ${amountNum.toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status icon and color
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return { icon: <FiCheckCircle className="mr-2" />, color: 'text-green-600 bg-green-100' };
      case 'shipped':
        return { icon: <FiTruck className="mr-2" />, color: 'text-blue-600 bg-blue-100' };
      case 'confirmed':
        return { icon: <FiCheckCircle className="mr-2" />, color: 'text-green-600 bg-green-100' };
      case 'cancelled':
        return { icon: <FiXCircle className="mr-2" />, color: 'text-red-600 bg-red-100' };
      case 'pending':
        return { icon: <FiClock className="mr-2" />, color: 'text-yellow-600 bg-yellow-100' };
      default:
        return { icon: <FiClock className="mr-2" />, color: 'text-gray-600 bg-gray-100' };
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get total paid amount (with tax)
  const getTotalPaidAmount = (order: Order) => {
    return parseFloat(order.item_payment_amount_with_tax || 
                      order.item_payment_amount || 
                      (parseFloat(order.total_price || '0') + parseFloat(order.shipping_charges || '0')));
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t("order_details")}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {t("customer")}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t("date")}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                {t("quantity")}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                {t("amount")}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {t("status")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {t("actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.item_order_status);
            const totalPaid = getTotalPaidAmount(order);
            const subtotalWithoutTax = parseFloat(order.amount_without_tax || order.total_price || 0);
            const taxAmount = parseFloat(order.taxable_amount || 0);
            
            return (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/seller/orders/${order.id}`)}
              >
                {/* Order Details */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border flex-shrink-0">
                      <img
                        src={order.product?.product_image || '/placeholder-product.png'}
                        alt={order.product?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.png';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {order.product?.name}
                        </p>
                        <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">
                          {order.product?.category?.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        #{order.sub_order_number}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {t("order_id")}: {order.order}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Customer */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.order_user?.first_name} {order.order_user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                      {order.order_user?.email}
                    </p>
                    {order.seller_user && (
                      <p className="text-xs text-gray-400 mt-1">
                        {t("seller")}: {order.seller_user.first_name}
                      </p>
                    )}
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm text-gray-900">
                      {formatDate(order.created_at)}
                    </p>
                    {order.expected_delivery_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {t("expected")}: {formatDate(order.expected_delivery_date)}
                      </p>
                    )}
                  </div>
                </td>

                {/* Quantity */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.quantity}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.product?.unit}
                    </p>
                  </div>
                </td>

                {/* Amount - Updated to show total paid with tax */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(totalPaid)}
                    </p>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <p className="text-xs text-gray-500">
                        {t("subtotal")}: {formatCurrency(subtotalWithoutTax)}
                      </p>
                      {taxAmount > 0 && (
                        <p className="text-xs text-gray-500">
                          {t("tax")}: {formatCurrency(taxAmount)}
                        </p>
                      )}
                      {parseFloat(order.shipping_charges || '0') > 0 && (
                        <p className="text-xs text-gray-500">
                          {t("shipping")}: {formatCurrency(order.shipping_charges)}
                        </p>
                      )}
                      {parseFloat(order.discount_percentage || '0') > 0 && (
                        <p className="text-xs text-green-600">
                          {order.discount_percentage}% {t("off")}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        {statusConfig.icon}
                        {order.item_order_status || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.item_payment_status)}`}>
                        {order.item_payment_status || 'N/A'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/seller/orders/${order.id}`);
                    }}
                    className="flex items-center gap-2 text-green-600 hover:text-green-800 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <FiEye />
                    <span className="hidden md:inline">{t("view")}</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* No Results Message */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("no_orders_found")}</p>
        </div>
      )}

      {/* Summary Footer */}
      {orders.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              {t("showing")} <span className="font-medium">{orders.length}</span> {t("orders")}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>{t("confirmed")}: {
                  orders.filter(o => o.item_order_status === 'Confirmed').length
                }</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span>{t("pending")}: {
                  orders.filter(o => o.item_order_status === 'Pending').length
                }</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;