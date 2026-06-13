import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const RequestSuccess = () => {
  const location = useLocation();
  const type = location.state?.type;

  const title =
    type === "seller"
      ? "Seller request under review"
      : "Bulk Buyer request under review";

  const desc =
    type === "seller"
      ? "Your seller request is under review. Our team will contact you soon."
      : "Your bulk buyer request is under review. Please wait for approval.";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-3">{title}</h1>
        <p className="text-gray-600 mb-6">{desc}</p>

        <Link
          to="/"
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default RequestSuccess;
