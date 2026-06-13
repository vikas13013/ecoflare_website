import React from "react";
import {
  ClipboardList,
  FileText,
  CreditCard,
  Truck,
  Search,
  Handshake,
  FileSignature,
  PackageCheck
} from "lucide-react";
import img1 from "../../assets/new-images/farmer-2.jpg";
import img2 from "../../assets/new-images/project-4-420x350.jpg";
import img3 from "../../assets/new-images/farm.png";
import img4 from "../../assets/new-images/project-6-420x350.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";

AOS.init();

// ... (keep your existing image imports)


export default function HorizontalScrollCards() {

  const { t } = useTranslation();

  const services = [
    {
      title: t("browse_or_list_produce"),
      icon: <Search className="w-6 h-6" />,
      stepIcon: <ClipboardList className="w-8 h-8" />,
      image: img1,
      desc: t("dicover_produce_from_local_farmers_or_list_your_own_crops_for_sale"),
    },
    {
      title: t("accept_or_place_orders"),
      icon: <Handshake className="w-6 h-6" />,
      stepIcon: <FileText className="w-8 h-8" />,
      image: img2,
      desc: t("easily_accept_incoming_orders_or_place_new_ones_with_our_intuitive_platform"),
    },
    {
      title: t("sign_smart_contract"),
      icon: <FileSignature className="w-6 h-6" />,
      stepIcon: <CreditCard className="w-8 h-8" />,
      image: img3,
      desc: t('secure_digital_contracts_with_built_in_trust_and_transparency'),
    },
    {
      title: t("delivery_and_payment"),
      icon: <PackageCheck className="w-6 h-6" />,
      stepIcon: <Truck className="w-8 h-8" />,
      image: img4,
      desc: t("track_deliveries_in_real_time_and_enjoy_sealess_payment_processing"),
    },
  ];


  return (
    <section className="bg-white py-20 overflow-hidden">
      {/* Heading (unchanged) */}
      <div className="text-center  px-4 mb-10 sm:mb-14 overflow-hidden">
        {/* Section Subtitle */}
        <h4
          data-aos="fade-up"
          className="text-highlight text-base sm:text-lg md:text-xl font-semibold mb-2 flex justify-center  items-center gap-2"
        >
          {t("how_it_works")}
        </h4>

        {/* Main Title */}
        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-snug mb-4"
        >
          {t("simple_steps_to_connect")} <br />
          {t("producers_and_buyers")}{" "}
          <span className="underline decoration-highlight">{t("seamlessly")}</span>
        </h2>

        {/* Description */}
        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-base sm:text-lg text-gray-700  mx-auto lg:mx-0"
        >
          {t("agriculture_is_the_backbone_of_our_society_providing_food_raw_materials")}
        </p>
      </div>


      {/* Scrollable Cards */}
      <div className="overflow-x-auto px-6 scrollbar-hide">
        <div className="flex gap-6 w-max mx-auto px-4">
          {services.map((item, index) => (
            <div
              key={index}
              className="group relative flex-shrink-0 min-w-[280px] max-w-[300px] p-6 rounded-xl bg-white text-[#1F4E3D] border border-gray-200 shadow-sm transition-all duration-300 hover:bg-green-900 hover:text-white overflow-hidden"
            >
              {/* Light Background Image */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(2px)",
                  zIndex: 0,
                }}
              />

              {/* Foreground Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-800 group-hover:bg-white group-hover:text-green-800 transition-colors duration-300">
                    {item.stepIcon}
                  </div>
                  <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* <div className="mb-2">{item.icon}</div> */}
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm mt-2 mb-4 opacity-90 group-hover:opacity-90 transition-opacity">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}