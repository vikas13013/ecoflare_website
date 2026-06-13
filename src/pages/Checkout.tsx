import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import {
  createOrder,
  clearOrder,
  createPaymentIntent,
} from "../features/order/orderThunk";
import { getCart } from "../features/cart/cartThunk";
import { fetchAddresses } from "../features/address/addressThunk";
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  MapPin,
  Plus,
  Lock,
  X,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import broccoliImg from "../assets/new-images/shimla.png";

// Stripe imports
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "../config/stripe";
import StripePaymentForm from "../components/StripePaymentForm";

import { useTranslation } from "react-i18next";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  // Get data from Redux store
  const {
    items: cartItems,
    summary,
    loading: cartLoading,
  } = useSelector((state: RootState) => state.cart);
  const data = useSelector((state: RootState) => state.cart);
  console.log(data, "this is data");

  console.log(summary, "this is summary");

  const finalAmount =
  summary?.cart_items_summary?.reduce((total, item) => {
    return total + (item.final_amount || 0);
  }, 0) || 0;

  const {
    order,
    loading: orderLoading,
    error,
    paymentIntent,
  } = useSelector((state: RootState) => state.order);

  const { addresses, loading: addressesLoading } = useSelector(
    (state: RootState) => state.address
  );

  console.log("Addresses:", addresses);

  const { user } = useSelector((state: RootState) => state.auth);

  // Form state
  const [formData, setFormData] = useState({
    addressId: "",
    paymentMethod: "STRIPE", // Default to COD
    deliveryInstructions: "",
  });

  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showStripeModal, setShowStripeModal] = useState(false); // Changed to modal state

  // Fetch cart and addresses data on component mount
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (formData.addressId) {
      dispatch(getCart(formData.addressId));
    }
  }, [formData.addressId, dispatch]);

  // Calculate order totals from summary
  const subtotal = summary?.total_base_price || 0;
  const shipping = summary?.total_shipping_charges || 0;
  const discount = summary?.total_discount || 0;
  
  // Extract tax from cart_items_summary if available
  const cartItemsSummary = summary?.cart_items_summary || [];
  const tax = cartItemsSummary.reduce((total, item) => {
    // taxable_amount is the tax amount from the API
    return total + (parseFloat(item.taxable_amount) || 0);
  }, 0);
  
  // Amount without tax (this is the discounted total)
  const amountWithoutTax = cartItemsSummary.reduce((total, item) => {
    return total + (parseFloat(item.amount_without_tax) || 0);
  }, 0);
  
  // Final total with tax
  const total = summary?.total_payable || (subtotal + shipping - discount + tax);

  // Convert to cents for Stripe (Stripe uses smallest currency unit)
  const totalInCents = Math.round(finalAmount * 100);

  // Prepare cart items
  const normalizedCart =
    cartItems?.map((item: any) => {
      const product = item.product || {};
      const quantity = parseFloat(item.quantity || "0");
      const pricePerUnit = parseFloat(item.base_price || "0");
      const totalPrice = parseFloat(item.price_details.base_price_per_unit * item.quantity || "0");
       const summaryItem = summary?.cart_items_summary?.find(
      (s: any) => s.cart_id === item.id
    );

      return {
        id: item.id,
        productId: product.id,
        name: product.name || "Unnamed Product",
        image: product.product_image || broccoliImg,
        unit: product.unit || "unit",
        price: pricePerUnit,
        quantity: quantity,
        total: totalPrice,
         discountPercentage: summaryItem?.discount_percentage || 0,
      };
    }) || [];

  // const cartItemsForOrder =
  //   cartItems?.map((item: any) => ({
  //     product_id: item.product?.id,
  //     quantity: parseFloat(item.quantity || "0"),
  //     cart_id: item.id,
  //   })) || [];

  const cartItemsForOrder =
  cartItems?.map((item: any) => {
    const summaryItem = summary?.cart_items_summary?.find(
      (s: any) => s.cart_id === item.id
    );

    return {
      product_id: item.product?.id,
      quantity: parseFloat(item.quantity || "0"),
      cart_id: item.id,

      // ✅ NEW FIELDS
      amount_with_tax: summaryItem?.amount_with_tax || 0,
      amount_without_tax: summaryItem?.amount_without_tax || 0,
      taxable_amount: summaryItem?.taxable_amount || 0,
    };
  }) || [];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Close modal when payment method changes
    if (name === "paymentMethod" && value !== "STRIPE") {
      setShowStripeModal(false);
      setPaymentError(null);
    }
  };

  // Handle Stripe payment initialization
  const currency = summary?.currency || "CAD";
  const handleStripePayment = async () => {
    if (!formData.addressId) {
      alert("Please select a shipping address");
      return;
    }

    if (cartItemsForOrder.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setPaymentError(null);

      console.log("🔄 Starting Stripe payment initialization...");
      console.log("💰 Payment Details:", {
        amount: totalInCents,
        total: total,
        currency: currency,
        items: cartItemsForOrder.length,
      });

      // Create payment intent
      const paymentData = {
        amount: totalInCents,
        currency: currency,
        description: `Order for ${user?.email} - ${cartItemsForOrder.length} items`,
      };

      console.log("📤 Sending payment intent request...", paymentData);

      const result = await dispatch(createPaymentIntent(paymentData)).unwrap();

      console.log("✅ Payment intent created successfully:", result);

      // Payment intent created successfully, show Stripe modal
      setShowStripeModal(true);
    } catch (error: any) {
      console.error("❌ Payment initialization failed:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
      setPaymentError(error.message || "Failed to initialize payment");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate address selection
    if (!formData.addressId) {
      alert("Please select a shipping address");
      return;
    }

    // Validate cart has items
    if (cartItemsForOrder.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      if (formData.paymentMethod === "COD") {
        // const orderData = {
        //   address_id: Number(formData.addressId),
        //   payment_method: "COD",
        //   payment_status: "pending",
        //   payment_amount: total,
        //   cart_items: cartItemsForOrder,
        // };

        const orderData = {
  address_id: Number(formData.addressId),
  payment_method: "COD",
  payment_status: "pending",
  payment_amount: finalAmount,

  plateform_charges: summary?.platform_fee || 0,
  payment_handaling_fee: summary?.payment_handling_fee || 0,

  cart_items: cartItemsForOrder,
};

        await dispatch(createOrder(orderData)).unwrap();
        setOrderComplete(true);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  // Handle successful Stripe payment
  const handleStripePaymentSuccess = async () => {
    try {
      // const orderData = {
      //   address_id: Number(formData.addressId),
      //   payment_method: "Card",
      //   payment_status: "succeeded",
      //   payment_amount: total,
      //   transaction_id: paymentIntent.paymentIntentId,
      //   payment_data: {
      //     payment_intent_id: paymentIntent.paymentIntentId,
      //   },
      //   cart_items: cartItemsForOrder,
      // };


      const orderData = {
  address_id: Number(formData.addressId),
  payment_method: "Card",
  payment_status: "succeeded",
  payment_amount: finalAmount,

  transaction_id: paymentIntent.paymentIntentId,

  payment_data: {
    stripe_payment_intent: paymentIntent.paymentIntentId,
    stripe_customer_id: "cus_xxx", // optional
  },

  // ✅ NEW FIELDS
  plateform_charges: summary?.platform_fee || 0,
  payment_handaling_fee: summary?.payment_handling_fee || 0,

  cart_items: cartItemsForOrder,
};

      await dispatch(createOrder(orderData)).unwrap();
      setOrderComplete(true);
      setShowStripeModal(false); // Close modal on success
    } catch (error) {
      console.error("Failed to create order after payment:", error);
      setPaymentError(
        "Payment successful but order creation failed. Please contact support."
      );
    }
  };

  // Close Stripe modal
  const handleCloseStripeModal = () => {
    setShowStripeModal(false);
    setPaymentError(null);
  };

  if (orderComplete && order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-sm">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {t("order_confirmed")}
            </h1>
            <p className="text-gray-600 mb-6">
              {t("order_thank_you", { id: order.id })}
            </p>
            <p className="text-gray-600 mb-8">
              {t("order_email_confirmation", { email: user?.email })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/buyer/orders")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                {t("view_order_details")}
              </button>
              <button
                onClick={() => navigate("/marketplace")}
                className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition"
              >
                {t("continue_shopping")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/cart"
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-green-700"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back_to_cart")}
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          {t("checkout")}
        </h1>

        {/* Cart Summary Stats */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">{t("total_items")}</p>
              <p className="text-lg font-semibold text-green-700">
                {summary?.total_items || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">{t("available_items")}</p>
              <p className="text-lg font-semibold text-blue-700">
                {summary?.available_items || 0}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600">{t("total_quantity")}</p>
              <p className="text-lg font-semibold text-amber-700">
                {summary?.total_quantity || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">{t("currency")}</p>
              <p className="text-lg font-semibold text-purple-700">
                {summary?.currency || "CAD"}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left column - Shipping and Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {t("select_shipping_address")}
              </h2>

              {addressesLoading ? (
                <div className="text-center py-4">{t("loading_addresses")}</div>
              ) : addresses && addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className="block p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="addressId"
                          value={address.id}
                          checked={formData.addressId === String(address.id)}
                          onChange={handleInputChange}
                          className="mt-1 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {address.address}, {address.city},{" "}
                              {address.postal_code}
                            </span>
                            {address.is_primary && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                {t("primary")}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.province?.name}, {address.country}
                          </p>
                          {address.is_rural && (
                            <p className="text-sm text-amber-600 mt-1 font-medium">
                              🚚 {t("rural_delivery_area")}
                            </p>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">
                    {t("no_saved_addresses")}
                  </p>
                  <Link
                    to="/profile/addresses"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    {t("add_new_address")}
                  </Link>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {t("payment_method")}
              </h2>

              <div className="space-y-3">
                {/* Stripe Credit Card Option */}
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="STRIPE"
                    checked={formData.paymentMethod === "STRIPE"}
                    onChange={handleInputChange}
                    className="text-green-600 focus:ring-green-500 w-5 h-5"
                  />
                  <div className="ml-3 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <div>
                      <span className="text-gray-700 font-medium">
                        {t("credit_debit_card")}
                      </span>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <span>{t("secure_payment_stripe")}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span>Apple Pay</span>
                          <span>•</span>
                          <span>Google Pay</span>
                        </span>
                      </p>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                {/* <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleInputChange}
                    className="text-green-600 focus:ring-green-500 w-5 h-5"
                  />
                  <div className="ml-3">
                    <span className="text-gray-700 font-medium">
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay when you receive your order
                    </p>
                  </div>
                </label> */}
              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{paymentError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("order_summary")}
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {normalizedCart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {t("cart_empty")}
                  </div>
                ) : (
                  normalizedCart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = broccoliImg;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.quantity} {item.unit}
                        </p>
                        <p className="text-sm text-gray-600">
                          CAD {item.price.toFixed(2)} per {item.unit}
                        </p>

                        {item.discountPercentage > 0 && (
  <p className="text-xs text-green-600 font-medium">
    {item.discountPercentage}% OFF
  </p>
)}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-gray-900">
                          CAD {item.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.quantity} × {item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>{t("subtotal")} ({summary?.total_items || 0} items)</span>
                  <span>CAD {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>{t("shipping")}</span>
                  <span
                    className={
                      shipping === 0 ? "text-green-600 font-medium" : ""
                    }
                  >
                    {shipping === 0 ? t("free") : `CAD ${shipping.toFixed(2)}`}
                  </span>
                </div>

                {summary?.total_discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("discount")}</span>
                    <span>- CAD {summary.total_discount.toFixed(2)}</span>
                  </div>
                )}

                {/* Tax Section - Show only when address is selected */}
                {formData.addressId && tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>{t("tax")}</span>
                    <span>CAD {tax.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg border-t pt-3 text-gray-900">
                  <span>{t("total_amount")}</span>
                  <span>CAD {finalAmount.toFixed(2)}</span>
                </div>

                {/* Tax Info Note */}
                {!formData.addressId && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-700 text-sm">
                      📍 {t("select_address_to_see_tax")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Secure Checkout & Place Order */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-medium">{t("secure_checkout")}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {t("secure_checkout_description")}
              </p>

              {/* Conditional Button based on Payment Method */}
              {formData.paymentMethod === "COD" ? (
                <button
                  type="submit"
                  disabled={
                    orderLoading ||
                    normalizedCart.length === 0 ||
                    !formData.addressId
                  }
                  className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-lg"
                >
                  {orderLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t("processing")}
                    </div>
                  ) : (
                    `Place Order - CAD ${finalAmount.toFixed(2)}`
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStripePayment}
                  disabled={
                    orderLoading ||
                    normalizedCart.length === 0 ||
                    !formData.addressId ||
                    showStripeModal
                  }
                  className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-lg"
                >
                  {orderLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t("processing")}
                    </div>
                  ) : (
                    `Pay with Card - CAD ${finalAmount.toFixed(2)}`
                  )}
                </button>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Cart Validation Messages */}
              {summary?.unavailable_items > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-amber-700 text-sm">
                    {summary.unavailable_items} item(s) in your cart are
                    currently unavailable
                  </p>
                </div>
              )}

              {normalizedCart.length === 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-700 text-sm">
                    {t("cart_empty_message")}
                  </p>
                </div>
              )}

              {!formData.addressId && normalizedCart.length > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-amber-700 text-sm">
                    {t("select_shipping_address_message")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Stripe Payment Modal */}
      {showStripeModal && paymentIntent.clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {t("secure_payment")}
              </h3>
              <button
                onClick={handleCloseStripeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">{t("secure_payment")}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your card details to complete your payment of{" "}
                  <strong>CAD {finalAmount.toFixed(2)}</strong>
                </p>
              </div>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: paymentIntent.clientSecret,
                }}
              >
                <StripePaymentForm
                  clientSecret={paymentIntent.clientSecret}
                  amount={totalInCents}
                  currency={currency}
                  onSuccess={handleStripePaymentSuccess}
                  onError={(error) => setPaymentError(error)}
                />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;