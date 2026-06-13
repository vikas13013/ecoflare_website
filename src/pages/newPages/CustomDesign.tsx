import React from "react";
import { Handshake, ShoppingCart, Shield } from "lucide-react"; // Lucide icons
import farmerImg1 from "../../assets/new-images/farmer-5.jpg";
import farmerImg2 from "../../assets/new-images/farmer-2.jpg";
import farmerImg3 from "../../assets/new-images/project-4-420x350.jpg";
import { useTranslation } from "react-i18next";

interface Feature {
    title: string;
    description: string;
    iconElement: JSX.Element;
    image: string;
    ctaText: string;
    ctaLink: string;
}

const CustomDesign: React.FC = () => {

    const { t } = useTranslation();

    const features: Feature[] = [
        {
            title: t("b2bMarketplace"),
            iconElement: <Handshake className="w-10 h-10 text-primary group-hover:text-secondary" />,
            description: t("connect_directly_with_farmers_for_bulk_purchasing_our"),
            ctaText: t("explore_marketplace"),
            ctaLink: "/marketplace",
            image: farmerImg1,
        },
        {
            title: t("b2cPlatform"),
            iconElement: <ShoppingCart className="w-10 h-10 text-primary group-hover:text-secondary" />,
            description: t("shop_farm_fresh_produce_with_complete_transparency"),
            ctaText: t("shop_fresh_produce"),
            ctaLink: "/marketplace",
            image: farmerImg2,
        },
        {
            title: t("smart_contracts"),
            iconElement: <Shield className="w-10 h-10 text-primary group-hover:text-secondary" />,
            description: t("secure_automated_smart_contracts_that_protect_both"),
            ctaText: t("learn_how_it_works"),
            ctaLink: "/pricewise",
            image: farmerImg3,
        },
    ];


    return (
        <section className="py-12 hidden sm:block bg-white">
            <div className="text-center max-w-5xl mx-auto mb-10 sm:mb-14 px-4">
                <p className="text-base sm:text-lg md:text-xl font-semibold text-primary tracking-widest mb-2">
                    {t("our_solutions_capital")}
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-snug mb-4">
                    {t("empowering")} <span className="text-highlight">{t("farm_to_business")}</span> {t("connections")}
                </h2>
                <p className="text-base sm:text-lg text-primary  mx-auto lg:mx-0">
                    {t("innovative_services_designed_to_bridge_the_gap_between_famers_and_buyers")}
                </p>
            </div>

            {/* CARDS CONTAINER */}
            <div className=" flex flex-wrap justify-center gap-16 px-4">
                {features.map((feature, index) => (
                    <div key={index} className="group relative h-[330px] w-[320px]">
                        {/* Circle with Icon */}
                        <div className="absolute z-10 rounded-full top-2 -left-12 w-24 h-24 bg-white   border border-primary group-hover:border-secondary flex items-center justify-center">
                            {feature.iconElement}
                        </div>

                        {/* Main Card */}
                        <div
                            className="relative h-80 shadow-2xl w-[310px] overflow-hidden"
                            style={{
                                borderTopLeftRadius: '100px',
                                borderTopRightRadius: '0',
                                borderBottomRightRadius: '100px',
                                borderBottomLeftRadius: '0',
                            }}
                        >
                            {/* Yellow color ONLY on rounded areas */}
                            <div
                                className="absolute z-40 top-0 right-0 w-12 h-12 group-hover:bg-secondary bg-[#D6B725]"
                                style={{ borderBottomLeftRadius: '250px' }}
                            ></div>

                            <div
                                className="absolute bottom-0 z-40 left-0 w-12 h-12 hidden group-hover:block bg-secondary"
                                style={{ borderTopRightRadius: '400px' }}
                            ></div>
                            <div className="absolute inset-0 bg-primary group-hover:bg-secondary">
                                <div
                                    className="bg-white  absolute top-4 h-80 w-72 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden px-6"
                                    style={{
                                        borderTopLeftRadius: '100px',
                                        borderTopRightRadius: '0',
                                        borderBottomRightRadius: '100px',
                                        borderBottomLeftRadius: '0',
                                    }}
                                >
                                    <h3 className="text-xl font-bold mb-2 text-primary">{feature.title}</h3>
                                    <p className="text-sm text-gray-700 mb-4">
                                        {feature.description}
                                    </p>
                                    <a
                                        href={feature.ctaLink}
                                        className="mt-4 px-4 py-2 bg-[#D6B725] group-hover:bg-secondary text-white rounded-md hover:bg-yellow-600 transition-colors"
                                    >
                                        {feature.ctaText}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* BORDER OVERLAY DIV */}
                        <div
                            className="absolute top-2 -left-3 w-full h-full pointer-events-none"
                            style={{
                                border: '2px dotted #6B7280',
                                borderTop: '2px dotted #6B7280',
                                borderBottom: '2px dotted #6B7280',
                                zIndex: "10px",
                                borderTopLeftRadius: '80px',
                                borderTopRightRadius: '0',
                                borderBottomRightRadius: '80px',
                                borderBottomLeftRadius: '0',
                                transform: 'translatex(-5px)'
                            }}
                        ></div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CustomDesign;