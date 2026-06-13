import React from "react";
import {
  Home,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import bannerImg from "../assets/slider-images/About Us.jpg";
import AmbitionsSection from "../components/AmbitionsSection";
import WhoWeAre from "./newPages/WhoWeAre";
import HerobannerSection from "./newPages/HerobannerSection";
import TeamSection from "./newPages/TeamMember";
import GalleryIntro from "./newPages/GalleryIntro";
import { useTranslation } from "react-i18next";

const About: React.FC = () => {


  const { t } = useTranslation();


  return (
    <div className="text-gray-800 overflow-hidden ">
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center bg-no-repeat h-80 md:h-[25rem] flex items-center"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="text-white hover:text-green-300 transition-colors"
              aria-label="Home"
            >
              <Home className="w-6 h-6" />
            </Link>
            <span className="text-white">/</span>
            <span className="text-white font-medium">{t("about_us")}</span>
          </div>
          <motion.h1
            className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mt-8 max-w-2xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t("cultivating_the_future_of_food")}
          </motion.h1>
          <motion.p
            className="text-white text-sm xs:text-base sm:text-lg md:text-xl mt-4 max-w-3xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {t("where_technoloty_meets_agriculture_to_create_sustainable")}
          </motion.p>
        </motion.div>
      </section>

      {/* Who We Are */}
      <WhoWeAre />

      <HerobannerSection />

      <AmbitionsSection />
      {/* <Gallery /> */}
      <GalleryIntro />
      {/* <YouTubeGallery/> */}

      <TeamSection />


      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center bg-white rounded-xl px-6 py-12 shadow-md"
      >
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-snug mb-4">
          {t("ready_to_shape_the_future_of_food")}
        </h1>

        {/* Subheading */}
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-6">
          {t("join_a_unified_B2B_B2C_markeplace_revolutionzing_how_fresh_produce_connects")}
        </h3>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          {t("whether_youre_a_farmer_buyer_or_advocate_for_sustainable_food")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center shadow"
          >
            {t("get_in_touch")} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link
            to="/marketplace"
            className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center"
          >
            {t("explore_marketplace")} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </motion.div>



    </div>
  );
};

export default About;