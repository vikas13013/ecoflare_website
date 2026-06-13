import { useNavigate, Link } from "react-router-dom";

const BulkBuyerAction = ({ data }) => {
  const navigate = useNavigate();

  const bulkBuyer = data?.bulk_buyer_applications;
  const status = bulkBuyer?.bulk_buyer_application_status;

  // ❌ Not applied
  if (!status) {
    return (
      <Link
        to="/register/bulk-buyer"
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full"
      >
        Join the marketplace
      </Link>
    );
  }

  // ⏳ Pending → button dikhao, click par navigate
  if (status === "Pending") {
    return (
      <button
        onClick={() =>
          navigate("/request-success", {
            state: { type: "bulk-buyer" },
          })
        }
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full"
      >
        View Request Status
      </button>
    );
  }

  // ✅ Approved
  if (status === "Approved") {
    return (
      <Link
        to="/dashboard/buyer"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full"
      >
        Go to Buyer Dashboard
      </Link>
    );
  }

  // ❌ Rejected
  return (
    <Link
      to="/register/bulk-buyer"
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
    >
      Re-apply as Bulk Buyer
    </Link>
  );
};

export default BulkBuyerAction;
