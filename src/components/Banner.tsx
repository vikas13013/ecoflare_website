import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star } from "lucide-react";
import { useState } from "react";

interface BannerProps {
  imageSrc: string;
  title: string;
  subtitle?: string;
  buttonText: string;
}

const Banner = ({ imageSrc, title, subtitle, buttonText }: BannerProps) => {
  const [showPopup, setShowPopup] = useState(false);

 

  return (
    <div className="relative">
      {/* Floating leaves decoration */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-500 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10],
              x: [0, Math.random() * 20 - 10],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            🍃
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-800 rounded-3xl w-full overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        

        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-8 py-12 md:py-16 gap-8 relative z-10">
          <motion.div
            className="w-full md:w-2/5 flex justify-center relative"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <img
              src={imageSrc}
              alt="Happy farmer with vegetables"
              className="w-72 md:w-96 drop-shadow-2xl relative z-10"
            />
          </motion.div>

          <div className="w-full md:w-3/5 text-center md:text-left text-white space-y-6">
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h2>

            {subtitle && (
              <motion.p
                className="text-lg md:text-xl opacity-90 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
            )}

            {/* Marketplace and Pricewise Sections */}
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-start gap-8 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {/* Marketplace Section */}
              <div className="flex-1 space-y-4 text-left">
                <h3 className="text-2xl font-bold text-yellow-400">Explore Marketplace</h3>
                <ul className="list-disc list-inside text-white/90 space-y-1">
                  <li>Buy fresh produce directly from farmers</li>
                  <li>Wide variety of organic and seasonal items</li>
                  <li>Verified sellers and transparent sourcing</li>
                </ul>
                <motion.button
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-semibold"
                  whileHover={{ y: -3 }}
                >
                  <Link to="/marketplace">Visit Marketplace</Link>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Divider Line */}
              <div className="w-px h-40 bg-white/30 hidden md:block" />

              {/* Pricewise Section */}
              <div className="flex-1 space-y-4 text-left">
                <h3 className="text-2xl font-bold text-yellow-400">Explore Pricewise</h3>
                <ul className="list-disc list-inside text-white/90 space-y-1">
                  <li>Compare prices across multiple vendors</li>
                  <li>Find the best deals on your favorite products</li>
                  <li>Save more with real-time market trends</li>
                </ul>
                <motion.button
                  
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-semibold"
                  whileHover={{ y: -3 }}
                >
                  <Link to="/pricewise">Visit Pricewise</Link>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* <motion.div
              className="flex flex-wrap gap-4 justify-center md:justify-center mt-8 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="flex -space-x-2 md:-ml-24 mr-3">
                  {[...Array(3)].map((_, i) => (
                    <img
                      key={i}
                      src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`}
                      alt="Happy customer"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm">500+ Happy Customers</span>
              </div>

              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 mr-2" />
                <span className="text-sm">4.9/5 (1200+ Reviews)</span>
              </div>
            </motion.div> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Banner;