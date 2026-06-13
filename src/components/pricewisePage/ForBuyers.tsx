import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Sparkles,
  Shield,
  Eye
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "aos/dist/aos.css";
import AOS from "aos";
import img1 from "../../assets/pricewise/Untitled design (4)/2.png";

const ForBuyers: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true
    });
  }, []);

  const { t } = useTranslation();

  return (
    <section className="py-12   bg-gradient-to-br from-white to-white overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Image Section - Enhanced */}
        <div
          className="w-full lg:w-2/5 relative"
          data-aos="fade-right"
        >
          <div className="relative w-[90%] h-[280px] sm:h-[320px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src={img1}
              alt="Buyers with fresh produce"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              style={{ objectPosition: "50% 35%" }}
              loading="lazy"
            />

            {/* Overlay with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>

            {/* Floating info badge */}
            {/* <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">Live Tracking</span>
            </div> */}
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-200 rounded-full -z-10 opacity-60"
            data-aos="fade" data-aos-delay="400"></div>

          <div className="absolute -top-6 -right-0 w-16 h-16 bg-blue-100 rounded-full -z-10 opacity-40"
            data-aos="fade" data-aos-delay="600"></div>

          {/* Blockchain indicator */}
          <div className="absolute bottom-6 left-6 bg-primary text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <div className="flex space-x-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
              ))}
            </div>
            <span className="text-xs font-medium">Blockchain Secured</span>
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-3/5 " data-aos="fade-left">
          {/* Tagline */}
          <span className="inline-flex items-center gap-2 bg-highlight text-white px-4 py-2 rounded-full mb-5 text-sm font-semibold uppercase tracking-wide">
            <Sparkles className="h-4 w-4" />
            {t("for_buyers_and_retailers")}
          </span>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight mb-5">
            {t("get_farm_fresh_produce")} <br className="hidden sm:block" />
            <span className="text-highlight">{t("with_full_transparency")}</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {t("build_reliable_supply_chains_with_transparent_pricing")}
          </p>

          {/* List Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10 capitalize">
            {[
              {
                title: "Order Your Way",
                desc: "Pre-order in advance or buy on demand",
              },
              {
                title: "Pay for Quality",
                desc: "Only pay for produce that meets your standards",
              },
              {
                title: "Assured Freshness",
                desc: "Every batch is quality-checked and verified",
              },
              {
                title: "Track with Confidence",
                desc: "Monitor every order from field to fork",
              },
            ].map((item, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={100 + index * 100}
                className="group flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-blue-50 
       hover:bg-secondary hover:text-white hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="bg-green-100 p-2 rounded-full flex-shrink-0 group-hover:bg-white transition-colors duration-300">
                  <Check className="h-5 w-5 text-primary group-hover:text-secondary transition-colors duration-300" />
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
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              data-aos="fade-up"
              data-aos-delay="550"
            >
              {t("explore_marketplace")}
              <ArrowRight className="h-5 w-5" />
            </Link>

            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2 sm:mt-0 sm:ml-6">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Blockchain verified transactions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForBuyers;