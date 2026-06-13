import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AppDispatch, RootState } from "../../app/store";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// Import components
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import ReviewModal from "./ReviewModal";
import ShareModal from "./ShareModal";
import BuyingOptionsModal from "./BuyingOptionsModal";
import ProductSkeleton from "./ProductSkeleton";
import StarRating from "./StarRating";

// Import thunks and slices
import { addToCart } from "../../features/cart/cartThunk";
import { getUserProfile } from "../../features/auth/authThunk";
import { fetchProducts } from "../../features/product/productThunk";
import { fetchSellerProductById } from "../../features/sellerProduct/sellerProductThunk";
import { fetchCategories } from "../../features/category/categoryThunk";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  checkProductInCartWishlist,
} from "../../features/wishlist/wishlistThunk";
import { updateCheckStatus } from "../../features/wishlist/wishlistSlice";
import {
  fetchProductReviews,
  createReview,
} from "../../features/reviews/reviewThunks";
import {
  clearReviewError,
  clearReviewSuccess,
} from "../../features/reviews/reviewSlice";

import "react-loading-skeleton/dist/skeleton.css";
import "./ProductDetails.css";

const ProductDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // State
  const [quantity, setQuantity] = useState(1);




  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showBuyOptions, setShowBuyOptions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { userprofile: userData } = useSelector(
    (state: RootState) => state.auth,
  );
  const user = userData;

  const checkStatus = useSelector(
    (state: RootState) => state.wishlist.checkStatus?.data,
  );

  const { reviewsData, createLoading, successMessage } = useSelector(
    (state: RootState) => state.reviews,
  );

  console.log("Reviews Data:", reviewsData);

    const { data: product, loading } = useSelector(
    (state: RootState) => state.sellerProduct.productDetails,
  );

  console.log("Product Details:", product);

    // Update quantity when product loads
useEffect(() => {
  if (product?.min_order_quantity) {
    setQuantity(parseFloat(product.min_order_quantity));
  }
}, [product]);

  // Fetch initial data
  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(fetchCategories());
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Fetch product details when id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchSellerProductById(parseInt(id)));
    }
  }, [dispatch, id]);



  // Fetch reviews when product is loaded
  useEffect(() => {
    if (product?.id) {
      console.log("Fetching reviews for product:", product.id);
      dispatch(fetchProductReviews(product.id));
    }
  }, [product, dispatch]);

  // Check wishlist/cart status
  useEffect(() => {
    if (product?.id) {
      dispatch(checkProductInCartWishlist(product.id));
    }
  }, [product, dispatch]);

  // Show success message
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearReviewSuccess());
    }
  }, [successMessage, dispatch]);

  // Helper functions
  const calculateCurrentPrice = (currentQuantity: number) => {
    if (!product.price?.discount_tiers) {
      return currentQuantity * parseFloat(product.base_price);
    }

    const tier = product.price.discount_tiers.find(
      (t: any) =>
        currentQuantity >= t.min_quantity && currentQuantity <= t.max_quantity,
    );

    if (tier) {
      return currentQuantity * tier.discounted_price_per_unit;
    }

    return currentQuantity * parseFloat(product.base_price);
  };

  const renderStars = (rating: number) => {
    return <StarRating rating={rating} />;
  };

const handleQuantityChange = (change: number) => {
  const newQuantity = quantity + change;
  const minOrder = parseFloat(product.min_order_quantity);
  const maxStock = parseFloat(product.stock_quantity);

  // Only allow changes within min and max bounds
  if (newQuantity >= minOrder && newQuantity <= maxStock) {
    setQuantity(newQuantity);
  }
};

  // Handlers
  const handleWishlistToggle = async () => {
    if (!product) return;

    if (!user) {
      toast.info(t("login_to_add_wishlist"));
      navigate("/login");
      return;
    }

    if (checkStatus?.in_wishlist) {
      await dispatch(removeFromWishlist(checkStatus.wishlist_id));
      toast.success(t("removed_from_wishlist"));
    } else {
      await dispatch(addToWishlist(product.id));
      toast.success(t("added_to_wishlist"));
    }

    dispatch(checkProductInCartWishlist(product.id));
  };

  const handleAddToCart = async () => {
    if (!user?.id) {
      navigate("/register");
      return;
    }

    if (!product) return;

    setAddingToCart(true);

    try {
      const cartData = {
        user: user.id,
        product: product.id,
        quantity,
      };

      await dispatch(addToCart(cartData)).unwrap();
    } catch (error: any) {
      console.log("Add to cart info:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  const handleSubmitReview = async (review: {
    rating: number;
    title: string;
    comment: string;
  }) => {
    if (!user) {
      toast.info(t("login_to_submit_review"));
      navigate("/login");
      return;
    }

    try {
      await dispatch(
        createReview({
          productId: product.id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
        }),
      ).unwrap();

      setShowReviewModal(false);
      toast.success(t("review_submitted_successfully"));

      // Refresh reviews after submission
      dispatch(fetchProductReviews(product.id));
    } catch (error) {
      toast.error(t("failed_to_submit_review"));
    }
  };

  if (loading || !product) {
    return <ProductSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#1F4E3D] hover:text-[#0F3D2E] transition-all duration-200 mb-6 group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-lg">{t("back_to_products")}</span>
        </button>

        <div className="rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Product Image Gallery */}
              <ProductImageGallery
                images={product.images}
                productImage={product.product_image}
                productName={product.name}
                isFlexibleBuying={product.is_flexible_buying}
                organicCertified={product.organic_certified}
              />

              {/* Product Info */}
              <ProductInfo
                product={product}
                quantity={quantity}
                checkStatus={checkStatus}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onWishlistToggle={handleWishlistToggle}
                onShareClick={() => setShowShareModal(true)}
                onReviewClick={() => setShowReviewModal(true)}
                addingToCart={addingToCart}
                calculateCurrentPrice={calculateCurrentPrice}
                renderStars={renderStars}
              />
            </div>
            <div className=" flex items-end justify-center">
              {/* Buying Options Modal */}
              {(product?.is_flexible_buying ||
                product?.is_preorder_produce) && (
                <>
                  <div className="w-full flex items-center justify-center border-b-2 pb-4 gap-4 mt-4">
                    <button
                      onClick={() => setShowBuyOptions(true)}
                      className="text-sm border py-2 px-4 rounded-2xl font-semibold text-green-600 hover:bg-green-50 transition"
                    >
                      {t("buying_with_pricewise?")}
                    </button>
                  </div>

                  <BuyingOptionsModal
                    isOpen={showBuyOptions}
                    onClose={() => setShowBuyOptions(false)}
                    product={product}
                    user={user}
                  />
                </>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-10 w-full gap-8 mt-6 px-4 sm:px-6 lg:px-6">
            <div className="lg:col-span-7">
              <ProductTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                product={product}
                reviewsData={reviewsData}
                renderStars={renderStars}
              />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="relative rounded-lg overflow-hidden shadow max-h-64">
                <img
                  src={product.product_image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {product.quantity_discounts?.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    {t("bulk_discounts_available")}
                  </h3>
                  {product.quantity_discounts.map(
                    (discount: any, index: number) => (
                      <div key={index} className="text-sm text-green-700 mb-1">
                        {discount.min_quantity}+ {product.unit}:{" "}
                        {discount.discount_percentage}% OFF
                        {parseFloat(discount.shipping_charges) === 0 &&
                          " + " + t("free_shipping")}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          productId={product.id}
          productName={product.name}
        />

        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          product={product}
          onSubmit={handleSubmitReview}
          isSubmitting={createLoading}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
