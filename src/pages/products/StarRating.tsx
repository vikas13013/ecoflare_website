import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  size?: number;
  showEmpty?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 20,
  showEmpty = true 
}) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" size={size} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-500" size={size} />
        );
      } else if (showEmpty) {
        stars.push(<FaStar key={i} className="text-gray-300" size={size} />);
      }
    }
    return stars;
  };

  return <div className="flex items-center gap-1">{renderStars()}</div>;
};

export default StarRating;