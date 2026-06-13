import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBranch } from '../features/auth/authThunk';
import { RootState, AppDispatch } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import {
  Home,
  ShoppingCart,
  Users,
  Package,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import bannerImg from "../assets/new-images/Page Header Banner/Buyer Seller Page.jpg";
import WhySellersLoveUs from "../components/WhySellersLoveUs";
import SellerCardsSection from "../components/pricewisePage/SellerCardsSection";
import { useTranslation } from 'react-i18next';
import SellerAction from '../Dashboard/seller/components/SellerAction';
import {fetchVerifyRoles} from "../features/roles/verifyRoleThunk";
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';

const SellerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

    const { data, loading, error } = useAppSelector((state) => state.roles);

  const branches = useSelector((state: RootState) => {
    const value = state.auth.branches?.data;
    return Array.isArray(value) ? value : [];
  });
  console.log(branches);
  const hasBranches = branches.length > 0;

  const { t } = useTranslation()


  useEffect(() => {
    const fetchBranches = async () => {
      try {
        await dispatch(getUserBranch()).unwrap();
        dispatch(fetchVerifyRoles());
      } catch (error) {
        // toast.error('Failed to load branches');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranches();
  }, [dispatch]);
  return (
    <div className="text-gray-800 font-sans">
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center bg-no-repeat h-96 flex items-center"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${bannerImg})` }}
      >
        <div className="container md:mr-auto  max-w-6xl px-6 text-center text-white">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Link to="/" className="text-white hover:text-yellow-300 transition-colors">
              <Home className="w-6 h-6" />
            </Link>
            <span className="text-lg">/ {t("for_sellers")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            {t("sell_direct_earn_more_waste_lesss")}
          </h1>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8">
            {t("connect_directly_with_verified_buyers")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* <button className="bg-yellow-500 hover:bg-yellow-600 text-primary font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
              <Link to={hasBranches ? "/branches" : "/register/seller"}>
                {hasBranches ? t("manage_your_branches") : t("become_a_seller")}
                {hasBranches ? t("become_a_seller") : t("become_a_seller")}
              </Link>
            </button> */}
            <SellerAction data={data} />
          </div>
        </div>
      </section>



      {/* Value Proposition */}
      <SellerCardsSection />

      <WhySellersLoveUs />

      {/* How It Works */}
      <section className="py-12 bg-primary lg:h-64 relative overflow-visible md:mb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              {t("how_selling_on_ecoflare_works")}
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              {t("a_seamless_process_from_farm_to_your_business_in_just_a_few_simple_steps")}
            </p>
          </motion.div>

          {/* Floating Boxes */}
          <div
            className={`
        w-full max-w-6xl mx-auto px-4
        mt-12
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6
        relative
        lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-bottom-44
      `}
          >
            <Box icon={<Users size={28} />} title={t("create_your_seller_profile")} />
            <Box icon={<ShoppingBag size={28} />} title={t("list_your_produce")} />
            <Box icon={<ShoppingCart size={28} />} title={t("receive_offers")} />
            <Box icon={<Package size={28} />} title={t("confirm_and_ship")} />
            <Box icon={<Truck size={28} />} title={t("get_paid_fast")} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary text-white rounded-b-[10%] md:rounded-b-full mb-5">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-snug">
            {t("ready_to_boost_your_farming_sales")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-4xl mx-auto px-2">
            {t("join_thousands_of_farmers_who_are_getting_better_prices_and_reducing_waster_through_direct_sales")}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <Link to="/register/seller" className="bg-white hover:bg-gray-100 text-green-800 font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-full transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base">
              {t("receive_produce_requests")}
            </Link>
            <Link to="/register/seller" className="bg-transparent hover:bg-green-800 text-white font-semibold py-3 sm:py-4 px-8 sm:px-10 border-2 border-white rounded-full transition-all text-sm sm:text-base">
              {t("become_a_seller")}
            </Link>
          </div>

          <p className="mt-6 text-green-200 text-sm sm:text-base">
            {t("no_upfront_costs_get_your_first_sale_in_days")}
          </p>
        </div>
      </section>
    </div>
  );
};
// Component for Steps

const Box = ({ icon, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    whileHover={{ scale: 1.05 }}
    className="group bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center gap-4 hover:shadow-xl transition-all duration-300 border border-green-100 hover:bg-secondary hover:text-white"
  >
    <div className="text-green-600 bg-green-100 p-2 rounded-full group-hover:bg-white group-hover:text-secondary transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-md font-semibold text-gray-800 text-center group-hover:text-white transition-colors duration-300">
      {title}
    </h3>
  </motion.div>
);

export default SellerPage;