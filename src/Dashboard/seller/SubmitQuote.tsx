import React, { useState } from "react";

const SubmitQuote: React.FC<{ buyerRequest?: any }> = ({ buyerRequest }) => {
  const [formData, setFormData] = useState({
    variety: buyerRequest?.productDetails?.variety || "",
    grade: buyerRequest?.quoteDetails?.grade || "",
    packType: buyerRequest?.quoteDetails?.packType || "",
    packStyle: buyerRequest?.productDetails?.packStyle?.[0] || "",
    quantity: buyerRequest?.purchaseInfo?.quantity || "",
    unit: buyerRequest?.purchaseInfo?.unit || "lbs",
    availabilityStart: buyerRequest?.quoteDetails?.availabilityStart || "",
    availabilityEnd: buyerRequest?.quoteDetails?.availabilityEnd || "",
    location: buyerRequest?.quoteDetails?.location || "",
    price: buyerRequest?.quoteDetails?.price || "",
    currency: buyerRequest?.quoteDetails?.currency || "USD",
    perUnit: buyerRequest?.quoteDetails?.perUnit || "lb",
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (action: string) => (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Seller ${action}:`, formData);
    // 👉 Call API with seller response
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Respond to Buyer Request</h1>
      <p className="text-gray-600 mb-6">
        Please review the buyer’s request below. You can accept it as is or
        propose your own terms.
      </p>

      {/* STEP 1: Buyer Request Summary */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 border">
        <h2 className="font-semibold text-lg mb-3">Buyer’s Request</h2>
        <ul className="text-sm space-y-1">
          <li>
            <strong>Product:</strong> {buyerRequest?.productDetails?.variety}
          </li>
          <li>
            <strong>Grades:</strong>{" "}
            {buyerRequest?.productDetails?.grades?.join(", ")}
          </li>
          <li>
            <strong>Pack Styles:</strong>{" "}
            {buyerRequest?.productDetails?.packStyle?.join(", ")}
          </li>
          <li>
            <strong>Quantity:</strong> {buyerRequest?.purchaseInfo?.quantity}{" "}
            {buyerRequest?.purchaseInfo?.unit}
          </li>
          <li>
            <strong>Need By:</strong> {buyerRequest?.purchaseInfo?.needByDate}
          </li>
          <li>
            <strong>Target Price:</strong> $
            {buyerRequest?.purchaseInfo?.targetPrice}/
            {buyerRequest?.purchaseInfo?.unit}
          </li>
          <li>
            <strong>Notes:</strong> {buyerRequest?.productDetails?.specifications}
          </li>
        </ul>
      </div>

      {/* STEP 2: Seller Response */}
      <form
        onSubmit={handleSubmit("response")}
        className="bg-white shadow-md rounded-lg p-6 border space-y-6"
      >
        <h2 className="font-semibold text-lg">Your Quote</h2>

        {/* Product Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Grade *</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="">Select Grade</option>
              <option value="US No. 1">US No. 1</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Pack Type *</label>
            <select
              name="packType"
              value={formData.packType}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="">Select Pack Type</option>
              <option value="Bin">Bin</option>
              <option value="Carton">Carton</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Pack Style *</label>
            <select
              name="packStyle"
              value={formData.packStyle}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="Loose">Loose</option>
              <option value="Tray Pack">Tray Pack</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Quantity *</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="border rounded p-2"
              >
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>
        </div>

        {/* Availability & Location */}
        <div>
          <label className="text-sm font-medium">Availability Window *</label>
          <div className="grid md:grid-cols-3 gap-3">
            <input
              type="date"
              name="availabilityStart"
              value={formData.availabilityStart}
              onChange={handleChange}
              className="border rounded p-2"
            />
            <input
              type="date"
              name="availabilityEnd"
              value={formData.availabilityEnd}
              onChange={handleChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              className="border rounded p-2"
            />
          </div>
        </div>

        {/* Pricing */}
        <div>
          <label className="text-sm font-medium">Price *</label>
          <div className="flex gap-2">
            <span className="self-center">$</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              placeholder="0.00"
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
        </div>

        {/* Seller Note */}
        <div>
          <label className="text-sm font-medium">Notes to Buyer</label>
          <textarea
            name="note"
            placeholder="Add any special terms, delivery info, or conditions..."
            value={formData.note}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit("accept")}
            className="px-6 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
          >
            Accept Request
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600"
          >
            Submit Counter-Offer
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitQuote;
