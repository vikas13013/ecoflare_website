import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const mockData = new Array(6).fill({
  title: "Habanero Pepper",
  subtitle: "Commercial - 8lb carton",
  pricing: "TBD",
  approx: "~ $3.82/lb",
  location: "Pharr, TX",
  dateRange: "Feb 15 2025 - Mar 05 2025",
  imageUrl: "https://images.unsplash.com/photo-1623534656125-dfe29b92c3ce?q=80&w=1460&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
});

const NewProgramsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      // Check scroll position after animation
      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">New Programs Available</h2>
          <p className="text-gray-500 mt-1">Discover our latest product offerings</p>
        </div>
        <button className="flex items-center gap-1 text-sm border border-green-500 px-4 py-2 rounded-full hover:bg-green-50 text-green-600 transition-colors">
          View All Programs
          <ArrowRight size={16} className="mt-0.5" />
        </button>
      </div>

      <div className="relative group">
        {/* Left Arrow - only visible when needed */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
        )}

        {/* Card Container */}
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 px-2"
        >
          {mockData.map((item, idx) => (
            <div
              key={idx}
              className="min-w-[280px] sm:min-w-[300px] flex-shrink-0 border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 snap-start"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" 
                />
                <div className="absolute bottom-2 left-2 bg-white text-green-600 text-xs px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Available
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{item.dateRange}</span>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    New Program
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.subtitle}</p>

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{item.pricing}</p>
                    <p className="text-xs text-gray-400">{item.approx}</p>
                  </div>
                  <button className="text-xs border border-green-500 text-green-600 px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors">
                    Program Details
                  </button>
                </div>

                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 mt-2">
                  <span>{item.location}</span>
                  <button className="text-green-600 hover:underline">Quick View</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow - only visible when needed */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        )}
      </div>
    </section>
  );
};



export default NewProgramsSection;