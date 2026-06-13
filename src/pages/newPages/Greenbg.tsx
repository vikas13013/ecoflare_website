import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star } from "lucide-react";
import { useState } from "react";
import imageSrc from "../../assets/images/man-holding-box-vegetables-with-smile-his-face 1.png";
import ServicesSection from "./ServicesSection";


interface BannerProps {
  imageSrc: string;
  title: string;
  subtitle?: string;
  buttonText: string;
}

const greenbg = ({  }: BannerProps) => {

 

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
        className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-800  w-full overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        

        <div className="flex flex-col md:flex-row items-center justify-between mx-auto px-2   gap-4 relative z-10">
          

          <ServicesSection/>
        </div>
      </motion.div>
    </div>
  );
};

export default greenbg;