import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import img1 from "../../assets/new-images/Pre order or Flexible Slider/8.jpg";
import img2 from "../../assets/new-images/Pre order or Flexible Slider/7.jpg";
import { useTranslation } from 'react-i18next';

interface Slide {
  id: number;
  emoji: string;
  title: string;
  description: string;
  image: string;
}

const DigitalTradeSlideshow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { t } = useTranslation();

  const slides: Slide[] = [
    {
      id: 1,
      emoji: "📊",
      title: t("digital_trade_made_simple"),
      description: t("digital_tools_that_simplify_complex_trade_from_seed_to_shelf"),
      image: img1
    },
    {
      id: 2,
      emoji: "🤝",
      title: t("trust_in_every_transaction"),
      description: t("fair_trade_real_relationships_better_food_for_all"),
      image: img2
    },
    {
      id: 3,
      emoji: "🏪",
      title: t("real_impact_local_reach"),
      description: t("pricewise_helps_rural_produces_access_urban_demand_fast_and_fair"),
      image: img1
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  return (
    <div className="relative w-full  overflow-hidden shadow-lg md:shadow-xl">
      {/* Slides Container */}
      <div className="relative w-full h-[70vh] max-h-[800px] overflow-hidden shadow-lg md:shadow-xl">
        {/* Slides Container */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onMouseEnter={() => !isMobile && setIsAutoPlaying(false)}
          onMouseLeave={() => !isMobile && setIsAutoPlaying(true)}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="w-full flex-shrink-0 relative"
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 md:bg-black/50 z-10"></div>

              {/* Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Text Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center text-white">
                <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto">
                  <span className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 block animate-bounce">
                    {slide.emoji}
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-white drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 lg:mb-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl mx-auto text-white/90 drop-shadow-md">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Navigation Arrows - Responsive sizing and positioning */}
      <button
        onClick={prevSlide}
        className="absolute hidden md:block left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-2.5 md:p-3 rounded-full shadow-md sm:shadow-lg transition-all z-30"
        aria-label="Previous slide"
      >
        <ChevronLeft size={isMobile ? 20 : 24} strokeWidth={2.5} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 hidden md:block sm:right-3 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-2.5 md:p-3 rounded-full shadow-md sm:shadow-lg transition-all z-30"
        aria-label="Next slide"
      >
        <ChevronRight size={isMobile ? 20 : 24} strokeWidth={2.5} />
      </button>

      {/* Dot Indicators - Responsive sizing and spacing */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-0 right-0 flex justify-center space-x-1.5 sm:space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentSlide === index
              ? 'bg-white w-4 sm:w-5 md:w-6'
              : 'bg-white/50 hover:bg-white/70'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DigitalTradeSlideshow;