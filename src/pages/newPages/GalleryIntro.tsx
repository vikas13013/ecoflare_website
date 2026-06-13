// src/pages/GalleryIntro.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import img5 from '../../assets/new-images/slider1/7.jpg';
import img6 from '../../assets/new-images/slider1/9.jpg';
import { useTranslation } from "react-i18next";

const GalleryIntro = () => {

  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <div className="py-20 flex flex-col items-center justify-center px-4 text-center  relative overflow-hidden">
      {/* Decorative elements */}
      {/* <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-xl"></div> */}
      {/* <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-secondary/10 blur-xl"></div> */}

      {/* Content container */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600">
            {t("explore_our_visual_story")}
          </span>
        </h1>

        <p className="text-gray-600 text-md md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
          {t("a_journey_from_canadian_farms_to_your_fork_step_into_the_world")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/gallery')}
            className="relative overflow-hidden group bg-gradient-to-r from-primary to-green-600 text-white px-8 py-4 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="relative z-10">{t("view_photo_gallery")}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>

          {/* <button
            onClick={() => navigate('/events')}
            className="relative overflow-hidden group border-2 border-primary text-primary px-8 py-4 rounded-lg text-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="relative z-10">{t("upcoming_events")}</span>
            <span className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button> */}
        </div>

        {/* Stats or highlights */}
        {/* <div className="mt-12 flex flex-wrap justify-center gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-primary">100+</div>
            <div className="text-gray-600">Events</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-primary">5K+</div>
            <div className="text-gray-600">Photos</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-primary">50+</div>
            <div className="text-gray-600">Workshops</div>
          </div>
        </div> */}
      </div>

      {/* Floating preview images */}
      <div className="hidden md:flex absolute -right-20 top-1/4 rotate-12 w-40 h-56 rounded-xl shadow-2xl overflow-hidden border-4 border-white">
        <img src={img5} alt="Preview" className="w-full h-full object-cover" />
      </div>
      <div className="hidden md:flex absolute -left-20 bottom-1/4 -rotate-12 w-40 h-56 rounded-xl shadow-2xl overflow-hidden border-4 border-white">
        <img src={img6} alt="Preview" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default GalleryIntro;