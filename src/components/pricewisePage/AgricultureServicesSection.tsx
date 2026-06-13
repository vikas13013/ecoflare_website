import { BarChart2, Calendar, DollarSign, FileText, Truck } from 'lucide-react';
import React, { useEffect } from 'react';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';

export default function AgricultureServicesSection() {

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true
        });
    }, []);

    const { t } = useTranslation();

    const services = [
        {
            title: t("pre_order_produce"),
            icon: <DollarSign className="w-5 h-5" />,
            description: t("secure_harvest_before_its_picked"),
            caption: t("plan_and_reserve_your_harvest_before_its_picked"),
        },
        {
            title: t("flexible_buying"),
            icon: <Calendar className="w-5 h-5" />,
            description: t("tiered_pricing_based_on_quality"),
            caption: t("only_pay_for_what_meets_your_standards"),
        },
        {
            title: t("smart_contracts"),
            icon: <FileText className="w-5 h-5" />,
            description: t("auto_enforced_agreements_and_delivery_terms"),
            caption: t("digitaly_signed_blockchain_baked_agreements_ensure_trusted"),
        },
    ];

    return (
        <section className=" text-black px-6 pt-10 pb-16 relative overflow-hidden">
            <div className="max-w-7xl mx-auto text-center">

                <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    {t("your_one_stop")}<br className="hidden md:block" /> {t("smart_fresh_produce")} <span className="underline text-green-600 decoration-primary">{t("marketplace")}</span>
                </h2>
                <p
                    className="text-gray-900 mt-4 max-w-xl mx-auto"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    {t("pricewise_ecoflares_innovative_platform_is_transforming_how_fresh_produce_is_bought_and_sold")}
                </p>

                <div className="grid gap-6 mt-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-gray-200 p-6 rounded-xl shadow-md relative group hover:scale-[1.03] transition-all duration-500 ease-out overflow-hidden"
                            data-aos="fade-up"
                            data-aos-delay={300 + (index * 100)}
                        >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Animated border effect */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400 rounded-xl transition-all duration-700 ease-in-out"></div>

                            {/* Content container with hover effects */}
                            <div className="relative z-10 h-full flex bg-white flex-col group-hover:bg-white group-hover:text-green-900 group-hover:bg-opacity-90 transition-all duration-300 p-5 rounded-lg">
                                <div className="absolute top-0 left-0 -mt-6 mr-6 bg-yellow-400 p-3 rounded-full shadow-md transition-all duration-500 group-hover:bg-green-900 group-hover:scale-110 group-hover:rotate-12">
                                    {React.cloneElement(service.icon, {
                                        className: "w-5 h-5 group-hover:text-yellow-400 transition-colors duration-300"
                                    })}
                                </div>
                                <h3 className="text-xl font-bold mt-8 mb-2 group-hover:text-green-900 transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="text-md text-gray-800 group-hover:text-green-800 transition-colors duration-300 flex-grow">
                                    {service.description}
                                </p>
                                <p className='text-sm mt-4'>{service.caption}</p>
                                <div className="w-8 h-8 bg-yellow-400 text-green-900 rounded-full flex items-center justify-center  transition-all duration-500 group-hover:translate-x-2 group-hover:bg-green-900 group-hover:text-yellow-400 self-end">
                                    <HiOutlineArrowUpRight className="text-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="fixed bottom-6 right-6 bg-green-600 hover:bg-yellow-400 hover:text-green-900 p-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                data-aos="fade-up"
                data-aos-delay="800"
                data-aos-anchor-placement="center-bottom"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </section>
    );
}