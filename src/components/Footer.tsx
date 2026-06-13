import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  ShoppingCart,
  MapPin,
  ChevronRight
} from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import logo2 from '../assets/images/mainlogo.png';
import pricewise from '../assets/images/Pricewise.png';
import { useTranslation } from 'react-i18next';
import DownloadApp from './DownloadApp';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // Show "Coming Soon" message instead of actual subscription
    setIsSubmitting(true);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
      setIsSubmitting(false);
      setEmail('');
    }, 3000);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const marketplaceLinks = [
    { text: t("about"), path: '/about' },
    { text: t("marketplace"), path: '/marketplace' },
    { text: t("pre_order_produce"), path: '/preorderproduce' },
    { text: t("flexible_buying"), path: '/flexiblebuying' },
    { text: t("pricewise"), path: 'https://pricewise.wizdigtech.com/' },
  ];

  return (
    <footer className="bg-white z-10">
      {/* Newsletter Section */}
      <div className="relative bg-primary px-4 sm:px-6 lg:px-8 py-10 overflow-hidden">
        {/* Background Glow Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-300/10 rounded-full blur-3xl animate-pulse"></div>

        <motion.div
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            },
            hidden: { opacity: 0 }
          }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center md:text-left">
            {t("stay_updated_with_ecoflare")}
          </h3>

          {/* Form Section */}
          <motion.div
            className="flex-1 max-w-xl"
            variants={fadeIn}
          >
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                placeholder={t("your_email_address")}
                className="w-full px-6 py-4 rounded-full shadow-inner bg-white text-primary focus:outline-none focus:ring-4 focus:ring-green-300 pr-40"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <motion.button
                type="submit"
                className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("sending...") : t("subscribe")}
              </motion.button>
            </form>
            <p className="text-green-100 text-sm mt-2 text-center md:text-left">
              {t("well_never_share_your_email_with_anyone_else")}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo */}
          <motion.div
            className="flex-1 text-center md:text-left"
            variants={fadeIn}
          >
            <a
              href="https://ecoflare.wizdigtech.com/"
              rel="noopener noreferrer"
            >
              <img
                src={logo2}
                alt="EcoFlare Logo"
                className="w-24 md:w-52 mx-auto md:mx-0 mb-4 md:mb-8"
              />
            </a>

            <a
              href="https://pricewise.wizdigtech.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={pricewise}
                alt="Pricewise Logo"
                className="w-24 md:w-32 mx-auto md:mx-10 mb-4 md:mb-0"
              />
            </a>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-primary mb-4">{t("quick_links")}</h3>
            <ul className="space-y-2">
              {marketplaceLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-green-500" />
                    {link.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-primary mb-4">{t("contact_us")}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-600">EcoFlare Solutions Inc.</p>
                  <p className="text-gray-600">185 The West Mall, Suite 905</p>
                  <p className="text-gray-600">Etobicoke, ON M9C 5L5</p>
                </div>
              </div>
             
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-600" />
                <a href="mailto:info@ecoflaresolutions.com" className="text-gray-600 hover:text-green-600 transition-colors">
                  info@ecoflaresolutions.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-primary mb-4">{t("follow_us")}</h3>
            <div className="flex gap-4 mb-6">
              {[
                { icon: <FaFacebookF className="w-5 h-5" />, color: "bg-blue-600", name: "Facebook", href: "https://www.facebook.com/ecoflareinc" },
                { icon: <FaXTwitter className="w-5 h-5" />, color: "bg-black", name: "Twitter", href: "https://x.com/EcoflareInc" },
                { icon: <FaLinkedinIn className="w-5 h-5" />, color: "bg-blue-700", name: "LinkedIn", href: "https://www.linkedin.com/company/ecoflare-solutions-inc/" },
                { icon: <FaInstagram className="w-5 h-5" />, color: "bg-pink-600", name: "Instagram", href: "https://www.instagram.com/ecoflareinc/" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.name}
                  className={`w-10 h-10 rounded-full ${social.color} flex items-center justify-center text-white hover:opacity-90 transition-opacity`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            {/* App Download Section */}
            <motion.div
              className="md:col-span-2 lg:col-span-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <DownloadApp />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {t('ecoflare_solutions_inc_all_rights_reserved')}
          </p>
        </div>
      </div>

      {/* Coming Soon Popup */}
      {showPopup && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-xl text-center max-w-xs"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon!</h3>
            <p className="text-gray-500 mb-4">Newsletter feature will be available soon.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </footer>
  );
};

export default Footer;