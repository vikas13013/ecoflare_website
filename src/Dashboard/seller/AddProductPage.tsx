import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiUpload,
  FiPlus,
  FiTrash2,
  FiMinus,
  FiX,
} from "react-icons/fi";
import { createSellerProduct } from "../../features/sellerProduct/sellerProductThunk";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../features/auth/authThunk";
import { RootState } from "../../app/store";
import { fetchCategories } from "../../features/category/categoryThunk";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/reduxHooks";

interface QuantityDiscount {
  min_quantity: number | null;
  max_quantity: number | null;
  discount_percentage: string;
  shipping_charges: string;
}

interface ImageFile {
  file: File;
  preview: string;
}

const AddProductPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: userData } = useSelector((state: RootState) => state.auth);
  const user = userData;

  const categories = useAppSelector(
    (state) => state.category.categories.data || [],
  );
  console.log(categories);

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [quantityDiscounts, setQuantityDiscounts] = useState<
    QuantityDiscount[]
  >([
    {
      min_quantity: 1,
      max_quantity: null,
      discount_percentage: "",
      shipping_charges: "",
    },
  ]);
  const [images, setImages] = useState<ImageFile[]>([]);

  useEffect(() => {
    dispatch(fetchCategories());
    if (!user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    status: "Draft",
    user: user?.id || "",
    stock_quantity: "",
    is_flexible_buying: false,
    is_bulk_buying: false,
    is_preorder_produce: false,
    growing_session: "",
    product_availability: 1,
    // branch: "",
    organic_certified: false,
    canada_grade: "",
    is_negotiable: false,
    currency: "CAD",
    base_price: "",
    hst_included: false,
    min_order_quantity: "",
    unit: "kg",
    expiry_date: "",
    harvest_date: "",
    food_safety_certification: "",
    is_top_products: false,
  });

  const sessions = ["Spring", "Summer", "Fall", "Winter"];
  const grades = [
    {
      show_name: "Grade A",
      name: "Grade A",
      grade: "A",
    },
    {
      show_name: "Grade B",
      name: "Grade B",
      grade: "B",
    },
    {
      show_name: "Grade C",
      name: "Grade C",
      grade: "C",
    },
    {
      show_name: "Grade D",
      name: "Grade D",
      grade: "D",
    },
  ];
  const currencies = ["CAD"];
  const units = [
    "kg",
    "g",
    "lb",
    "pcs",
    "piece",
    "box",
    "case",
    "bunch",
    "dozen",
    "liter",
    "ml",
    "pack",
    "bag",
    "other",
    "bushel",
    "tonne",
    "crate",
    "milliliter",
    "gallon",
    "quart",
    "pint",
    "ounce",
  ];
  const statusOptions = [
    "Draft",
    "Published",
    "Out of Stock",
    "Seasonal",
    "Discontinued",
    "Archived",
  ];
  const availabilityOptions = ["In Stock", "Out of Stock", "Pre-Order"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const val = type === "checkbox" ? checked : value;
    setProduct((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        newImages.push({ file, preview });
      }
    });

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = ""; // Reset input
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview); // Clean up memory
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleDiscountChange = (
    index: number,
    field: keyof QuantityDiscount,
    value: string,
  ) => {
    const updatedDiscounts = [...quantityDiscounts];
    if (field === "min_quantity" || field === "max_quantity") {
      updatedDiscounts[index][field] = value === "" ? null : parseInt(value);
    } else {
      updatedDiscounts[index][field] = value;
    }
    setQuantityDiscounts(updatedDiscounts);
  };

  const addDiscountTier = () => {
    setQuantityDiscounts([
      ...quantityDiscounts,
      {
        min_quantity: null,
        max_quantity: null,
        discount_percentage: "",
        shipping_charges: "",
      },
    ]);
  };

  const removeDiscountTier = (index: number) => {
    if (quantityDiscounts.length > 1) {
      const updatedDiscounts = quantityDiscounts.filter((_, i) => i !== index);
      setQuantityDiscounts(updatedDiscounts);
    }
  };

  // Function to upload images after product creation
  //   const uploadProductImages = async (productId?: number) => {
  //   // 🔴 HARD GUARD
  //   if (!productId) {
  //     throw new Error("Product ID is missing for image upload");
  //   }

  //   if (!images || images.length === 0) return;

  //   const formData = new FormData();

  //   // ✅ SAFE CONVERSION
  //   formData.append('product', String(productId));

  //   images.forEach(image => {
  //     if (image?.file) {
  //       formData.append('images', image.file);
  //     }
  //   });

  //   try {
  //     const response = await fetch(
  //       'https://api.ecoflaresolutions.com/product/product-images/',
  //       {
  //         method: 'POST',
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
  //         },
  //         body: formData,
  //       }
  //     );
  //          const data = await response.json();
  //      console.log(data, "Uploaded Images Response");

  //     if (!response.ok) {
  //       throw new Error('Failed to upload images');
  //     }

  //       return data;

  //     // return await response.json();
  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //     throw error;
  //   }
  // };

  const uploadProductImages = async (productId?: number) => {
    // 🔴 HARD GUARD
    if (!productId) {
      throw new Error("Product ID is missing for image upload");
    }

    if (!images || images.length === 0) return;

    const formData = new FormData();

    // ✅ Product ID
    formData.append("product", String(productId));

    // ✅ MAIN IMAGE (0th index)
    if (images[0]?.file) {
      formData.append("product_image", images[0].file);
    }

    // ✅ GALLERY IMAGES
    images.forEach((img) => {
      if (img?.file) {
        formData.append("images", img.file);
      }
    });

    try {
      const response = await fetch(
        "https://api.ecoflaresolutions.com/product/product-images/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          },
          body: formData,
        },
      );

      const data = await response.json();
      console.log(data, "Uploaded Images Response");

      if (!response.ok) {
        throw new Error(data?.message || "Failed to upload images");
      }

      return data;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate quantity discounts
      const validDiscounts = quantityDiscounts.filter(
        (discount) =>
          discount.discount_percentage && discount.min_quantity !== null,
      );

      const payload = {
        ...product,
        stock_quantity: parseFloat(product.stock_quantity) || 0,
        base_price: parseFloat(product.base_price) || 0,
        min_order_quantity: parseFloat(product.min_order_quantity) || 1,
        category: parseInt(product.category),
        // branch: parseInt(product.branch),
        user: product.user ? Number(product.user) : undefined,
        quantity_discounts:
          validDiscounts.length > 0 ? validDiscounts : undefined,
      };

      // Step 1: Create product
      const productResponse = await dispatch(
        createSellerProduct(payload),
      ).unwrap();
      console.log(productResponse, "Created Product Response neww");
      const productId = productResponse.data.id;
      if (!productId) {
        throw new Error("Product ID not returned from create product API");
      }

      // Step 2: Upload images if any
      if (images.length > 0) {
        setUploadingImages(true);
        await uploadProductImages(productId);
        setUploadingImages(false);
      }

      toast.success("✅ Product created successfully!");
      navigate("/dashboard/seller");
    } catch (error: any) {
      console.error("FULL ERROR 👉", error);
      console.error("STACK 👉", error?.stack);
      toast.error(
        "❌ Error creating product: " +
          (typeof error === "string"
            ? error
            : error?.message || "Something went wrong"),
      );
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProduct((prev) => {
      const updated = { ...prev, [name]: value };

      // Harvest date change
      if (name === "harvest_date") {
        if (prev.expiry_date && new Date(prev.expiry_date) <= new Date(value)) {
          updated.expiry_date = "";
          toast.warning("Expiry date must be after harvest date");
        }
      }

      // Expiry date change
      if (name === "expiry_date") {
        if (
          prev.harvest_date &&
          new Date(value) <= new Date(prev.harvest_date)
        ) {
          toast.error("Expiry date must be after harvest date");
          return prev;
        }
      }

      return updated;
    });
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#1F4E3D] hover:text-green-700 transition-colors mb-4 font-medium"
          >
            <FiArrowLeft className="mr-2" /> Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to list your product
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-6 bg-green-600 rounded-full mr-3"></div>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch *
                </label>
                <select
                  name="branch"
                  value={product.branch}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.legal_name}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your product in detail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-vertical"
                />
              </div>

              {/* Product Images */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>

                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-images"
                  />
                  <label
                    htmlFor="product-images"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">
                      Click to upload images
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG, JPEG up to 10MB
                    </span>
                  </label>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Selected Images ({images.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Inventory Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Base Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price ({product.currency}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="base_price"
                  value={product.base_price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  name="currency"
                  value={product.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  {currencies.map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="stock_quantity"
                  value={product.stock_quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={product.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Order Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Quantity *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="min_order_quantity"
                  value={product.min_order_quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              {/* Product Availability */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Availability
                </label>
                <select
                  name="product_availability"
                  value={product.product_availability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>
          </div>

          {/* Quantity Discounts Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-6 bg-purple-600 rounded-full mr-3"></div>
                Quantity Discounts
              </div>
              <button
                type="button"
                onClick={addDiscountTier}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <FiPlus className="w-4 h-4" />
                Add Tier
              </button>
            </h2>

            <div className="space-y-4">
              {quantityDiscounts.map((discount, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg"
                >
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Quantity *
                    </label>
                    <input
                      type="number"
                      value={discount.min_quantity || ""}
                      onChange={(e) =>
                        handleDiscountChange(
                          index,
                          "min_quantity",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="1"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Quantity
                    </label>
                    <input
                      type="number"
                      value={discount.max_quantity || ""}
                      onChange={(e) =>
                        handleDiscountChange(
                          index,
                          "max_quantity",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Leave empty for no limit"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount %
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={discount.discount_percentage}
                      onChange={(e) =>
                        handleDiscountChange(
                          index,
                          "discount_percentage",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={discount.shipping_charges}
                      onChange={(e) =>
                        handleDiscountChange(
                          index,
                          "shipping_charges",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <button
                      type="button"
                      onClick={() => removeDiscountTier(index)}
                      disabled={quantityDiscounts.length === 1}
                      className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiTrash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-6 bg-orange-600 rounded-full mr-3"></div>
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Growing Session */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Growing Session
                </label>
                <select
                  name="growing_session"
                  value={product.growing_session}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">Select Session</option>
                  {sessions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Canada Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canada Grade
                </label>

                <select
                  name="canada_grade"
                  value={product.canada_grade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">Select Grade</option>

                  {grades.map((g) => (
                    <option key={g.grade} value={g.grade}>
                      {g.show_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Harvest Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harvest Date
                </label>
                <input
                  type="date"
                  name="harvest_date"
                  value={product.harvest_date}
                  onChange={handleDateChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  value={product.expiry_date}
                  onChange={handleDateChange}
                  min={product.harvest_date || ""}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Food Safety Certification */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Safety Certification
                </label>
                <input
                  type="text"
                  name="food_safety_certification"
                  value={product.food_safety_certification}
                  onChange={handleChange}
                  placeholder="e.g., Safe Food Certified, Organic Certified, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Settings & Options Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-6 bg-red-600 rounded-full mr-3"></div>
              Settings & Options
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkboxes Grid */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="organic_certified"
                      checked={product.organic_certified}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Organic Certified
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_negotiable"
                      checked={product.is_negotiable}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Price Negotiable
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="hst_included"
                      checked={product.hst_included}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      HST Included
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_top_products"
                      checked={product.is_top_products}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Featured Product
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_flexible_buying"
                      checked={product.is_flexible_buying}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Flexible Buying
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_bulk_buying"
                      checked={product.is_bulk_buying}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Bulk Buying
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_preorder_produce"
                      checked={product.is_preorder_produce}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Pre-order Produce
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Product...
                </>
              ) : uploadingImages ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading Images...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
