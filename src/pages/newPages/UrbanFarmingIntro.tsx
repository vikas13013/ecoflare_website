import React from "react";
import topImage from "../../assets/new-images/project-9-420x350.jpg";
import bottomImage from "../../assets/new-images/Slider1/12.jpg";
import { Leaf, Scale, Sprout, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UrbanFarmingIntro = () => {

  const { t } = useTranslation();

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* Left Side - Images */}
        <div className="relative flex flex-col gap-4 sm:gap-6">
          <div className="overflow-hidden rounded-xl shadow-md">
            <img
              src={topImage}
              alt="Farm top"
              className="rounded-xl object-cover w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[300px]"
            />
          </div>

          <div className="relative w-full sm:w-[90%] md:w-[95%] ml-auto overflow-hidden rounded-xl shadow-md">
            <img
              src={bottomImage}
              alt="Farm bottom"
              className="rounded-xl object-cover w-full h-[180px] sm:h-[220px] md:h-[240px]"
            />
          </div>
        </div>

        {/* Right Side - Text */}
        <div>
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-2 text-center lg:text-left">
            {t("welcome_to_ecoflare_solutions")}
          </p>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-primary leading-snug mb-4 text-center lg:text-left">
            {t("where_fresh_produce_meets")} <br /> <span className="text-highlight">{t("smart_technology")}</span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 text-center lg:text-left">
            {t("ecoflare_solutions_is_revolutionizing_the_way_fresh_produce_is_grown_sourced_and_delivered")}
          </p>

          {/* Features */}
          <div className="space-y-5">
            {[
              {
                icon: <Store className="w-5 h-5 sm:w-6 sm:h-6 text-green-700 group-hover:text-secondary" />,
                title: t("direct_farm_access"),
                desc: t("buy_straight_from_local_farmers")
              },
              {
                icon: <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-green-700 group-hover:text-secondary" />,
                title: t("transparent_pricing"),
                desc: t("fair_real_time_prices_with_no_hidden_fees")
              },
              {
                icon: <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-green-700 group-hover:text-secondary" />,
                title: t("guaranteed_freshness"),
                desc: t("pre_order_for_peak_freshness_and_zero_waste")
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group flex items-start bg-white shadow-sm rounded-lg rounded-r-full p-4 md:w-[65%] hover:bg-secondary hover:text-white transition-colors duration-300"
              >
                <div className="bg-green-100 p-2 rounded-full mr-4 group-hover:bg-white">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-primary font-semibold text-base sm:text-lg group-hover:text-white">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm group-hover:text-white">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-6 sm:mt-8 text-center lg:text-left">
            <Link
              to="/about"
              className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-md transition-all inline-block"
            >
              {t("more_about_us")}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default UrbanFarmingIntro;
