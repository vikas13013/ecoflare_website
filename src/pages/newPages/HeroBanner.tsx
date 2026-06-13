import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

// Images
import banner1 from "../../assets/new-images/Slider1/4.jpg";
import banner2 from "../../assets/new-images/Slider1/5.jpg";
import { useTranslation } from "react-i18next";



const HeroSlider = () => {

  const { t } = useTranslation();

  const slides = [
    {
      image: banner1,
      subtitle: t("revolutionzing_the_way_canada_buys_produce"),
      title: t("at_ecoflare_solutions_we_bring_you_direct_access_to_farm_fresh_fruits_and_vegetables"),
    },
    {
      image: banner2,
      subtitle: t("your_produce_should_be_as_smart_as_your_business"),
      title: t("with_ecoflare_pricewise_marketplace_pre_order_harvests"),
    },
  ];

  return (
    <section className="relative w-full h-[80vh] md:h-screen overflow-hidden text-white">
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 5000 }}
        effect="fade"
        loop
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={slide.image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60" />
            </div>

            {/* Slide Text Content */}
            <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-8">
              <div className="text-center max-w-4xl md:max-w-5xl">
                {/* Subtitle */}
                <p className="text-base sm:text-lg md:text-xl -mt-20  text-white mb-2 sm:mb-4">
                  {slide.subtitle}
                </p>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl  md:text-4xl font-semibold leading-snug sm:leading-tight text-white mb-4 sm:mb-6">
                  {slide.title}
                </h1>

                {/* CTA Button (Uncomment if needed) */}
                {/* 
    <button className="bg-primary hover:bg-secondary px-6 py-3 rounded-md font-semibold transition duration-300 text-white">
      Read More
    </button> 
    */}
              </div>
            </div>

          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;
