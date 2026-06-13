import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import StarRating from "./StarRating";
import { useTranslation } from "react-i18next";


interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSubmit: (review: { rating: number; title: string; comment: string }) => void;
  isSubmitting?: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  onSubmit,
  isSubmitting = false,
}) => {
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reviewForm);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 review-modal">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{t("write_review")}</h3>
          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Product Preview */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
          <img
            src={product.images?.[0]?.image || product.product_image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <div className="font-semibold">{product.name}</div>
            <div className="text-gray-500 text-sm">{product.category?.name}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-6">
            <label className="block font-medium mb-3">{t("your_rating")}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className={`text-3xl ${
                    star <= reviewForm.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Review Title */}
          <div className="mb-6">
            <label className="block font-medium mb-2">{t("review_title")}</label>
            <input
              type="text"
              value={reviewForm.title}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
placeholder={t("review_title_placeholder")}              required
            />
          </div>

          {/* Review Comment */}
          <div className="mb-6">
            <label className="block font-medium mb-2">{t("your_review")}</label>
            <textarea
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, comment: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32"
placeholder={t("review_comment_placeholder")}              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
{isSubmitting ? t("submitting") : t("submit_review")}            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;