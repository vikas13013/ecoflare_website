// TransactionList.jsx - Updated with tax support
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Loader,
  AlertCircle,
  Store,
  ShoppingBag,
  FileText,
  CreditCard,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  User,
  Package,
  DollarSign,
  TrendingUp,
  Receipt
} from "lucide-react";
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useTranslation } from "react-i18next";

const API_BASE_URL = "https://api.ecoflaresolutions.com";

interface Transaction {
  id: number;
  rfq_id: string;
  blockchain_tx_hash: string;
  blockchain_block_number: number;
  blockchain_status: string;
  blockchain_timestamp: number;
  created_at: string;
  updated_at: string;
  smart_contract: {
    id: number;
    contract_created: boolean;
    created_at: string;
    updated_at: string;
  };
  signatures: {
    sing_by_buyer: boolean;
    buyer_signature: string;
    buyer_signature_time: string;
    sign_by_seller: boolean;
    seller_signature: string;
    seller_signature_time: string;
  };
  buyer: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    country_code: string | null;
    is_verified_seller: boolean;
  };
  seller: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    country_code: string | null;
    is_verified_seller: boolean;
  };
  negotiation: {
    id: number;
    status: string;
    buying_type: string;
    buyer_accepted: boolean;
    seller_accepted: boolean;
    accepted_by_both_at: string | null;
    created_at: string;
  };
  price_negotiation: {
    id: number;
    negotiation: {
      id: number;
      product: {
        id: number;
        name: string;
        description: string;
        category: number;
        product_image: string | null;
        images: Array<{
          id: number;
          product: number;
          image: string;
          alt_text: string;
          created_at: string;
        }>;
        status: string;
        user: number;
        product_availability: number;
        organic_certified: boolean;
        is_negotiable: boolean;
        is_flexible_buying: boolean;
        is_bulk_buying: boolean;
        is_preorder_produce: boolean;
        canada_grade: string;
        currency: string;
        base_price: string;
        hst_included: boolean;
        stock_quantity: string;
        min_order_quantity: string;
        unit: string;
        growing_session: string;
        expiry_date: string;
        harvest_date: string;
        food_safety_certification: string;
        is_top_products: boolean;
        quantity_discounts: Array<any>;
      };
      buyer: number;
      seller: number;
      buying_type: string;
      status: string;
      buyer_accepted: boolean;
      seller_accepted: boolean;
      accepted_by_both_at: string | null;
      created_at: string;
      updated_at: string;
      seller_responded_at: string;
      expires_at: string | null;
      time_remaining: string | null;
      is_expired: boolean;
    };
    user: number;
    quantity: number;
    expected_quantity: number;
    unit: string;
    message: string;
    status: string;
    frequency_of_deliveries: string;
    product_variety: string;
    expiry_date: string | null;
    harvest_date: string | null;
    delivery_start_date: string;
    delivery_end_date: string;
    product_type: string;
    grade: string;
    product_availability: number;
    location: number;
    ships_from: string | null;
    expected_price: string;
    amount_with_tax: number | {
      base_total: number;
      gst_rate: number;
      pst_rate: number;
      hst_rate: number;
      total_tax_rate: number;
      gst_amount: number;
      pst_amount: number;
      hst_amount: number;
      total_tax_amount: number;
      total_with_tax: number;
      currency: string;
      province: string;
    } | null;
    created_at: string;
    updated_at: string;
  };
  payment_info: {
    payments: Array<{
      id: number;
      payments_id: number;
      trade_id: string;
      transaction_id: number;
      pg_txn_id: string;
      payment_type: string;
      amount_cad: number;
      payment_method: string;
      stripe_status: string;
      blockchain_status: string;
      blockchain_tx_hash: string | null;
      smart_contract_id: number;
      created_at: string;
      updated_at: string;
    }>;
    summary: {
      price_per_unit_cad: number;
      quantity: number;
      contract_total_cad: number;
      contract_total_with_tax: number;
      tax: {
        province?: string;
        gst_rate?: number;
        pst_rate?: number;
        hst_rate?: number;
        total_tax_rate?: number;
        gst_amount?: number;
        pst_amount?: number;
        hst_amount?: number;
        total_tax_amount?: number;
        total_with_tax?: number;
        currency?: string;
      } | null;
      total_paid_cad: number;
      total_due_cad: number;
      total_payments_count: number;
      by_type: {
        advance: {
          due_cad: number;
          remaining_cad: number;
          total_transactions: number;
          paid_cad: number;
          pending_cad: number;
          last_payment: {
            id: number;
            amount_cad: number;
            stripe_status: string;
            blockchain_status: string;
            created_at: string;
          } | null;
          frequency_breakdown?: {
            per_installment: number;
            installments: number;
            label: string;
          };
        };
        installment?: {
          due_cad: number;
          remaining_cad: number;
          total_transactions: number;
          paid_cad: number;
        };
        final: {
          due_cad: number;
          remaining_cad: number;
          total_transactions: number;
          paid_cad: number;
          pending_cad: number;
          last_payment: {
            id: number;
            amount_cad: number;
            stripe_status: string;
            blockchain_status: string;
            created_at: string;
          } | null;
        };
      };
      schedule_stats: {
        total_installments: number;
        paid_installments: number;
        pending_installments: number;
        delivered_count: number;
        pending_delivery: number;
      };
    };
  };
  payment_schedule: Array<{
    installment_id: number;
    installment_number: number;
    payment_type: string;
    amount_cad: number;
    amount_with_tax: number;
    tax_breakdown: {
      gst: { rate: number; amount: number };
      pst: { rate: number; amount: number };
      hst: { rate: number; amount: number };
      total_tax_rate: number;
      total_tax_amount: number;
    };
    tax_amount: number;
    platform_fee: number;
    payment_handling_fee: number;
    amount_payable: number;
    due_date: string;
    payment_status: string;
    delivery_status: string;
    paid_at: string | null;
    notes: string;
    contract_payment_id: number | null;
  }>;
}

const TransactionList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [buyingTypeFilter, setBuyingTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem("accessToken");

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/block-chain/smart-contracts/transactions/?page=${page}&page_size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Transactions Response:", data);

      if (data.status === 0) {
        setTransactions(data.data.results);
        setCurrentPage(data.data.page);
        setTotalPages(data.data.total_pages);
        setTotalTransactions(data.data.total);
      } else {
        setError(data.message || "Failed to fetch transactions");
      }
    } catch (err) {
      setError("Error loading transactions");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions(currentPage);
  };

  const handleTransactionClick = (transactionId: number) => {
    navigate(`/transaction/${transactionId}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchTransactions(newPage);
  };

  const getPaymentStatus = (transaction: Transaction) => {
    const summary = transaction.payment_info.summary;
    const totalPaid = summary.total_paid_cad;
    const totalDue = summary.total_due_cad;
    const totalContract = summary.contract_total_with_tax || summary.contract_total_cad;
    
    if (totalDue === 0 && totalPaid === totalContract) {
      return { status: "completed", label: "Payment Completed", color: "green", icon: CheckCircle };
    } else if (summary.by_type.advance.paid_cad > 0 && summary.by_type.advance.remaining_cad === 0) {
      return { status: "advance_paid", label: "Advance Paid", color: "blue", icon: TrendingUp };
    } else if (summary.by_type.advance.remaining_cad > 0 && summary.by_type.advance.paid_cad === 0) {
      return { status: "pending", label: "Advance Pending", color: "yellow", icon: Clock };
    } else if (totalPaid > 0 && totalDue > 0) {
      return { status: "partial", label: "Partial Payment", color: "purple", icon: CreditCard };
    } else {
      return { status: "pending", label: "Payment Pending", color: "yellow", icon: Clock };
    }
  };

  const getRole = (transaction: Transaction) => {
    if (user?.id === transaction.buyer.id) return "buyer";
    if (user?.id === transaction.seller.id) return "seller";
    return "other";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBuyingTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'flexible_buying': 'Flexible Buying',
      'preorder_produce': 'Pre-order',
      'bulk_buying': 'Bulk Buying'
    };
    return types[type] || type;
  };

  const formatTaxAmount = (taxBreakdown: any) => {
    if (!taxBreakdown) return null;
    const totalTax = taxBreakdown.total_tax_amount;
    const rate = taxBreakdown.total_tax_rate;
    if (totalTax > 0) {
      return `${rate}% (${totalTax.toLocaleString()} CAD)`;
    }
    return "Tax Exempt";
  };

  const filteredTransactions = transactions.filter(transaction => {
    const productName = transaction.price_negotiation?.negotiation?.product?.name || '';
    const matchesSearch = 
      transaction.rfq_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.seller.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter !== "all") {
      const paymentStatus = getPaymentStatus(transaction);
      if (paymentStatus.status !== statusFilter) return false;
    }
    
    if (buyingTypeFilter !== "all") {
      if (transaction.negotiation.buying_type !== buyingTypeFilter) return false;
    }
    
    return matchesSearch;
  });

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">{t("loading_transactions")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {t("my_transactions")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Total {totalTransactions} transaction{totalTransactions !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-all disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all text-gray-700"
            >
              {t("back_to_dashboard")}
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by RFQ ID, product, buyer or seller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Advance Pending</option>
                <option value="advance_paid">Advance Paid</option>
                <option value="completed">Completed</option>
                <option value="partial">Partial Payment</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              <select
                value={buyingTypeFilter}
                onChange={(e) => setBuyingTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="flexible_buying">Flexible Buying</option>
                <option value="preorder_produce">Pre-order</option>
                <option value="bulk_buying">Bulk Buying</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t("no_transactions_found")}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all" || buyingTypeFilter !== "all"
                ? "Try adjusting your search or filters" 
                : "You haven't made any transactions yet"}
            </p>
            {(searchTerm || statusFilter !== "all" || buyingTypeFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setBuyingTypeFilter("all");
                }}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => {
                const paymentStatus = getPaymentStatus(transaction);
                const role = getRole(transaction);
                const product = transaction.price_negotiation?.negotiation?.product;
                const StatusIcon = paymentStatus.icon;
                const isBuyer = role === 'buyer';
                const counterparty = isBuyer ? transaction.seller : transaction.buyer;
                const productImage = product?.product_image || 
                  (product?.images && product.images[0]?.image) || 
                  'https://via.placeholder.com/80';
                
                const totalWithTax = transaction.payment_info.summary.contract_total_with_tax || 
                                     transaction.payment_info.summary.contract_total_cad;
                const taxInfo = transaction.payment_info.summary.tax;
                
                return (
                  <div
                    key={transaction.id}
                    onClick={() => handleTransactionClick(transaction.id)}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Top Row */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Transaction #{transaction.id}
                            </h3>
                            <p className="text-sm text-gray-500">
                              RFQ: {transaction.rfq_id}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1
                            ${paymentStatus.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                            ${paymentStatus.color === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                            ${paymentStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${paymentStatus.color === 'purple' ? 'bg-purple-100 text-purple-700' : ''}
                          `}>
                            <StatusIcon className="w-3 h-3" />
                            {paymentStatus.label}
                          </span>
                          
                          <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${transaction.blockchain_status === 'CONFIRMED' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {transaction.blockchain_status}
                          </span>
                          
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {getBuyingTypeLabel(transaction.negotiation.buying_type)}
                          </span>
                          
                          <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${role === 'buyer' ? 'bg-purple-100 text-purple-700' : 
                              role === 'seller' ? 'bg-blue-100 text-blue-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                            {role === 'buyer' ? 'Buyer' : role === 'seller' ? 'Seller' : 'Viewer'}
                          </span>
                        </div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid md:grid-cols-4 gap-4">
                        {/* Product Info */}
                        <div className="flex items-start gap-3">
                          <img
                            src={productImage}
                            alt={product?.name || 'Product'}
                            className="w-14 h-14 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-800">{product?.name || 'Product'}</p>
                            <p className="text-sm text-gray-500">
                              {transaction.price_negotiation.expected_quantity} {transaction.price_negotiation.unit}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Grade: {transaction.price_negotiation.grade}
                            </p>
                          </div>
                        </div>

                        {/* Parties */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {isBuyer ? 'Seller' : 'Buyer'}
                          </p>
                          <p className="font-medium text-gray-800">{counterparty.full_name}</p>
                          <p className="text-xs text-gray-500">{counterparty.email}</p>
                          {counterparty.is_verified_seller && (
                            <span className="text-xs text-green-600">✓ Verified</span>
                          )}
                        </div>

                        {/* Payment Summary */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            Total (incl. Tax)
                          </p>
                          <p className="font-bold text-lg text-purple-600">
                            CAD {totalWithTax?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          {taxInfo && taxInfo.total_tax_amount > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Receipt className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                Tax: {taxInfo.total_tax_rate}% ({taxInfo.total_tax_amount.toLocaleString()} CAD)
                              </p>
                            </div>
                          )}
                          <div className="flex flex-col gap-1 mt-2 text-sm">
                            <span className="text-green-600">
                              Paid: CAD {transaction.payment_info.summary.total_paid_cad?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-blue-600">
                              Due: CAD {transaction.payment_info.summary.total_due_cad?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {/* Date & Action */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {formatDate(transaction.created_at)}
                          </p>
                          <p className="text-xs text-gray-400 mb-2">
                            Delivery: {formatDate(transaction.price_negotiation.delivery_start_date)} - {formatDate(transaction.price_negotiation.delivery_end_date)}
                          </p>
                          <button className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-1">
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Payment Progress Bar */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
                                style={{
                                  width: `${(transaction.payment_info.summary.total_paid_cad / totalWithTax) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Installments:</span>
                            <span className="font-medium">
                              {transaction.payment_info.summary.schedule_stats.paid_installments} / {transaction.payment_info.summary.schedule_stats.total_installments} Paid
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>Advance: CAD {transaction.payment_info.summary.by_type.advance.paid_cad?.toLocaleString()}</span>
                            <span>Installments: CAD {transaction.payment_info.summary.by_type.installment?.paid_cad?.toLocaleString() || 0}</span>
                            <span>Final: CAD {transaction.payment_info.summary.by_type.final.paid_cad?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-3 h-3" />
                            <span>Deliveries: {transaction.payment_info.summary.schedule_stats.delivered_count} / {transaction.payment_info.summary.schedule_stats.total_installments}</span>
                          </div>
                        </div>
                      </div>

                      {/* Last Payment Info */}
                      {transaction.payment_info.payments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
                          <CreditCard className="w-3 h-3" />
                          <span>Last payment:</span>
                          <span className="font-medium">
                            CAD {transaction.payment_info.payments[transaction.payment_info.payments.length - 1].amount_cad?.toLocaleString()}
                          </span>
                          <span>({transaction.payment_info.payments[transaction.payment_info.payments.length - 1].payment_type})</span>
                          <span>•</span>
                          <span>{formatDate(transaction.payment_info.payments[transaction.payment_info.payments.length - 1].created_at)}</span>
                          <span>•</span>
                          <span className={transaction.payment_info.payments[transaction.payment_info.payments.length - 1].blockchain_status === 'CONFIRMED' 
                            ? 'text-green-600' : 'text-yellow-600'
                          }>
                            {transaction.payment_info.payments[transaction.payment_info.payments.length - 1].blockchain_status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-white hover:shadow-md'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionList;