import React, { useState } from "react";

const BuyerResponse: React.FC<{ sellerQuote?: any }> = ({ sellerQuote }) => {
  // sellerQuote can be passed as prop (from API)
  const [formData, setFormData] = useState({
    variety: sellerQuote?.variety || "",
    grade: sellerQuote?.grade || "",
    packType: sellerQuote?.packType || "",
    packStyle: sellerQuote?.packStyle || "",
    quantity: sellerQuote?.quantity || "",
    unit: sellerQuote?.unit || "lbs",
    availabilityStart: sellerQuote?.availabilityStart || "",
    availabilityEnd: sellerQuote?.availabilityEnd || "",
    location: sellerQuote?.location || "",
    price: sellerQuote?.price || "",
    perUnit: sellerQuote?.perUnit || "lb",
    currency: sellerQuote?.currency || "USD",
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (action: string) => (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Buyer ${action}:`, formData);
    // 👉 Call API with buyer response
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-2">Review Seller’s Quote</h1>
      <p className="text-green-700 bg-green-50 border border-green-200 p-3 rounded text-sm mb-6">
        Seller has submitted a quote. You can accept, reject, or send a
        counter-offer.
      </p>

      {/* Seller Quote Summary */}
      <div className="bg-blue-50 border border-blue-200 p-3 mb-6 rounded">
        <h2 className="font-medium">Seller Quote</h2>
        <p className="text-sm">
          <strong>Variety:</strong> {sellerQuote?.variety} |{" "}
          <strong>Grade:</strong> {sellerQuote?.grade} |{" "}
          <strong>Pack Type:</strong> {sellerQuote?.packType} |{" "}
          <strong>Pack Style:</strong> {sellerQuote?.packStyle}
        </p>
        <p className="text-sm">
          <strong>Quantity:</strong> {sellerQuote?.quantity} {sellerQuote?.unit}{" "}
          | <strong>Price:</strong> ${sellerQuote?.price}/{sellerQuote?.perUnit}
        </p>
        <p className="text-sm">
          <strong>Availability:</strong> {sellerQuote?.availabilityStart} -{" "}
          {sellerQuote?.availabilityEnd}
        </p>
        <p className="text-sm">
          <strong>Location:</strong> {sellerQuote?.location}
        </p>
      </div>

      {/* Buyer Response Form */}
      <form onSubmit={handleSubmit("counter")} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="flex gap-2">
            <span className="self-center">$</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              placeholder="Your counter price"
            />
            <select
              name="perUnit"
              value={formData.perUnit}
              onChange={handleChange}
              className="border rounded p-2"
            >
              <option value="lb">/lb</option>
              <option value="kg">/kg</option>
            </select>
          </div>

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="Your required quantity"
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="Delivery Location"
          />
        </div>

        {/* Buyer Note */}
        <textarea
          name="note"
          placeholder="Add any notes for the seller..."
          value={formData.note}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit("reject")}
              className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
            >
              Reject
            </button>
            <button
              onClick={handleSubmit("accept")}
              className="px-6 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
            >
              Accept
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600"
            >
              Counter-Offer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BuyerResponse;
