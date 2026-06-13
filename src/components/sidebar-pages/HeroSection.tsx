import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from 'lucide-react';
import { useTranslation } from "react-i18next";

const HeroSection = ({ bannerImg, title, subtitle }) => {

  const {t} = useTranslation();

  return (
    <section className="relative h-96">
      <div className="absolute inset-0  bg-gradient-to-b from-black/40 to-transparent z-10" />
      <img
        src={bannerImg}
        alt="Blog banner"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <nav className="flex justify-center items-center text-white mb-4 ">
            <Link to="/" className="flex items-center hover:text-primary transition">
              <Home className="w-5 h-5 mr-2" />
              {t("home")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{t("blog")}</span>
          </nav>
          <div className="">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {subtitle}
          </p>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;