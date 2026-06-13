// src/components/RecommendedCard.jsx
import { FaMapMarkerAlt, FaStar, FaShippingFast } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

const RecommendedCard = ({ 
  featured = false, 
  organic = false, 
  fastShipping = false,
  rating = 0, 
  reviews = 0,
  discount = null
}) => {
  return (
    <div className={`relative rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-shadow ${featured ? 'border-green-300' : ''}`}>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {featured && (
          <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </span>
        )}
        {organic && (
          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
            Organic
          </span>
        )}
        {discount && (
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}
          </span>
        )}
      </div>
      
      {/* Wishlist button */}
      <button className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100">
        <FiHeart className="text-gray-500" />
      </button>
      
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://http2.mlstatic.com/D_NQ_NP_890082-MLM54820605091_042023-O-semillas-de-chile-habanero-de-03-gr-rinde-hasta-70-plantas.webp"
          alt="Habanero Pepper"
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Habanero Pepper</h3>
            <p className="text-sm text-gray-600">Commercial • 8lb carton</p>
          </div>
          {fastShipping && (
            <div className="flex items-center text-blue-600 text-xs">
              <FaShippingFast className="mr-1" /> Fast ship
            </div>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400 mr-1">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'} 
                size={14}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            {rating} ({reviews} reviews)
          </span>
        </div>
        
        {/* Price */}
        <div className="mt-2">
          <span className="text-lg font-bold text-gray-800">$3.98</span>
          <span className="text-sm text-gray-500 ml-1">/lb</span>
        </div>
        
        {/* Location */}
        {/* <div className="flex items-center text-sm text-gray-500 mt-1">
          <FaMapMarkerAlt className="mr-1 text-gray-400" /> 
          <span>Pharr, TX</span>
        </div> */}
        
        {/* Action Button */}
        <button
          className={`mt-4 w-full py-2 rounded-lg font-medium text-sm transition-colors ${
            featured 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'border border-gray-300 hover:bg-gray-50 text-gray-800'
          }`}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RecommendedCard;