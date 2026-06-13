import React from "react";
import { Plus, Mail } from "lucide-react";
import Profile1 from '../../assets/images/founders/mohhmad-baseem.png';
import Profile2 from '../../assets/images/founders/kamran-ahmad.png';
import Profile3 from '../../assets/images/founders/maam.png';
import Profile4 from '../../assets/images/founders/Kushwant singh.png';
import Profile5 from '../../assets/images/founders/Naqi Abbas.png';
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  twitter?: string;
}
const TeamSection: React.FC = () => {

  const { t } = useTranslation();

  const teamMembers: TeamMember[] = [
    {
      name: 'Mohammad Waseem',
      role: t("ceo"),
      image: Profile1,
    },
    {
      name: 'Kamran Ahmad',
      role: t("business_services_manager"),
      image: Profile2,
    },
    {
      name: 'Seema ',
      role: t("finance_manager"),
      image: Profile3,
    },
    {
      name: 'Kushwant Singh',
      role: t("sales_manager"),
      image: Profile4,
    },
    {
      name: 'Naqi Abbas',
      role: t("customer_relationship_manager"),
      image: Profile5,
    },
  ];


  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center px-4 mb-10 sm:mb-16"
        >
          {/* Section Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-snug mb-4">
            {t("our")} <span className="text-highlight">{t("leadership_team")},</span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            {t("meet_the_passionate_team_driving_our_mission_to_revolutionize_agriculture")}
          </p>
        </motion.div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl transition duration-300"
            >
              <div className="relative h-70 overflow-hidden">
                {/* Image with hover scale */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top-right Plus Icon */}
                <a
                  href="mailto:info@ecoflaresolutions.com"
                >
                  <div className="absolute bottom-0 right-0 m-2 bg-white rounded-md p-1 shadow-md cursor-pointer hover:bg-gray-100 transition">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                </a>




                {/* Animated borders */}
                <span className="absolute inset-0 border-2 border-primary group-hover:border-transparent transition-all duration-500 ease-in-out pointer-events-none" />
                <span className="absolute top-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out" />
                <span className="absolute bottom-0 right-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-300 ease-in-out" />
                <span className="absolute top-0 left-0 w-0.5 h-full bg-white transform scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300 ease-in-out" />
                <span className="absolute bottom-0 right-0 w-0.5 h-full bg-white transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 ease-in-out" />

                {/* Email hover overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-end pb-5">
                  <a
                    href={`mailto:${member.name.split(' ').join('.').toLowerCase()}@example.com`}
                    className="bg-white p-2 rounded-full hover:bg-blue-50 transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="w-5 h-5 text-gray-600" />
                  </a>
                </div> */}
              </div>

              {/* Text Section */}
              <div className="bg-white p-6 text-center">
                <p className="text-xs uppercase tracking-widest text-gray-900 font-semibold mb-1">
                  {member.role}
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <div className="w-12 h-1 bg-green-500 mx-auto mt-2"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
