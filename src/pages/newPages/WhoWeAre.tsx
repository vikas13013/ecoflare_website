import React from 'react';
import farmImg from "../../assets/new-images/Slider1/11.jpg";
import { Contrast, Leaf } from 'lucide-react';
import { useTranslation } from "react-i18next";

const WhoWeAre = () => {

  const { t } = useTranslation();

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-10">

        {/* Left Image */}
        <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden shadow-md">
          <img
            src={farmImg}
            alt="Farm field"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 relative px-0 lg:pl-20 flex flex-col justify-between h-auto lg:h-[500px]">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-primary">{t("who_we_are")}</h2>
            <p className="text-gray-700 font-semibold mb-10 text-base sm:text-md">
              {t("ecoflare_solutions_inc_is_committed_to_revolutionizing_the_fresh_produce")}
            </p>
          </div>

          {/* Two Blocks */}
          <div className="flex flex-col md:flex-row gap-6 relative lg:absolute lg:-bottom-10 lg:-left-24">
            {/* Block 1 */}
            <div className="bg-[#F4B942] py-8 px-6 md:px-8 w-full md:w-1/2 shadow-md rounded-lg">
              <div className="mb-4">
                <Leaf className="w-12 h-12 sm:w-16 sm:h-16 text-black" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-black">{t("our_value")}</h3>
              <p className="text-sm sm:text-base text-black">
                {t("to_create_an_equitable_efficient_and_sustainable_marketplace_for_fresh_produce")}
              </p>
            </div>

            {/* Block 2 */}
            <div className="bg-[#4CAF50] py-8 px-6 md:px-8 w-full md:w-1/2 shadow-md rounded-lg">
              <div className="mb-4">
                <Contrast className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">{t("our_commitment")}</h3>
              <p className="text-sm sm:text-base text-white">
                {t("ensuring_fair_prices_and_delivering_fresh_high_quality_produce_to_all")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
