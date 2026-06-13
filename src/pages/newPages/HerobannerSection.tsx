import React from 'react';
import { motion } from 'framer-motion';
import tractorImg from '../../assets/new-images/about-01.jpg';
import broccoliImg from '../../assets/new-images/shimla.png';
import { useTranslation } from "react-i18next";

const HerobannerSection = () => {

  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-[#1a4738] to-[#275D47] overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="grid grid-cols-10 grid-rows-10 h-full">
            {[...Array(100)].map((_, i) => (
              <div key={i} className="border border-white/10"></div>
            ))}
          </div>
        </div>
        <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-[#4d9a7b] opacity-20 blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10 lg:gap-16">
          {/* Left Side Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-full lg:w-1/2 order-2 lg:order-1"
          >
            <div className="relative group">
              <div className="absolute -inset-1 sm:-inset-2 rounded-xl sm:rounded-2xl opacity-75 group-hover:opacity-100 blur transition-all duration-300"></div>
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl border-2 sm:border-4 border-white/10">
                <img
                  src={tractorImg}
                  alt="Farmer in field"
                  className="w-full h-auto min-h-[300px] sm:h-[400px] md:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Side Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="w-full lg:w-1/2 text-white space-y-4 sm:space-y-6 order-1 lg:order-2"
          >
            <div className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-2 sm:mb-4">
              <span className="text-xs sm:text-sm font-semibold text-lime-200">{t("innovation_in_fresh_produce_market")}</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold leading-snug sm:leading-tight md:leading-tight">
              {t("leading_the_way_in")}{' '}
              <span className="relative inline-block">
                <span className="relative z-10">{t("transforming")} </span>
                {/* <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 bg-[#F3C623]/40 z-0"></span> */}
              </span>{' '}
              {t("the_produce_market_for_a_sustainable_and_equitble_future")}

            </h2>

            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed">
              {t("ecoflare_solutions_connects_buyers_directly_with_farmers_through_transparent_pricing")}            </p>

            {/* Uncomment if you want buttons
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-lime-400 to-green-500 text-[#1a4738] font-semibold rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
              >
                Learn More
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-transparent border border-lime-300 text-lime-100 font-semibold rounded-full hover:bg-white/10 transition-all text-sm sm:text-base"
              >
                Contact Us
              </motion.button>
            </div>
            */}
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute top-1/4 left-4 sm:left-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-lime-300/30 blur-md"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute bottom-1/3 right-8 sm:right-20 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-lime-200/40 blur-md"
      ></motion.div>
    </section>
  );
};

export default HerobannerSection;