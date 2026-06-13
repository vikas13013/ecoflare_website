type Conversation = {
  id: number;
  date: string;
  product: string;
  priceRange: string;
  unread: boolean;
};

interface ConversationDetailsProps {
  conversation: Conversation;
}

export default function ConversationDetails({ conversation }: ConversationDetailsProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Produce request details</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Details</h4>
          <p><b>Product:</b> {conversation.product}</p>
          <p><b>Variety:</b> Broccoli Crowns</p>
          <p><b>Growing Method:</b> Conventional</p>
          <p><b>Pack Type:</b> Carton</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">End use</h4>
          <p><b>Price range:</b> {conversation.priceRange}</p>
          <p><b>Quantity:</b> 1,244 Cartons</p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Logistics</h4>
        <p><b>Frequency:</b> One-time purchase</p>
        <p><b>Date needed by:</b> Mar 29 2025</p>
        <p><b>Response deadline:</b> Mar 29 2025</p>
      </div>

      {/* <div className="flex justify-between mt-6 w-full ">
        <button className="px-4 py-2 border rounded">Cancel</button>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border rounded">Negotiate</button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded">Accept</button>
        </div>
      </div> */}
    </div>
  );
}
