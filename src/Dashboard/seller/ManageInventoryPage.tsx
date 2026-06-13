import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave, FiPlus, FiMinus } from "react-icons/fi";

const ManageInventoryPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(45);
  const [price, setPrice] = useState("40");
  const [notes, setNotes] = useState("");

  // Mock data - in real app, you would fetch this based on the id
  const vegetableDetails = {
    id: 1,
    name: "Organic Tomatoes",
    threshold: 20,
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the inventory
    console.log("Inventory updated:", { stock, price, notes });
    navigate(`/inventory/details/${id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-[#1F4E3D] hover:text-black mb-6"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Inventory - {vegetableDetails.name}</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock (kg)</label>
              <div className="flex items-center">
                <button 
                  onClick={() => setStock(prev => Math.max(0, prev - 1))}
                  className="bg-gray-200 p-2 rounded-l-lg hover:bg-gray-300"
                >
                  <FiMinus />
                </button>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  className="border-t border-b border-gray-300 p-2 w-20 text-center"
                />
                <button 
                  onClick={() => setStock(prev => prev + 1)}
                  className="bg-gray-200 p-2 rounded-r-lg hover:bg-gray-300"
                >
                  <FiPlus />
                </button>
              </div>
              <p className={`text-sm mt-1 ${stock < vegetableDetails.threshold ? 'text-red-500' : 'text-[#90B83E]'}`}>
                {stock < vegetableDetails.threshold ? 'Stock is below threshold!' : 'Stock is healthy'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹ per kg)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full h-24"
                placeholder="Any special notes about this inventory..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#1F4E3D] hover:bg-black text-white py-2 px-4 rounded-lg flex items-center"
              >
                <FiSave className="mr-2" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageInventoryPage;