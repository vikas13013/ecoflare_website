import React from "react";
import { useTranslation } from "react-i18next";
import StarRating from "./StarRating";

interface ProductTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  product: any;
  reviewsData: any;
  renderStars: (rating: number) => JSX.Element[];
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  activeTab,
  setActiveTab,
  product,
  reviewsData,
  renderStars,
}) => {
  const { t } = useTranslation();

  console.log("Product Tabs Props:", {  reviewsData });
  

  const tabs = [
    { id: "description", label: t("descriptions") },
    { id: "Specifications", label: t("Specifications") },
    { id: "feedback", label: t("customer_feedback") },
    { id: "pricing", label: t("pricing_tiers") },
  ];

  return (
    <div className="border-t pt-6">
      {/* Tab Header */}
      <div className="border-b border-gray-200 flex flex-wrap gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 text-sm font-medium relative ${
              activeTab === tab.id
                ? "text-green-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-green-600" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeTab === "description" && (
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              {product.description ||
                t("no_description_available_for_this_product")}
            </p>
          </div>
        )}

        {activeTab === "Specifications" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <p>
              <span className="font-medium">{t("category:")}</span>{" "}
              {product.category?.name || "N/A"}
            </p>
            <p>
              <span className="font-medium">{t("stock_status")}</span>{" "}
              {product.stock_quantity} {product.unit} {t("available")}
            </p>
            <p>
              <span className="font-medium">{t("min_order")}</span>{" "}
              {product.min_order_quantity} {product.unit}
            </p>
            <p>
              <span className="font-medium">{t("organic_certified")}</span>{" "}
              {product.organic_certified ? t("yes") : t("no")}
            </p>
            {product.harvest_date && (
              <p>
                <span className="font-medium">{t("harvest_date")}</span>{" "}
                {new Date(product.harvest_date).toLocaleDateString()}
              </p>
            )}
            {product.expiry_date && (
              <p>
                <span className="font-medium">{t("expiry_date")}</span>{" "}
                {new Date(product.expiry_date).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {activeTab === "feedback" && (
          <div>
            {/* Reviews List */}
            <div className="space-y-6">
              {reviewsData?.data?.map((review: any) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold">
                        {review.user_name ||  t("anonymous")}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-gray-500 text-sm">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-lg font-bold">{review.rating}.0</div>
                  </div>
                  <h4 className="font-medium text-lg mb-2">{review.title}</h4>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("quantity_discount_tiers")}</h3>
            {product.price?.discount_tiers?.map((tier: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    {tier.min_quantity} - {tier.max_quantity} {product.unit}
                  </span>
                  <span className="text-green-600 font-bold">
                    {tier.discount_percentage}% OFF
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>{t("price_per")} {product.unit}:</div>
                  <div className="text-right">
                    <span className="line-through text-gray-400 mr-2">
                      {product.currency} {product.base_price}
                    </span>
                    <span className="font-semibold">
                      {product.currency} {tier.discounted_price_per_unit}
                    </span>
                  </div>
                  <div>{t("shipping")}:</div>
                  <div className="text-right">
                    {parseFloat(tier.shipping_charges) > 0
                      ? `${product.currency} ${tier.shipping_charges}`
                      : t("free")}
                  </div>
                  <div>{t("min_total")}:</div>
                  <div className="text-right font-semibold">
                    {product.currency} {tier.total_min_amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;