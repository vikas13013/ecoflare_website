import React, { useEffect } from "react";
import farmer from "../../assets/new-images/vission.png";
import farmer2 from "../../assets/new-images/project-4-420x350.jpg";
import farmer3 from "../../assets/new-images/farm.png";
import tractor from "../../assets/new-images/project-6-420x350.jpg";
import { Calendar, ClipboardList, CreditCard, FileText, Scale, Smartphone, Truck, Users } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";


export default function ServiceCardsSection() {


    const {t} = useTranslation()

    const services = [
        {
            title: t("all_grades_welcome"),
            icon: <Scale className="w-6 h-6 text-green-900" />,
            image: farmer3,
            description: t("sell_high_quality_grades_processing_grade_and_surplus_produce")
        },
        {
            title: t("future_harvest_sales"),
            icon: <Calendar className="w-6 h-6 text-green-900" />,
            image: farmer2,
            description: t("list_upcoming_harvests_and_secure_buyers_in_advance")
        },
        {
            title: t("mobile_friendly"),
            icon: <Smartphone className="w-6 h-6 text-green-900" />,
            image: tractor,
            description: t("manage_your_sales_from_the_field_with_our_farmer_app")
        },
        // {
        //     title: "Order Tracking & Assurance",
        //     icon: <Users className="w-6 h-6 text-green-900" />,
        //     image: farmer,
        //     description: "Get real-time updates from farm to doorstep, backed by our satisfaction guarantee."
        // },

    ];


    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: false
        });
    }, []);

    return (
        <section className=" py-20 px-4 text-center">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-4 leading-snug">
                    {t("build_for")} <span className="text-highlight">{t("farmers")}</span>{t("by_farmers")}
                </h2>

                <p className="text-base sm:text-lg md:text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
                    {t("everything_you_need_to_sell_efficiently_and_grow_your_farming_business")}
                </p>

                {/* <p
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="max-w-xl mx-auto text-gray-600 mb-10"
                >
                    Agriculture is the backbone of our society, providing food, raw materials, and economic stability.
                </p> */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center  items-start max-w-5xl mx-auto">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={300 + (index * 100)}
                            className="relative h-80 group bg-white shadow-lg rounded-t-[60px] rounded-b-full overflow-hidden border-4 border-primary hover:border-yellow-400 transition-all duration-500 flex flex-col items-center hover:-translate-y-2"
                        >
                            {/* Image container with improved styling */}
                            <div className="relative  w-full h-10 overflow-hidden">
                                {/* <img 
                                    src={service.image} 
                                    alt={service.title} 
                                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" 
                                /> */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                            </div>

                            {/* Icon with animation */}
                            <div className="bg-yellow-400 w-14 h-14 z-50 flex items-center justify-center rounded-full shadow-lg -mt-7  transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                {service.icon}
                            </div>

                            <div className="p-6 flex flex-col justify-between h-full w-full">
                                <h3 className="text-xl font-bold text-green-900 mb-2">{service.title}</h3>
                                <p className="text-gray-600 mb-2">{service.description}</p>

                                {/* Animated arrow button */}
                                <div className="w-12 h-12 mt-2 bg-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-md transition-all duration-300 group-hover:bg-green-800 group-hover:text-white">
                                    {/* <span className="text-xl font-bold transition-transform duration-300 group-hover:translate-x-1">→</span> */}
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute bottom-10 -right-2 w-20 h-20 bg-yellow-400/20 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500" />
                            <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-800/10 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-700" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}