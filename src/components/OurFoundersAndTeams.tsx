import React from 'react';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Dummy Images (Replace with your own image URLs)
import Profile1 from '../assets/images/founders/mohhmad-baseem.png';
import Profile2 from '../assets/images/founders/kamran-ahmad.png';
import Profile3 from '../assets/images/founders/seema.png';
import Profile4 from '../assets/images/founders/Kushwant singh.png';
import Profile5 from '../assets/images/founders/Naqi Abbas.png';

const teamMembers = [
  { name: '  Mohammad Waseem ', role: 'CEO', image: Profile1 },
  { name: 'Kamran Ahmad', role: 'Business Services Manager', image: Profile2 },
  { name: '  Seema Kalpathy–', role: 'Finance Manager', image: Profile3 },
  { name: ' Kushwant Singh', role: 'Sales Manager', image: Profile4 },
  { name: ' Naqi Abbas ', role: 'Customer Relationship Manager', image: Profile5 },
];

const OurFoundersAndTeams = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Our <span className="text-green-800">Founders And Team</span>
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Meet the passionate team driving our mission to revolutionize agriculture
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center max-w-6xl mx-auto">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="relative group"
          >
            <div className="bg-white border-2 border-green-700 rounded-t-full rounded-b-2xl px-6 py-2 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-full flex flex-col items-center group-hover:bg-[#F8FAF5]">
              {/* Profile Image with floating effect */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 mx-auto mb-2 rounded-full overflow-hidden bg-gray-200 border-2 border-green-800 group-hover:border-green-800/30 transition-all duration-300 relative z-10"
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-green-800/0 group-hover:bg-green-800/10 transition-all duration-300" />
              </motion.div>

              {/* Profile Info */}
              <div className="text-center flex-grow">
                <h3 className="font-bold text-lg text-gray-800 capitalize ">
                  {member.name}
                </h3>
                <p className="text-green-800 font-medium text-sm  px-2 py-1  rounded-full inline-block">
                  {member.role}
                </p>
              </div>

              {/* Icons with hover effects */}
              <div className="flex justify-center gap-4 ">
                {/* <motion.a 
                  href="#"
                  whileHover={{ scale: 1.1, backgroundColor: "#73AA4C", color: "white" }}
                  className="border-2 border-green-800 rounded-full p-2 text-green-800 text-base w-10 h-10 flex items-center justify-center transition-colors duration-300 hover:bg-green-800 hover:text-white"
                >
                  <FaPhoneAlt />
                </motion.a> */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, backgroundColor: "#73AA4C", color: "white" }}
                  className="border-2 border-green-800 rounded-full p-2 text-green-800 text-base w-10 h-10 flex items-center justify-center transition-colors duration-300 hover:bg-green-800 hover:text-white"
                >
                  <FaEnvelope />
                </motion.a>
              </div>
            </div>

            {/* Floating leaves decoration on hover */}
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-green-800 opacity-20"
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
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-16"
      >
        {/* <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#5a8c3a" }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-800 text-white px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
        >
          View Full Team
        </motion.button> */}
      </motion.div>
    </div>
  );
};

export default OurFoundersAndTeams;