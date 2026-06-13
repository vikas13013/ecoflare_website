// src/pages/ProductCategoryPage.tsx
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchCategories } from "../../features/category/categoryThunk";
import { fetchProducts } from "../../features/product/productThunk";
import img1 from "../../assets/new-images/slider1/3.jpg";
import Bananas from "../../assets/product-images/EcoFlare Products/Bananas.png";
import Mangoes from "../../assets/product-images/EcoFlare Products/Mangoes.png";
import Apples from "../../assets/product-images/EcoFlare Products/Apples.png";
import broccoliImg from "../../assets/product-images/EcoFlare Products/6.png";
import Oranges from "../../assets/product-images/EcoFlare Products/Oranges.png";
import strawberry from "../../assets/product-images/EcoFlare Products/Strawberries.png";
import Carrot from "../../assets/product-images/EcoFlare Products/Carrots.png";
import Onion from "../../assets/product-images/EcoFlare Products/Onions.png";
import Potato from "../../assets/product-images/EcoFlare Products/Potato.png";
import Spinach from "../../assets/product-images/EcoFlare Products/Spinach.png";
import Tomato from "../../assets/product-images/EcoFlare Products/Tomatoes.png";
import Grapes from "../../assets/product-images/EcoFlare Products/Grapes.png";
import falbackImage from "../../assets/new-images/shimla.png";
import { useNavigate } from "react-router";
import {
  FaHeart,
  FaEye,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaRegHeart,
} from "react-icons/fa";
import { ShoppingBag, X, Star, Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { addToCart } from "../../features/cart/cartThunk";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  checkProductInCartWishlist,
} from "../../features/wishlist/wishlistThunk";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

interface FilterState {
  status: string;
  category: string;
  organic: string;
  min_price: string;
  max_price: string;
  currency: string;
  search: string;
  in_stock: string;
  page: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  category_image: string;
  is_active: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category: Category;
  product_image: string | null;
  status: string;
  stock_quantity: string;
  currency: string;
  base_price: string;
  final_base_price: number;
  unit: string;
  organic_certified: boolean;
  min_order_quantity: string;
  average_rating: number;
  total_reviews: number;
  price?: {
    calculated_price: {
      final_total: number;
      discounted_price: number;
    };
  };
}

// Fallback images mapping
const productImages: Record<string, string> = {
  Bananas: Bananas,
  Mangoes: Mangoes,
  Apples: Apples,
  Broccoli: broccoliImg,
  Oranges: Oranges,
  Strawberry: strawberry,
  Carrot: Carrot,
  Onion: Onion,
  Potato: Potato,
  Spinach: Spinach,
  Tomato: Tomato,
  Grapes: Grapes,
  falbackImage,
};

const ProductCategoryPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // const { checkStatus } = useAppSelector((state) => state.wishlist);
  const [productStatusMap, setProductStatusMap] = useState<{
    [productId: number]: {
      in_cart: boolean;
      in_wishlist: boolean;
    };
  }>({});

  // State selectors
  const {
    categories = [],
    loading: categoryLoading,
    error: categoryError,
  } = useAppSelector((state) => state.category);

const PAGE_SIZE = 12;


  const {
    products = [],
    pagination = {
      total_items: 0,
      current_page: 1,
      current_page_size: 12,
      total_pages: 0,
      next: null,
      previous: null,
    },
    loading: productLoading,
    error: productError,
  } = useAppSelector((state) => state.product);
  console.log(pagination, "oroginal products");

  const checkStatus = useAppSelector(
    (state) => state.wishlist.checkStatus?.data
  );

  const startItem =
  pagination.total_items === 0
    ? 0
    : (pagination.current_page - 1) * PAGE_SIZE + 1;

const endItem = Math.min(
  pagination.current_page === pagination.total_pages
    ? pagination.total_items
    : pagination.current_page * PAGE_SIZE,
  pagination.total_items
);


  const [filters, setFilters] = useState<FilterState>({
    status: "",
    category: "",
    organic: "",
    min_price: "",
    max_price: "",
    currency: "CAD",
    search: "",
    in_stock: "",
    page: "1",
  });

  // Quantity management state
  const [productQuantities, setProductQuantities] = useState<{
    [key: number]: number;
  }>({});
  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>(
    {}
  );

  const getProductImage = (product: Product): string => {
    // 1️⃣ First priority: images array (API)
    if (product?.images && product.images.length > 0) {
      return product.images[0].image;
    }

    // 2️⃣ Second priority: single product_image field
    if (product?.product_image) {
      return product.product_image;
    }

    // 3️⃣ Third priority: name-based static images
    const productName = product?.name?.toLowerCase() || "";

    if (productName.includes("banana")) return productImages.Bananas;
    if (productName.includes("mango")) return productImages.Mangoes;
    if (productName.includes("apple")) return productImages.Apples;
    if (productName.includes("broccoli")) return productImages.Broccoli;
    if (productName.includes("orange")) return productImages.Oranges;
    if (productName.includes("strawberry")) return productImages.Strawberry;
    if (productName.includes("carrot")) return productImages.Carrot;
    if (productName.includes("onion")) return productImages.Onion;
    if (productName.includes("potato")) return productImages.Potato;
    if (productName.includes("spinach")) return productImages.Spinach;
    if (productName.includes("tomato")) return productImages.Tomato;
    if (productName.includes("grape")) return productImages.Grapes;

    // 4️⃣ Final fallback
    return null;
  };

  // Quantity management functions
  const getInitialQuantity = (product: Product): number => {
    return parseFloat(product.min_order_quantity) || 1;
  };

  const handleQuantityIncrease = (productId: number, product: Product) => {
    setProductQuantities((prev) => {
      const currentQty = prev[productId] || getInitialQuantity(product);
      const stockQty = parseFloat(product.stock_quantity);
      const newQty = currentQty + 1;

      return newQty <= stockQty ? { ...prev, [productId]: newQty } : prev;
    });
  };

  const handleQuantityDecrease = (productId: number, product: Product) => {
    setProductQuantities((prev) => {
      const currentQty = prev[productId] || getInitialQuantity(product);
      const minQty = parseFloat(product.min_order_quantity);
      const newQty = currentQty - 1;

      return newQty >= minQty ? { ...prev, [productId]: newQty } : prev;
    });
  };

  const getProductQuantity = (productId: number, product: Product): number => {
    return productQuantities[productId] || getInitialQuantity(product);
  };

  const getQueryString = () => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    return queryParams.toString() ? `?${queryParams.toString()}` : "";
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    const query = getQueryString();
    dispatch(fetchProducts(query));
  }, [dispatch, filters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: "1" }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      category: "",
      organic: "",
      min_price: "",
      max_price: "",
      currency: "CAD",
      search: "",
      in_stock: "",
      page: "1",
    });
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  // Extract results from API response
  const categoryResults: Category[] = Array.isArray(categories)
    ? categories
    : categories?.data || [];
  const productResults: Product[] = Array.isArray(products)
    ? products
    : products?.results || [];

  console.log(categoryResults, "categories results");

  useEffect(() => {
    if (!productResults || productResults.length === 0) return;

    productResults.forEach((product) => {
      dispatch(checkProductInCartWishlist(product.id))
        .unwrap()
        .then((res) => {
          setProductStatusMap((prev) => ({
            ...prev,
            [product.id]: {
              in_cart: res.data.in_cart,
              in_wishlist: res.data.in_wishlist,
            },
          }));
        })
        .catch(() => {
          // silent fail (optional)
        });
    });
  }, [productResults, dispatch]);

  // Add to cart function
  const { user } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = async (product: Product) => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    if (!product) {
      toast.error(t("product_not_found"));
      return;
    }

    setAddingToCart((prev) => ({ ...prev, [product.id]: true }));

    try {
      const quantity = getProductQuantity(product.id, product);
      const cartData = {
        user: user.id,
        product: product.id,
        quantity: quantity,
      };

      await dispatch(addToCart(cartData)).unwrap();
      toast.success(t("product_added_to_cart_successfully"));
    } catch (error: any) {
      toast.error(error.message || t("failed_to_add_produce_to_cart"));
      console.log(error);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      case "Seasonal":
        return "bg-yellow-100 text-yellow-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="text-sm text-gray-500 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                {t("farm_fresh_marketplace")}
              </h1>
              <p className="text-lg lg:text-xl mb-6 opacity-90 leading-relaxed">
                {t(
                  "discover_the_freshest_produce_directly_from_local_farms_and_suppliers"
                )}
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <span className="bg-green-500 bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
                  🍎 {t("fresh_fruits")}
                </span>
                <span className="bg-green-500 bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
                  🥦 {t("organic_vegetables")}
                </span>
                <span className="bg-green-500 bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
                  🚚 {t("direct_from_farms")}
                </span>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 lg:w-36 lg:h-36 bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <img
                    src={img1}
                    alt="Fresh produce"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      {t("fresh_100")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-md border border-gray-200 w-full justify-center hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            <span className="font-medium text-gray-700">{t("filters")}</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {Object.values(filters).filter(Boolean).length}
            </span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("filters")}
                  </h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    {t("reset_all")}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔍 {t("search_products")}
                    </label>
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleChange}
                      placeholder={t("search_placeholder")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📂 {t("category")}
                    </label>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">{t("all_categories")}</option>
                      {categoryResults.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💰 {t("price_range")} ({filters.currency})
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        name="min_price"
                        placeholder={t("min")}
                        value={filters.min_price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        min="0"
                      />
                      <input
                        type="number"
                        name="max_price"
                        placeholder={t("max")}
                        value={filters.max_price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Stock Availability */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📦 {t("stock_availability")}
                    </label>
                    <select
                      name="in_stock"
                      value={filters.in_stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">{t("all_stock")}</option>
                      <option value="true">{t("in_stock_only")}</option>
                      <option value="false">{t("out_of_stock")}</option>
                    </select>
                  </div> */}
                  {/* Status */}
                  <div className="mb-4">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("status")}
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={filters.status}
                      onChange={handleChange}
                      className="w-full rounded-md py-1 px-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">{t("all_status")}</option>
                      <option value="Published">{t("published")}</option>
                      <option value="Draft">{t("draft")}</option>
                      <option value="Seasonal">{t("seasonal")}</option>
                      <option value="Out of Stock">{t("out_of_stock")}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Categories List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("popular_categories")}
                </h3>
                <div className="space-y-3">
                  {categoryResults.slice(0, 5).map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          category: category.id.toString(),
                        }))
                      }
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        filters.category === category.id.toString()
                          ? "bg-green-50 border border-green-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <img
                          src={
                            category.category_image || productImages.falbackImage
                          }
                          alt={category.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {category.description.slice(0, 50)}...
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {t("product_catalog")}
                  </h1>
                  <p className="text-sm text-gray-700">
  {t("showing")}{" "}
  <span className="font-medium">{startItem}</span> to{" "}
  <span className="font-medium">{endItem}</span> of{" "}
  <span className="font-medium">{pagination.total_items}</span>{" "}
  {t("results")}
</p>

                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={filters.currency}
                    onChange={handleChange}
                    name="currency"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="CAD">CAD $</option>
                    {/* <option value="USD">USD $</option> */}
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {productLoading || categoryLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">
                    {t("loading_products")}
                  </p>
                </div>
              </div>
            ) : productError || categoryError ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  {t("error_loading_data")}
                </h3>
                <p className="text-red-600">{productError || categoryError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("try_again")}
                </button>
              </div>
            ) : productResults.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                  {t("no_products_found")}
                </h3>
                <p className="text-yellow-700 mb-4">
                  {t("no_products_found_matching_your_filters")}
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  {t("clear_filters")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {productResults.map((product) => {
                  const imageSrc = getProductImage(product);
                  const quantity = getProductQuantity(product.id, product);
                  const isAddingToCart = addingToCart[product.id];
                  const minOrderQty = parseFloat(product.min_order_quantity);
                  const stockQty = parseFloat(product.stock_quantity);
                  const displayPrice =
                    product.price?.calculated_price?.discounted_price ||
                    parseFloat(product.base_price);
                  const status = productStatusMap[product.id];

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-green-200"
                    >
                      {/* Product Image */}
                      <div
                        onClick={() =>
                          navigate(`/products/details/${product.id}`)
                        }
                        className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer"
                      >
                          {!imageSrc ? (
                             <Skeleton className="w-full h-full rounded-lg" />
                              ) : (
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                         )}

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              product.status
                            )}`}
                          >
                            {product.status}
                          </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickView(product);
                            }}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                          >
                            <FaEye size={16} className="text-gray-600" />
                          </button>
                        </div>

                        {/* Organic Badge */}
                        {product.organic_certified && (
                          <div className="absolute bottom-3 left-3">
                            <span className="inline-flex items-center px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                              🌿 Organic
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="p-5">
                        {/* Category */}
                        {/* <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            {product.category.name}
                          </span>
                          {product.average_rating > 0 && renderStars(product.average_rating)}
                        </div> */}

                        {/* Name and Description */}
                        <h3
                          onClick={() =>
                            navigate(`/products/details/${product.id}`)
                          }
                          className="font-semibold text-lg text-gray-900 mb-2 cursor-pointer hover:text-green-600 transition-colors line-clamp-1"
                        >
                          {product.name}
                        </h3>

                        {/* Price and Stock */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-2xl font-bold text-green-600">
                              {displayPrice} {product.currency}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              / {product.unit}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">{t("stock")}</div>
                            <div className="font-medium text-gray-900">
                              {stockQty} {product.unit}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">
                            {t("quantity")}:
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                handleQuantityDecrease(product.id, product)
                              }
                              disabled={quantity <= minOrderQty}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                              -
                            </button>
                            <span className="font-semibold text-gray-900 min-w-8 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityIncrease(product.id, product)
                              }
                              disabled={quantity >= stockQty}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={
                            isAddingToCart ||
                            stockQty === 0 ||
                            quantity >= stockQty ||
                            stockQty < minOrderQty ||
                            status?.in_cart === true
                          }
                          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                            isAddingToCart ||
                            stockQty === 0 ||
                            stockQty < minOrderQty ||
                            status?.in_cart === true
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          }`}
                        >
                          {isAddingToCart ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              {t("adding")}...
                            </>
                          ) : stockQty === 0 ? (
                            t("out_of_stock")
                          ) : stockQty < minOrderQty ? (
                            t("out_of_stock") // ⭐ You can also replace with: t("min_order_not_reached")
                          ) : status?.in_cart ? (
                            t("already_in_cart")
                          ) : (
                            <>
                              <ShoppingBag size={18} />
                              {t("add_to_cart")}
                            </>
                          )}
                        </button>

                        {/* Min Order Info */}
                        <div className="text-center mt-3">
                          <span className="text-xs text-gray-500">
                            Min. order: {minOrderQty} {product.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* Pagination - Product list ke baad */}
        {/* Pagination Component */}
       {productResults.length > 0 && (
  <div className="flex flex-col items-center justify-between gap-4 pt-6 mt-8 border-t border-gray-200 sm:flex-row">
    {/* {t("showing")} info */}
    {/* <div className="text-sm text-gray-600">
      {t("showing")}{" "}
      <span className="font-semibold text-gray-900">
        {(pagination.current_page - 1) * pagination.current_page_size + 1}
      </span>
      {" - "}
      <span className="font-semibold text-gray-900">
        {Math.min(
          pagination.current_page * pagination.current_page_size,
          pagination.total_items
        )}
      </span>
      {" of "}
      <span className="font-semibold text-gray-900">{pagination.total_items}</span> products
    </div> */}
    <p className="text-sm text-gray-700">
  {t("showing")}{" "}
  <span className="font-medium">{startItem}</span> to{" "}
  <span className="font-medium">{endItem}</span> {t("of")}{" "}
  <span className="font-medium">{pagination.total_items}</span>{" "}
  {t("results")}
</p>


    {/* Pagination Controls */}
    <div className="flex items-center gap-2">
      {/* Items per page */}
      <div className="hidden mr-4 sm:flex items-center gap-2">
        <span className="text-sm text-gray-600">{t("show")}:</span>
        <select
          value={filters.page_size || pagination.current_page_size.toString()}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            page_size: e.target.value,
            page: "1"
          }))}
          className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-green-500"
        >
          {[4, 8, 12, 16, 24].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {/* Previous */}
      <button
        onClick={() => {
          if (pagination.previous) {
            setFilters(prev => ({
              ...prev,
              page: (pagination.current_page - 1).toString()
            }));
          }
        }}
        disabled={!pagination.previous}
        className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Info */}
      <div className="flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">
          {t("page")} {pagination.current_page} {t("of")} {pagination.total_pages}
        </span>
      </div>

      {/* Next */}
      <button
        onClick={() => {
          if (pagination.next) {
            setFilters(prev => ({
              ...prev,
              page: (pagination.current_page + 1).toString()
            }));
          }
        }}
        disabled={!pagination.next}
        className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
)}
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("filters")}
                </h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* Mobile filter content - same as desktop but compact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("search_products")}
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder={t("search_placeholder")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("category")}
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">{t("all_categories")}</option>
                  {categoryResults.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("price_range")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="min_price"
                    placeholder={t("min")}
                    value={filters.min_price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    name="max_price"
                    placeholder={t("max")}
                    value={filters.max_price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                {t("reset_filters")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Quick View Modal */}
      {isQuickViewOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsQuickViewOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="p-6">
              {/* Header Section */}
              <div className="flex items-start gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={getProductImage(selectedProduct)}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium mb-2">
                    {selectedProduct.category.name}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">
                    {selectedProduct.name}
                  </h2>
                  {selectedProduct.average_rating > 0 && (
                    <div className="flex items-center gap-1">
                      {renderStars(selectedProduct.average_rating)}
                      <span className="text-xs text-gray-500 ml-1">
                        ({selectedProduct.total_reviews})
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right md:mr-10">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedProduct.price?.calculated_price
                      ?.discounted_price ||
                      selectedProduct.final_base_price}{" "}
                    {selectedProduct.currency}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t("per")} {selectedProduct.unit}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="space-y-3">
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={getProductImage(selectedProduct)}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        selectedProduct.status
                      )}`}
                    >
                      {selectedProduct.status}
                    </span>
                    {selectedProduct.organic_certified && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-500 text-white rounded text-xs font-medium">
                        🌿 Organic
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Stock Information */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {t("available_stock")}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          parseFloat(selectedProduct.stock_quantity) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedProduct.stock_quantity} {selectedProduct.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{t("minimum_order")}</span>
                      <span>
                        {parseFloat(selectedProduct.min_order_quantity)}{" "}
                        {selectedProduct.unit}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector - Only show if stock is available */}
                  {/* Quantity Selector & Add to Cart Section */}
                  {/* Quantity Selector & Add to Cart Section */}
                  {parseFloat(selectedProduct.stock_quantity) >=
                  parseFloat(selectedProduct.min_order_quantity) ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {t("quantity")}
                        </span>
                        <span className="text-xs text-gray-500">
                          Min: {parseFloat(selectedProduct.min_order_quantity)}{" "}
                          {selectedProduct.unit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-2">
                        <button
                          onClick={() =>
                            handleQuantityDecrease(
                              selectedProduct.id,
                              selectedProduct
                            )
                          }
                          disabled={
                            getProductQuantity(
                              selectedProduct.id,
                              selectedProduct
                            ) <= parseFloat(selectedProduct.min_order_quantity)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                        >
                          <span className="text-lg font-medium">-</span>
                        </button>

                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            {getProductQuantity(
                              selectedProduct.id,
                              selectedProduct
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {selectedProduct.unit}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleQuantityIncrease(
                              selectedProduct.id,
                              selectedProduct
                            )
                          }
                          disabled={
                            getProductQuantity(
                              selectedProduct.id,
                              selectedProduct
                            ) >= parseFloat(selectedProduct.stock_quantity)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                        >
                          <span className="text-lg font-medium">+</span>
                        </button>
                      </div>

                      {/* Stock Warning - Agar stock kam hai lekin minimum order ke liye sufficient hai */}
                      {parseFloat(selectedProduct.stock_quantity) <
                        parseFloat(selectedProduct.min_order_quantity) * 2 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-600">⚠️</span>
                            <div className="text-xs text-yellow-700">
                              <span className="font-medium">{t("low_stock")}:</span>{" "}
                              {t("only")} {selectedProduct.stock_quantity}{" "}
                              {selectedProduct.unit} {t("available")}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Total Price */}
                      <div className="flex justify-between items-center py-2 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                          {t("total_price")}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {(
                            (selectedProduct.price?.calculated_price
                              ?.discounted_price ||
                              selectedProduct.final_base_price) *
                            getProductQuantity(
                              selectedProduct.id,
                              selectedProduct
                            )
                          ).toFixed(2)}{" "}
                          {selectedProduct.currency}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => {
                          handleAddToCart(selectedProduct);
                          setIsQuickViewOpen(false);
                        }}
                        disabled={addingToCart[selectedProduct.id]}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                          addingToCart[selectedProduct.id]
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                        }`}
                      >
                        {addingToCart[selectedProduct.id] ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                           {t("adding")}
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={18} />
                            {t("add_to_cart")}
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Out of Stock State - Jab available stock minimum order quantity se kam hai */
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">⛔</span>
                      </div>
                      <h3 className="text-lg font-semibold text-red-600 mb-2">
                        {t("out_of_stock")}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {t("available_stock")} ({selectedProduct.stock_quantity}{" "}
                        {selectedProduct.unit}) is less than minimum order
                        {t("quantity")} (
                        {parseFloat(selectedProduct.min_order_quantity)}{" "}
                        {selectedProduct.unit})
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-red-700">{t("available_stock")}:</span>
                          <span className="font-medium text-red-700">
                            {selectedProduct.stock_quantity}{" "}
                            {selectedProduct.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-red-700">{t("min_order")}:</span>
                          <span className="font-medium text-red-700">
                            {parseFloat(selectedProduct.min_order_quantity)}{" "}
                            {selectedProduct.unit}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsQuickViewOpen(false)}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        {t("continue_shopping")}
                      </button>
                    </div>
                  )}

                  {/* Additional Info */}
                  {parseFloat(selectedProduct.stock_quantity) > 0 && (
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">{t("unit")}</div>
                        <div className="text-sm font-medium text-gray-900">
                          {selectedProduct.unit}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                         {t("in_stock")}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {selectedProduct.stock_quantity}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={() =>
                    navigate(`/products/details/${selectedProduct.id}`)
                  }
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  {t("view_full_details")} →
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{t("share")}:</span>
                  <button className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                    <FaFacebookF size={12} className="text-blue-600" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                    <FaTwitter size={12} className="text-blue-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategoryPage;
