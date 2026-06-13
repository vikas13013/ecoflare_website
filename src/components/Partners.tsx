import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

import ptr1 from '../assets/new-partner-logo/WizDig Technologies.jpg';
import ptr3 from '../assets/new-partner-logo/York Angel Investor.jpg';
import ptr9 from '../assets/new-partner-logo/York Angel (Designated Organization).jpg';
import ptr10 from '../assets/new-partner-logo/Tecenda Capital (VCC).jpg';
import ptr11 from '../assets/new-partner-logo/West Ontario Law LLP (Legal Counsel).jpg';
import ptr12 from '../assets/new-partner-logo/MB Accounting (Canadian Accounting Firm – Compliance & Taxation).jpg';
import ptr13 from '../assets/new-partner-logo/MBE Business Magazine.jpg';
import ptr14 from '../assets/new-partner-logo/Gulfood Event.jpg';
import ptr16 from '../assets/new-partner-logo/CPMA (Canadian Produce Marketing Association).jpg';
import ptr17 from '../assets/new-partner-logo/KLA (Karman-Line Acceleration).jpg';
import ptr18 from '../assets/new-partner-logo/IFPA (International Fresh Produce Association).jpg';
import ptr19 from '../assets/new-partner-logo/Kreative Hive.jpg';
import ptr20 from '../assets/new-partner-logo/Crunchbase (2).jpg';
import ptr21 from '../assets/new-partner-logo/Wise Payments Canada.jpg';
import ptr22 from '../assets/new-partner-logo/Gulfood Manufacturing Event.jpg';
import ptr23 from '../assets/new-partner-logo/KPMG.jpg';
import ptr24 from '../assets/new-partner-logo/Immigrate.AI.jpg';
import { useTranslation } from 'react-i18next';

const PartnersCarousel = () => {
  const partners = [
    { name: 'partner', logo: ptr1 },
    // { name: 'partner', logo: ptr9 },
    { name: 'partner', logo: ptr10 },
    // { name: 'partner', logo: ptr11 },
    { name: 'partner', logo: ptr18 },
    { name: 'partner', logo: ptr16 },
    { name: 'partner', logo: ptr17 },
    { name: 'partner', logo: ptr19 },
    { name: 'partner', logo: ptr3 },
    { name: 'partner', logo: ptr20 },
    { name: 'partner', logo: ptr21 },
    { name: 'partner', logo: ptr12 },
    { name: 'partner', logo: ptr13 },
    { name: 'partner', logo: ptr14 },
    { name: 'partner', logo: ptr22 },
    { name: 'partner', logo: ptr23 },
    { name: 'partner', logo: ptr24 },
  ];


  const { t } = useTranslation();

  return (
    <section className="py-16 bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center  mb-10 sm:mb-14 px-4">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-snug mb-4">
            {t("our")} <span className="text-highlight">{t("trusted")} </span> {t("partners")}
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-center text-primary  mx-auto lg:mx-0">
            {t("collaborating_with_industry_leaders_to_deliver_excellence")}
          </p>
        </div>


        <Swiper
          modules={[Autoplay]}
          loop={true}
          autoplay={{
            delay: 500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={1500}
          className="py-4"
          breakpoints={{
            1536: { slidesPerView: 7, spaceBetween: 20 },
            1280: { slidesPerView: 6, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            640: { slidesPerView: 3, spaceBetween: 20 },
            480: { slidesPerView: 2, spaceBetween: 16 },
            0: { slidesPerView: 1.5, spaceBetween: 12 },
          }}
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index}>
              <motion.div
                className="flex items-center justify-center h-32 p-4 rounded-lg shadow-sm border border-gray-200 "
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 }
                }}
                initial={{ y: 0, scale: 1 }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-20 w-auto object-contain"
                  style={{
                    maxWidth: '160px',
                    height: 'auto',
                  }}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PartnersCarousel;
