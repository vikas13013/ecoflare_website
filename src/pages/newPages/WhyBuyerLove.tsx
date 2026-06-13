import { FC } from "react";
import {
    ArrowUpRight,
    Network,
} from "lucide-react";
import { motion } from "framer-motion";
import s1Img from "../../assets/new-images/project-5-420x350.jpg";
import React from "react";
import { useTranslation } from "react-i18next";

const WhyBuyerLove: FC = () => {

    const { t } = useTranslation();

    const features = [
        {
            icon: <ArrowUpRight className="w-6 h-6" />,
            title: t("save_time"),
            description:
                t("reduce_sourcing_time_from_weeks_to_minutes_with_our_streamlined_digital_platform"),
        },
        {
            icon: <Network className="w-6 h-6" />,
            title: t("save_money"),
            description:
                t("eliminate_middlemen_and_reduce_costs_with_direct_deals"),
        },
    ];


    return (
        <section className="py-16 bg-gradient-to-b from-green-50 to-white overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
                {/* Text Content */}
                <div className="w-full lg:w-1/2">
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
                            className="text-2xl sm:text-3xl md:text-3xl  font-bold text-gray-900 mb-6 leading-tight"
                        >
                            {t("the")} <span className="text-green-600">{t("smart_way")}</span> {t("to_source_fresh_produce")}
                        </motion.h2>
                        <h2 className="text-gray-600 text-base md:text-lg">
                            {t("ecolare_eliminates_traditional_supply_chain_inefficiencis")}
                        </h2>
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
                                    {/* Icon Wrapper */}
                                    <div className="bg-green-100 p-3 rounded-lg group-hover:bg-white transition-colors duration-300">
                                        {React.cloneElement(feature.icon, {
                                            className:
                                                "w-6 h-6 text-green-600 group-hover:text-primary transition-colors duration-300",
                                        })}
                                    </div>

                                    {/* Text */}
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
                    className="w-full lg:w-1/2 order-1 lg:order-2"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative w-full h-[300px] lg:h-[500px] rounded-2xl overflow-hidden ">
                        {/* For Desktop */}
                        <div className="hidden lg:block w-full h-full rounded-l-full overflow-hidden">
                            <img
                                src={s1Img}
                                alt="Farmer harvesting crops"
                                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                            />
                        </div>

                        {/* For Mobile */}
                        <div className="block lg:hidden w-full h-full">
                            <img
                                src={s1Img}
                                alt="Farmer harvesting crops"
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>

                        {/* Decorative Elements */}
                        {/* <motion.div
                            className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-200 rounded-2xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        />
                        <motion.div
                            className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-100 rounded-2xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        /> */}
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default WhyBuyerLove;
