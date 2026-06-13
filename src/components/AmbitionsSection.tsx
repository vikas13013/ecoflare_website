import { FC } from "react";
import {
  Leaf,
  Sprout,
  ShoppingBasket,
  Package,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import mission from "../assets/new-images/mission.png";
import vission from "../assets/new-images/2nd Slider Images/2.jpg";
import { useTranslation } from "react-i18next";



const Ambitions: FC = () => {

  const { t } = useTranslation();

  const ambitions = [
    {
      title: t("our_vision"),
      icon: <Leaf className="w-6 h-6 text-green-600 group-hover:text-secondary" />,
      description: t("our_vision_is_to_transform_the_fresh_produce_market_into_a_transparent"),
    },
    {
      title: t("our_mission"),
      icon: <Sprout className="w-6 h-6 text-green-600 group-hover:text-secondary" />,
      description: t("ecoflare_mission_is_to_connect_famers_directly_with_consumers_and_business"),
      tags: (
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center bg-green-50 px-2 py-2 rounded-full">
            <ShoppingBasket className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-[12px] font-medium">{t("empowering_famers")}</span>
          </div>
          <div className="flex items-center bg-green-50 px-2 py-2 rounded-full">
            <Package className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-[12px] font-medium">{t("engaging_buyers")}</span>
          </div>
          <div className="flex items-center bg-green-50 px-2 py-2 rounded-full">
            <Truck className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-[12px] font-medium">{t("enabling_growth")}</span>
          </div>
        </div>
      ),
    },
  ];


  return (
    <section className="bg-[#f4f9f7] w-full py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left Column: Text Cards */}
          <div className="flex flex-col justify-center gap-8 md:gap-20 h-full ">
            {ambitions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group bg-white p-6 md:pl-12 rounded-3xl md:rounded-l-full shadow-lg flex flex-col sm:flex-row items-start gap-4 hover:shadow-xl transition-all duration-300 hover:bg-secondary"
              >
                <div className="bg-green-100 p-3 rounded-full flex-shrink-0 group-hover:bg-white">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl  font-semibold text-green-700 mb-3 group-hover:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-800 md:text-lg leading-relaxed group-hover:text-white">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Images */}
          <div className="flex flex-col justify-start gap-8 h-full">
            {/* Image 1 */}
            <motion.div
              initial={{ x: -20 }}
              animate={{
                x: 20,
                transition: {
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }}
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden rounded-xl shadow-lg"
            >
              <motion.img
                src={mission}
                alt="Mission"
                className="object-cover w-full h-72 object-top hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            {/* Image 2 */}
            <motion.div
              initial={{ x: 20 }}
              animate={{
                x: -20,
                transition: {
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }}
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden rounded-xl shadow-lg"
            >
              <motion.img
                src={vission}
                alt="Vision"
                className="object-cover w-full h-72 hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default Ambitions;
