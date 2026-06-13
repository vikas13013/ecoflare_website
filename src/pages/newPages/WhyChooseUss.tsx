import React from "react";
import { Handshake, ShoppingCart, Shield } from "lucide-react"; // using Lucide icons
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



const WhyChooseUss = () => {

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
    <section className="md:py-16 block sm:hidden bg-white">
      <div className="text-center  max-w-4xl mx-auto mb-10 sm:mb-14 px-4">
        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl font-semibold text-primary tracking-widest mb-2">
          {t("our_solutions_capital")}
        </p>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-snug mb-4">
          {t("empowering")} <span className="text-highlight">{t("farm_to_business")}</span> {t("connections")}
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-primary max-w-2xl mx-auto lg:mx-0">
          {t("innovative_services_designed_to_bridge_the_gap_between_famers_and_buyers")}
        </p>
      </div>


      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mb-10 sm:mb-16">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="group relative hover:bg-secondary bg-white shadow-md rounded-b-[3rem] pt-20 pb-10 px-6 border-t-[6px]  border-primary hover:border-secondary overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Curved corner top-right */}
            <div className="absolute top-0 right-0 w-28 h-28 group-hover:bg-white bg-primary rounded-bl-[100%]" />

            {/* Icon */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
              <div className="w-20 h-20 rounded-full bg-white border-2 group-hover:border-white border-primary flex items-center justify-center shadow-md">
                {feature.iconElement}
              </div>
            </div>

            {/* Content */}
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary group-hover:text-white mb-2 mt-6 text-center">
              {feature.title}
            </h3>
            <p className="text-sm sm:text-base group-hover:text-white text-gray-600 text-center mb-4 px-2">
              {feature.description}
            </p>

            {/* Optional CTA */}
            <div className="text-center mt-4">
              <a
                href={feature.ctaLink}
                className="text-primary group-hover:text-white font-medium underline  transition"
              >
                {feature.ctaText}
              </a>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default WhyChooseUss;
