import { Link, useNavigate } from "react-router-dom";

const SellerAction = ({ data }) => {
  const navigate = useNavigate();
  console.log(data , "sellerdata");
  

  const seller = data?.seller_details;
  const status = seller?.seller_verification_status; // ✅ FIXED

  // ❌ Not applied (seller_details hi nahi aaya)
  if (!seller) {
    return (
      <Link
        to="/register/seller"
        className="bg-yellow-500 hover:bg-yellow-600 text-primary font-bold py-3 px-8 rounded-full"
      >
        Become a Seller
      </Link>
    );
  }

  // ⏳ Pending
  if (status === "Pending") {
    return (
      <button
        onClick={() =>
          navigate("/request-success", {
            state: { type: "seller" },
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
        to="/dashboard/seller"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full"
      >
        Go to Seller Dashboard
      </Link>
    );
  }

  // ❌ Rejected
  return (
    // <Link
    //   to="/register/seller"
    //   className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
    // >
    //   Re-apply as Seller
    // </Link>
    <Link
        to="/register/seller"
        className="bg-yellow-500 hover:bg-yellow-600 text-primary font-bold py-3 px-8 rounded-full"
      >
        Become a Seller
      </Link>
  );
};

export default SellerAction;
