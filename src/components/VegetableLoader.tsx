import React from "react";
import { motion } from "framer-motion";
import pricewise from "../assets/images/logo.png";


const VegetableLoader = () => {
  return (
    
    <div className="flex items-center justify-center h-screen bg-white flex-col">
      <div className="text-6xl animate-bounce"><img className="w-16 h-16 md:w-32 md:h-32" src={pricewise} alt="Pricewise Logo" /></div>
      <p className="mt-4 text-gray-600 text-lg animate-pulse">Loading freshness...</p>
    </div>
  );
};

export default VegetableLoader;
