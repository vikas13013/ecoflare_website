// src/pages/PreOrderProduce.tsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaSeedling, FaCalendarCheck, FaTruck, FaHandshake, FaLeaf, FaPercentage, FaUserShield, FaChartLine, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TestimonialSlider } from "./newPages/TestimonialSlider";
import slide1 from '../assets/new-images/Pre order or Flexible Slider/Sustainability Meets Technology.jpg';
import slide2 from '../assets/new-images/Pre order or Flexible Slider/Transforming the Way You Source Fresh Produce.jpg';
import { LocateFixed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PreOrderProduce() {

  const { t } = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const slides = [
    {
      title: t("pre_order_with_confidence_plan_pay_smart"),
      subtitle: t("browse_upcoming_harvests_and_set_expectations"),
      description: t("view_real_time_listings_negotiate_quantity_and_delivery_and"),
      image: slide2
    },
    {
      title: t("transforming_the_way_you_source_fresh_produce"),
      subtitle: t("connect_directly_with_verified_farms"),
      description: t("no_middlemen_just_transparent_farm_fresh_produce_at_competitive_price_delivered_when_you_need_it"),
      image: slide1  // Replace with actual path
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-12  flex flex-col items-center">
      {/* Slider/Carousel Section */}
      <div className="w-full mb-8 sm:mb-12 md:mb-16 relative overflow-hidden  shadow-lg">
        <div className="relative h-64 sm:h-80 md:h-[50vh] lg:h-[70vh] xl:h-[90vh] w-full overflow-hidden">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 sm:p-6 md:p-8 text-center z-10"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: index === currentSlide ? 1 : 0,
                y: index === currentSlide ? 0 : 20
              }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl max-w-6xl font-bold mb-1 sm:mb-2 drop-shadow-lg">{slide.title}</h1>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-4 drop-shadow-lg">{slide.subtitle}</h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-2xl drop-shadow-lg">
                {slide.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute z-50 left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-50 transition"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 z-50 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-50 transition"
          aria-label="Next slide"
        >
          <FaChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center space-x-1 sm:space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Hero Section */}
      <div className=" w-full  text-center mb-8 sm:mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 sm:mb-4">
            {t("pre_order")} <span className="text-highlight">{t("farm_fresh")}</span> {t("produce")}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">
            {t("secure_the_harvest_support_the_future_eat_fresher")}
          </p>
        </motion.div>



        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 sm:mt-6 md:mt-8"
        >
          <p className="text-xl sm:text-2xl px-4 sm:px-8 md:px-12 lg:px-20 text-gray-800 font-semibold mt-2 sm:mt-3">
            {t("why_wait_for_availability_when_you_can_reserve_produce_straight_from_trusted_local_farms")} <br />
            <span className="text-green-600">{t("ecofalre_preorder_system_lets_you_lock_in_quality")}</span>
          </p>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <div className="w-full max-w-7xl mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-green-800 mb-12">
          {t("how")} <span className="text-green-600"> {t("pre_order")}</span> {t("works")}
        </h2>

        <div className="relative">
          {/* Progress line */}
          <div className="hidden md:block absolute h-1 bg-green-200 top-1/2 left-0 right-0 transform -translate-y-1/2"></div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="group bg-white rounded-xl shadow-lg pt-10 p-6 text-center flex flex-col items-center relative z-10 border border-green-100 hover:bg-secondary hover:text-white transition-all duration-300"
            >
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center absolute -top-4 left-1/2 transform -translate-x-1/2 font-bold">
                <div className="bg-green-100 p-4 rounded-full mb-4 transition duration-300 group-hover:bg-white">
                  <FaSeedling className="text-green-600 text-3xl group-hover:text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-green-800 group-hover:text-white">{t("browse_upcoming_harvests")}</h3>
              <p className="text-gray-600 group-hover:text-white">
                {t("explore_real_time_listings_of_verified_famrs")}
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group bg-white rounded-xl shadow-lg pt-10 p-6 text-center flex flex-col items-center relative z-10 border border-green-100 hover:bg-secondary hover:text-white transition-all duration-300"
            >
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center absolute -top-4 left-1/2 transform -translate-x-1/2 font-bold">
                <div className="bg-green-100 p-4 rounded-full mb-4 transition duration-300 group-hover:bg-white">
                  <FaCalendarCheck className="text-green-600 text-3xl group-hover:text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-green-800 group-hover:text-white">{t("set_expectations_with_the_farmer")}</h3>
              <p className="text-gray-600 group-hover:text-white">
                {t("agree_on_quantity_quantity_quality")}
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="group bg-white rounded-xl shadow-lg pt-10 p-6 text-center flex flex-col items-center relative z-10 border border-green-100 hover:bg-secondary hover:text-white transition-all duration-300"
            >
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center absolute -top-4 left-1/2 transform -translate-x-1/2 font-bold">
                <div className="bg-green-100 p-4 rounded-full mb-4 transition duration-300 group-hover:bg-white">
                  <FaHandshake className="text-green-600 text-3xl group-hover:text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-green-800 group-hover:text-white">{t("confirm_with_smart_contracts")}</h3>
              <p className="text-gray-600 group-hover:text-white">
                {t("your_agreement_is_securely_recorded_using_blockchain_backed_smart_contracts_for_full_transparency")}
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="group bg-white rounded-xl shadow-lg pt-10 p-6 text-center flex flex-col items-center relative z-10 border border-green-100 hover:bg-secondary hover:text-white transition-all duration-300"
            >
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center absolute -top-4 left-1/2 transform -translate-x-1/2 font-bold">
                <div className="bg-green-100 p-4 rounded-full mb-4 transition duration-300 group-hover:bg-white">
                  <LocateFixed className="text-green-600 text-3xl group-hover:text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-green-800 group-hover:text-white">{t("track_your_harvest")}</h3>
              <p className="text-gray-600 group-hover:text-white">
                {t("farmers_update_availability_and_timelines")}
              </p>
            </motion.div>

            {/* Step 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="group bg-white rounded-xl shadow-lg pt-10 p-6 text-center flex flex-col items-center relative z-10 border border-green-100 hover:bg-secondary hover:text-white transition-all duration-300"
            >
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center absolute -top-4 left-1/2 transform -translate-x-1/2 font-bold">
                <div className="bg-green-100 p-4 rounded-full mb-4 transition duration-300 group-hover:bg-white">
                  <FaTruck className="text-green-600 text-3xl group-hover:text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-green-800 group-hover:text-white">{t("get_fresh_delivery")}</h3>
              <p className="text-gray-600 group-hover:text-white">
                {t("produce_is_delivered_as_promised_payments_are_processed")}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <TestimonialSlider />


      {/* Benefits Section */}
      <div className="w-full max-w-7xl mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-green-800 mb-12">
          {t("why_pre_order")} <span className="text-green-600">{t("with_ecoflare")}</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Benefit 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 hover:bg-secondary hover:text-white"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg mr-4 transition duration-300 group-hover:bg-white">
                <FaLeaf className="text-green-600 text-xl group-hover:text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 group-hover:text-white">{t("peak_freshness")}</h3>
            </div>
            <p className="text-gray-600 group-hover:text-white">
              {t("harvested_at_ripeness_and_delivered_direct_to_your_door")}
            </p>
          </motion.div>

          {/* Benefit 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 hover:bg-secondary hover:text-white"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg mr-4 transition duration-300 group-hover:bg-white">
                <FaPercentage className="text-green-600 text-xl group-hover:text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 group-hover:text-white">{t("early_bird_savings")}</h3>
            </div>
            <p className="text-gray-600 group-hover:text-white">
              {t("save_by_securing_your_order_in_advance")}
            </p>
          </motion.div>

          {/* Benefit 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 hover:bg-secondary hover:text-white"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg mr-4 transition duration-300 group-hover:bg-white">
                <FaUserShield className="text-green-600 text-xl group-hover:text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 group-hover:text-white">{t("farmer_first_model")}</h3>
            </div>
            <p className="text-gray-600 group-hover:text-white">
              {t("help_farmers_plan_reduce_waste_and_boost_income")}
            </p>
          </motion.div>

          {/* Benefit 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 hover:bg-secondary hover:text-white"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg mr-4 transition duration-300 group-hover:bg-white">
                <FaChartLine className="text-green-600 text-xl group-hover:text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 group-hover:text-white">{t("stable_pricing")}</h3>
            </div>
            <p className="text-gray-600 group-hover:text-white">
              {t("lock_in_prices_ahead_of_seasonal_spikes_and_shortages")}
            </p>
          </motion.div>
        </div>
      </div>


      {/* Final CTA */}
      <div className="w-full max-w-4xl mx-auto text-center bg-primary rounded-2xl p-10 sm:p-12 shadow-xl mb-10 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Optional Gradient Overlay */}
          <div className="absolute inset-0  pointer-events-none rounded-2xl" />

          {/* Main Title */}
          <h2 className="relative z-10 text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug mb-4">
            {t("smarter_seamless")} <span className="">{t("sustainable")}.</span>
          </h2>

          {/* Subheading */}
          <p className="relative z-10  text-lg sm:text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
            {t("pre_ordering_isnt_just_a_transaction")}
          </p>
        </motion.div>

      </div>
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
              navigate("/request-produce", { state: { type: "Pre Order Produce" } });
            }}
            className="bg-[#D6B825] hover:bg-yellow-600 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition shadow-md hover:shadow-lg"
          >
            {t("start_a_pre_order_produce")}
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