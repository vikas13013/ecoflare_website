import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiEdit,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiCalendar,
  FiPercent,
  FiStar,
  FiCopy,
  FiArchive,
  FiLayers,
  FiUsers,
  FiShoppingCart,
  FiBarChart2,
  FiGlobe,
  FiShield,
  FiRefreshCw,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiClock,
  FiTruck,
} from "react-icons/fi";
import { IoLeafOutline } from "react-icons/io5";
import { fetchSellerProductById } from "../../features/sellerProduct/sellerProductThunk";
import { AppDispatch, RootState } from "../../app/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductImageGallery from "../../pages/products/ProductImageGallery";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const { data: product, loading } = useSelector(
    (state: RootState) => state.sellerProduct.productDetails,
  );

  console.log(product, "Product Details");

  useEffect(() => {
    if (id) {
      dispatch(fetchSellerProductById(parseInt(id)));
    }
  }, [dispatch, id]);

  if (loading || !product) {
    return <LoadingSkeleton />;
  }

  // Extract product data with safe access
  const productImages = product.images || [];
  const discountTiers =
    product.price?.discount_tiers || product.quantity_discounts || [];
  const categoryName =
    typeof product.category === "object" ? product.category.name : "Fruit";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Actions */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#1F4E3D] transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                {product.name}
              </h1>
              <StatusBadge status={product.status} />
            </div>

            <div className="flex items-center space-x-2">
              
              <button
                onClick={() => navigate(`/seller/products/edit/${product.id}`)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#1F4E3D] to-emerald-700 text-white rounded-lg hover:from-[#173b2d] hover:to-emerald-800 transition-all shadow-sm"
              >
                <FiEdit className="w-4 h-4" />
                <span className="font-medium">Edit Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Title Section - Mobile Only */}
        <div className="lg:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center space-x-3">
            <StatusBadge status={product.status} />
            <span className="text-sm text-gray-500">ID: #{product.id}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Image Gallery - 5 columns on large screens */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4 ">
              {/* Image Gallery */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4  flex items-center justify-center ">
                  <ProductImageGallery
                    images={productImages}
                    productImage={product.product_image}
                    productName={product.name}
                    isFlexibleBuying={product.is_flexible_buying}
                    organicCertified={product.organic_certified}
                    onImageClick={() => setShowImageModal(true)}
                  />
                </div>
              </div>

              {/* Discount Badge - Below Gallery */}
              {discountTiers.length > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FiPercent className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-gray-700">Bulk Discount Available</span>
                    </div>
                    <span className="text-lg font-bold text-red-600">
                      Up to {Math.max(...discountTiers.map((d) => d.discount_percentage))}% OFF
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Stats Card - Mobile/Tablet Only */}
              <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <QuickStat
                    icon={<FiPackage className="w-4 h-4" />}
                    label="Stock"
                    value={`${product.stock_quantity} ${product.unit}`}
                  />
                  <QuickStat
                    icon={<FiShoppingCart className="w-4 h-4" />}
                    label="Min Order"
                    value={`${product.min_order_quantity} ${product.unit}`}
                  />
                  <QuickStat
                    icon={<FiCalendar className="w-4 h-4" />}
                    label="Harvest"
                    value={new Date(product.harvest_date).toLocaleDateString()}
                  />
                  <QuickStat
                    icon={<FiStar className="w-4 h-4" />}
                    label="Rating"
                    value={`${product.average_rating || "0"}/5`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Product Details - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
                {product.is_negotiable && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Negotiable
                  </span>
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex items-baseline space-x-2">
                  {product.price?.calculated_price?.discounted_price ? (
                    <>
                      <span className="text-3xl font-bold text-gray-900">
                        {product.currency} {product.price.calculated_price.discounted_price}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {product.currency} {product.price.calculated_price.base_price}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {product.currency} {product.base_price}
                    </span>
                  )}
                  <span className="text-gray-500">/ {product.unit}</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    parseFloat(product.stock_quantity) > 50
                      ? "bg-emerald-500 animate-pulse"
                      : parseFloat(product.stock_quantity) > 20
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`} />
                  <span className="text-sm text-gray-600">Stock Status</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {parseFloat(product.stock_quantity) > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(product.description)}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-[#1F4E3D]"
                >
                  <FiCopy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-2 gap-3">
                <FeatureTag
                  icon={<FiTag className="w-4 h-4" />}
                  label="Category"
                  value={categoryName}
                />
                {product.organic_certified && (
                  <FeatureTag
                    icon={<IoLeafOutline className="w-4 h-4" />}
                    label="Organic"
                    value="Certified"
                    color="text-emerald-600"
                  />
                )}
                {product.canada_grade && (
                  <FeatureTag
                    icon={<FiStar className="w-4 h-4" />}
                    label="Grade"
                    value={product.canada_grade}
                  />
                )}
                <FeatureTag
                  icon={<FiTruck className="w-4 h-4" />}
                  label="Shipping"
                  value={discountTiers[0]?.shipping_charges ? `CAD ${discountTiers[0].shipping_charges}` : 'Varies'}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Product Specifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Specifications
              </h3>
              <div className="space-y-3">
                <SpecItem
                  icon={<FiCalendar className="w-4 h-4" />}
                  label="Harvest Date"
                  value={new Date(product.harvest_date).toLocaleDateString()}
                />
                <SpecItem
                  icon={<FiCalendar className="w-4 h-4" />}
                  label="Expiry Date"
                  value={new Date(product.expiry_date).toLocaleDateString()}
                />
                <SpecItem
                  icon={<FiShield className="w-4 h-4" />}
                  label="Food Safety"
                  value={product.food_safety_certification || "Not Specified"}
                />
                <SpecItem
                  icon={<FiGlobe className="w-4 h-4" />}
                  label="Growing Session"
                  value={product.growing_session || "Not Specified"}
                />
                <SpecItem
                  // icon={<FiDollarSign className="w-4 h-4" />}
                  label="HST Included"
                  value={product.hst_included ? "Yes" : "No"}
                  color={product.hst_included ? "text-emerald-600" : "text-gray-600"}
                />
              </div>
            </div>

            {/* Buying Options */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Buying Options
              </h3>
              <div className="space-y-2">
                <OptionBadge
                  active={product.is_bulk_buying}
                  label="Bulk Buying"
                  icon={<FiUsers className="w-4 h-4" />}
                />
                <OptionBadge
                  active={product.is_flexible_buying}
                  label="Flexible Buying"
                  icon={<FiRefreshCw className="w-4 h-4" />}
                />
                <OptionBadge
                  active={product.is_preorder_produce}
                  label="Pre-order Available"
                  icon={<FiClock className="w-4 h-4" />}
                />
              </div>
            </div>

            

            {/* Product Metadata */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Metadata
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium text-gray-900">
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="font-medium text-gray-900">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Product ID</span>
                  <span className="font-mono font-medium text-gray-900">
                    #{product.id}
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bulk Pricing Section - Full Width */}
        {discountTiers.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Bulk Pricing & Discounts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {discountTiers.map((tier: any, index: number) => (
                  <div
                    key={index}
                    className={`p-5 rounded-xl border ${
                      index === 0
                        ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">
                        Tier {index + 1}
                      </span>
                      {tier.discount_percentage > 0 && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                          {tier.discount_percentage}% OFF
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Range:</span>
                        <span className="font-semibold text-gray-900">
                          {tier.min_quantity} - {tier.max_quantity} {product.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price/{product.unit}:</span>
                        <span className="font-bold text-[#1F4E3D]">
                          {product.currency}{" "}
                          {tier.discounted_price_per_unit ||
                            (parseFloat(product.base_price) *
                              (1 - tier.discount_percentage / 100)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Shipping:</span>
                        <span className="font-medium text-gray-900">
                          {product.currency} {tier.shipping_charges}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total:</span>
                          <span className="font-bold text-gray-900">
                            {product.currency}{" "}
                            {tier.final_total || tier.total_min_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && productImages.length > 0 && (
        <ImageModal
          images={productImages}
          currentIndex={selectedImageIndex}
          onClose={() => setShowImageModal(false)}
          onNavigate={(index) => setSelectedImageIndex(index)}
        />
      )}
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <Skeleton height={500} className="rounded-2xl" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <Skeleton height={200} className="rounded-2xl" />
          <Skeleton height={150} className="rounded-2xl" />
          <Skeleton height={180} className="rounded-2xl" />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <Skeleton height={250} className="rounded-2xl" />
          <Skeleton height={200} className="rounded-2xl" />
          <Skeleton height={150} className="rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

// Image Modal Component
const ImageModal: React.FC<{
  images: any[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}> = ({ images, currentIndex, onClose, onNavigate }) => {
  const handlePrev = () => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const handleNext = () => {
    onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 z-10"
      >
        <FiX className="w-8 h-8" />
      </button>

      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
      >
        <FiChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
      >
        <FiChevronRight className="w-8 h-8" />
      </button>

      <div className="relative max-w-6xl max-h-[90vh] mx-4">
        <img
          src={images[currentIndex]?.image}
          alt={`Product ${currentIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

// Status Badge Component
type StatusType = string | number | null | undefined;

const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
  const normalizedStatus =
    typeof status === "string" ? status.toLowerCase() : "";

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "published":
        return { color: "bg-emerald-100 text-emerald-800", icon: "✓" };
      case "draft":
        return { color: "bg-amber-100 text-amber-800", icon: "✎" };
      case "pending":
        return { color: "bg-blue-100 text-blue-800", icon: "⏳" };
      case "rejected":
        return { color: "bg-red-100 text-red-800", icon: "✗" };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: "?" };
    }
  };

  const config = getStatusConfig(normalizedStatus);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      <span className="mr-1.5">{config.icon}</span>
      {status}
    </span>
  );
};

// Quick Stat Component
const QuickStat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
    <div className="text-gray-500">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

// Feature Tag Component
const FeatureTag: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}> = ({ icon, label, value, color = "text-gray-900" }) => (
  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
    <div className="text-gray-500">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>{value}</p>
    </div>
  </div>
);

// Option Badge Component
const OptionBadge: React.FC<{
  active: boolean;
  label: string;
  icon: React.ReactNode;
}> = ({ active, label, icon }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl ${
    active ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'
  }`}>
    <div className="flex items-center space-x-2">
      <div className={active ? 'text-emerald-600' : 'text-gray-400'}>
        {icon}
      </div>
      <span className={active ? 'text-emerald-700 font-medium' : 'text-gray-500'}>
        {label}
      </span>
    </div>
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
      active 
        ? 'bg-emerald-200 text-emerald-800' 
        : 'bg-gray-200 text-gray-600'
    }`}>
      {active ? 'Enabled' : 'Disabled'}
    </span>
  </div>
);

// Spec Item Component
const SpecItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}> = ({ icon, label, value, color = "text-gray-900" }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <div className="flex items-center space-x-3">
      <div className="text-gray-400">{icon}</div>
      <span className="text-gray-600">{label}</span>
    </div>
    <span className={`font-medium ${color}`}>{value}</span>
  </div>
);

export default ProductDetailsPage;