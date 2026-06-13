import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface BuyingOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  user: any;
}

const BuyingOptionsModal: React.FC<BuyingOptionsModalProps> = ({
  isOpen,
  onClose,
  product,
  user,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOptionClick = (type: string) => {
    navigate("/negotiation-request", {
      state: {
        type,
        product_id: product.id,
        buyer_id: user?.id,
        product_name: product.name,
        base_price: product.base_price,
        currency: product.currency,
        unit: product.unit,
        quantity: product.min_order_quantity,
        grade: product.canada_grade,
        product_availability: product.product_availability,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {t("choose_your_option")}
        </h2>

        <div className="flex flex-col gap-3">
          {product?.is_flexible_buying && (
            <button
              onClick={() => handleOptionClick("Flexible Buying")}
              className="w-full py-2 rounded-lg bg-secondary text-white font-medium hover:bg-green-600 transition"
            >
              {t("flexible_buying")}
            </button>
          )}

          {product?.is_preorder_produce && (
            <button
              onClick={() => handleOptionClick("Pre-Order-Produce")}
              className="w-full py-2 rounded-lg bg-secondary text-white font-medium hover:bg-green-600 transition"
            >
              {t("pre_order_produce")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyingOptionsModal;