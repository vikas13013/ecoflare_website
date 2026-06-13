import React from "react";
import { motion } from "framer-motion";

import {
  Home,
  ShoppingCart,
  Search,
  Users,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import bannerImg from "../assets/new-images/Page Header Banner/buyerheaderimage.jpg";
import WhyBuyerLove from "./newPages/WhyBuyerLove";
import ServiceCardsSection from "../components/pricewisePage/ServiceCardsSection";
import { useTranslation } from "react-i18next";
import {fetchVerifyRoles} from "../features/roles/verifyRoleThunk";
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import BulkBuyerAction from "../Dashboard/buyer/components/BulkBuyerAction";


const About: React.FC = () => {

  const { t } = useTranslation()
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.roles);
  console.log(data, "verify rolls");
  

  React.useEffect(() => {
    dispatch(fetchVerifyRoles());
  }, [dispatch]);

  return (
    <div className="text-gray-800 font-sans">
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center bg-no-repeat h-96 flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url(${bannerImg})`,
        }}
      >
        <div className="container ml-auto px-6 text-center text-white">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Link to="/" className="text-white hover:text-yellow-300 transition-colors">
              <Home className="w-6 h-6" />
            </Link>
            <span className="text-lg">/ {t('for_buyers')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            {t('revolutionize_your_produce_sourcing')}
          </h1>

          <p className="text-sm xs:text-base sm:text-lg md:text-xl max-w-3xl text-center mx-auto mb-8">
            {t("direct_farm_access_better_pricing_smarter_sustainable_choices")}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* <Link to="/register/bulk-buyer" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
              {t('join_the_marketplace')}
            </Link> */}
            <BulkBuyerAction data={data} />
          </div>
        </div>
      </section>


      <ServiceCardsSection />

      <WhyBuyerLove />




      {/* How It Works */}
      <section className="min-h-[18rem] bg-white relative overflow-visible mb-24">
        {/* Colored inner container */}
        <div className="container mx-auto px-4 sm:px-6 bg-primary relative h-64 rounded-xl flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="px-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-4 leading-snug">
              {t("how_ecoflare_works_for_buyers")}
            </h2>
            <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto">
              {t("a_seamless_process_from_farm_to_your_business_in_just_a_few_simple_steps")}
            </p>
          </motion.div>
        </div>

        {/* Floating steps boxes */}
        <div
          className="
      w-full max-w-6xl mx-auto px-4
      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6
      mt-[-2rem] relative 
      lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-bottom-20
    "
        >
          <Box
            icon={<Users size={28} />}
            title={t("create_your_account")}
            description={t("simple_signup_with_intuitive_onboarding_in_minutes")}
          />
          <Box
            icon={<Search size={28} />}
            title={t("browse_and_compare")}
            description={t("search_product_grade_pricing_and_delivery_timelines_using_advanced_filters")}
          />
          <Box
            icon={<ShoppingCart size={28} />}
            title={t("place_your_order")}
            description={t("select_the_best_deals_with_transparent_terms_and_instant_confirmation")}
          />
          <Box
            icon={<Package size={28} />}
            title={t("track_and_receive")}
            description={t("live_updates_and_on_time_delivery_with_guaranteed_quality_assurance")}
          />
        </div>
      </section>




      {/* CTA Section */}
      <section className="py-16 bg-primary text-white rounded-b-[10%] md:rounded-b-full mb-5">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-snug">
            {t("ready_to_transform_your_produce_sourcing")}
          </h2>
          <p className="text-base sm:text-lg   mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            {t("join_thousands_of_smart_buyers_getting_frsher_produce")}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <Link
              to="/marketplace"
              className="bg-transparent hover:bg-green-800 text-white font-semibold hover:text-white py-3 sm:py-4 px-8 sm:px-10 border-2 border-white rounded-full transition-all text-sm sm:text-base"
            >
              {t("explore_marketplace")}
            </Link>
            <Link
              to="/register/bulk-buyer"
              className="bg-white hover:bg-gray-100 text-green-800 font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-full transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              {t("submit_produce_request")}
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
};



// Component for Steps
const Box = ({ icon, title, description }) => (
  <div className="group bg-white hover:bg-secondary p-6 rounded-xl shadow-md flex flex-col items-center justify-center gap-4 transition-all duration-300">
    <div className="text-green-600 bg-green-100 p-2 rounded-full group-hover:bg-white group-hover:text-secondary transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-md font-semibold text-gray-800 group-hover:text-white transition-colors duration-300">
      {title}
    </h3>
    <p className="text-gray-600 text-[12px] text-center group-hover:text-white transition-colors duration-300">
      {description}
    </p>
  </div>
);


// Component for Feature Cards
const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string
}) => (
  <div className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden">
    {/* Hover background overlay - removed z-index */}
    <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    {/* Content container - removed z-index */}
    <div className="relative">
      <div className="flex items-center mb-4">
        {/* Icon with hover effects */}
        <div className="mr-3 p-2 rounded-lg bg-green-800 group-hover:bg-green-50 transition-colors duration-300">
          {React.cloneElement(icon as React.ReactElement, {
            className: `${(icon as React.ReactElement).props.className} group-hover:text-secondary text-white  transition-colors duration-300`
          })}
        </div>
        {/* Title with hover effect */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
      </div>
      {/* Description with hover effect */}
      <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
        {description}
      </p>
    </div>

    {/* Decorative corner effect on hover */}
    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
    </div>
  </div>
);








export default About;