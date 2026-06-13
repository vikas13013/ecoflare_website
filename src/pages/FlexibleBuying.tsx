// src/pages/FlexibleBuying.tsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaLeaf, FaShieldAlt, FaChartLine, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import {
  FaSearch,
  FaFileContract,
  FaBalanceScale,
  FaHandHoldingUsd
} from 'react-icons/fa';
import slide1 from '../assets/new-images/2nd Slider Images/2.jpg';
import slide2 from '../assets/new-images/Slider1/12.jpg';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


export default function FlexibleBuying() {

  const { t } = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: t("flexible_buying_fair_pricing"),
      subtitle: t("pay_only_for_the_quality_you_receive"),
      description: t("no_more_flat_rates_for_varied_quality"),
      image: slide1  // Replace with actual path
    },
    {
      title: t("set_your_quality_standards"),
      subtitle: t("you_decide"),
      description: t("define_your_standards_before_the_harvest"),
      image: slide2
    },

  ];


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50 pb-16  flex flex-col items-center">
      {/* Slider/Carousel Section */}
      <div className="w-full  mb-8 sm:mb-12 md:mb-16 relative overflow-hidden  shadow-lg">
        <div className="relative h-64 sm:h-80 md:h-[50vh] lg:h-[70vh] xl:h-[90vh] w-full overflow-hidden">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 sm:p-6 md:p-8 text-center z-10"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{
                  y: index === currentSlide ? 0 : -20,
                  opacity: index === currentSlide ? 1 : 0
                }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-2 drop-shadow-lg">
                  {slide.title}
                </h1>
              </motion.div>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{
                  y: index === currentSlide ? 0 : -20,
                  opacity: index === currentSlide ? 1 : 0
                }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-4 drop-shadow-lg">
                  {slide.subtitle}
                </h2>
              </motion.div>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{
                  y: index === currentSlide ? 0 : -20,
                  opacity: index === currentSlide ? 1 : 0
                }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-2xl drop-shadow-lg">
                  {slide.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-60 transition z-20"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-60 transition z-20"
          aria-label="Next slide"
        >
          <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center space-x-1 sm:space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-4 sm:w-6' : 'bg-white bg-opacity-50'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Heading with decorative elements */}
      <div className="relative w-full max-w-4xl text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute -top-6 -left-6 text-green-200 text-6xl opacity-50"
        >
          <FaLeaf />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute -bottom-6 -right-6 text-green-200 text-6xl opacity-50"
        >
          <FaLeaf className="transform rotate-180" />
        </motion.div>
      </div>



      {/* How It Works Section */}
      <div className="w-full max-w-6xl mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary mb-12 leading-snug">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-12 leading-snug">
            <span className="relative inline-block">
              <span className="relative z-10">
                {t("how")} <span className="text-highlight">{t("flexible_buying")}</span> {t("works")}
              </span>
              {/* <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-2 bg-highlight z-0 opacity-40 rounded-full -mb-1" /> */}
            </span>
          </h2>

        </h2>


        <div className="grid md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-secondary hover:bg-secondary hover:text-white transition-colors duration-300"
          >
            <div className="bg-green-100 p-4 rounded-full mb-6 mx-auto w-16 h-16 flex items-center justify-center group-hover:bg-white">
              <FaSearch className="text-primary text-2xl group-hover:text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-white">
              {t("select_and_agree_on_quality_tiers")}
            </h3>
            <p className="text-gray-600 group-hover:text-white">
              {t("choose_your_produce_and_agree_to_pricing_based_on_grading_standards")}
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-secondary hover:bg-secondary hover:text-white transition-colors duration-300"
          >
            <div className="bg-green-100 p-4 rounded-full mb-6 mx-auto w-16 h-16 flex items-center justify-center group-hover:bg-white">
              <FaFileContract className="text-primary text-2xl group-hover:text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-white">
              {t("lock_terms_with_smart_contracts")}
            </h3>
            <p className="text-gray-600 group-hover:text-white">
              {t("all_agreements_are_securely_stoered_on_blockchain_for_trust_and_transparency")}
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-secondary hover:bg-secondary hover:text-white transition-colors duration-300"
          >
            <div className="bg-green-100 p-4 rounded-full mb-6 mx-auto w-16 h-16 flex items-center justify-center group-hover:bg-white">
              <FaBalanceScale className="text-primary text-2xl group-hover:text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-white">
              {t("adjusted_pricing")}
            </h3>
            <p className="text-gray-600 group-hover:text-white">
              {t("final_payment_reflects_the_delivered_grade_no_overpaying_no_disputes")}
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-secondary hover:bg-secondary hover:text-white transition-colors duration-300"
          >
            <div className="bg-green-100 p-4 rounded-full mb-6 mx-auto w-16 h-16 flex items-center justify-center group-hover:bg-white">
              <FaHandHoldingUsd className="text-primary text-2xl group-hover:text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-white">
              {t("fair_payment_settlement")}
            </h3>
            <p className="text-gray-600 group-hover:text-white">
              {t("sellers_are_paid_according_to_the_quality_delivered")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10 mb-16 border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-12 leading-snug">
            <span className="relative inline-block">
              <span className="relative z-10">{t("why_choose")} <span className="text-highlight">{t("flexible_buying?")}</span></span>
              {/* <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-2 bg-highlight z-0 opacity-30 rounded-full -mb-1"></span> */}
            </span>
          </h2>

        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-start">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <FaChartLine className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t("reduced_risk")}</h3>
              <p className="text-gray-600">{t("only_pay_for_the_quality_you_receive")}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FaShieldAlt className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t("contract_clarity")}</h3>
              <p className="text-gray-600"> {t("smart_contracts_eliminate_confusion")}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <FaLeaf className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t("built_in_transparency")}</h3>
              <p className="text-gray-600">{t("quality_checks_ensure_mutual_accountability")}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <FaLeaf className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t("fair_returns")}</h3>
              <p className="text-gray-600">{t("high_quality_producers_get_rewarded_buyers_get_value")}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center px-4"
      >
        {/* Heading */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug">
          {t("real_quality_real_value")} <span className="text-highlight">{t("real_trust")}</span>
        </h3>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/register"
            className="bg-gradient-to-r from-primary to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition shadow-md hover:shadow-lg"
          >
            {t("explore_produce_listings")}
          </a>
          <a
            href="/request-produce"
            onClick={(e) => {
              e.preventDefault();
              navigate("/request-produce", { state: { type: "Flexible Produce" } });
            }}
            className="bg-[#D6B825] hover:bg-yellow-600 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition shadow-md hover:shadow-lg"
          >
            {t("start_a_flexible_produce")}
          </a>

        </div>


        {/* Tagline */}
        <p className="text-gray-600 mt-4 text-sm sm:text-base">
          {t("your_produce_your_terms_our_technology")}
        </p>
      </motion.div>

    </div>
  );
}