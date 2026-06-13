// src/components/TestimonialSlider.tsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import chef from "../../assets/new-images/update-images2/1.png";
import farmer from "../../assets/new-images/Slider1/4.jpg";
import customer from "../../assets/new-images/Slider1/5.jpg";

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  const images = [chef, farmer, customer];

  const next = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full  h-[50vh] sm:h-[60vh] md:h-screen lg:h-screen xl:h-screen mx-auto relative overflow-hidden mb-6 sm:mb-8 md:mb-10  shadow-md sm:shadow-lg">
      <div className="relative h-full w-full">
        {images.map((src, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, x: index > current ? 100 : -100 }}
            animate={{
              opacity: index === current ? 1 : 0,
              x: 0,
              transition: { duration: 0.6 },
            }}
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"  
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-green-700 p-1 sm:p-2 rounded-full shadow hover:bg-white z-20"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-green-700 p-1 sm:p-2 rounded-full shadow hover:bg-white z-20"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 w-full flex justify-center space-x-1 sm:space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 ${
              index === current ? "bg-green-600 w-3 sm:w-4" : "bg-green-200"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}