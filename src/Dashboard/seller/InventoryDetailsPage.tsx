import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit, FiPackage, FiDollarSign, FiTag, FiClock } from "react-icons/fi";

const InventoryDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, you would fetch this based on the id
  const vegetableDetails = {
    id: 1,
    name: "Organic Tomatoes",
    description: "Fresh organic tomatoes grown locally without pesticides",
    stock: 45,
    threshold: 20,
    price: "₹40/kg",
    category: "Vegetables",
    lastUpdated: "2023-06-15",
    image: "/images/tomatoes.jpg",
    supplier: "Local Organic Farms",
    shelfLife: "7 days"
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-[#1F4E3D] hover:text-black mb-4"
          >
            <FiArrowLeft className="mr-2" /> Back to Inventory
          </button>
          
          <div className="md:flex gap-6">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <img src={vegetableDetails.image} alt={vegetableDetails.name} className="h-full object-cover" />
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{vegetableDetails.name}</h1>
              <p className="text-gray-600 mb-6">{vegetableDetails.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <div className="bg-[#1F4E3D]/10 p-2 rounded-full mr-3">
                    <FiPackage className="text-[#1F4E3D]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Stock</p>
                    <p className="font-medium">{vegetableDetails.stock} kg</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-[#1F4E3D]/10 p-2 rounded-full mr-3">
                    <FiDollarSign className="text-[#1F4E3D]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">{vegetableDetails.price}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-[#1F4E3D]/10 p-2 rounded-full mr-3">
                    <FiTag className="text-[#1F4E3D]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{vegetableDetails.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-[#1F4E3D]/10 p-2 rounded-full mr-3">
                    <FiClock className="text-[#1F4E3D]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shelf Life</p>
                    <p className="font-medium">{vegetableDetails.shelfLife}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-2">Supplier Information</h3>
                <p className="text-gray-600">{vegetableDetails.supplier}</p>
              </div>
              
              <button 
                onClick={() => navigate(`/inventory/manage/${id}`)}
                className="mt-6 bg-[#1F4E3D] hover:bg-black text-white py-2 px-4 rounded-lg flex items-center"
              >
                <FiEdit className="mr-2" /> Manage Inventory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailsPage;