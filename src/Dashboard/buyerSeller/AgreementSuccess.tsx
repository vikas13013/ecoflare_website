// AgreementSuccess.jsx - Fixed with CAD currency
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ArrowLeft,
  FileText,
  CreditCard,
  Store,
  ShoppingBag,
  User,
  Shield,
  Loader,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "../../components/StripePaymentForm";
import {
  stripeService,
  CreatePaymentIntentData,
} from "../../services/stripeService";
import { useTranslation } from "react-i18next";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const API_BASE_URL = "https://api.ecoflaresolutions.com";

// Payment Processing Overlay Component
const PaymentProcessingOverlay = ({ amount, currency = "CAD" }: { amount: number; currency?: string }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" />

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-slideUp">
        <div className="text-center">

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {t("processing_payment")}
          </h3>

          <p className="text-gray-600 mb-4">
            {t("processing_payment_message")}
            <span className="font-semibold text-purple-600">
              {" "} {currency} {amount.toLocaleString()}
            </span>
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>{t("stripe_secure_message")}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

// Add these styles to your global CSS or in a style tag
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .animate-slideUp {
    animation: slideUp 0.4s ease-out forwards;
  }
`;

const AgreementSuccess = () => {
  const [agreementData, setAgreementData] = useState<any>(null);
  const [smartContractData, setSmartContractData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [negotiationId, setNegotiationId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Payment States
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [stripePaymentIntentId, setStripePaymentIntentId] = useState<
    string | null
  >(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  // New state for showing processing overlay
  const [showProcessingOverlay, setShowProcessingOverlay] = useState<boolean>(false);

  // Get current user from Redux
  const { user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("negotiationId");
    setNegotiationId(id);
  }, []);

  // Fetch agreement data and smart contract status
  useEffect(() => {
    if (!negotiationId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const contractResponse = await fetch(
          `${API_BASE_URL}/block-chain/smart-contracts/negotiation/${negotiationId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const contractData = await contractResponse.json();
        // console.log("🔍 Full API Response:", contractData);

        if (contractData.status === 0 && contractData.data?.length > 0) {
          const contract = contractData.data[0];
          console.log("📄 Contract Data:", contract);

          setSmartContractData(contract);

          if (contract.price_negotiation) {
            setAgreementData(contract.price_negotiation);
          }
        }
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [negotiationId, token]);

  const handleBack = () => {
    window.history.back();
  };

  const getBuyerName = () => {
    if (smartContractData?.user_data?.buyer) {
      const b = smartContractData.user_data.buyer;
      return `${b.first_name} ${b.last_name}`.trim();
    }
    return "Buyer";
  };

  const getSellerName = () => {
    if (smartContractData?.user_data?.seller) {
      const s = smartContractData.user_data.seller;
      return `${s.first_name} ${s.last_name}`.trim();
    }
    return "Seller";
  };

  const isBuyer = user?.id === smartContractData?.user_data?.buyer?.id;
  const isSeller = user?.id === smartContractData?.user_data?.seller?.id;

  // Get payment info from smart contract data
  const paymentInfo = smartContractData?.payment_info;

// Get advance payment schedule
const advanceSchedule = smartContractData?.payment_schedule?.find(
  (item: any) => item.payment_type === "advance"
);

const advanceInstallmentId = advanceSchedule?.installment_id;
const advanceAmount = advanceSchedule?.amount_cad;


  const summary = paymentInfo?.summary;
  const advancePayment = summary?.by_type?.advance;

  // Calculate amounts from payment_info
  const contractTotal = summary?.contract_total_cad || 0;
  const contractTotalWithTax = summary?.contract_total_with_tax || 0;
  const advanceDue = advancePayment?.due_cad || 0;
  const advancePaid = advancePayment?.paid_cad || 0;
  const advanceRemaining = advancePayment?.remaining_cad || advanceDue;

  // Check if advance payment is already made
  const isAdvancePaid = advancePaid > 0;

  // Amount to pay in CAD
  // const amountToPay = Math.round(advanceRemaining);
  // const amountToPayInCents = amountToPay * 100; 

  const advanceAmountWithTax = advanceSchedule?.amount_with_tax || 0;

// Agar summary use karna hai to:
const amountToPay = advanceAmountWithTax;
const amountToPayInCents = amountToPay * 100;

  console.log("🔧 Calculated Values:", {
      contractTotalWithTax,
    advanceDue,
    advancePaid,
    advanceRemaining,
    isAdvancePaid,
    amountToPay,
    amountToPayInCents,
    isBuyer,
    isSeller,
    userId: user?.id,
    buyerId: smartContractData?.user_data?.buyer?.id,
  });

  // Product details
  const product = smartContractData?.price_negotiation?.negotiation?.product;
  const quantity = smartContractData?.price_negotiation?.expected_quantity || 0;
  const pricePerUnit =
    smartContractData?.price_negotiation?.expected_price || 0;

  /**
   * STEP 1: Create Stripe payment intent for advance payment
   */
  const createAdvancePaymentIntent = async (): Promise<{
    clientSecret: string;
    paymentIntentId: string;
    payment_id: number;
  } | null> => {
    if (!token || !smartContractData) {
      setPaymentError("Authentication required or contract data missing");
      return null;
    }

    if (amountToPay <= 0) {
      setPaymentError("Invalid payment amount");
      return null;
    }

    try {
      const paymentData: CreatePaymentIntentData = {
        amount: amountToPayInCents,
        currency: "CAD",
        description: `Advance payment for Smart Contract #${smartContractData.id} - ${product?.name || "Product"}`,
        metadata: {
          smart_contract_id: smartContractData.id.toString(),
          negotiation_id: negotiationId || "",
          payment_type: "advance",
          buyer_id: user?.id?.toString() || "",
          amount_cad: amountToPay.toString(),
          contract_total_cad: contractTotalWithTax.toString(),
        },
      };

      console.log("💳 Creating payment intent with CAD:", paymentData);
      const response = await stripeService.createPaymentIntent(
        paymentData,
        token,
      );
      console.log("💳 Payment intent response:", response);

      if (response.data?.client_secret) {
        return {
          clientSecret: response.data.client_secret,
          paymentIntentId: response.data.payment_intent_id || response.data.paymentIntentId,
          payment_id: response.data.payment_id
        };
      } else if (response.client_secret) {
        return {
          clientSecret: response.client_secret,
          paymentIntentId: response.payment_intent_id,
          payment_id: response.payment_id
        };
      } else {
        console.error("No client_secret in response:", response);
        setPaymentError("Failed to initialize payment - no client secret");
        return null;
      }
    } catch (error: any) {
      console.error("Failed to create payment intent:", error);
      setPaymentError(error.message || "Failed to initialize payment");
      return null;
    }
  };

  /**
   * STEP 2: Handle payment button click
   */
  const handlePaymentClick = async () => {
    console.log("🖱️ Payment button clicked");

    if (!user) {
      setPaymentError("Please login to make payment");
      return;
    }

    if (!smartContractData) {
      setPaymentError("Smart contract data not found");
      return;
    }

    if (isAdvancePaid) {
      setPaymentError("Advance payment has already been made");
      return;
    }

    if (amountToPay <= 0) {
      setPaymentError("No payment amount due");
      return;
    }

    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      const result = await createAdvancePaymentIntent();
      console.log("advance_payment_intent_created", result);
      
      if (result && result.clientSecret) {
        console.log(
          "✅ Client secret received:",
          result.clientSecret.substring(0, 20) + "...",
        );
        console.log("✅ Payment ID received:", result.payment_id);
        
        setClientSecret(result.clientSecret);
        setStripePaymentIntentId(result.paymentIntentId);
        setPaymentId(result.payment_id);
        setShowPaymentModal(true);
      }
    } catch (error: any) {
      setPaymentError(error.message || "Failed to initialize payment");
    } finally {
      setPaymentProcessing(false);
    }
  };

  /**
   * STEP 3: Submit payment to blockchain API after Stripe success
   */
  const submitPaymentToBlockchain = async (
    paymentIntentId: string,
    paymentMethod: string,
  ) => {
    if (!smartContractData) return;

    if (!paymentId) {
      console.error("❌ paymentId is null or undefined");
      setPaymentError("Payment ID is missing");
      return;
    }

    try {
      // Show processing overlay
      setShowProcessingOverlay(true);

      const advanceSchedule = smartContractData?.payment_schedule?.find(
  (item: any) => item.payment_type === "advance"
);
      
      // Create payment record in blockchain
      const paymentData = {
        smart_contract_id: smartContractData.id,
        pg_txn_id: paymentIntentId,
        amount: advanceSchedule?.amount_with_tax,
        payments_id: paymentId,
        payment_type: advanceSchedule?.payment_type,
        installment_id: advanceSchedule?.installment_id,
        stripe_status: "Paid",
        payment_method: paymentMethod || "Card",
      };

      console.log("📤 Submitting payment to blockchain:", paymentData);

      // Validate required fields
      const requiredFields = ['smart_contract_id', 'pg_txn_id', 'amount', 'payment_type', 'payments_id'];
      const missingFields = requiredFields.filter(field => !paymentData[field as keyof typeof paymentData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const response = await fetch(
        `${API_BASE_URL}/block-chain/smart-contracts/payments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(paymentData),
        },
      );

      const result = await response.json();
      console.log("📥 Blockchain payment response:", result);
      
      // Keep overlay visible for a moment to show success
      setTimeout(() => {
        setShowProcessingOverlay(false);
        if (response.ok) {
          // Navigate to transactions page
          navigate(`/transactions`);
        } else {
          throw new Error(result.message || "Failed to record payment");
        }
      }, 1500); // Show success state briefly
      
    } catch (error: any) {
      setShowProcessingOverlay(false);
      console.error("Blockchain payment submission error:", error);
      setPaymentError(
        error.message || "Payment recorded but failed to update blockchain",
      );
    }
  };

  /**
   * STEP 4: Payment success handler from Stripe
   */
  const handlePaymentSuccess = async (
    paymentIntentId: string,
    paymentMethod?: string,
  ) => {
    console.log("✅ Payment success:", { paymentIntentId, paymentMethod });
    console.log("✅ Using payment_id:", paymentId);
    
    if (!paymentId) {
      console.error("❌ paymentId is missing!");
      setPaymentError("Payment ID missing. Please contact support.");
      return;
    }
    
    await submitPaymentToBlockchain(paymentIntentId, paymentMethod || "Card");
  };

  /**
   * STEP 5: Payment error handler
   */
  const handlePaymentError = (errorMessage: string) => {
    console.error("❌ Payment error:", errorMessage);
    setPaymentError(errorMessage);
    setShowPaymentModal(false);
    setClientSecret(null);
  };

  /**
   * Payment Modal Component
   */
  const PaymentModal = () => {
    if (!clientSecret || !smartContractData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Complete Advance Payment
            </h3>
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setClientSecret(null);
                setPaymentError(null);
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Smart Contract ID:</span>
              <span className="font-semibold">#{smartContractData.id}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Product:</span>
              <span className="font-semibold">{product?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-semibold">{quantity} kg</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Payment Type:</span>
              <span className="font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">
                Advance Payment
              </span>
            </div>

            <div className="border-t border-blue-200 my-3 pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Contract Total:</span>
                <span className="font-semibold">
                  CAD {contractTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Contract Total With Tax:</span>
                <span className="font-semibold">
                  CAD {contractTotalWithTax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Advance Due:</span>
                <span className="font-semibold">
                  {/* CAD {advanceDue.toLocaleString()} */}
                  CAD {advanceAmountWithTax.toLocaleString()}
                </span>
              </div>
              {advancePaid > 0 && (
                <div className="flex justify-between items-center mb-2 text-green-600">
                  <span>Already Paid:</span>
                  <span className="font-semibold">
                    CAD {advancePaid.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t border-blue-200">
                <span className="text-gray-800">To Pay Now:</span>
                <span className="text-secondary text-2xl">
                  CAD {amountToPay.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {paymentError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{paymentError}</p>
            </div>
          )}

          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm
              clientSecret={clientSecret}
              amount={amountToPayInCents}
              currency="CAD"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!smartContractData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t("contract_not_found")}
          </h2>
          <button
            onClick={handleBack}
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            {t("go_back")}
          </button>
        </div>
      </div>
    );
  }

  // Payment success banner
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
           {t("payment_successful")}
          </h2>
          <p className="text-gray-600 mb-4">
            Advance payment of CAD {amountToPay.toLocaleString()} has been
            recorded.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {t("refreshing_contract")}
          </p>
          <div className="flex justify-center">
            <Loader className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Add styles */}
      <style>{styles}</style>
      
      {/* Payment Processing Overlay */}
      {showProcessingOverlay && (
        <PaymentProcessingOverlay amount={amountToPay} currency="CAD" />
      )}

      {/* Payment Modal */}
      {showPaymentModal && <PaymentModal />}

      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
             {t("agreement_completed")}
            </h1>
            <p className="text-sm text-gray-500">
              {t("both_parties_signed")}
            </p>
          </div>
        </div>

        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            {t("agreement_signed")}
          </h2>
          <p className="text-green-700">
            Both buyer and seller have successfully signed the agreement.
            {isBuyer
              ? t("complete_advance_payment")
              : t("waiting_buyer_payment")}
          </p>
        </div>

        {/* User Role Indicator */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            {isBuyer ? (
              <>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">You are viewing as</p>
                  <p className="font-semibold text-gray-800">
                    Buyer: {user?.first_name} {user?.last_name}
                  </p>
                </div>
              </>
            ) : isSeller ? (
              <>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Store className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">You are viewing as</p>
                  <p className="font-semibold text-gray-800">
                    Seller: {user?.first_name} {user?.last_name}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Viewing as</p>
                  <p className="font-semibold text-gray-800">Guest</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Deal Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              {t("deal_summary")}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Contract ID</span>
              <span className="font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-sm">
                #{smartContractData.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">{t("buyer")}</p>
                <p className="font-medium text-gray-800">{getBuyerName()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{t("seller")}</p>
                <p className="font-medium text-gray-800">{getSellerName()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">{t("product")}</p>
                <p className="font-medium text-gray-800">
                  {product?.name || "Product"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{t("grade")}</p>
                <p className="font-medium text-gray-800">
                  {smartContractData.price_negotiation?.grade || "Standard"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">{t("quantity")}</p>
                <p className="font-medium text-gray-800">{quantity} kg</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{t("price_per_kg")}</p>
                <p className="font-medium text-gray-800">CAD {pricePerUnit}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t("signatures")}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-800">
                  Buyer: {getBuyerName()}
                </span>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-800">
                  Seller: {getSellerName()}
                </span>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t("payment_details")}
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">{t("contract_total")}</span>
              <span className="font-bold text-gray-800">
                CAD {contractTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              {/* <span className="text-gray-600">{t("contract_total")}</span> */}
              <span className="text-gray-600">Contract Total With Tax</span>
              <span className="font-bold text-gray-800">
                CAD {contractTotalWithTax.toLocaleString()}
              </span>
            </div>



            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-700 mb-3">
                {t("advance_payment")}
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t("due_amount")}</span>
                  <span className="font-semibold text-purple-600">
                    CAD {advanceDue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Due Amount With Tax</span>
                  <span className="font-semibold text-purple-600">
                    CAD {advanceAmountWithTax.toLocaleString()}
                  </span>
                </div>

                {advancePaid > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>{t("paid_amount")}</span>
                    <span className="font-semibold">
                      CAD {advancePaid.toLocaleString()}
                    </span>
                  </div>
                )}

                {advanceRemaining > 0 && !isAdvancePaid && (
                  <div className="flex justify-between items-center text-blue-600">
                    <span>{t("remaining_to_pay")}</span>
                    <span className="font-semibold">
                      CAD {advanceAmountWithTax.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-700 mb-3">{t("final_payment")}</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t("due_after_delivery")}</span>
                <span className="font-semibold">
                  CAD {(summary?.by_type?.final?.due_cad || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Status */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6" />
            <h3 className="font-semibold">{t("blockchain_verification")}</h3>
          </div>
          <p className="text-sm opacity-90 mb-2">
            ✓ Signatures locked and verified on blockchain
          </p>
          <p className="text-sm opacity-90">
            {isAdvancePaid
              ? t("advance_payment_completed")
              : t("advance_payment_pending")}
          </p>
        </div>

        {/* Payment Action Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-purple-100">
          {isAdvancePaid ? (
            // Advance already paid
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                {t("advance_payment_completed")}
              </h3>
              <p className="text-gray-600 mb-4">
                You have paid CAD {advancePaid.toLocaleString()} as advance.
              </p>
              <button
                onClick={() =>
                  (window.location.href = `/transactions`)
                }
                className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
              >
                Check Transaction Status
              </button>
            </div>
          ) : isBuyer ? (
            // Buyer - Show payment button
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800">
                    Advance Payment Required
                  </span>
                  <span className="text-3xl font-bold text-purple-600">
                    CAD {advanceAmountWithTax.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Complete the advance payment to lock this deal. The remaining
                  amount will be paid after delivery.
                </p>
              </div>

              <button
                onClick={handlePaymentClick}
                disabled={paymentProcessing || amountToPay <= 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {t("initializing_payment")}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    {t("pay_advance")} (CAD {advanceAmountWithTax.toLocaleString()})
                  </>
                )}
              </button>
            </>
          ) : (
            // Seller - Show waiting message
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Waiting for Payment
              </h3>
              <p className="text-gray-600">
                Waiting for buyer to complete the advance payment of CAD{" "}
                {advanceAmountWithTax.toLocaleString()}. You'll be notified once payment
                is received.
              </p>
            </div>
          )}

          {paymentError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{paymentError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgreementSuccess;