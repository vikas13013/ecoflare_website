import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import StarRating from "./StarRating";
import { useTranslation } from "react-i18next";

interface ProductInfoProps {
  product: any;
  quantity: number;
  checkStatus: any;
  onQuantityChange: (change: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onWishlistToggle: () => void;
  onShareClick: () => void;
  onReviewClick: () => void;
  addingToCart: boolean;
  calculateCurrentPrice: (quantity: number) => number;
  renderStars: (rating: number) => JSX.Element[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  quantity,
  checkStatus,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
  onShareClick,
  onReviewClick,
  addingToCart,
  calculateCurrentPrice,
  renderStars,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full lg:w-1/2 xl:w-3/5">
      {/* Title + Stock */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
          {product.name}
        </h1>
        <span
          className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-lg ${
            parseFloat(product.stock_quantity) > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
{parseFloat(product.stock_quantity) > 0
  ? t("in_stock")
  : t("out_of_stock")}        </span>
      </div>

      {/* Rating and Share */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {renderStars(product.average_rating || 0)}
            </div>
            <span className="text-gray-600 font-medium">
              {product.average_rating?.toFixed(1) || "0.0"}
            </span>
          </div>
          <button
            onClick={onReviewClick}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {product.total_reviews || 0} {t("reviews")}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShareClick}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span>{t("share")}</span>
          </button>
          <button
            onClick={onWishlistToggle}
            className={`p-3 rounded-full ${
              checkStatus?.in_wishlist
                ? "bg-red-50 text-red-500"
                : "bg-gray-100 text-gray-600 hover:text-red-500"
            }`}
          >
            {checkStatus?.in_wishlist ? (
              <FaHeart size={20} />
            ) : (
              <FaRegHeart size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Pricing Display */}
      <div className="mb-4">
        <div className="flex items-center flex-wrap gap-3 mb-2">
          <span className="text-2xl sm:text-3xl font-bold text-green-600">
            {product.price?.calculated_price?.currency || product.currency}{" "}
            {product.price?.calculated_price?.discounted_price ||
              product.price?.calculated_price?.base_price}
          </span>
          {product.price?.calculated_price?.discount_percentage > 0 && (
            <>
              <span className="text-lg sm:text-xl text-gray-400 line-through">
                {product.currency} {product.price?.calculated_price?.base_price}
              </span>
              <span className="text-sm font-medium text-red-500">
                {product.price?.calculated_price?.discount_percentage}% {t("off")}
              </span>
            </>
          )}
        </div>

        {/* Quantity Discount Tiers */}
        {product.price?.discount_tiers?.length > 0 && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("quantity_discounts")}:
            </p>
            {product.price.discount_tiers.map((tier: any, index: number) => (
              <div
                key={index}
                className="text-xs text-gray-600 flex justify-between"
              >
                <span>
                  {tier.min_quantity}-{tier.max_quantity} {product.unit}:
                </span>
                <span>
                  {tier.discount_percentage}% off - {tier.currency || product.currency}{" "}
                  {tier.discounted_price_per_unit}/{product.unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
        {product.description || t("no_description_available")}
      </p>

      {/* Quantity Selector + Buttons */}
      <div className="mb-4 p-4 border-t-2 border-b-2 border-gray-200">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Quantity */}
         {/* Quantity */}
<div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
  <button
    onClick={() => onQuantityChange(-1)}
    disabled={quantity <= parseFloat(product.min_order_quantity)}
    className={`px-3 py-2 text-lg ${
      quantity <= parseFloat(product.min_order_quantity)
        ? "text-gray-300 cursor-not-allowed"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    -
  </button>
  <span className="px-4 py-2 text-center font-medium w-12">
    {quantity}
  </span>
  <button
    onClick={() => onQuantityChange(1)}
    disabled={quantity >= parseFloat(product.stock_quantity)}
    className={`px-3 py-2 text-lg ${
      quantity >= parseFloat(product.stock_quantity)
        ? "text-gray-300 cursor-not-allowed"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    +
  </button>
</div>

          {/* Current Price Calculation */}
          <div className="text-sm text-gray-600">
            {t("total")}: {product.currency} {calculateCurrentPrice(quantity)}
          </div>

          {/* Buttons */}
          <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
            <button
              onClick={onAddToCart}
              disabled={
                addingToCart ||
                parseFloat(product?.stock_quantity ?? "0") === 0 ||
                checkStatus?.in_cart === true
              }
              className={`flex-1 flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50
                ${
                  checkStatus?.in_cart
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#FFA726] hover:bg-[#FB8C00] text-white"
                }
              `}
            >
              <FiShoppingCart />
              {checkStatus?.in_cart
                ? t("already_in_cart")
                : addingToCart
                ? t("adding....")
                : t("add_to_cart")}
            </button>

            <button
              onClick={onBuyNow}
              disabled={
                addingToCart || parseFloat(product.stock_quantity) === 0
              }
              className="flex-1 flex items-center justify-center gap-2 text-white font-medium py-3 px-6 bg-[#1F4E3D] hover:bg-[#0F3D2E] rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {t("buy_now")}
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-sm mt-4 font-medium text-gray-600">
        {t("category:")} {product.category?.name || t("not_available")}
      </h2>
    </div>
  );
};

export default ProductInfo;