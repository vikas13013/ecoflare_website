import React from "react";
import { useNavigate } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  pricingNote: string;
  location: string;
  availability: string;
  dateRange: string;
  image: string;
  category: string[];
};

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/marketplace/${product.id}`, { state: product });
  };

  const availabilityColors = {
    "Available": "bg-green-500",
    "Limited": "bg-yellow-500",
    "Coming Soon": "bg-blue-500"
  };

  return (
    <div
      onClick={handleNavigate}
      className="w-full rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white flex flex-col h-full cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute top-3 right-3 w-3 h-3 rounded-full ${availabilityColors[product.availability as keyof typeof availabilityColors]}`}></span>
      </div>
      <div className="p-4 flex flex-col flex-grow space-y-3">
        <p className="text-gray-600 text-sm line-clamp-2">
          {product.dateRange}
        </p>
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1 flex-1">
            {product.name}
          </h3>
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
            {product.description}
          </span>
        </div>
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {product.price}
            </span>
            <div className="flex items-center text-xs text-gray-500 bg-gray-50 rounded-full px-2 py-1">
              <svg
                className="w-3 h-3 mr-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate max-w-[100px]">{product.location}</span>
            </div>
          </div>
          {product.pricingNote && (
            <div className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1">
              {product.pricingNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;