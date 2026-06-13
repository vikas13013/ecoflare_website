// src/components/RecommendedSection.jsx
import RecommendedCard from "./RecommendedCard";
import { FiChevronRight } from "react-icons/fi";

const RecommendedSection = () => {
  return (
    <section className="my-12 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-green-100 text-green-800 p-2 rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </span>
          Recommended Listings
        </h2>
        <button className="text-green-600 hover:text-green-800 font-medium flex items-center text-sm">
          View all <FiChevronRight className="ml-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecommendedCard 
          featured 
          rating={4.8} 
          reviews={124} 
          discount="10% OFF" 
        />
        <RecommendedCard 
          organic 
          rating={4.5} 
          reviews={89} 
          fastShipping
        />
        <RecommendedCard 
          rating={4.2} 
          reviews={56} 
          discount="5% OFF"
        />
      </div>
    </section>
  );
};

export default RecommendedSection;