import { useState } from "react";
import ConversationList from "../components/ConversationList";
import ConversationDetails from "../components/ConversationDetails";
import SubmitQuote from "../SubmitQuote"; // 👈 import

const conversations = [
  {
    id: 1,
    date: "Today 2:15am",
    product: "Broccoli, Crowns",
    priceRange: "CAD$120 - CAD$150 /Lbs",
    unread: true,
  },
  {
    id: 2,
    date: "Yesterday 2:15am",
    product: "Broccoli, Crowns",
    priceRange: "CAD$120 - CAD$150 /Lbs",
    unread: false,
  },
  {
    id: 3,
    date: "25 March 2025",
    product: "Broccoli, Crowns",
    priceRange: "CAD$120 - CAD$150 /Lbs",
    unread: false,
  },
];


export default function NegotiateTerms() {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="p-6 bg-[#F3F8F3] min-h-screen">
      <button onClick={() => window.history.back()} className="flex items-center gap-2 mb-4 text-sm">
        ⬅ Back
      </button>
      <h2 className="text-2xl font-semibold mb-2">Negotiate Terms</h2>
      <p className="text-gray-600 mb-6">
        Discuss and finalize the terms before placing an order.
      </p>

      <div className="grid grid-cols-4 gap-6 bg-white p-4 rounded-lg shadow">
        {/* Left Side - Conversations */}
        <div className="col-span-1 border-r">
          <ConversationList
            conversations={conversations}
            onSelect={setSelectedConversation} // pass callback
            selectedId={selectedConversation?.id}
          />
        </div>

        {/* Right Side - Details */}
        <div className="col-span-3">
          {!selectedConversation ? (
            <p className="text-gray-400">Select a conversation to view details.</p>
          ) : selectedConversation.unread ? (
            <SubmitQuote conversation={selectedConversation} />
          ) : (
            <ConversationDetails conversation={selectedConversation} />
          )}
        </div>
      </div>
    </div>
  );
}
