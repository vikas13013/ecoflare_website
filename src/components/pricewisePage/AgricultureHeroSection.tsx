import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { HiOutlineArrowUp } from 'react-icons/hi';
import image2 from '../../assets/new-images/mission.png';
import image3 from '../../assets/new-images/about-02.jpg';
import image4 from '../../assets/new-images/organic-sticker-2.png';
import natural from '../../assets/images/flogo.jpg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AgricultureHeroSection() {

  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-b from-white to-green-50 px-4 sm:px-6 py-14 md:py-20 relative overflow-hidden mb-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-16">

        {/* Images */}
        <div className="relative flex justify-center items-center h-80 sm:h-96 md:h-[28rem] lg:h-[32rem] w-full max-w-4xl mx-auto">
          {/* Main Image - Centered and larger */}
          <img
            src={image2}
            alt="Tractor in field"
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover object-[85%_10%] rounded-lg shadow-xl z-10 border-4 border-white transform  transition-transform duration-300"
          />

          {/* Overlay Image 1 - Top right with better positioning */}
          <img
            src={natural}
            alt="Farmer working"
            className="absolute left-0 top-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-full shadow-lg border-4 border-white z-20 transform  transition-transform duration-300"
          />

          {/* Overlay Image 2 - Bottom right with better spacing */}
          <img
            src={image3}
            alt="Tractor at sunset"
            className="absolute right-8 bottom-0 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 object-cover rounded-lg shadow-lg border-4 border-white z-30 transform  transition-transform duration-300"
          />

          {/* Optional decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border-2 border-amber-200 opacity-30"></div>
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] rounded-full border-2 border-green-200 opacity-30"></div>
          </div>
        </div>

        {/* Text Content */}
        <div className="px-4 lg:px-0 max-w-3xl">
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-highlight font-semibold mb-2">
            {("EcoFlare Introduces PriceWise")}
          </p>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-snug mb-4">
            {t("redefining_fresh_produce_with_smart")} <span className="text-highlight">{t("solutions")}</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-700 mb-6">
            {t("welcome_to_priwise_by_ecoflare_the_next_gen_b2b_marketplace")}
          </p>

          {/* Feature List */}
          <ul className="space-y-4 mb-6">
            {[
              { iconPath: "M13 10V3L4 14h7v7l9-11h-7z", text: t("no_middlemen") },
              { iconPath: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", text: t("zero_waste_promise") },
              { iconPath: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z", text: t("full_traceability_with_smart_contracts") }
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                </svg>
                <span className="text-gray-800 text-sm sm:text-base font-medium">{item.text}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-6">
            {/* <Link to="/about" className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-md shadow transition text-sm sm:text-base">
              {t("more_about_us")}
            </Link> */}
            {/* <div className="flex items-center gap-2 text-highlight font-medium text-sm sm:text-base">
              <FaPhoneAlt className="text-base" />
              <span>+91-9876543210</span>
            </div> */}
          </div>
        </div>

      </div>

      {/* 100% Natural Badge - hidden on small screens */}
      {/* <div className="absolute top-72 right-6 hidden lg:block">
        <img src={image4} alt="100% Natural" className="w-20 lg:w-24" />
      </div> */}


    </section>
  );
}
