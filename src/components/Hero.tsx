import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectCreative } from "swiper/modules";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Typewriter } from 'react-simple-typewriter';


import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-creative";

const HeroSlider = () => {
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const [showNavButtons, setShowNavButtons] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef();


  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false
    });
  }, []);

  useEffect(() => {
    // Delay loading video source after the page has loaded
    if (videoRef.current) {
      const source = document.createElement("source");
      source.src = "/videos/slider-video1.mp4";
      source.type = "video/mp4";
      videoRef.current.appendChild(source);
      videoRef.current.load();
    }
  }, []);




  return (
    <div
      className="relative h-[60vh] sm:h-[70vh] md:h-[110vh] lg:h-[110vh] xl:h-[110vh] w-full "
      onMouseEnter={() => setShowNavButtons(true)}
      onMouseLeave={() => setShowNavButtons(false)}
    >


      {/* Swiper Start */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectCreative]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        effect={'creative'}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ["-20%", 0, -1],
            opacity: 0,
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        className="w-full h-full relative"
      >
        <SwiperSlide>
          <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              poster="/images/video-thumbnail.jpg"
              className="absolute inset-0 w-full h-full object-cover z-[-1]"
            >
              <source src="/videos/slider-video1.mp4" type="video/mp4" />
              {t("your_browser_does_not_support_the_video_tag")}
            </video>

            <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

            <div className="z-10 text-center px-4 w-full max-w-4xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white font-myfont text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl leading-tight"
                data-aos="fade-up"
              >
                <Typewriter
                  words={[
                    t("direct_from_farm_straight_to_you"),
                    t("direct_from_farm_straight_to_you"),

                  ]}
                  loop={Infinity} // Infinite loop
                  cursor
                  cursorStyle="|"
                  typeSpeed={80} // Slow, readable typing
                  deleteSpeed={40} // Smooth deleting
                  delaySpeed={1500} // Wait before deleting
                />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-white text-sm xs:text-base sm:text-lg md:text-xl mt-2 sm:mt-3 md:mt-4 max-w-3xl mx-auto"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {t("we_connect_you_to_fresh_high_quality_produce_from_local_farms_no_middlemen")}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-4 sm:mt-6 md:mt-8 bg-[#f4c150] hover:bg-yellow-500 text-black font-medium px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-md transition text-sm sm:text-base"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <Link to="/marketplace">{t("explore_marketplace")}</Link>
              </motion.button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-full bg-cover bg-center flex items-center justify-center hm-1slide1">
            <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
            <div className="z-10 text-center px-4 w-full max-w-4xl mx-auto py-8 md:py-16">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white font-myfont text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl  leading-tight"
                data-aos="fade-up"
              >
                <Typewriter
                  words={[
                    t("farm_fresh_doorstep_delivered"),
                    t("farm_fresh_doorstep_delivered"),

                  ]}
                  loop={Infinity} // Infinite loop
                  cursor
                  cursorStyle="|"
                  typeSpeed={80} // Slow, readable typing
                  deleteSpeed={40} // Smooth deleting
                  delaySpeed={1500} // Wait before deleting
                />

              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-white text-sm xs:text-base sm:text-lg md:text-xl mt-2 sm:mt-3 md:mt-4 max-w-4xl mx-auto"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {t("affordable_produce_handpicked_and_delivered_from_nearby_farms_to_your_home_or_business")}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-4 sm:mt-6 md:mt-8 bg-[#f4c150] hover:bg-yellow-500 text-black font-medium px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-md transition text-sm sm:text-base"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <Link to="/preorderproduce">
                  {t("shop_fresh_produce")}
                </Link>
              </motion.button>
            </div>
          </div>
        </SwiperSlide>

        {/* <SwiperSlide>
          <div className="relative h-full bg-cover bg-center flex items-center justify-center hm-1slide3">
            <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
            <div className="z-10 text-center px-4 w-full max-w-4xl mx-auto py-8 md:py-16">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white font-myfont text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight"
                data-aos="fade-up"
              >
                Revolutionizing Food Access
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-white text-sm xs:text-base sm:text-lg md:text-xl mt-2 sm:mt-3 md:mt-4 max-w-3xl mx-auto"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Bring fresh, affordable produce straight from the farm to your doorstep
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                onClick={handleSubscribeClick}
                className="mt-4 sm:mt-6 md:mt-8 bg-[#f4c150] hover:bg-yellow-500 text-black font-medium px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-md transition text-sm sm:text-base"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                Discover More
              </motion.button>
            </div>
          </div>
        </SwiperSlide> */}

        {/* Navigation Buttons */}
        <div
          className={`swiper-button-prev z-50 hidden md:block absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 cursor-pointer w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-white bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 ${showNavButtons ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
        <div
          className={`swiper-button-next hidden md:block z-50 absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 cursor-pointer w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-white bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 ${showNavButtons ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
        >
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
      </Swiper>
    </div>
  );
};

export default HeroSlider;