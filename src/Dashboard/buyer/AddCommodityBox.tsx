// src/components/AddCommodityBox.jsx
import { FiPlus } from "react-icons/fi";

const AddCommodityBox = () => {
  return (
    <div className="bg-white border border-green-200 rounded-xl p-6 h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="bg-green-100 p-3 rounded-full mb-4">
          <FiPlus className="text-green-600 text-xl" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Expand Your Commodities
        </h3>
        <p className="text-gray-600 text-sm mb-4 max-w-md">
          Include more products you're looking to sell so we can find better matches 
          and increase your business opportunities.
        </p>
        <button className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
          <FiPlus className="mr-2" />
          Add Commodity
        </button>
      </div>
    </div>
  );
};

export default AddCommodityBox;