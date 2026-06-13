import { motion } from "framer-motion";
import { Leaf, DollarSign, ShieldCheck, Globe } from "lucide-react";
import img1 from "../../assets/new-images/farm2.png";
import { useTranslation } from "react-i18next";

export default function WhyChooseUs() {

  const { t } = useTranslation();

  const benefits = [
    {
      title: t("farm_fresh_produce"),
      description: t("enjoy_produce_picked_at_peak_freshness"),
      icon: <Leaf className="w-8 h-8 text-secondary font-extrabold" />,
    },
    {
      title: t("fair_prices"),
      description: t("our_transparent_pricing_model_cuts_out_intermediaries"),
      icon: <DollarSign className="w-8 h-8 text-secondary font-extrabold" />,
    },
    {
      title: t("quality_guaranteed"),
      description: t("every_product_is_verified_though_our_quality_checks"),
      icon: <ShieldCheck className="w-8 h-8 text-secondary font-extrabold" />,
    },
    {
      title: t("sustainable_impact"),
      description: t("support_eco_friendly_farming_pratices_that_reduce_environmental"),
      icon: <Globe className="w-8 h-8 text-secondary font-extrabold" />,
    },
  ];

  return (
    <section className="py-16 md:pb-28 md:pt-16 bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-snug mb-6 sm:mb-24 text-center "
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t("why_choose")} <span className="text-highlight">{t("us?")}</span>
        </motion.h2>


        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
          {/* Left Features */}
          <div className="flex flex-col gap-10 w-full md:w-1/4 text-left">
            {benefits.slice(0, 2).map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-4 border-b-2 border-secondary pb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                <div>{item.icon}</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center Image */}
          <div className="relative w-[200px] sm:w-[300px] h-[230px] sm:h-[340px] flex-shrink-0 mx-auto md:mx-0">
            <motion.div
              className="absolute -top-10 -left-12 sm:-top-24 sm:-left-24 w-[300px] h-[320px] sm:w-[500px] sm:h-[540px] rounded-full bg-yellow-400 opacity-70 scale-125"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.img
              src={img1}
              alt="Happy Farmer"
              className="rounded-lg z-10 relative w-full h-full object-cover shadow-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
            {/* <motion.div
              className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-secondary hidden md:block text-white px-5 py-3 sm:px-6 sm:py-4 text-center font-bold text-sm sm:text-lg rounded-full shadow-lg z-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              50+ <br />
              <span className="text-xs sm:text-sm font-medium">
                Trusted Clients
              </span>
            </motion.div> */}
          </div>

          {/* Right Features */}
          <div className="flex flex-col gap-10 w-full md:w-1/4 text-left">
            {benefits.slice(2).map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-4 border-b-2 border-secondary pb-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                <div>{item.icon}</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
