// TransactionDetails.jsx - Reorganized with better UI
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ArrowLeft,
  FileText,
  Store,
  ShoppingBag,
  User,
  Shield,
  Loader,
  AlertCircle,
  CreditCard,
  Clock,
  ExternalLink,
  Download,
  Package,
  Truck,
  CheckSquare,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  Receipt,
  Smartphone,
  Mail,
  Phone,
  Building2,
  TrendingUp,
  Wallet,
  Banknote,
  Users
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "../../components/StripePaymentForm";
import AgreementPDFDocument from "./AgreementPDFDocument";
import {
  stripeService,
  CreatePaymentIntentData,
} from "../../services/stripeService";
import { pdf } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const API_BASE_URL = "https://api.ecoflaresolutions.com";

const DELIVERY_STATUS = {
  PENDING: "Pending",
  DISPATCHED: "Dispatched",
  DELIVERED: "Delivered",
};

// Payment Processing Overlay Component
const PaymentProcessingOverlay = ({ amount, currency = "CAD", paymentType = "installment" }: { amount: number; currency?: string; paymentType?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-slideUp">
        <div className="text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader className="w-10 h-10 animate-spin text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {paymentType === "installment" ? t("processing_installment_payment") : t("processing_final_payment")}
          </h3>
          <p className="text-gray-600 mb-4">
            {t("processing_payment_message")}{" "}
            <span className="font-semibold text-purple-600">{currency} {amount.toLocaleString()}</span>
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>{t("secured_by_stripe")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
  .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
  .animate-slideInRight { animation: slideInRight 0.4s ease-out forwards; }
`;

const TransactionDetails = () => {
  const { transactionId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tncDocument, setTncDocument] = useState<any>(null);

  // Payment States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showProcessingOverlay, setShowProcessingOverlay] = useState(false);
  const [currentPaymentType, setCurrentPaymentType] = useState<string>("");
  const [currentInstallment, setCurrentInstallment] = useState<any>(null);
  
  // PDF States
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementPdfUrl, setAgreementPdfUrl] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Delivery Status Update States
  const [updatingDelivery, setUpdatingDelivery] = useState<number | null>(null);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [deliverySuccess, setDeliverySuccess] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchTransactionDetails();
    fetchTncDocument();
  }, [transactionId]);

  const fetchTncDocument = async () => {
    try {
      const response = await fetch("https://api.ecoflaresolutions.com/legal_doc/legal-documents/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === 0) {
        const tnc = data.data.find((doc: any) => doc.document_type === "block_chain_terms_and_conditions");
        setTncDocument(tnc);
      }
    } catch (err) {
      console.error("TNC fetch error:", err);
    }
  };

  const fetchTransactionDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/block-chain/smart-contracts/transactions/${transactionId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.status === 0) {
        setTransaction(data.data);
      } else {
        setError(data.message || "Failed to fetch transaction");
      }
    } catch (err) {
      setError("Error loading transaction details");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  const createPaymentIntent = async (installment: any): Promise<any> => {
    if (!token || !transaction) {
      setPaymentError("Authentication required or transaction data missing");
      return null;
    }

    try {
      const amountToPay = installment.amount_with_tax * 100;
      const paymentData: CreatePaymentIntentData = {
        amount: amountToPay,
        currency: "CAD",
        description: `${installment.payment_type} payment for Transaction #${transaction.id}`,
        metadata: {
          smart_contract_id: transaction?.smart_contract?.id?.toString() || "",
          payment_type: installment.payment_type,
          installment_id: installment.installment_id.toString(),
          buyer_id: user?.id?.toString() || "",
          amount_with_tax: installment.amount_with_tax.toString(),
          transaction_id: transaction.id.toString(),
        },
      };

      const response = await stripeService.createPaymentIntent(paymentData, token);
      
      if (response.client_secret || response.data?.client_secret) {
        return {
          clientSecret: response.client_secret || response.data.client_secret,
          paymentIntentId: response.payment_intent_id || response.data.payment_intent_id,
          payment_id: response.payment_id || response.data.payment_id,
        };
      }
      return null;
    } catch (error: any) {
      setPaymentError(error.message || "Failed to initialize payment");
      return null;
    }
  };

  const handlePaymentClick = async (installment: any) => {
    if (!user || !transaction) {
      setPaymentError("Please login to make payment");
      return;
    }
    if (installment.payment_status === "Paid") {
      setPaymentError("This installment has already been paid");
      return;
    }

    setCurrentPaymentType(installment.payment_type);
    setCurrentInstallment(installment);
    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      const result = await createPaymentIntent(installment);
      if (result?.clientSecret) {
        setClientSecret(result.clientSecret);
        setPaymentId(result.payment_id);
        setShowPaymentModal(true);
      }
    } catch (error: any) {
      setPaymentError(error.message || "Failed to initialize payment");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const submitPaymentToBlockchain = async (paymentIntentId: string, paymentMethod: string) => {
    if (!transaction || !currentInstallment || !paymentId) return;

    try {
      setShowProcessingOverlay(true);
      const paymentData = {
        smart_contract_id: transaction?.smart_contract?.id,
        pg_txn_id: paymentIntentId,
        amount: currentInstallment.amount_with_tax,
        payments_id: paymentId,
        payment_type: currentInstallment.payment_type,
        installment_id: currentInstallment.installment_id,
        stripe_status: "Paid",
        payment_method: paymentMethod || "Card",
        tax_amount: currentInstallment.tax_amount,
        tax_rate: currentInstallment.tax_breakdown?.total_tax_rate,
      };

      const response = await fetch(`${API_BASE_URL}/block-chain/smart-contracts/payments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        setPaymentSuccess(true);
        setTimeout(() => {
          fetchTransactionDetails();
          setShowPaymentModal(false);
          setPaymentSuccess(false);
          setCurrentInstallment(null);
          setShowProcessingOverlay(false);
        }, 2000);
      } else {
        throw new Error("Failed to record payment");
      }
    } catch (error: any) {
      setShowProcessingOverlay(false);
      setPaymentError(error.message || "Payment recorded but failed to update blockchain");
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string, paymentMethod?: string) => {
    if (!paymentId) {
      setPaymentError("Payment ID missing. Please contact support.");
      return;
    }
    await submitPaymentToBlockchain(paymentIntentId, paymentMethod || "Card");
  };

  const handlePaymentError = (errorMessage: string) => {
    setPaymentError(errorMessage);
    setShowPaymentModal(false);
    setClientSecret(null);
    setCurrentInstallment(null);
  };

  const updateDeliveryStatus = async (installmentId: number, newStatus: string) => {
    if (!token) return;
    setUpdatingDelivery(installmentId);
    try {
      const response = await fetch(`${API_BASE_URL}/block-chain/contract-payment-schedule/${installmentId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ delivery_status: newStatus }),
      });
      if (response.ok) {
        setDeliverySuccess(`Delivery status updated to ${newStatus}`);
        fetchTransactionDetails();
      }
    } catch (error: any) {
      setDeliveryError(error.message || "Failed to update delivery status");
    } finally {
      setUpdatingDelivery(null);
    }
  };

  const generateAgreementPDF = async () => {
    if (!transaction) return;
    setGeneratingPdf(true);
    try {
      const blob = await pdf(<AgreementPDFDocument
        buyer={transaction?.buyer?.full_name || "Buyer"}
        seller={transaction?.seller?.full_name || "Seller"}
        amount={transaction?.payment_info?.summary?.total_paid_cad?.toString() || "0"}
        buyerTime={transaction?.signatures?.buyer_signature_time ? new Date(transaction.signatures.buyer_signature_time).toLocaleString() : ""}
        sellerTime={transaction?.signatures?.seller_signature_time ? new Date(transaction.signatures.seller_signature_time).toLocaleString() : ""}
        buyerSignature={transaction?.signatures?.buyer_signature}
        sellerSignature={transaction?.signatures?.seller_signature}
        transaction={transaction}
        tncDocument={tncDocument}
      />).toBlob();
      setAgreementPdfUrl(URL.createObjectURL(blob));
      setShowAgreementModal(true);
    } catch (err) {
      setError("Failed to generate agreement PDF");
    } finally {
      setGeneratingPdf(false);
    }
  };

  const isInstallmentPayable = (installment: any) => installment.payment_status === "Pending" && installment.delivery_status === DELIVERY_STATUS.DISPATCHED;
  const canMarkAsDispatched = (installment: any) => installment.payment_status === "Pending" && installment.delivery_status === DELIVERY_STATUS.PENDING;
  const canMarkAsDelivered = (installment: any) => installment.payment_status === "Paid" && installment.delivery_status === DELIVERY_STATUS.DISPATCHED;

  const getNextPendingInstallment = () => {
    if (!transaction?.payment_schedule) return null;
    return transaction.payment_schedule.find((item: any) => 
      item.payment_status === "Pending" && (item.installment_number > 0 || item.payment_type !== "advance")
    );
  };

  const allPaymentsCompleted = transaction?.payment_schedule?.filter((item: any) => 
    item.installment_number > 0 || item.payment_type !== "advance"
  ).every((item: any) => item.payment_status === "Paid" && item.delivery_status === DELIVERY_STATUS.DELIVERED) || false;

  const getDeliveryStatusColor = (status: string) => {
    switch(status) {
      case DELIVERY_STATUS.PENDING: return "bg-yellow-100 text-yellow-700";
      case DELIVERY_STATUS.DISPATCHED: return "bg-blue-100 text-blue-700";
      case DELIVERY_STATUS.DELIVERED: return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getDeliveryStatusIcon = (status: string) => {
    switch(status) {
      case DELIVERY_STATUS.PENDING: return <Clock className="w-4 h-4" />;
      case DELIVERY_STATUS.DISPATCHED: return <Truck className="w-4 h-4" />;
      case DELIVERY_STATUS.DELIVERED: return <CheckSquare className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => `CAD ${amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Payment Modal Component
  const PaymentModal = () => {
    if (!clientSecret || !transaction || !currentInstallment) return null;
    const product = transaction?.price_negotiation?.negotiation?.product;
    
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold text-gray-900 capitalize">
              Complete {currentInstallment.payment_type} Payment
            </h3>
            <button onClick={() => { setShowPaymentModal(false); setClientSecret(null); setPaymentError(null); }} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 mb-5">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600">Product</span><span className="font-semibold">{product?.name || "N/A"}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Installment</span><span className="font-semibold">#{currentInstallment.installment_number}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Due Date</span><span className="font-semibold">{new Date(currentInstallment.due_date).toLocaleDateString()}</span></div>
              <div className="border-t border-gray-200 my-2 pt-2">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatCurrency(currentInstallment.amount_cad)}</span></div>
                {currentInstallment.tax_amount > 0 && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Tax ({currentInstallment.tax_breakdown?.total_tax_rate}%)</span>
                    <span>+ {formatCurrency(currentInstallment.tax_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
                  <span>Total to Pay</span>
                  <span className="text-purple-600">{formatCurrency(currentInstallment.amount_with_tax)}</span>
                </div>
              </div>
            </div>
          </div>

          {paymentError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{paymentError}</p>
            </div>
          )}

          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm
              clientSecret={clientSecret}
              amount={currentInstallment.amount_with_tax * 100}
              currency="CAD"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        </div>
      </div>
    );
  };

  const AgreementModal = () => {
    if (!agreementPdfUrl) return null;
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> Final Agreement</h3>
            <button onClick={() => { setShowAgreementModal(false); setAgreementPdfUrl(null); }} className="text-white hover:text-gray-200 text-2xl">×</button>
          </div>
          <div className="p-4 bg-gray-50">
            <div className="flex gap-3 justify-end mb-4">
              <a href={agreementPdfUrl} download={`Agreement_${transaction?.id}.pdf`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" /> Download PDF
              </a>
              <a href={agreementPdfUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm">
                <ExternalLink className="w-4 h-4" /> Open in New Tab
              </a>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 h-[500px] overflow-auto">
              <iframe src={agreementPdfUrl} className="w-full h-full" title="Agreement PDF" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Transaction not found"}</p>
          <button onClick={handleBack} className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700">Go Back</button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center animate-slideUp">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your {currentPaymentType} payment has been processed successfully.</p>
          <Loader className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
        </div>
      </div>
    );
  }

  const { id, rfq_id, blockchain_tx_hash, blockchain_block_number, blockchain_status, blockchain_timestamp, created_at, signatures, buyer, seller, price_negotiation, payment_info, payment_schedule } = transaction;
  const product = price_negotiation?.negotiation?.product;
  const isBuyer = user?.id === buyer?.id;
  const isSeller = user?.id === seller?.id;
  const regularInstallments = payment_schedule?.filter((item: any) => item.installment_number > 0 || item.payment_type !== "advance") || [];
  const nextPendingInstallment = getNextPendingInstallment();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <style>{styles}</style>
      
      {showProcessingOverlay && currentInstallment && (
        <PaymentProcessingOverlay amount={currentInstallment.amount_with_tax} currency="CAD" paymentType={currentInstallment.payment_type} />
      )}
      {showPaymentModal && <PaymentModal />}
      {showAgreementModal && <AgreementModal />}

      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Transaction Details</h1>
              <p className="text-sm text-gray-500 mt-1">Transaction ID: #{id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${
              blockchain_status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {blockchain_status === "CONFIRMED" ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {blockchain_status}
            </span>
          </div>
        </div>

        {/* Status Messages */}
        {deliverySuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-slideUp">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm text-green-700">{deliverySuccess}</p>
          </div>
        )}
        {deliveryError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700">{deliveryError}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Product & Parties */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2"><Package className="w-5 h-5" /> Product Details</h2>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <img src={product?.product_image || product?.images?.[0]?.image || 'https://via.placeholder.com/80'} alt={product?.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{product?.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product?.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">Grade: {price_negotiation?.grade}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div><p className="text-xs text-gray-500">Quantity</p><p className="font-semibold">{price_negotiation?.expected_quantity} {price_negotiation?.unit}</p></div>
                  <div><p className="text-xs text-gray-500">Price/Unit</p><p className="font-semibold">{formatCurrency(price_negotiation?.expected_price)}</p></div>
                  <div><p className="text-xs text-gray-500">Delivery Period</p><p className="font-semibold text-sm">{new Date(price_negotiation?.delivery_start_date).toLocaleDateString()} - {new Date(price_negotiation?.delivery_end_date).toLocaleDateString()}</p></div>
                  <div><p className="text-xs text-gray-500">RFQ ID</p><p className="font-mono text-xs">{rfq_id}</p></div>
                </div>
              </div>
            </div>

            {/* Parties Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Parties</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-purple-600" /></div>
                  <div className="flex-1"><p className="text-xs text-purple-600 font-medium">BUYER</p><p className="font-semibold text-gray-800">{buyer?.full_name}</p><p className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{buyer?.email}</p><p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{buyer?.phone_number}</p></div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Store className="w-5 h-5 text-blue-600" /></div>
                  <div className="flex-1"><p className="text-xs text-blue-600 font-medium">SELLER</p><p className="font-semibold text-gray-800">{seller?.full_name}</p><p className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{seller?.email}</p><p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{seller?.phone_number}</p>{seller?.is_verified_seller && <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Verified Seller</span>}</div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between"><span className="text-gray-600">Buyer Signed</span>{signatures?.sing_by_buyer ? <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" />{new Date(signatures.buyer_signature_time).toLocaleDateString()}</span> : <span className="text-yellow-600">Pending</span>}</div>
                  <div className="flex items-center justify-between mt-2"><span className="text-gray-600">Seller Signed</span>{signatures?.sign_by_seller ? <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" />{new Date(signatures.seller_signature_time).toLocaleDateString()}</span> : <span className="text-yellow-600">Pending</span>}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Installments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2"><Wallet className="w-5 h-5" /> Payment Summary</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-sm text-gray-500 mb-1">Total Contract</p><p className="text-2xl font-bold text-gray-800">{formatCurrency(payment_info?.summary?.contract_total_with_tax || payment_info?.summary?.contract_total_cad)}</p></div>
                  <div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-sm text-green-600 mb-1">Total Paid</p><p className="text-2xl font-bold text-green-600">{formatCurrency(payment_info?.summary?.total_paid_cad)}</p></div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-sm text-blue-600 mb-1">Remaining</p><p className="text-2xl font-bold text-blue-600">{formatCurrency(payment_info?.summary?.total_due_cad)}</p></div>
                </div>
                
                {/* Tax Breakdown */}
                {payment_info?.summary?.tax && payment_info.summary.tax.total_tax_amount > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Receipt className="w-4 h-4" /> Tax Breakdown ({payment_info.summary.tax.province})</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {payment_info.summary.tax.gst_rate > 0 && <div><p className="text-xs text-gray-500">GST ({payment_info.summary.tax.gst_rate}%)</p><p className="font-semibold">{formatCurrency(payment_info.summary.tax.gst_amount)}</p></div>}
                      {payment_info.summary.tax.pst_rate > 0 && <div><p className="text-xs text-gray-500">PST ({payment_info.summary.tax.pst_rate}%)</p><p className="font-semibold">{formatCurrency(payment_info.summary.tax.pst_amount)}</p></div>}
                      {payment_info.summary.tax.hst_rate > 0 && <div><p className="text-xs text-gray-500">HST ({payment_info.summary.tax.hst_rate}%)</p><p className="font-semibold">{formatCurrency(payment_info.summary.tax.hst_amount)}</p></div>}
                      <div><p className="text-xs text-gray-500">Total Tax</p><p className="font-semibold text-purple-600">{formatCurrency(payment_info.summary.tax.total_tax_amount)}</p></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Installments Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2"><Calendar className="w-5 h-5" /> Payment Schedule</h2>
              </div>
              <div className="p-5 space-y-4">
                {regularInstallments.map((installment: any, index: number) => {
                  const isCurrentInstallment = nextPendingInstallment?.installment_id === installment.installment_id;
                  const canBeProcessed = isCurrentInstallment;
                  
                  return (
                    <div key={installment.installment_id} className={`border rounded-xl overflow-hidden transition-all ${installment.payment_status === "Paid" ? "border-green-200 bg-green-50/30" : "border-gray-200 hover:shadow-md"} ${!canBeProcessed && installment.payment_status === "Pending" ? "opacity-60" : ""}`}>
                      <div className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${installment.payment_status === "Paid" ? "bg-green-100" : "bg-purple-100"}`}>
                              {installment.payment_status === "Paid" ? <CheckCircle className="w-4 h-4 text-green-600" /> : <CreditCard className="w-4 h-4 text-purple-600" />}
                            </div>
                            <div>
                              <p className="font-semibold capitalize text-gray-800">{installment.payment_type === "installment" ? `Installment ${installment.installment_number}` : "Final Payment"}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {new Date(installment.due_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-purple-600">{formatCurrency(installment.amount_with_tax)}</p>
                            {installment.tax_amount > 0 && <p className="text-xs text-gray-500">(incl. tax {formatCurrency(installment.tax_amount)})</p>}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200">
                            <span className="text-xs text-gray-500">Payment:</span>
                            {installment.payment_status === "Paid" ? <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle className="w-3 h-3" />Paid</span> : <span className="flex items-center gap-1 text-yellow-600 text-sm"><Clock className="w-3 h-3" />Pending</span>}
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getDeliveryStatusColor(installment.delivery_status)}`}>
                            {getDeliveryStatusIcon(installment.delivery_status)}
                            <span className="text-sm">{installment.delivery_status}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-3">
                          {isBuyer && installment.payment_status === "Pending" && isInstallmentPayable(installment) && canBeProcessed && (
                            <button onClick={() => handlePaymentClick(installment)} disabled={paymentProcessing} className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2">
                              <CreditCard className="w-4 h-4" /> Pay Now
                            </button>
                          )}
                          {isSeller && installment.payment_status === "Pending" && canMarkAsDispatched(installment) && canBeProcessed && (
                            <button onClick={() => updateDeliveryStatus(installment.installment_id, DELIVERY_STATUS.DISPATCHED)} disabled={updatingDelivery === installment.installment_id} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                              <Truck className="w-4 h-4" /> {updatingDelivery === installment.installment_id ? "Updating..." : "Mark as Dispatched"}
                            </button>
                          )}
                          {isSeller && installment.payment_status === "Paid" && canMarkAsDelivered(installment) && (
                            <button onClick={() => updateDeliveryStatus(installment.installment_id, DELIVERY_STATUS.DELIVERED)} disabled={updatingDelivery === installment.installment_id} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                              <CheckSquare className="w-4 h-4" /> {updatingDelivery === installment.installment_id ? "Updating..." : "Mark as Delivered"}
                            </button>
                          )}
                          {installment.payment_status === "Paid" && installment.delivery_status === DELIVERY_STATUS.DELIVERED && (
                            <div className="flex-1 text-center py-2.5 text-sm text-green-600 bg-green-50 rounded-xl border border-green-200">✓ Completed</div>
                          )}
                          {!canBeProcessed && installment.payment_status === "Pending" && (
                            <div className="flex-1 text-center py-2.5 text-sm text-gray-500 bg-gray-50 rounded-xl">Waiting for previous installment</div>
                          )}
                        </div>

                        {installment.paid_at && (
                          <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-100">Paid on: {new Date(installment.paid_at).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agreement Button */}
            {allPaymentsCompleted && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">All Payments Completed!</h3>
                  <p className="text-gray-600 mb-5">All payments have been completed successfully. You can now view the final agreement.</p>
                  <button onClick={generateAgreementPDF} disabled={generatingPdf} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50">
                    {generatingPdf ? <><Loader className="w-5 h-5 animate-spin" /> Generating...</> : <><FileText className="w-5 h-5" /> View Final Agreement</>}
                  </button>
                </div>
              </div>
            )}

            {/* Blockchain Info */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg p-5">
              <div className="flex items-center gap-2 mb-3"><Shield className="w-5 h-5 text-purple-400" /><h3 className="font-semibold text-white">Blockchain Verification</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><p className="text-gray-400 text-xs">Transaction Hash</p><p className="font-mono text-gray-300 text-xs break-all">{blockchain_tx_hash}</p></div>
                <div><p className="text-gray-400 text-xs">Block Number</p><p className="text-gray-300">{blockchain_block_number}</p></div>
                <div><p className="text-gray-400 text-xs">Timestamp</p><p className="text-gray-300">{new Date(blockchain_timestamp * 1000).toLocaleString()}</p></div>
                <div><p className="text-gray-400 text-xs">Created</p><p className="text-gray-300">{new Date(created_at).toLocaleString()}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;