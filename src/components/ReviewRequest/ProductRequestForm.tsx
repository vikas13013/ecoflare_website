import {
  ChevronDown,
  Calendar,
  Package,
  CheckCircle,
  Truck,
  Info,
  Clock,
  AlertCircle,
  ArrowLeft,
  Eye,
  Send,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCategories } from "../../features/category/categoryThunk";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { AppDispatch, RootState } from "../../app/store";
import { fetchAddresses } from "../../features/address/addressThunk";
import { MapPin, Plus } from "lucide-react"; //
import { useSelector } from "react-redux";

const ProductRequestForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // State from location
  const {
    type,
    product_id,
    buyer_id,
    quantity: initialQuantity,
    unit,
    grade,
    product_availability,
    product_name,
    base_price,
    currency,
  } = location.state || { type: "Unknown" };
  console.log(location.state);

  // State management
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [negotiationId, setNegotiationId] = useState(null);
  const [activeTab, setActiveTab] = useState("product");

  // Helper function to convert display type to backend format
  const getBuyingTypeForBackend = (displayType) => {
    if (displayType === "Flexible Buying") {
      return "flexible_buying";
    } else if (displayType === "Pre-Order-Produce") {
      return "preorder_produce";
    }
    return displayType.toLowerCase().replace(/-/g, "_"); // fallback
  };

  // Form data state
  const [formData, setFormData] = useState({
    // Common fields
    // quantity: initialQuantity || "",
    quantity: 1,

    unit: unit || "kg",
    grade: grade || "",
    product_availability: product_availability || "",
    message: "",
    product_variety: "",
    product_type: "",
    expected_quantity: "",
    expected_price: base_price || "",
    currency: currency || "CAD",

    // Common delivery fields for both types
    frequency_of_deliveries: "weekly",
    delivery_start_date: "",
    delivery_end_date: "",
    expiry_date: "",
    harvest_date: "",
    location: "",
  });

  const { addresses, loading: addressesLoading } = useSelector(
    (state: RootState) => state.address,
  );

  const {
    categories: categoryResponse,
    loading: categoryLoading,
    error: categoryError,
  } = useAppSelector((state) => state.category);

  // Extract the actual categories array from the response
  const categoriess = categoryResponse?.data || [];

  useEffect(() => {
    if (buyer_id) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, buyer_id]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle form field changes
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // Agar start date change ho rahi hai, to end date clear kar do
      if (name === "delivery_start_date") {
        return {
          ...prev,
          [name]: value,
          delivery_end_date: "", // Clear end date
        };
      }

      // Agar harvest date change ho rahi hai (Pre-Order ke liye), to expiry date clear kar do
      if (name === "harvest_date") {
        return {
          ...prev,
          [name]: value,
          expiry_date: "", // Clear expiry date
        };
      }

      // Normal field update for other fields
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // Calculate total value
  const calculateTotal = () => {
    const quantity = parseFloat(formData.expected_quantity) || 0;
    const price = parseFloat(formData.expected_price) || 0;
    return (quantity * price).toFixed(2);
  };

  // Validate form based on type
  const validateForm = () => {
    const requiredFields = [
      "expected_quantity",
      "expected_price",
      "product_variety",
      "product_type",
      "grade",
    ];

    // Check common required fields
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace("_", " ")}`);
        return false;
      }
    }

    // Common validations for both types
    if (!formData.frequency_of_deliveries) {
      setError("Please select frequency of deliveries");
      return false;
    }
    if (!formData.delivery_start_date) {
      setError("Please select delivery start date");
      return false;
    }
    if (!formData.delivery_end_date) {
      setError("Please select delivery end date");
      return false;
    }

    if (!formData.location) {
      setError("Please select delivery location");
      return false;
    }

    if (type === "Pre-Order-Produce") {
      if (!formData.harvest_date) {
        setError("Please select harvest date");
        return false;
      }
      if (!formData.expiry_date) {
        setError("Please select expiry date");
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const accessToken = localStorage.getItem("accessToken");

      // Step 1: Create negotiation entry
      const negotiationResponse = await fetch(
        "https://api.ecoflaresolutions.com/negotiation/negotiations/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            product_id: product_id,
            // buyer: buyer_id,
            buying_type: getBuyingTypeForBackend(type),
          }),
        },
      );

      const negotiationData = await negotiationResponse.json();
      console.log(negotiationData, "negotiationData");

      if (!negotiationData || negotiationData.status !== 0) {
        throw new Error(
          negotiationData?.message || "Failed to create negotiation",
        );
      }

      if (!negotiationData || !negotiationData?.data?.id) {
        throw new Error("Unexpected response from server");
      }

      const newNegotiationId = negotiationData?.data?.id;

      if (!newNegotiationId) {
        throw new Error("Unexpected response from server");
      }

      setNegotiationId(newNegotiationId);

      // Step 2: Create price negotiation
      const priceNegotiationData = {
        user: buyer_id,
        negotiation_id: newNegotiationId,
        quantity: parseInt(formData.quantity) || 1,
        unit: formData.unit,
        grade: formData.grade,
        product_availability: parseInt(formData.product_availability),
        message: formData.message || `Negotiation request for ${product_name}`,
        product_variety: formData.product_variety,
        product_type: formData.product_type,
        expected_quantity: parseFloat(formData.expected_quantity),
        expected_price: parseFloat(formData.expected_price).toFixed(2),
        currency: formData.currency,
        delivery_start_date: formData.delivery_start_date,
        delivery_end_date: formData.delivery_end_date,

        frequency_of_deliveries: formData.frequency_of_deliveries,
        location: formData.location,
      };

      // Add type-specific fields
      if (type === "Pre-Order-Produce") {
        priceNegotiationData.harvest_date = formData.harvest_date;
        priceNegotiationData.expiry_date = formData.expiry_date;
      }

      const priceResponse = await fetch(
        "https://api.ecoflaresolutions.com/negotiation/price-negotiations/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(priceNegotiationData),
        },
      );

      if (!priceResponse.ok) {
        const errorData = await priceResponse.json();
        throw new Error(
          errorData.message || "Failed to submit price negotiation",
        );
      }

      const result = await priceResponse.json();

      // Success
      setSuccess("Negotiation request submitted successfully!");

      // Redirect after delay
      setTimeout(() => {
        navigate(`/buyer/negotiation/${newNegotiationId}`, {
          replace: true,
        });
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      console.error("Error submitting negotiation:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const CommonCanadaGradeList = [
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">
            Preparing negotiation form...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we set everything up
          </p>
        </div>
      </div>
    );
  }

  // Error state for missing data
  if (!product_id || !buyer_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Missing Information
          </h2>
          <p className="text-gray-600 mb-6">
            Required product information is missing. Please go back and try
            again.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {type === "Flexible Buying"
                  ? "Flexible Buying Request"
                  : "Pre-Order Produce"}
              </h1>
              <p className="text-gray-600 mt-2">
                {type === "Flexible Buying"
                  ? "Request flexible deliveries for your needs"
                  : "Pre-order produce for future harvest"}
              </p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg capitalize">
              <span className="font-medium">{product_name}</span>
              <span className="text-sm ml-2">
                ({base_price} {currency} per {unit})
              </span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-8">
            {["product", "details", "submit"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${
                    activeTab === step
                      ? "bg-primary text-white"
                      : index <
                          ["product", "details", "submit"].indexOf(activeTab)
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                  }
                `}
                >
                  {index + 1}
                </div>
                <div className="ml-3">
                  <p
                    className={`font-medium ${
                      activeTab === step ? "text-primary" : "text-gray-500"
                    }`}
                  >
                    {step === "product"
                      ? "Product Info"
                      : step === "details"
                        ? "Negotiation Details"
                        : "Submit"}
                  </p>
                </div>
                {index < 2 && (
                  <div
                    className={`
                    h-0.5 w-16 mx-4
                    ${
                      index <
                      ["product", "details", "submit"].indexOf(activeTab)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }
                  `}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-700 font-medium">{success}</span>
              </div>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            {/* Product Information Tab */}
            {activeTab === "product" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Variety */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Variety *
                    </label>
                    <input
                      type="text"
                      name="product_variety"
                      value={formData.product_variety}
                      onChange={handleChange}
                      placeholder="e.g., Hass Avocados, Organic"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                    />
                  </div>
                  {/* Product Type (Category) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type (Category) *
                    </label>
                    <select
                      name="product_type"
                      value={formData.product_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                    >
                      <option value="">Select category</option>
                      {Array.isArray(categoriess) && categoriess.length > 0 ? (
                        categoriess.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No categories available
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Grade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality Grade *
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                    >
                      <option value="">Select grade</option>
                      {CommonCanadaGradeList.map((gradeItem) => (
                        <option key={gradeItem.grade} value={gradeItem.grade}>
                          {gradeItem.show_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product Availability */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Negotiation Quantity ({unit}) *
                    </label>
                    <input
                      type="number"
                      name="product_availability"
                      value={formData.product_availability}
                      onChange={handleChange}
                      placeholder={` negotiation quantity in ${unit}`}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                      disabled
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center"
                  >
                    Continue
                    <ChevronDown className="w-5 h-5 ml-2 transform rotate-90" />
                  </button>
                </div>
              </div>
            )}

            {/* Negotiation Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Expected Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Quantity ({unit}) *
                    </label>
                    <input
                      type="number"
                      name="expected_quantity"
                      value={formData.expected_quantity}
                      onChange={handleChange}
                      placeholder={`Quantity in ${unit}`}
                      min="1"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                    />
                  </div>

                  {/* Expected Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Price ({currency}) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500"></span>
                      </div>
                      <input
                        type="number"
                        name="expected_price"
                        value={formData.expected_price}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Type-specific fields */}
                  {/* Delivery Details - Common for both types */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency of Deliveries *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["daily", "weekly", "monthly"].map((freq) => (
                        <button
                          type="button"
                          key={freq}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              frequency_of_deliveries: freq,
                            }))
                          }
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.frequency_of_deliveries === freq
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-sm font-medium capitalize">
                            {freq}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Start Date *
                    </label>
                    <input
                      type="date"
                      name="delivery_start_date"
                      value={formData.delivery_start_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery End Date *
                    </label>
                    <input
                      type="date"
                      name="delivery_end_date"
                      value={formData.delivery_end_date}
                      onChange={handleChange}
                      min={
                        formData.delivery_start_date ||
                        new Date().toISOString().split("T")[0]
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      required
                    />
                  </div>

                  {/* Delivery Dates ke baad yeh add karo */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Location *
                    </label>

                    {/* Address Selection Dropdown */}
                    <div className="relative">
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none bg-white"
                        required
                      >
                        <option value="">Select delivery address</option>
                        {addressesLoading ? (
                          <option disabled>Loading addresses...</option>
                        ) : addresses && addresses.length > 0 ? (
                          addresses.map((address) => (
                            <option key={address.id} value={address.id}>
                              {address.address}, {address.city},{" "}
                              {address.postal_code}, {address.country}
                              {address.is_primary ? " (Primary)" : ""}
                            </option>
                          ))
                        ) : (
                          <option disabled>No addresses found</option>
                        )}
                      </select>
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Selected Address Preview (optional) */}
                    {formData.location && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 font-medium flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          Selected Address ID: {formData.location}
                        </p>
                      </div>
                    )}

                    {/* Add New Address Link (optional) */}
                    {/* <div className="mt-2 text-right">
    <button
      type="button"
      onClick={() => navigate('/buyer/address/add')}
      className="text-sm text-primary hover:text-primary-dark flex items-center justify-end"
    >
      <Plus className="w-4 h-4 mr-1" />
      Add New Address
    </button>
  </div> */}
                  </div>

                  {type === "Pre-Order-Produce" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Harvest Date *
                        </label>
                        <input
                          type="date"
                          name="harvest_date"
                          value={formData.harvest_date}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="date"
                          name="expiry_date"
                          value={formData.expiry_date}
                          onChange={handleChange}
                          min={
                            formData.harvest_date ||
                            new Date().toISOString().split("T")[0]
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                          required
                        />
                      </div>
                    </>
                  )}
                  {/* Message */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Add any additional details or requests..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>

                  {/* Summary Card */}
                  <div className="md:col-span-2">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Order Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Product</span>
                          <span className="font-medium">{product_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Expected Quantity
                          </span>
                          <span className="font-medium">
                            {formData.expected_quantity || 0} {unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Price per {unit}
                          </span>
                          <span className="font-medium">
                            {currency} {formData.expected_price || 0}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Value</span>
                            <span className="text-lg font-bold text-primary">
                              {currency} {calculateTotal()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("product")}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </button>
                  <div className="space-x-3 flex">
                    <button
                      type="button"
                      onClick={() => setActiveTab("submit")}
                      className="px-6 py-3 border border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors flex items-center"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("submit")}
                      className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center"
                    >
                      Continue to Submit
                      <ChevronDown className="w-5 h-5 ml-2 transform rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Tab */}
            {activeTab === "submit" && (
              <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-start">
                    <Info className="w-6 h-6 text-blue-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Review Your Request
                      </h3>
                      <p className="text-blue-700">
                        Please review all details carefully before submitting.
                        Once submitted, suppliers will be able to view your
                        request and submit their offers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Product Details
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500">
                            Product Name
                          </span>
                          <p className="font-medium">{product_name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Variety</span>
                          <p className="font-medium">
                            {formData.product_variety || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Type</span>
                          <p className="font-medium">
                            {formData.product_type || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Grade</span>
                          <p className="font-medium">
                            {formData.grade || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Negotiation Details
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500">
                            Expected Quantity
                          </span>
                          <p className="font-medium">
                            {formData.expected_quantity} {unit}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            Expected Price
                          </span>
                          <p className="font-medium">
                            {currency} {formData.expected_price} per {unit}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            Delivery Frequency
                          </span>
                          <p className="font-medium capitalize">
                            {formData.frequency_of_deliveries}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            Delivery Start Date
                          </span>
                          <p className="font-medium">
                            {formData.delivery_start_date || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            Delivery End Date
                          </span>
                          <p className="font-medium">
                            {formData.delivery_end_date || "Not specified"}
                          </p>
                        </div>

                        {/* Delivery Details section mein address add karo */}
                        <div>
                          <span className="text-sm text-gray-500">
                            Delivery Location
                          </span>
                          <p className="font-medium">
                            {formData.location ? (
                              addresses.find(
                                (a) => a.id === parseInt(formData.location),
                              ) ? (
                                <>
                                  {
                                    addresses.find(
                                      (a) =>
                                        a.id === parseInt(formData.location),
                                    ).address
                                  }
                                  ,
                                  {
                                    addresses.find(
                                      (a) =>
                                        a.id === parseInt(formData.location),
                                    ).city
                                  }
                                  ,
                                  {/* {addresses.find(a => a.id === parseInt(formData.locationName)).postal_code} */}
                                </>
                              ) : (
                                `Address ID: ${formData.location}`
                              )
                            ) : (
                              "Not selected"
                            )}
                          </p>
                        </div>

                        {type === "Pre-Order-Produce" && (
                          <>
                            <div>
                              <span className="text-sm text-gray-500">
                                Harvest Date
                              </span>
                              <p className="font-medium">
                                {formData.harvest_date}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">
                                Expiry Date
                              </span>
                              <p className="font-medium">
                                {formData.expiry_date}
                              </p>
                            </div>
                          </>
                        )}

                        <div>
                          <span className="text-sm text-gray-500">
                            Total Value
                          </span>
                          <p className="text-lg font-bold text-primary">
                            {currency} {calculateTotal()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.message && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Additional Message
                      </h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {formData.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Details
                  </button>
                  <div className="space-x-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Negotiation Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@ecoflaresolutions.com"
              className="text-primary hover:underline"
            >
              support@ecoflaresolutions.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductRequestForm;
