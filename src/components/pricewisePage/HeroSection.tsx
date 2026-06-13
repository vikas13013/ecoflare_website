import React from "react";
import bgimage from "../../assets/new-images/Pricewisebg.png";
import bannerImg from "../../assets/slider-images/About Us.jpg";
import farmer from "../../assets/new-images/slider-farmer-3.png";
import farmer2 from "../../assets/new-images/farmer-2.jpg";
import natural from "../../assets/images/flogo.jpg";
import tractor from "../../assets/new-images/project-6-420x350.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HeroSection() {

    const { t } = useTranslation();

    return (
        <section className="bg-[#1e4d3b] text-white pt-20 md:py-16 relative overflow-hidden">
            {/* Background Illustration */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-50 z-0"
                style={{ backgroundImage: `url(${bannerImg})` }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-12">
                {/* Left Content */}
                <div className="lg:w-1/2">
                    <p className="text-yellow-400 font-semibold text-lg mb-3 flex items-center gap-2">
                        {t("ecoflare_solutions_presents_pricewise")}
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-4">
                        <span className="block">{t("a_smart_b2b_marketplace_for")}</span>
                        <span className="block">
                            {t("fresh_and_fairly_priced")}  {" "}
                            <span className=" decoration-yellow-400">{t("produce")}</span>
                        </span>
                    </h1>
                    <p className="text-white mb-6 text-sm xs:text-base w-6xl sm:text-lg md:text-md">
                        {t("Empowering farmers, buyers, and retailers with smart contracts, traceable sourcing, and transparent pricing  all in one trusted platform.")}
                    </p>

                    {/* <div className="flex items-center gap-4 flex-wrap">
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-md">
                            Get In Touch
                        </button>

                        <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-md border border-yellow-400">
                            <div className="w-10 h-10 bg-yellow-400 text-black flex items-center justify-center rounded-full font-bold">
                                📞
                            </div>
                            <div className="text-left">
                                <p className="text-white font-medium">(704) 555-0127</p>
                                <p className="text-yellow-400 text-sm">Call For Booking</p>
                            </div>
                        </div>
                    </div> */}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-wrap justify-start gap-4 mb-8"
                    >
                        <Link
                            to="https://pricewise.wizdigtech.com/"
                            className="relative bg-white hover:bg-gray-50 text-green-800 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                        >
                            <span className="relative z-10">{t("Explore_Pricewise")}</span>
                        </Link>
                        
                        {/* <Link
                            to="/register/seller"
                            className="relative bg-white hover:bg-gray-50 text-green-800 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                        >
                            <span className="relative z-10">{t("list_your_produce")}</span>
                        </Link> */}
                    </motion.div>
                </div>

                {/* Right Image Section */}
                <div className="lg:w-1/2 relative">
                    <motion.div
                        initial={{ x: -20 }}
                        animate={{
                            x: 20,
                            transition: {
                                duration: 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }
                        }}
                        whileHover={{ scale: 1.02 }}
                        className="overflow-hidden  relative -top-16 "
                    >
                        <img
                            src={natural}
                            alt="Farmer"
                            className="w-60 max-w-sm mx-auto relative z-10 rounded-full shadow-xl "
                        />
                    </motion.div>
                    {/* <motion.div
                        initial={{ x: -20 }}
                        animate={{
                            x: 20,
                            transition: {
                                duration: 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }
                        }}
                        whileHover={{ scale: 1.02 }}
                        className="overflow-hidden  absolute  top-40 left-36 z-50"
                    >
                        <motion.img
                            src={natural}
                            alt="Mission"
                            className="object-cover  rounded-full w-24 h-24 "
                        />
                    </motion.div> */}
                    {/* <img
                        src={natural}
                        alt="100% Natural"
                        className="absolute  top-40 left-36 rounded-full w-24 z-50"
                    /> */}
                    <div className="absolute bottom-[-10px] right-[140px] flex gap-4">
                        <img
                            src={farmer2}
                            alt="Woman with basket"
                            className="w-36 h-36 object-cover  rounded-tr-3xl rounded-bl-3xl border-4 border-white shadow-lg z-10"
                        />
                        <img
                            src={tractor}
                            alt="Tractor"
                            className="w-36 h-36 object-cover rounded-tl-3xl rounded-br-3xl  border-4 border-white shadow-lg z-10"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
