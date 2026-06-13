import { FC } from "react";
import { Store, Globe, UploadCloud, LeafyGreen } from "lucide-react";
import { motion } from "framer-motion";
import s1Img from "../assets/new-images/farm2.png";
import React from "react";
import { useTranslation } from "react-i18next";



const WhySellersLoveUs: FC = () => {

    const {t} = useTranslation();

    const features = [
        {
            icon: <Store className="w-6 h-6" />,
            title: t("boost_your_produce_sales"),
            description:
                t("tap_into_high_demand_markets_and_increase_earnings_by_showcasing_your_entire_harvest_to_verified_buyer"),
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: t("nationwide_buyer_access"),
            description:
                t("connect_with_retailers_distributors_and_processors_across_the_country"),
        },
        {
            icon: <UploadCloud className="w-6 h-6" />,
            title: t("list_instantly_sell_quickly"),
            description:
                t("upload_your_your_inventory_with_ease_and_start_receiving_buyer_interest_in_minutes"),
        },
        {
            icon: <LeafyGreen className="w-6 h-6" />,
            title: t("sell_every_grade_of_crop"),
            description:
                t("whether_its_surplus_or_slightly_imperfect_produce"),
        },
    ];


    return (
        <section className="py-20 bg-gradient-to-b from-green-50 to-white">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                {/* Text Content */}
                <div className="w-full lg:w-1/2 order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                        className="mb-10"
                    >
                        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-green-800 uppercase bg-green-200 rounded-full mb-4">
                            {t("ecoflare_network")}
                        </span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight"
                        >
                            {t("why")} <span className="text-green-600">{t("farmers")}</span> {t("trust_ecoflare")}
                        </motion.h2>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 + index * 0.15 }}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent group-hover:bg-secondary group-hover:text-white">
                                    <div className="bg-green-100 p-3 rounded-lg group-hover:bg-white transition-colors duration-300">
                                        {React.cloneElement(feature.icon, {
                                            className:
                                                "w-6 h-6 text-green-600 group-hover:text-primary transition-colors duration-300",
                                        })}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                                            {feature.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>

                {/* Image */}
                <motion.div
                    className="w-full lg:w-1/2 order-1 lg:order-2 overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative w-full h-[300px] md:h-[400px] lg:h-full md:rounded-l-full rounded-2xl overflow-hidden shadow-lg">
                        {/* Visible on all screens */}
                        <img
                            src={s1Img}
                            alt="Farmer harvesting crops"
                            className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105 md:rounded-l-full`   rounded-2xl"
                        />

                        {/* Decorative Blobs */}
                        <motion.div
                            className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-200 rounded-2xl -z-10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        />
                        <motion.div
                            className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-100 rounded-2xl -z-10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        />
                    </div>
                </motion.div>
            </div>
        </section>

    );
};

export default WhySellersLoveUs;