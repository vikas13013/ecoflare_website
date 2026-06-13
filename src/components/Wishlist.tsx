// src/components/Wishlist.tsx
import React, { useEffect } from "react";
import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaInstagram,
  FaShoppingCart,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../hooks/reduxHooks";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistThunk";
import broccoliImg from "../assets/new-images/shimla.png";
import { AppDispatch, RootState } from "../app/store";
import { addToCart } from "../features/cart/cartThunk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";

const Wishlist: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items, loading, error } = useAppSelector(
    (state: RootState) => state.wishlist
  );
  console.log("Wishlist items:", items);
  const { user } = useSelector((state: RootState) => state.auth);
  console.log("User info:", user);

  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (id: number) => {
    try {
      await dispatch(removeFromWishlist(id)).unwrap();
toast.success(t("removed_from_wishlist"));    } catch (error: any) {
      toast.error(t("failed_remove_wishlist"));
    }
  };

  const handleAddToCart = async (wishlistItem: any) => {
    if (!user || !user.id) {
     toast.error(t("login_to_add_cart"));
      navigate("/register");
      return;
    }

    const product = wishlistItem.product;
    if (!product) return;

    setAddingToCart(wishlistItem.id);
    try {
      const cartData = {
        user: user.id,
        product: product.id,
        quantity: parseFloat(product.min_order_quantity || "1"),
      };

      await dispatch(addToCart(cartData)).unwrap();
      toast.success(t("product_added_to_cart_success"));
    } catch (error: any) {
      toast.error(error.message || t("failed_add_product_cart"));
      console.log(error);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleViewProduct = (product: any) => {
    if (product && product.id) {
      navigate(`/products/details/${product.id}`);
    }
  };

  // Helper function to get product image
  // const getProductImage = (product: any) => {
  //   if (product?.product_image) {
  //     return product.product_image;
  //   }
  //   return broccoliImg;
  // };

  // Helper function to get product image (NO DEFAULT)
  const getProductImage = (product: any) => {
    return product?.product_image || null;
  };

  // Helper function to check stock status
  const getStockStatus = (product: any) => {
    if (!product) return { status: false, text: "Unknown" };

    const stockQuantity = parseFloat(product.stock_quantity || "0");
    const minOrder = parseFloat(product.min_order_quantity || "1");

    if (stockQuantity >= minOrder) {
      return { status: true, text: "In Stock" };
    } else {
      return { status: false, text: "Out of Stock" };
    }
  };

  // Helper function to get price display
  const getPriceDisplay = (product: any) => {
    if (!product) return { current: "0.00", original: null, currency: "CAD" };

    const basePrice = parseFloat(product.base_price || "0");
    const currency = product.currency || "CAD";

    return {
      current: basePrice.toFixed(2),
      original: null, // You can add discounted price logic here if needed
      currency: currency,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading_wishlist")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrash className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("unable_to_load_wishlist")}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchWishlist())}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {t("try_again")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("my_wishlist")}</h1>
          <p className="text-gray-600">
            {items?.length > 0
              ? `You have ${items.length} item${
                  items.length > 1 ? "s" : ""
                } in your wishlist`
              : "Your favorite products will appear here"}
          </p>
        </div>

        {/* Wishlist Items */}
        {items?.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header - Desktop */}
            <div className="hidden lg:grid grid-cols-12 gap-4 border-b border-gray-200 px-6 py-4 bg-gray-50">
              <div className="col-span-5">
                <span className="text-sm font-semibold text-gray-700">
                  {t("product")}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-sm font-semibold text-gray-700">
                  {t("price")}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-sm font-semibold text-gray-700">
                 {t("stock_status")}
                </span>
              </div>
              <div className="col-span-3 text-center">
                <span className="text-sm font-semibold text-gray-700">
                  {t("actions")}
                </span>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="divide-y divide-gray-100">
              {items.map((wishlistItem: any) => {
                const product = wishlistItem.product;
                const stockInfo = getStockStatus(product);
                const priceInfo = getPriceDisplay(product);

                return (
                  <div
                    key={wishlistItem.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-6 hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Info */}
                    <div className="lg:col-span-5 flex items-center gap-4">
                      <div className="relative">
                        {!getProductImage(product) ? (
                          <Skeleton className="w-full h-full rounded-lg" />
                        ) : (
                          <LazyLoadImage
                            src={getProductImage(product)}
                            effect="blur"
                            alt={product?.name ||  t("unnamed_product")}
                            className="w-20 h-20 lg:w-24 lg:h-24 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = broccoliImg;
                            }}
                          />
                        )}
                        {!stockInfo.status && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-medium px-2 py-1">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                          {product?.name ||  t("unnamed_product")}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                          {product?.description || t("no_description_available")}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>
                            Category: {product?.category?.name ||  t("unknown")}
                          </span>
                          <span>•</span>
                          <span>
                            Min order: {product?.min_order_quantity || "1"}{" "}
                            {product?.unit || t("unit")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-center lg:justify-center gap-2">
                      <span className="text-xl font-bold text-green-600">
                        {priceInfo.currency} {priceInfo.current}
                      </span>
                      {priceInfo.original && (
                        <span className="text-gray-400 line-through text-sm">
                          {priceInfo.currency} {priceInfo.original}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="lg:col-span-2 flex lg:justify-center items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          stockInfo.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {stockInfo.status ? `✅ ${t("in_stock")}` : `❌ ${t("out_of_stock")}`}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-3 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleAddToCart(wishlistItem)}
                        disabled={
                          !stockInfo.status || addingToCart === wishlistItem.id
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                          stockInfo.status
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        } ${
                          addingToCart === wishlistItem.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {addingToCart === wishlistItem.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {t("adding")}
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="w-4 h-4" />+
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleViewProduct(product)}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleRemove(wishlistItem.id)}
                        className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                        title={t("remove_from_wishlist")}
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Share Section */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium">
                    {t("share_your_wishlist")}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                    >
                      <FaFacebookF size={16} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition"
                    >
                      <FaTwitter size={16} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                    >
                      <FaPinterestP size={16} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition"
                    >
                      <FaInstagram size={16} />
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/marketplace")}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  {t("continue_shopping")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("wishlist_empty")}
              </h3>
              <p className="text-gray-600 mb-6">
               {t("wishlist_empty_description")}
              </p>
              <button
                onClick={() => navigate("/marketplace")}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                {t("browse_products")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
