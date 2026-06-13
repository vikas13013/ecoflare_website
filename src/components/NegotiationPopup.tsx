import { useState } from "react";

const NegotiationModal = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null; // Hide modal when closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-bold text-green-700">Explore Negotiation</h2>
          <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-2">
          Please describe any specific details around the terms of the negotiation or contract you would like us to secure for you, and we will follow up.
        </p>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Commodity */}
          <div>
            <label className="block text-sm font-medium">Commodity*</label>
            <select className="w-full border p-2 rounded">
              <option>Select commodity</option>
              <option>Vegetables</option>
              <option>Fruits</option>
            </select>
          </div>

          {/* Variety */}
          <div>
            <label className="block text-sm font-medium">Variety</label>
            <select className="w-full border p-2 rounded">
              <option>Pepper, Habanero</option>
              <option>Organic</option>
            </select>
          </div>

          {/* Loads Needed */}
          <div>
            <label className="block text-sm font-medium">Loads Needed</label>
            <div className="flex">
              <input type="text" className="w-full border p-2 rounded" placeholder="Enter load" />
              <span className="bg-green-500 text-white px-3 py-2 rounded ml-2">Loads</span>
            </div>
            <p className="text-xs text-gray-500">If you need 3 loads weekly, put in 3 here & weekly in the box to the right.</p>
          </div>

          {/* Frequency of Deliveries */}
          <div>
            <label className="block text-sm font-medium">Frequency of Deliveries</label>
            <select className="w-full border p-2 rounded">
              <option>Select option</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          {/* Delivery Start Date */}
          <div>
            <label className="block text-sm font-medium">Delivery Start Date</label>
            <input type="date" className="w-full border p-2 rounded" />
          </div>

          {/* Delivery End Date */}
          <div>
            <label className="block text-sm font-medium">Delivery End Date</label>
            <input type="date" className="w-full border p-2 rounded" />
          </div>

          {/* Desired Price */}
          <div>
            <label className="block text-sm font-medium">Desired Price</label>
            <div className="flex items-center border rounded p-2">
              <span className="text-gray-500 pr-2">$</span>
              <input type="number" className="w-full outline-none" placeholder="Enter price" />
            </div>
          </div>

          {/* Pack Type */}
          <div>
            <label className="block text-sm font-medium">Pack Type</label>
            <select className="w-full border p-2 rounded">
              <option>Per</option>
              <option>Ton</option>
              <option>Kg</option>
            </select>
          </div>
        </div>

        {/* Terms and Submit Button */}
        <div className="mt-4">
          <p className="text-sm">
            Program or Contract <a href="#" className="text-green-600 underline">Term Details</a>
          </p>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg w-full mt-3">
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default NegotiationModal;