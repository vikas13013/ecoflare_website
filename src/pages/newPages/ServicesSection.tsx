import React from "react";
import {
  Leaf,
  ShoppingCart,
  Wheat,
  Tractor,
  Factory,
  Handshake,
  ArrowRight,
  Shield,
} from "lucide-react";
import farmerImg1 from "../../assets/new-images/farmer-5.jpg";
import farmerImg2 from "../../assets/new-images/farmer-2.jpg";
import farmerImg3 from "../../assets/new-images/project-4-420x350.jpg";
import { useState } from "react";

const services = [
  {
    title: "B2B Marketplace",
    icon: <Handshake className="w-6 h-6 md:w-10 md:h-10 text-secondary" />,
    description:
      "Connect directly with farmers for bulk purchasing. Our platform ensures fair pricing, quality assurance, and streamlined logistics.",
    ctaText: "Explore Marketplace",
    ctaLink: "/marketplace",
    image: farmerImg1,
  },
  {
    title: "B2C Platform",
    icon: <ShoppingCart className="w-6 h-6 md:w-10 md:h-10 text-secondary" />,
    description:
      "Shop farm-fresh produce with complete transparency. Know exactly where your food comes from and support local agriculture.",
    ctaText: "Shop Fresh Produce",
    ctaLink: "/shop",
    image: farmerImg2,
  },
  {
    title: "Smart Contracts",
    icon: <Shield className="w-6 h-6 md:w-10 md:h-10 text-secondary" />,
    description:
      "Secure, automated agreements that protect both buyers and farmers. Payments are released only when quality standards are met.",
    ctaText: "Learn How It Works",
    ctaLink: "/pricewise",
    image: farmerImg3,
  },
];

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="relative py-12 w-full overflow-hidden">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <p className="text-2xl text-primary font-semibold tracking-widest mb-2">
          OUR SOLUTIONS
        </p>
        <h2 className="text-xl md:text-5xl mb-4 font-bold text-primary">
          Empowering <span className="text-yellow-300">Farm-to-Business</span> Connections
        </h2>
        <p className="text-primary text-xl max-w-2xl mx-auto">
          Innovative services designed to bridge the gap between farmers and buyers with transparency and efficiency
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative flex flex-col items-start gap-3 border-b border-gray-200 pb-6 group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-secondary hover:text-white"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center w-full justify-between">
              <div className="p-2 bg-gray-100 rounded-full group-hover:bg-white transition-colors duration-300">
                {React.cloneElement(service.icon, { className: "w-6 h-6 md:w-10 md:h-10 text-secondary group-hover:text-secondary transition-colors duration-300" })}
              </div>
              <h4 className="text-lg md:text-xl font-bold text-[#537C38] group-hover:text-white transition-colors duration-300">
                {service.title}
              </h4>
            </div>
            <p className="text-gray-600 text-lg group-hover:text-white transition-colors duration-300">
              {service.description}
            </p>
            <a
              href={service.ctaLink}
              className="flex items-center text-primary font-medium text-sm group-hover:text-white group-hover:underline mt-2 transition-colors duration-300"
            >
              {service.ctaText}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
            </a>
          </div>
        ))}
      </div>

      {/* Optional Background Illustration */}
      <div className="absolute left-0 bottom-0 opacity-10 z-0">
        {/* Background SVGs if needed */}
      </div>
    </section>
  );
}