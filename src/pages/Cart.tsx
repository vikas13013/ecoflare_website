import React, { useState, useEffect } from "react";
import { updateCart, deleteCart, getCart } from "../features/cart/cartThunk";
import { fetchAddresses } from "../features/address/addressThunk";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import broccoliImg from "../assets/new-images/shimla.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";

import {
  ArrowLeft,
  Trash2,
  ShoppingCart,
  CalendarDays,
  Plus,
  Minus,
  ShieldCheck,
  PackageX,
  MapPin,
  AlertCircle,
  X,
  PlusCircle,
  Navigation
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  origin: string;
}

// Address Required Modal Component
const AddressRequiredModal: React.FC<{
  onClose: () => void;
  onNavigate: () => void;
}> = ({ onClose, onNavigate }) => {
  const { t } = useTranslation();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-slideUp">
        <div className="relative p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            {t("delivery_address_required") || "Delivery Address Required"}
          </h3>
          
          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            {t("delivery_address_required_message") || 
              "Please add a delivery address before proceeding to checkout. We need your address to calculate shipping costs and estimate delivery time."}
          </p>
          
          {/* Warning note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">
                {t("address_required_warning") ||
                  "Without a delivery address, you cannot complete your purchase. Please add your address to continue."}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {t("maybe_later") || "Maybe Later"}
            </button>
            <button
              onClick={onNavigate}
              className="flex-1 bg-orange-600 text-white px-4 py-2.5 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {t("add_address") || "Add Address"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const { t } = useTranslation();
  
  // State for address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Get cart data from Redux store
  const data = useSelector((state: RootState) => state.cart?.items || []);
  const dataa = useSelector((state: RootState) => state.cart || []);
  console.log("Cart data:", dataa);
  const cartItems = data || [];

  const { summary } = useSelector((state: RootState) => state.cart);
  console.log("Cart summary:", summary);

  // Get cart data from Redux store
  const { loading, error, updating, deleting } = useSelector(
    (state: RootState) => state.cart,
  );

  const { addresses } = useSelector((state: RootState) => state.address);

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  // Safely extract cart items from data
  const cartItemsSummary = summary?.cart_items_summary || [];

  const tax = cartItemsSummary.reduce((total, item) => {
    return total + (parseFloat(item.taxable_amount) || 0);
  }, 0);

  const finalAmount =
    summary?.cart_items_summary?.reduce((total, item) => {
      return total + (item.final_amount || 0);
    }, 0) || 0;

  // Fetch cart data on component mount
  useEffect(() => {
    if (selectedAddressId) {
      dispatch(getCart(selectedAddressId));
    }
  }, [selectedAddressId, dispatch]);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const primary = addresses.find((addr) => addr.is_primary);
      if (primary) {
        setSelectedAddressId(String(primary.id));
      } else {
        setSelectedAddressId(String(addresses[0].id));
      }
    }
  }, [addresses]);

  // Normalize cart data with proper error handling
  const normalizedCart = cartItems.map((item: any) => {
    // Safely parse prices and quantities
    const quantity = parseFloat(item.quantity || "0");
    const basePrice = parseFloat(
      item.base_price || item.product?.base_price || "0",
    );
    const discountedPrice = parseFloat(
      basePrice,
    );
    const finalPrice = parseFloat(
      discountedPrice * quantity,
    );

    return {
      id: item.id.toString(),
      name: item.product?.name || "Unnamed Product",
      image: item.product?.product_image || null,
      unit: item.product?.unit || "unit",
      price: discountedPrice,
      quantity: quantity,
      total: finalPrice,
      basePrice: basePrice,
      discountedPrice: discountedPrice,
      discountPercentage: parseFloat(item.discount_percentage || "0"),
      shippingCharges: parseFloat(item.shipping_charges || "0"),
      currency: item.currency || "CAD",
      isAvailable: item.is_available !== false,
    };
  });

  // Calculate totals
  const subtotal = normalizedCart.reduce((sum, item) => sum + item.total, 0);
  const totalShipping = normalizedCart.reduce(
    (sum, item) => sum + item.shippingCharges,
    0,
  );
  const shipping = totalShipping;
  const total = subtotal + shipping;

  const removeFromCart = async (cartItemId: string) => {
    try {
      await dispatch(deleteCart(cartItemId)).unwrap();
      dispatch(getCart());
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      dispatch(getCart());
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await dispatch(
        updateCart({
          id: cartItemId,
          quantity: newQuantity,
        }),
      ).unwrap();
      dispatch(getCart());
    } catch (error) {
      console.error("Failed to update quantity:", error);
      dispatch(getCart());
    }
  };

  // Check if address exists
  const hasAddress = addresses && addresses.length > 0;

  // Handle checkout button click
  const handleCheckout = () => {
    if (!hasAddress) {
      setShowAddressModal(true);
      return;
    }
    
    // Proceed to checkout if address exists
    setIsCheckingOut(true);
    navigate("/checkout");
  };

  // Handle navigate to address management
  const handleNavigateToAddress = () => {
    setShowAddressModal(false);
    navigate("/profiledashboard/addressmanagement");
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <PackageX className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            {t("error_loading_cart")}
          </h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => dispatch(getCart())}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {t("try_again")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Address Required Modal */}
      {showAddressModal && (
        <AddressRequiredModal
          onClose={() => setShowAddressModal(false)}
          onNavigate={handleNavigateToAddress}
        />
      )}

      <div className="max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-sm">
        <Link
          to="/marketplace"
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-green-700"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("continue_shopping")}
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          {t("your_shopping_cart")} ({normalizedCart.length} {t("items")})
        </h1>

        {/* Address Warning Banner (if no address) */}
        {!hasAddress && normalizedCart.length > 0 && (
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-800">
                  {t("delivery_address_missing") || "Delivery Address Missing"}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {t("add_address_to_checkout") || 
                    "Please add a delivery address to proceed with checkout. We need your address to calculate shipping costs."}
                </p>
              </div>
            </div>
            <button
              onClick={handleNavigateToAddress}
              className="text-sm bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap ml-4"
            >
              {t("add_address") || "Add Address"}
            </button>
          </div>
        )}

        {normalizedCart.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <PackageX className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">
              {t("cart_empty")}
            </h2>
            <p className="text-gray-500 mt-2">{t("cart_empty_message")}</p>
            <button
              onClick={() => navigate("/marketplace")}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {t("continue_shopping")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="divide-y divide-gray-200">
                {normalizedCart.map((item) => (
                  <div
                    key={item.id}
                    className="py-6 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-full relative sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {!item.image ? (
                        <Skeleton height="100%" />
                      ) : (
                        <LazyLoadImage
                          src={item.image}
                          effect="blur"
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/no-image.png";
                          }}
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 text-lg">
                          {item.name || t("unnamed_product")}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                          disabled={deleting === item.id}
                        >
                          {deleting === item.id ? (
                            <div className="animate-spin w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full"></div>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Price Display */}
                      <div className="mb-3">
                        {item.discountPercentage > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 font-medium">
                              {item.currency} {item.discountedPrice.toFixed(2)}{" "}
                              / {item.unit}
                            </span>
                            <span className="text-gray-400 line-through text-sm">
                              {item.currency} {item.basePrice.toFixed(2)}
                            </span>
                            <span className="text-red-500 text-sm font-medium">
                              {item.discountPercentage}% OFF
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-800 font-medium">
                            {item.currency} {item.price.toFixed(2)} /{" "}
                            {item.unit}
                          </span>
                        )}
                      </div>

                      {/* Availability Badge */}
                      {!item.isAvailable && (
                        <div className="mb-3">
                          <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                            {t("out_of_stock")}
                          </span>
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 text-gray-500 hover:text-green-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                            disabled={
                              updating === item.id ||
                              item.quantity <= 1 ||
                              !item.isAvailable
                            }
                          >
                            <Minus size={18} />
                          </button>
                          <span className="text-lg font-medium w-8 text-center">
                            {updating === item.id ? (
                              <div className="animate-spin w-4 h-4 border border-green-600 border-t-transparent rounded-full mx-auto"></div>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 text-gray-500 hover:text-green-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                            disabled={updating === item.id || !item.isAvailable}
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">
                          {item.unit}
                          {item.quantity > 1 && "s"}
                        </span>

                        {item.shippingCharges > 0 && (
                          <span className="text-sm text-gray-500">
                            + {item.currency} {item.shippingCharges.toFixed(2)}{" "}
                            {t("shipping")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="w-full sm:w-24 text-right sm:text-left ">
                      <p className="font-bold text-sm">
                        {item.currency} {item.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} {item.unit}
                        {item.quantity > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {t("order_summary")}
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>
                      {t("subtotal")} ({normalizedCart.length} {t("items")})
                    </span>
                    <span>CAD {subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>{t("shipping")}</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">
                          {t("free")}
                        </span>
                      ) : (
                        `CAD ${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {totalShipping > 0 && shipping === 0 && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      {t("free_shipping_applied")}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-600">
                      - CAD {summary?.total_discount?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>CAD {tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-3 mt-2 flex justify-between text-base font-semibold">
                    <span>{t("total")}</span>
                    <span>CAD {finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    loading ||
                    normalizedCart.length === 0 ||
                    normalizedCart.some((item) => !item.isAvailable) ||
                    isCheckingOut
                  }
                >
                  {loading || isCheckingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {t("processing")}
                    </>
                  ) : (
                    t("proceed_to_checkout")
                  )}
                </button>

                {/* Security Badge */}
                <div className="mt-4 text-xs text-gray-500 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>{t("secure_checkout_message")}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;