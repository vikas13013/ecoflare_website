import React, { useState, useEffect } from "react";
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

// ====================== INTERFACES ======================
interface PlanFeature {
  label: string;
  available: boolean;
}

interface PricingPlan {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  currency: string;
  shortDescription: string;
  features: PlanFeature[];
  isActive: boolean;
  isCurrentUserPlan?: boolean;
  userPlanDetails?: any;
  negotiation_limit?: number;
  duration_in_days?: number;
  popular?: boolean;
}

interface ApiPlan {
  id: number;
  is_current_user_plan: boolean;
  user_plan_details: any;
  plan_type: string;
  currency: string;
  price: string;
  short_description: string;
  features: string[];
  negotiation_limit: number;
  duration_in_days: number;
  is_active: boolean;
}

// ====================== MAIN COMPONENT ======================
const Pricing: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem("accessToken");
  const { t } = useTranslation();

  // State Management
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Plan Activation States
  const [activatingPlanId, setActivatingPlanId] = useState<number | null>(null);
  const [activationMessage, setActivationMessage] = useState<string | null>(
    null,
  );
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);

  // ====================== EFFECT HOOKS ======================
  useEffect(() => {
    fetchPlans();
  }, []);

  // ====================== API CALLS ======================
  /**
   * STEP 1: Fetch all subscription plans from API
   * Called on component mount
   */
  const fetchPlans = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/orders/subs-plans/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status !== 0) {
        throw new Error(result.message || "Failed to fetch plans");
      }

      if (!result.data?.plans || !Array.isArray(result.data.plans)) {
        throw new Error("Invalid response format: plans array not found");
      }

      const transformedPlans = transformApiPlans(result.data.plans);
      setPlans(transformedPlans);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * STEP 2: Transform API response into frontend format
   * Adds sorting, feature mapping, and badge logic
   */
  const transformApiPlans = (apiPlans: ApiPlan[]): PricingPlan[] => {
    const planOrder = { basic: 1, standard: 2, premium: 3 };
    const sortedPlans = [...apiPlans].sort(
      (a, b) => (planOrder[a.plan_type] || 0) - (planOrder[b.plan_type] || 0),
    );

    const middleIndex = Math.floor(sortedPlans.length / 2);

    return sortedPlans.map((plan, index) => {
      const priceValue = parseFloat(plan.price);
      const isCurrentPlan = plan.is_current_user_plan;
      const isPopular = index === middleIndex;

      // Build features array
      const features: PlanFeature[] = [
        ...(plan.negotiation_limit
          ? [
              {
                label: `${plan.negotiation_limit} Negotiations per month`,
                available: true,
              },
            ]
          : []),
        ...(plan.duration_in_days
          ? [
              {
                label: `${plan.duration_in_days} Days Duration`,
                available: true,
              },
            ]
          : []),
        ...plan.features.map((feature) => ({
          label: feature.trim(),
          available: true,
        })),
        ...(isCurrentPlan && plan.user_plan_details
          ? [
              {
                label: `Remaining: ${plan.user_plan_details.remaining_negotiations}/${plan.user_plan_details.negotiation_limit} negotiations`,
                available: true,
              },
              {
                label: `Days Left: ${plan.user_plan_details.days_remaining}`,
                available: true,
              },
              {
                label: `✓ Your Current Plan`,
                available: true,
              },
            ]
          : []),
      ];

      return {
        id: plan.id,
        name: plan.plan_type.charAt(0).toUpperCase() + plan.plan_type.slice(1),
        price: `${plan.currency} ${priceValue.toFixed(2)}`,
        priceValue,
        currency: plan.currency,
        shortDescription: plan.short_description,
        features,
        isActive: plan.is_active,
        isCurrentUserPlan: isCurrentPlan,
        userPlanDetails: plan.user_plan_details,
        negotiation_limit: plan.negotiation_limit,
        duration_in_days: plan.duration_in_days,
        popular: isPopular,
      };
    });
  };

  /**
   * STEP 3: Create Stripe payment intent when user selects a plan
   * Called before showing payment modal
   */
  const createPaymentIntent = async (
    plan: PricingPlan,
  ): Promise<string | null> => {
    if (!token) {
      setActivationMessage("Authentication required");
      return null;
    }

    try {
      const paymentData: CreatePaymentIntentData = {
        amount: Math.round(plan.priceValue * 100),
        currency: plan.currency,
        description: `${plan.name} Subscription`,
      };

      const response = await stripeService.createPaymentIntent(
        paymentData,
        token,
      );

      return response.data?.client_secret || response.client_secret || null;
    } catch (error: any) {
      console.error("Failed to create payment intent:", error);
      setActivationMessage(error.message || "Failed to initialize payment");
      return null;
    }
  };

  /**
   * STEP 4: Activate user plan after successful payment
   * Called from payment success handler
   */
  const activateUserPlan = async (
    planId: number,
    paymentData: {
      transactionId: string;
      paymentIntentId?: string;
    },
  ): Promise<void> => {
    if (!user || !token) {
      setActivationMessage("Please log in to activate a plan");
      return;
    }

    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      setActivationMessage("Plan not found");
      return;
    }

    setActivatingPlanId(planId);
    setPaymentProcessing(true);

    try {
      const requestBody = {
        user_id: user.id,
        plan_id: planId,
        transaction_id: paymentData.transactionId,
        payment_status: "succeeded",
        auto_renew: true,
        payment_data: {
          gateway: "stripe",
          amount: Math.round(plan.priceValue * 100),
          currency: plan.currency,
          payment_intent_id: paymentData.paymentIntentId,
        },
      };

      const response = await fetch(`${API_BASE_URL}/plan/user-plan/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! Status: ${response.status}`,
        );
      }

      setActivationMessage(result.message || "Plan successfully activated!");
      setShowSuccessModal(true);
      setShowPaymentModal(false);

      // Refresh plans to update current user plan status
      fetchPlans();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred during plan activation";
      setActivationMessage(errorMessage);
      console.error("Error activating plan:", err);
    } finally {
      setActivatingPlanId(null);
      setPaymentProcessing(false);
      setClientSecret(null);
    }
  };

  // ====================== EVENT HANDLERS ======================
  /**
   * MAIN FLOW: Handle plan selection -> Payment intent -> Show payment modal
   */
  const handlePlanSelection = async (planId: number): Promise<void> => {
    // Validation checks
    const selectedPlan = plans.find((plan) => plan.id === planId);
    if (!selectedPlan) {
      setActivationMessage("Plan not found");
      return;
    }

    if (!selectedPlan.isActive) {
      setActivationMessage("This plan is currently not available");
      return;
    }

    if (!user) {
      setActivationMessage("Please login to subscribe to a plan");
      return;
    }

    if (selectedPlan.isCurrentUserPlan) {
      setActivationMessage("This is already your current plan");
      return;
    }

    // Initialize payment
    setSelectedPlan(selectedPlan);
    setPaymentProcessing(true);

    try {
      const secret = await createPaymentIntent(selectedPlan);
      if (secret) {
        setClientSecret(secret);
        setShowPaymentModal(true);
      }
    } catch (error: any) {
      setActivationMessage(error.message || "Failed to initialize payment");
    } finally {
      setPaymentProcessing(false);
    }
  };

  /**
   * Payment success handler - called from StripePaymentForm
   */
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!selectedPlan) return;

    const transactionId = paymentIntentId;
    await activateUserPlan(selectedPlan.id, {
      transactionId,
      paymentIntentId,
    });
  };

  /**
   * Payment error handler - called from StripePaymentForm
   */
  const handlePaymentError = (errorMessage: string) => {
    setActivationMessage(errorMessage);
    setShowPaymentModal(false);
  };

  // ====================== UI COMPONENTS ======================
  const renderLoading = () => (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="text-gray-600 text-lg">{t("loading_plans")}</p>
      </div>
    </section>
  );

  const renderError = () => (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {t("unable_load_plans")}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPlans}
            className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-primary transition"
          >
            {t("try_again")}
          </button>
        </div>
      </div>
    </section>
  );

  const PaymentModal = () => {
    if (!selectedPlan || !clientSecret) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {t("complete_payment")}
            </h3>
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setClientSecret(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">{t("plan")}:</span>
              <span className="font-semibold">{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">{t("duration")}:</span>
              <span className="font-semibold">
                {selectedPlan.duration_in_days} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("total")}:</span>
              <span className="text-2xl font-bold text-secondary">
                {selectedPlan.price}
              </span>
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <StripePaymentForm
              clientSecret={clientSecret}
              amount={Math.round(selectedPlan.priceValue * 100)}
              currency={selectedPlan.currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        </div>
      </div>
    );
  };

  const renderPlanCard = (plan: PricingPlan) => {
    const isActivating = activatingPlanId === plan.id;
    const isCurrentPlan = plan.isCurrentUserPlan || false;
    const isPopular = plan.popular || false;

    const getButtonText = () => {
      if (!user) return t("login_required");
      if (isCurrentPlan) return t("current_plan");
      if (!plan.isActive) return t("unavailable");
      if (paymentProcessing && isActivating) return t("initializing");
      return t("subscribe_now");
    };

    const isButtonDisabled =
      isCurrentPlan || !plan.isActive || paymentProcessing || !user;

    return (
      <div
        key={plan.id}
        className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:scale-105 ${
          isCurrentPlan
            ? "bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl border-2 border-green-300"
            : isPopular
              ? "bg-gradient-to-br from-secondary to-primary shadow-2xl border-2 border-white transform scale-105 text-white"
              : "bg-white shadow-lg border border-gray-200"
        }`}
      >
        {/* Current Plan Badge */}
        {isCurrentPlan && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              Current Plan
            </span>
          </div>
        )}

        {/* Popular Badge */}
        {!isCurrentPlan && isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-white text-secondary px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              Most Popular
            </span>
          </div>
        )}

        {/* Plan Content */}
        <div className="text-center mb-6">
          <h3
            className={`text-2xl font-bold mb-2 ${isCurrentPlan ? "text-green-700" : isPopular ? "text-white" : "text-gray-900"}`}
          >
            {plan.name}
            {isCurrentPlan && " (Active)"}
          </h3>
          <p
            className={`text-sm mb-4 ${isCurrentPlan ? "text-green-600" : isPopular ? "text-blue-100" : "text-gray-600"}`}
          >
            {plan.shortDescription}
          </p>
          <div className="flex items-baseline justify-center mb-2">
            <span
              className={`text-2xl font-bold ${isCurrentPlan ? "text-green-700" : isPopular ? "text-white" : "text-secondary"}`}
            >
              {plan.price}
            </span>
            <span
              className={
                isCurrentPlan
                  ? "text-green-600 ml-2"
                  : isPopular
                    ? "text-blue-100 ml-2"
                    : "text-gray-600 ml-2"
              }
            >
              /month
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="flex-1 mb-8">
          <ul className="space-y-4">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${isCurrentPlan ? "text-green-500" : isPopular ? "text-green-300" : "text-green-500"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className={
                    isCurrentPlan
                      ? "text-green-700"
                      : isPopular
                        ? "text-blue-100"
                        : "text-gray-700"
                  }
                >
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => handlePlanSelection(plan.id)}
          disabled={isButtonDisabled}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition ${
            isCurrentPlan
              ? "bg-green-100 text-green-700 cursor-not-allowed border border-green-300"
              : isButtonDisabled
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-secondary text-white hover:bg-primary"
          }`}
        >
          {getButtonText()}
        </button>
      </div>
    );
  };

  // ====================== MAIN RENDER ======================
  if (loading) return renderLoading();
  if (error) return renderError();

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
             {t("subscription_success")}
            </h3>
            <p className="text-gray-600 mb-6">{activationMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-primary transition w-full"
            >
              {t("continue")}
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && <PaymentModal />}

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("choose_subscription_plan")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("subscription_plan_description")}
            </p>
          </div>

          {/* Activation Message */}
          {activationMessage && !showSuccessModal && (
            <div
              className={`max-w-2xl mx-auto mb-8 p-4 rounded-lg text-center ${
                activationMessage.toLowerCase().includes("success")
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : activationMessage.toLowerCase().includes("fail")
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : "bg-blue-100 text-blue-800 border border-blue-300"
              }`}
            >
              {activationMessage}
            </div>
          )}

          {/* Pricing Cards */}
          <div
            className={`grid gap-8 max-w-6xl mx-auto ${
              plans.length === 1
                ? "grid-cols-1 max-w-md"
                : plans.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 lg:grid-cols-3"
            }`}
          >
            {plans.map((plan) => renderPlanCard(plan))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
