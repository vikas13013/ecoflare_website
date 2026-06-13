export default function ConversationList({ conversations, onSelect, selectedId }) {
  return (
    <div className="space-y-2">
      {conversations.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelect(c)} // set selected conversation
          className={`cursor-pointer block p-3 rounded border ${
            selectedId === c.id
              ? "border-green-500 bg-green-50"
              : "border-gray-200"
          }`}
        >
          <p className="text-sm text-gray-500">{c.date}</p>
          <p className="font-medium">{c.product}</p>
          <p className="text-gray-600 text-sm">{c.priceRange}</p>
          {c.unread && (
            <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">
              Unread
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
