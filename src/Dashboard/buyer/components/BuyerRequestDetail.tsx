import React, { useState } from "react";
import BuyerResponse from "./BuyerResponse"; // 👈 BuyerResponse form import karein

const conversations = [
  {
    id: 1,
    date: "Today 2:15am",
    product: "Apples, Organic",
    priceRange: "CAD$1.20-CAD$1.40/lb",
    unread: true,
  },
  {
    id: 2,
    date: "Yesterday 4:00pm",
    product: "Bananas, Fresh",
    priceRange: "CAD$0.50-CAD$0.70/lb",
    unread: false,
  },
  {
    id: 3,
    date: "25 March 2025",
    product: "Mangoes, Premium",
    priceRange: "CAD$1.80-CAD$2.10/lb",
    unread: false,
  },
];

function BuyerConversationDetails({ conversation }) {
  if (!conversation) {
    return <p className="text-gray-400">Select a request to view details.</p>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Produce request details</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Details</h4>
          <p>
            <b>Product:</b> {conversation.product}
          </p>
          <p>
            <b>Variety:</b> Organic
          </p>
          <p>
            <b>Method:</b> Conventional
          </p>
          <p>
            <b>Packaging:</b> Carton
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-2">End use</h4>
          <p>
            <b>Price range:</b> {conversation.priceRange}
          </p>
          <p>
            <b>Quantity:</b> 1,244 Cartons
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Logistics</h4>
        <p>
          <b>Frequency:</b> One-time purchase
        </p>
        <p>
          <b>Date needed by:</b> Mar 29 2025
        </p>
        <p>
          <b>Response deadline:</b> Mar 29 2025
        </p>
      </div>
    </div>
  );
}

export default function BuyerRequests() {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="p-6 bg-[#F3F8F3] min-h-screen">
      <h2 className="text-2xl font-semibold mb-2">My Requests</h2>
      <p className="text-gray-600 mb-6">
        Track and view details of your submitted requests.
      </p>

      <div className="grid grid-cols-4 gap-6 bg-white p-4 rounded-lg shadow">
        {/* Left Side - Requests List */}
        <div className="col-span-1 border-r">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedConversation(c)}
              className={`p-3 mb-2 rounded cursor-pointer ${
                selectedConversation?.id === c.id
                  ? "bg-green-100 border border-green-500"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="text-xs text-gray-500">{c.date}</p>
              <p className="font-medium">{c.product}</p>
              <p className="text-sm text-gray-600">{c.priceRange}</p>
              {c.unread && (
                <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded">
                  Unread
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Right Side - Request Details OR Response */}
        <div className="col-span-3">
          {selectedConversation ? (
            selectedConversation.unread ? (
              <BuyerResponse sellerQuote={selectedConversation} />
            ) : (
              <BuyerConversationDetails conversation={selectedConversation} />
            )
          ) : (
            <p className="text-gray-400">Select a request to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
