import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiSave, 
  FiUpload, 
  FiTrash2, 
  FiX, 
  FiEye,
  FiGrid,
  FiPlus,
  FiEdit2,
  FiImage,
  FiRefreshCw
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { 
  updateSellerProduct, 
  deleteSellerProduct, 
  fetchSellerProductById 
} from "../../features/sellerProduct/sellerProductThunk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface ProductImage {
  id?: number;
  product?: number;
  image: string;
  file?: File;
  isMain: boolean;
  isNew?: boolean;
}

interface ProductFormData {
  name: string;
  category: string | number;
  base_price: string;
  stock_quantity: string;
  description: string;
  unit: string;
  expiry_date: string;
  harvest_date: string;
  hst_included: boolean;
  min_order_quantity: string;
  canada_grade: string;
  food_safety_certification: string;
  organic_certified: boolean;
  is_negotiable: boolean;
  is_flexible_buying: boolean;
  is_bulk_buying: boolean;
  is_preorder_produce: boolean;
  product_availability: number;
  growing_session: string;
  currency: string;
  status?: string;
}

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { data: productDetails, loading: detailsLoading } = useSelector(
    (state: RootState) => state.sellerProduct.productDetails
  );

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    base_price: "",
    stock_quantity: "",
    description: "",
    unit: "kg",
    expiry_date: "",
    harvest_date: "",
    hst_included: false,
    min_order_quantity: "1.00",
    canada_grade: "",
    food_safety_certification: "",
    organic_certified: false,
    is_negotiable: false,
    is_flexible_buying: false,
    is_bulk_buying: false,
    is_preorder_produce: false,
    product_availability: 1,
    growing_session: "",
    currency: "CAD",
  });

  // Image states
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isManagingImages, setIsManagingImages] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImageType, setSelectedImageType] = useState<'existing' | 'new'>('existing');

  const categories = [
    { id: 1, name: "Vegetables" },
    { id: 2, name: "Fruits" },
    { id: 3, name: "Grains" },
    { id: 4, name: "Dairy" },
    { id: 5, name: "Meat" },
    { id: 6, name: "Herbs" },
    { id: 7, name: "Other" },
  ];

  const units = ["kg", "g", "lb", "piece", "bunch", "dozen", "pack"];
  const canadaGrades = ["Grade A", "Grade B", "Grade C", "Commercial", "Premium"];
  const growingSessions = ["Spring", "Summer", "Fall", "Winter", "Year-round", "Not specified"];
  const currencies = ["CAD", "USD", "EUR", "GBP"];
  const statuses = ["Published", "Draft", "Pending", "Archived"];

  // Fetch product details
  useEffect(() => {
    if (id) {
      dispatch(fetchSellerProductById(parseInt(id)));
    }
  }, [id, dispatch]);

  // Initialize form data and images when productDetails is loaded
  useEffect(() => {
    if (productDetails) {
      console.log('Product Details for editing:', productDetails);
      
      // Set form data
      setFormData({
        name: productDetails.name || "",
        category: typeof productDetails.category === 'object' 
          ? productDetails.category.id 
          : productDetails.category || "",
        base_price: productDetails.base_price || "",
        stock_quantity: productDetails.stock_quantity || "",
        description: productDetails.description || "",
        unit: productDetails.unit || "kg",
        expiry_date: productDetails.expiry_date || "",
        harvest_date: productDetails.harvest_date || "",
        hst_included: productDetails.hst_included || false,
        min_order_quantity: productDetails.min_order_quantity || "1.00",
        canada_grade: productDetails.canada_grade || "",
        food_safety_certification: productDetails.food_safety_certification || "",
        organic_certified: productDetails.organic_certified || false,
        is_negotiable: productDetails.is_negotiable || false,
        is_flexible_buying: productDetails.is_flexible_buying || false,
        is_bulk_buying: productDetails.is_bulk_buying || false,
        is_preorder_produce: productDetails.is_preorder_produce || false,
        product_availability: productDetails.product_availability || 1,
        growing_session: productDetails.growing_session || "",
        currency: productDetails.currency || "CAD",
        status: productDetails.status || "Draft",
      });

      // Initialize existing images
      const initialImages: ProductImage[] = [];
      
      // Add product_image as main image if exists
      if (productDetails.product_image) {
        initialImages.push({
          image: productDetails.product_image,
          isMain: true,
        });
      }

      // Add other images from images array
      if (productDetails.images && Array.isArray(productDetails.images)) {
        productDetails.images.forEach((img: any, index: number) => {
          initialImages.push({
            id: img.id,
            product: img.product,
            image: img.image,
            isMain: false,
          });
        });
      }

      setExistingImages(initialImages);
      setNewImages([]); // Reset new images
      setImagesToDelete([]); // Reset delete list
    }
  }, [productDetails]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ==================== IMAGE MANAGEMENT FUNCTIONS ====================

  const handleAddNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
      e.target.value = ""; // Reset file input
      toast.success(`${files.length} image(s) added for upload`);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const markImageForDeletion = (imageId: number) => {
    setImagesToDelete(prev => [...prev, imageId]);
    // Also remove from existing images display
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    toast.info("Image marked for deletion");
  };

  const unmarkImageForDeletion = (imageId: number) => {
    setImagesToDelete(prev => prev.filter(id => id !== imageId));
    // Need to restore image from productDetails
    if (productDetails?.images) {
      const imageToRestore = productDetails.images.find((img: any) => img.id === imageId);
      if (imageToRestore) {
        setExistingImages(prev => [...prev, {
          id: imageToRestore.id,
          product: imageToRestore.product,
          image: imageToRestore.image,
          isMain: false,
        }]);
      }
    }
  };

  const handleImageClick = (type: 'existing' | 'new', index: number) => {
    setSelectedImageType(type);
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  // Separate API call for uploading new images
  const uploadNewImages = async (productId: number) => {
    if (newImages.length === 0) return;

    const formData = new FormData();
    formData.append("product", String(productId));

    // Add all new images
    newImages.forEach((file, index) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        "https://api.ecoflaresolutions.com/product/product-images/",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken") || ""}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("New images uploaded successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error uploading new images:", error);
      throw new Error(error.response?.data?.message || "Failed to upload images");
    }
  };

  // Separate API call for deleting images
  const deleteMarkedImages = async () => {
    if (imagesToDelete.length === 0) return;

    try {
      const deletePromises = imagesToDelete.map(async (imageId) => {
        await axios.delete(
          `https://api.ecoflaresolutions.com/product/product-images/${imageId}/`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("accessToken") || ""}`,
            },
          }
        );
      });

      await Promise.all(deletePromises);
      console.log(`${imagesToDelete.length} image(s) deleted successfully`);
      return true;
    } catch (error: any) {
      console.error("Error deleting images:", error);
      throw new Error(error.response?.data?.message || "Failed to delete images");
    }
  };

  // Manage images function (separate from product update)
  const handleManageImages = async () => {
    if (!id) {
      toast.error("Product ID is missing");
      return;
    }

    const productId = parseInt(id);
    const hasChanges = newImages.length > 0 || imagesToDelete.length > 0;

    if (!hasChanges) {
      toast.info("No image changes to save");
      return;
    }

    setIsManagingImages(true);

    try {
      // Delete marked images first
      if (imagesToDelete.length > 0) {
        toast.info(`Deleting ${imagesToDelete.length} image(s)...`);
        await deleteMarkedImages();
        setImagesToDelete([]);
      }

      // Upload new images
      if (newImages.length > 0) {
        toast.info(`Uploading ${newImages.length} new image(s)...`);
        await uploadNewImages(productId);
        setNewImages([]);
      }

      // Refresh product data
      dispatch(fetchSellerProductById(productId));
      
      toast.success("Images updated successfully!");
    } catch (err: any) {
      console.error('Image management error:', err);
      toast.error(err?.message || "Failed to update images");
    } finally {
      setIsManagingImages(false);
    }
  };

  // ==================== PRODUCT UPDATE FUNCTION ====================

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!id) {
    toast.error("Product ID is missing");
    return;
  }

  const productId = parseInt(id);

  try {
    // Prepare data for API (without images)
    // Since we're not sending images, we can use plain object
    const updateData: any = {};
    
    // Convert form data to API expected format
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Convert boolean to string for API
        if (typeof value === 'boolean') {
          updateData[key] = value;
        } 
        // Handle category - if it's a number, keep as number
        else if (key === 'category' && !isNaN(Number(value))) {
          updateData[key] = Number(value);
        }
        // Handle numeric fields
        else if (['base_price', 'stock_quantity', 'min_order_quantity'].includes(key)) {
          updateData[key] = value;
        }
        // Handle product_availability
        else if (key === 'product_availability') {
          updateData[key] = Number(value);
        }
        // For all other fields
        else {
          updateData[key] = value;
        }
      }
    });

    console.log('Updating product with data:', updateData);
    
    // Dispatch the update action - now sending JSON instead of FormData
    await dispatch(updateSellerProduct({ 
      id: productId, 
      productData: updateData // Changed from FormData to plain object
    })).unwrap();

    toast.success("Product details updated successfully!");

    // Check if user wants to manage images separately
    const hasImageChanges = newImages.length > 0 || imagesToDelete.length > 0;
    
    if (hasImageChanges) {
      const shouldUpdateImages = window.confirm(
        "You have image changes pending. Do you want to update images now?"
      );
      
      if (shouldUpdateImages) {
        await handleManageImages();
      } else {
        toast.info("Product details saved. Image changes are still pending.");
      }
    }

    // Navigate back to products page
    navigate("/seller/products");

  } catch (err: any) {
    console.error('Update error:', err);
    toast.error(err?.message || "Failed to update product");
  }
};

  const handleDeleteProduct = async () => {
    if (!id) return;
    
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await dispatch(deleteSellerProduct(parseInt(id))).unwrap();
        toast.success("Product deleted successfully!");
        navigate("/seller/products");
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete product");
        setIsDeleting(false);
      }
    }
  };

  if (detailsLoading && !productDetails) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="flex justify-end gap-3">
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-[#1F4E3D] hover:text-[#0F3D2E] transition-colors duration-200 mb-6 group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Products</span>
        </button>
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Product</h1>
                <p className="text-gray-600">Update product details and manage images separately</p>
              </div>
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-70 mt-4 sm:mt-0"
              >
                <FiTrash2 />
                {isDeleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>

            {/* ============ SEPARATE IMAGE MANAGEMENT SECTION ============ */}
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiImage className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Image Management</h2>
                    <p className="text-sm text-gray-600">Manage product images separately</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {(newImages.length > 0 || imagesToDelete.length > 0) && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {newImages.length} new, {imagesToDelete.length} to delete
                      </span>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleManageImages}
                    disabled={isManagingImages || (newImages.length === 0 && imagesToDelete.length === 0)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isManagingImages ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiSave />
                        Save Image Changes
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Existing Images Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-800">Existing Images</h3>
                    <span className="text-sm text-gray-500">
                      {existingImages.length} images
                    </span>
                  </div>
                  
                  {existingImages.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <FiImage className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No existing images</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {existingImages.map((img, index) => (
                        <div 
                          key={img.id || index} 
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                        >
                          <img
                            src={img.image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handleImageClick('existing', index)}
                          />
                          
                          {/* Main Image Badge */}
                          {img.isMain && (
                            <div className="absolute top-2 left-2 bg-[#1F4E3D] text-white text-xs font-medium px-2 py-1 rounded">
                              Main
                            </div>
                          )}
                          
                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => img.id && markImageForDeletion(img.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                            title="Delete image"
                          >
                            <FiTrash2 className="w-3 h-3" />
                          </button>
                          
                          {/* Image ID */}
                          {img.id && (
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              ID: {img.id}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* New Images Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-800">New Images to Upload</h3>
                    <span className="text-sm text-gray-500">
                      {newImages.length} pending
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {/* Add Image Card */}
                    <label className="cursor-pointer">
                      <div className="aspect-square border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-2 p-4 bg-blue-50">
                        <FiPlus className="text-xl text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Add Images</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleAddNewImages}
                        accept="image/*"
                        multiple
                      />
                    </label>

                    {/* New Image Thumbnails */}
                    {newImages.map((file, index) => (
                      <div 
                        key={index} 
                        className="relative aspect-square rounded-lg overflow-hidden border border-blue-200 group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => handleImageClick('new', index)}
                        />
                        
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                          title="Remove image"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                        
                        {/* File Info */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded truncate">
                            {file.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Instructions */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Click "Add Images" to select new images</p>
                    <p>• Click 🗑️ on existing images to mark for deletion</p>
                    <p>• Click "Save Image Changes" to apply changes</p>
                    <p>• Image changes are separate from product details</p>
                  </div>
                </div>
              </div>

              {/* Images Marked for Deletion */}
              {imagesToDelete.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-red-800 flex items-center gap-2">
                      <FiTrash2 />
                      {imagesToDelete.length} Image(s) Marked for Deletion
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        // Restore all deleted images
                        imagesToDelete.forEach(unmarkImageForDeletion);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Undo All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {imagesToDelete.map(imageId => (
                      <div 
                        key={imageId}
                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-red-200"
                      >
                        <span className="text-sm text-gray-700">Image ID: {imageId}</span>
                        <button
                          type="button"
                          onClick={() => unmarkImageForDeletion(imageId)}
                          className="text-red-500 hover:text-red-700"
                          title="Restore image"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ============ PRODUCT FORM (NO IMAGES) ============ */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Status & Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                    required
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500">
                      {formData.currency}
                    </span>
                    <input
                      type="number"
                      name="base_price"
                      value={formData.base_price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Stock & Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                      required
                    />
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="px-4 py-2 border-t border-r border-b border-gray-300 rounded-r-lg bg-gray-50 focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harvest Date *
                  </label>
                  <input
                    type="date"
                    name="harvest_date"
                    value={formData.harvest_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                  required
                  placeholder="Describe your product in detail..."
                />
              </div>

              {/* Certification & Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canada Grade
                  </label>
                  <select
                    name="canada_grade"
                    value={formData.canada_grade}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                  >
                    <option value="">Select Grade</option>
                    {canadaGrades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Safety Certification
                  </label>
                  <input
                    type="text"
                    name="food_safety_certification"
                    value={formData.food_safety_certification}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                    placeholder="Enter certification number"
                  />
                </div>
              </div>

              {/* Growing Session */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Growing Session
                </label>
                <select
                  name="growing_session"
                  value={formData.growing_session}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                >
                  <option value="">Select Growing Session</option>
                  {growingSessions.map(session => (
                    <option key={session} value={session}>{session}</option>
                  ))}
                </select>
              </div>

              {/* Checkbox Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="organic_certified"
                    name="organic_certified"
                    checked={formData.organic_certified}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#1F4E3D] focus:ring-[#1F4E3D] border-gray-300 rounded"
                  />
                  <label htmlFor="organic_certified" className="ml-2 text-sm text-gray-700">
                    Organic Certified
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hst_included"
                    name="hst_included"
                    checked={formData.hst_included}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#1F4E3D] focus:ring-[#1F4E3D] border-gray-300 rounded"
                  />
                  <label htmlFor="hst_included" className="ml-2 text-sm text-gray-700">
                    HST Included
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_negotiable"
                    name="is_negotiable"
                    checked={formData.is_negotiable}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#1F4E3D] focus:ring-[#1F4E3D] border-gray-300 rounded"
                  />
                  <label htmlFor="is_negotiable" className="ml-2 text-sm text-gray-700">
                    Price Negotiable
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="product_availability"
                    name="product_availability"
                    checked={formData.product_availability === 1}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      product_availability: e.target.checked ? 1 : 0
                    }))}
                    className="h-4 w-4 text-[#1F4E3D] focus:ring-[#1F4E3D] border-gray-300 rounded"
                  />
                  <label htmlFor="product_availability" className="ml-2 text-sm text-gray-700">
                    Available
                  </label>
                </div>
              </div>

              {/* Additional Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_flexible_buying"
                    name="is_flexible_buying"
                    checked={formData.is_flexible_buying}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#1F4E3D] focus:ring-[#1F4E3D] border-gray-300 rounded"
                  />
                  <label htmlFor="is_flexible_buying" className="ml-2 text-sm text-gray-700">
                    Flexible Buying
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_bulk_buying"
                    name="is_bulk_buying"
                    checked={formData.is_bulk_buying}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#1F4E3D] focus:ring-[#1F4E3D] border-gray-300 rounded"
                  />
                  <label htmlFor="is_bulk_buying" className="ml-2 text-sm text-gray-700">
                    Bulk Buying
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_preorder_produce"
                    name="is_preorder_produce"
                    checked={formData.is_preorder_produce}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#1F4E3D] focus:ring-[#1F4E3D] border-gray-300 rounded"
                  />
                  <label htmlFor="is_preorder_produce" className="ml-2 text-sm text-gray-700">
                    Pre-order Produce
                  </label>
                </div>
              </div>

              {/* Min Order Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Quantity
                </label>
                <input
                  type="number"
                  name="min_order_quantity"
                  value={formData.min_order_quantity}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition"
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={detailsLoading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1F4E3D] to-emerald-700 text-white rounded-lg hover:from-[#173b2d] hover:to-emerald-800 transition-all font-medium disabled:opacity-70"
                >
                  <FiSave />
                  {detailsLoading ? "Saving..." : "Save Product Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-10"
          >
            <FiX className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => {
              if (selectedImageType === 'existing') {
                setSelectedImageIndex(prev => 
                  prev > 0 ? prev - 1 : existingImages.length - 1
                );
              } else {
                setSelectedImageIndex(prev => 
                  prev > 0 ? prev - 1 : newImages.length - 1
                );
              }
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <FiArrowLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => {
              if (selectedImageType === 'existing') {
                setSelectedImageIndex(prev => 
                  prev < existingImages.length - 1 ? prev + 1 : 0
                );
              } else {
                setSelectedImageIndex(prev => 
                  prev < newImages.length - 1 ? prev + 1 : 0
                );
              }
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <FiArrowLeft className="w-8 h-8 transform rotate-180" />
          </button>
          
          <div className="relative max-w-6xl max-h-[90vh] mx-4">
            {selectedImageType === 'existing' ? (
              <img
                src={existingImages[selectedImageIndex]?.image}
                alt={`Product image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            ) : (
              <img
                src={URL.createObjectURL(newImages[selectedImageIndex])}
                alt={`New image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {selectedImageType === 'existing' ? existingImages.length : newImages.length}
              {selectedImageType === 'existing' && existingImages[selectedImageIndex]?.id && (
                <span className="ml-2">(ID: {existingImages[selectedImageIndex]?.id})</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;