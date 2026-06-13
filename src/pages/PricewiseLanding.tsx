import React, { useTransition } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import image1 from "../assets/new-images/farm.png";
import ForSellers from "../components/pricewisePage/ForSellers";
import ForBuyers from "../components/pricewisePage/ForBuyers";
import {
  ArrowRight,
  Check,
  Users,
  FileText,
  Truck,
  CreditCard,
  ClipboardList,
} from "lucide-react";

const PricewiseLanding = () => {
  return (
    <div className="font-sans text-gray-900 bg-white overflow-hidden">
      <HeroSection />
      <AgricultureHeroSection />
      <DigitalTradeSlideshow />

      <HorizontalScrollCards />
      <AgricultureServicesSection />
      <ForSellers />

      {/* For Buyers */}
      <ForBuyers />
    </div>
  );
};

// Component 2: Hero Section
import AgricultureHeroSection from "../components/pricewisePage/AgricultureHeroSection";
import AgricultureServicesSection from "../components/pricewisePage/AgricultureServicesSection";
import HeroSection from "../components/pricewisePage/HeroSection";
import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from "react";

// const ForSellers: React.FC = () => {

//   useEffect(() => {
//     AOS.init({
//       duration: 800,
//       easing: "ease-in-out",
//       once: true
//     });
//   }, []);

//   const { t } = useTranslation();

//   const points = [
//     t("set_your_pricing_tiers"),
//     t("pre_sell_upcoming_harvests"),
//     t("pre_sell_future_harvests"),

//   ];

//   return (
//     <section className="py-16 md:py-20 bg-gradient-to-br from-green-50 to-white overflow-hidden">
//       <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">

//         {/* Text Content */}
//         <div className="w-full lg:w-1/2 order-2 lg:order-1 px-4" data-aos="fade-right">
//           {/* Tagline */}
//           <span className="inline-block bg-green-100 text-highlight px-3 py-1 rounded-full mb-4 text-xs font-semibold uppercase tracking-wide">
//             {t("for_producers_sellers")}
//           </span>

//           {/* Heading */}
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-snug mb-4">
//             {t("grow_list_and_earn")} <br /> {t("without_middlemen")}
//           </h2>

//           {/* Description */}
//           <p className="text-base sm:text-lg text-gray-700 mb-6">
//             {t("connect_directly_with_buyers_while_maintaining_pricing_control")}
//           </p>

//           {/* List Points */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
//             {points.map((point, index) => (
//               <div
//                 key={index}
//                 data-aos="fade-up"
//                 data-aos-delay={100 + index * 100}
//                 className="flex items-start gap-3 bg-white border border-transparent hover:border-green-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
//               >
//                 <div className="bg-green-100 p-2 rounded-full">
//                   <Check className="h-4 w-4 text-green-600" />
//                 </div>
//                 <span className="text-primary font-medium text-sm sm:text-base">
//                   {point}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
//             {/* <Link
//               to="/seller-registration"
//               className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-md text-sm sm:text-base transition-all"
//               data-aos="fade-up"
//               data-aos-delay="500"
//             >
//               {t("Explore Features")}
//             </Link> */}
//             {/* <Link
//               to="/seller-features"
//               className="flex items-center text-highlight hover:text-secondary font-medium text-sm sm:text-base"
//               data-aos="fade-up"
//               data-aos-delay="550"
//             >
//               {t("explore_features")} <ArrowRight className="ml-1.5 h-4 w-4" />
//             </Link> */}
//           </div>
//         </div>


//         {/* Image Section */}
//         <div
//           className="w-full lg:w-1/2 order-1 lg:order-2 relative min-h-[200px] sm:min-h-[350px] md:min-h-[400px]"
//           data-aos="fade-left"
//         >
//           <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-lg">
//             <img
//               src={image1}
//               alt="Farmer in field"
//               className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
//             />
//           </div>

//           {/* Decorative blobs */}
//           <div
//             className="absolute hidden md:block -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-2xl -z-10"
//             data-aos="fade"
//             data-aos-delay="400"
//           />
//           <div
//             className="absolute hidden md:block -top-6 -right-6 w-24 h-24 bg-secondary rounded-2xl -z-10"
//             data-aos="fade"
//             data-aos-delay="600"
//           />
//         </div>
//       </div>
//     </section>

//   );
// };






// Component 7: For Buyers

import "aos/dist/aos.css";
import HorizontalScrollCards from "../components/pricewisePage/HorizontalScrollCards";
import DigitalTradeSlideshow from "../components/pricewisePage/DigitalTradeSlideshow";
import { useTranslation } from "react-i18next";

// const ForBuyers: React.FC = () => {

//   const { t } = useTranslation();

//   useEffect(() => {
//     AOS.init({
//       duration: 800,
//       easing: "ease-in-out",
//       once: true
//     });
//   }, []);


//   return (
//     <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
//       <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">

//         {/* Image Section */}
//         <div
//           className="w-full lg:w-1/2 relative max-h-[500px] sm:min-h-[400px]"
//           data-aos="fade-left"
//         >
//           <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-lg max-h-[500px]">
//             <img
//               src="https://img.freepik.com/premium-photo/proud-couple-showing-vegetables-basket_13339-28953.jpg?w=740"
//               alt="Buyers with fresh produce"
//               className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//               style={{
//                 objectPosition: '50% 40%',
//                 maxHeight: '500px',
//               }}
//               loading="lazy"
//             />
//           </div>

//           {/* Decorative blobs */}
//           <div
//             className="absolute hidden md:block -bottom-10 -right-6 w-32 h-32 bg-secondary rounded-2xl -z-10"
//             data-aos="fade"
//             data-aos-delay="400"
//           />
//           <div
//             className="absolute hidden md:block -top-6 -left-6 w-24 h-24 bg-secondary rounded-2xl -z-10"
//             data-aos="fade"
//             data-aos-delay="600"
//           />
//         </div>


//         {/* Text Content */}
//         <div className="w-full lg:w-1/2 px-4" data-aos="fade-right">
//           {/* Tagline */}
//           <span className="inline-block bg-blue-100 text-highlight px-3 py-1 rounded-full mb-4 text-xs font-semibold uppercase tracking-wide">
//             {t("for_buyers_and_retailers")}
//           </span>

//           {/* Heading */}
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-snug mb-4">
//             {t("get_farm_fresh_produce")} <br /> {t("with_full_transparency")}
//           </h2>

//           {/* Description */}
//           <p className="text-base sm:text-lg text-gray-700 mb-6">
//             {t("build_reliable_supply_chains_with_transparent_pricing")}
//           </p>

//           {/* List Points */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
//             {[
//               t("order_in_advance_or_on_demand"),
//               t("pay_based_on_quality_delievered"),
//               t("quality_assurance"),
//               t("track_every_order_from_field_to_fork")
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 data-aos="fade-up"
//                 data-aos-delay={100 + index * 100}
//                 className="flex items-start gap-3 bg-white border border-transparent hover:border-blue-100 p-1 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
//               >
//                 <div className="bg-blue-100 p-2 rounded-full">
//                   <Check className="h-4 w-4 text-primary" />
//                 </div>
//                 <span className="text-primary font-medium text-sm">
//                   {item}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
//             {/* <Link
//               to="/buyer-registration"
//               className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-md text-sm sm:text-base transition-all"
//               data-aos="fade-up"
//               data-aos-delay="500"
//             >
//               {t("start_buying")}
//             </Link> */}
//             <Link
//               to="/marketplace" 
//               className="flex items-center text-highlight hover:text-secondary font-medium text-sm sm:text-base"
//               data-aos="fade-up"
//               data-aos-delay="550"
//             >
//               {t("explore_marketplace")}
//               <ArrowRight className="ml-1.5 h-4 w-4" />
//             </Link>
//           </div>
//         </div>

//       </div>
//     </section>

//   );
// };




export default PricewiseLanding;