import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// import image1 from "../../assets/new-images/farm.png";
import image1 from "../../assets/pricewise/Untitled design (4)/1.png";
import {
  ArrowRight,
  Check,
  Sparkles,
  Shield,
  TrendingUp
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "aos/dist/aos.css";
import AOS from "aos";

// ForSellers Component
const ForSellers: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true
    });
  }, []);

  const { t } = useTranslation();

  // const points = [
  //   t("set_your_pricing_tiers"),
  //   t("pre_sell_upcoming_harvests"),
  //   t("pre_sell_future_harvests"),
  //   t("Secure & Transparent Deals "),

  // ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-green-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-around gap-8 lg:gap-12">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 order-2 lg:order-1 px-2" data-aos="fade-right">
          {/* Tagline */}
          <span className="inline-flex items-center gap-2 bg-highlight text-white px-4 py-2 rounded-full mb-5 text-sm font-semibold uppercase tracking-wide">
            <Sparkles className="h-4 w-4" />
            {t("for_producers_sellers")}
          </span>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
            {t("grow_list_and_earn")} <br className="hidden sm:block" />
            <span className="text-green-600">{t("without_middlemen")}</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {t("connect_directly_with_buyers_while_maintaining_pricing_control")}
          </p>

          {/* List Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {[
              {
                title: "Set Your Own Pricing Tiers",
                desc: "Define fair prices based on quality and demand",
              },
              {
                title: "Pre-Sell Your Harvests",
                desc: "Lock in buyers before your crops are picked",
              },
              {
                title: "Secure Future Deals",
                desc: "Ensure stability and guaranteed sales ahead of time",
              },
              {
                title: "Trustworthy & Transparent",
                desc: "Blockchain-backed contracts protect every transaction",
              },
            ].map((item, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={100 + index * 100}
                className="group flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-green-50 
       hover:bg-secondary hover:text-white hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="bg-green-100 p-2 rounded-full flex-shrink-0 group-hover:bg-white transition-colors duration-300">
                  <Check className="h-5 w-5 text-green-600 group-hover:text-secondary transition-colors duration-300" />
                </div>

                {/* Content */}
                <div>
                  <h4 className="text-gray-900 font-semibold group-hover:text-white transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>



          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              to="/seller"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              data-aos="fade-up"
              data-aos-delay="550"
            >
              {t("explore_features")}
              <ArrowRight className="h-5 w-5" />
            </Link>

            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2 sm:mt-0 sm:ml-6">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Direct blockchain transactions</span>
            </div>
          </div>
        </div>

        {/* Image Section - Enhanced */}
        <div
          className="w-full lg:w-[35%] order-1 lg:order-2 relative"
          data-aos="fade-left"
        >
          <div className="relative w-full h-[280px] sm:h-[320px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src={image1}
              alt="Farmer in field"
              className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />

            {/* Overlay with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/10 to-transparent"></div>

            {/* Floating info badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-800">Better Profits</span>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-200 rounded-full -z-10 opacity-60"
            data-aos="fade" data-aos-delay="400"></div>

          <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-100 rounded-full -z-10 opacity-40"
            data-aos="fade" data-aos-delay="600"></div>

          {/* Blockchain indicator */}
          <div className="absolute bottom-6 right-6 bg-green-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <div className="flex space-x-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
              ))}
            </div>
            <span className="text-xs font-medium">No Middlemen</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForSellers;