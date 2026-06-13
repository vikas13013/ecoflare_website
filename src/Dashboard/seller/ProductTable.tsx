import React, { useEffect, useState } from "react";
import { 
  FiEdit, 
  FiTrash2, 
  FiBox, 
  FiEye, 
  FiPlus, 
  FiSearch, 
  FiCalendar 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchSellerProducts,
  deleteSellerProduct 
} from "../../features/sellerProduct/sellerProductThunk";
import { AppDispatch, RootState } from "../../app/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { clearSellerProductError } from "../../features/sellerProduct/sellerProductSlice";

interface TableProduct {
  id: number;
  name: string;
  description: string;
  category: number;
  product_image: string | null;
  images: Array<{
    id: number;
    product: number;
    image: string;
    alt_text: string;
    created_at: string;
  }>;
  status: string;
  stock_quantity: string;
  base_price: string;
  currency: string;
  unit: string;
  expiry_date: string;
  harvest_date: string;
}

const ProductTable: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Access state from sellerProduct slice
  const { 
    products, 
    loading, 
    pagination, 
    error,
    successMessage 
  } = useSelector((state: RootState) => state.sellerProduct);

  console.log(products , "produts");
  
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Fetch products on component mount and when page changes
  useEffect(() => {
    const query = `?page=${currentPage}&page_size=10`;
    dispatch(fetchSellerProducts(query));
  }, [dispatch, currentPage]);

  // Clear error/success messages after 3 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSellerProductError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteSellerProduct(id)).then((result) => {
        if (deleteSellerProduct.fulfilled.match(result)) {
          // Product deleted successfully, no need to refetch
          // because the slice already updates the state
          setDeleteConfirm(null);
        }
      });
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/seller/products/details/${id}`);
  };

  const handleEditProduct = (id: number) => {
    navigate(`/seller/products/edit/${id}`);
  };

  const handleAddProduct = () => {
    navigate("/seller/add-product");
  };

  // Filter products based on search term
  const filteredProducts = Array.isArray(products)
    ? products.filter((product: TableProduct) => {
        if (!searchTerm) return true; // Show all if no search term
        
        const searchLower = searchTerm.toLowerCase().trim();
        
        // Safely check each field
        const name = (product.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const status = (product.status || '').toLowerCase();
        
        return name.includes(searchLower) ||
               description.includes(searchLower) ||
               status.includes(searchLower);
      })
    : [];

  // Calculate discount price if available
 const calculateDiscountedPrice = (product: any) => {
    if (!product) return { discountPrice: null, discountPercentage: null };
    
    const basePrice = product.base_price ? parseFloat(product.base_price) : 0;
    
    if (product.quantity_discounts && 
        Array.isArray(product.quantity_discounts) && 
        product.quantity_discounts.length > 0) {
      
      const validDiscounts = product.quantity_discounts
        .map((d: any) => d?.discount_percentage ? parseFloat(d.discount_percentage) : 0)
        .filter((p: number) => !isNaN(p) && p > 0);
      
      if (validDiscounts.length > 0) {
        const minDiscount = Math.min(...validDiscounts);
        const discount = basePrice * (minDiscount / 100);
        return {
          discountPrice: (basePrice - discount).toFixed(2),
          discountPercentage: minDiscount
        };
      }
    }
    
    return {
      discountPrice: null,
      discountPercentage: null
    };
  };

  if (error && !products.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="text-red-500 p-4 rounded-lg bg-red-50 max-w-md mx-auto">
          <h3 className="font-medium mb-2">Error loading products</h3>
          <p>{error}</p>
          <button
            onClick={() => dispatch(fetchSellerProducts("?page=1&page_size=10"))}
            className="mt-4 px-4 py-2 bg-[#1F4E3D] text-white rounded-lg hover:bg-[#173b2d] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-3">
          <div className="flex justify-between items-center">
            <span>{successMessage}</span>
            <button onClick={() => dispatch(clearSellerProductError())}>
              ×
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => dispatch(clearSellerProductError())}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header with search and add button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white border-b border-gray-100">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
          <p className="text-gray-500 text-sm mt-1">
            {products.length} {products.length === 1 ? 'product' : 'products'} in inventory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E3D] focus:border-[#1F4E3D] w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center justify-center gap-2 bg-[#1F4E3D] text-white px-4 py-2 rounded-lg hover:bg-[#173b2d] transition whitespace-nowrap"
          >
            <FiPlus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading && !products.length ? (
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="mb-4">
                <Skeleton height={60} />
              </div>
            ))}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pricing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product: TableProduct) => {
                  const { discountPrice, discountPercentage } = calculateDiscountedPrice(product);
                  const hasImages = product.images && product.images.length > 0;
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-[#1F4E3D]/10 flex items-center justify-center overflow-hidden">
                            {hasImages ? (
                              <img
                                src={product.images[0].image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                                }}
                              />
                            ) : product.product_image ? (
                              <img
                                src={product.product_image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                                }}
                              />
                            ) : (
                              <FiBox className="text-[#1F4E3D] text-lg" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 capitalize line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {discountPrice ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {product.currency} {discountPrice}
                                </span>
                                {discountPercentage && (
                                  <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                                    {discountPercentage}% off
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 line-through">
                                {product.currency} {product.base_price}
                              </div>
                            </>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {product.currency} {product.base_price}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              parseFloat(product.stock_quantity) > 20
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="text-sm text-gray-900">
                            {product.stock_quantity} {product.unit}
                          </span>
                        </div>
                      </td>
                    <td className="px-6 py-4">
  <div className="text-sm text-gray-900 space-y-1">
    
    <div className="flex items-center gap-1">
      <FiCalendar className="text-gray-400 text-xs" />
      <span>
        {new Date(product.harvest_date).toLocaleDateString("en-GB")}
      </span>
    </div>

    <div className="flex items-center gap-1">
      <FiCalendar className="text-gray-400 text-xs" />
      <span>
        {new Date(product.expiry_date).toLocaleDateString("en-GB")}
      </span>
    </div>

  </div>
</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.status === "Published"
                              ? "bg-green-100 text-green-800"
                              : product.status === "Draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleViewDetails(product.id)}
                            className="text-gray-500 hover:text-[#1F4E3D] p-1.5 rounded-full hover:bg-gray-100 transition"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="text-gray-500 hover:text-[#1F4E3D] p-1.5 rounded-full hover:bg-gray-100 transition"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-gray-500 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 transition"
                            title="Delete"
                            disabled={deleteConfirm === product.id}
                          >
                            {deleteConfirm === product.id ? (
                              <span className="text-xs">Deleting...</span>
                            ) : (
                              <FiTrash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FiBox className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {searchTerm ? "No matching products" : "No products found"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {searchTerm
                          ? "Try adjusting your search query"
                          : "Get started by adding a new product"}
                      </p>
                      <button
                        onClick={handleAddProduct}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#1F4E3D] hover:bg-[#173b2d] focus:outline-none"
                      >
                        <FiPlus size={16} />
                        Add Product
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {products.length > 0 && !searchTerm && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">
              {(currentPage - 1) * pagination.current_page_size + 1}
            </span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * pagination.current_page_size, pagination.total_items)}
            </span> of{" "}
            <span className="font-medium">{pagination.total_items}</span> products
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {pagination.total_pages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => 
                pagination.total_pages ? Math.min(pagination.total_pages, prev + 1) : prev + 1
              )}
              disabled={currentPage >= (pagination.total_pages || 1)}
              className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                currentPage >= (pagination.total_pages || 1)
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;