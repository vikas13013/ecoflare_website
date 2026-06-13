import React, { useState, useEffect } from 'react';
import img1 from '../../assets/EcoFlare Solutions/1.jpg';
import img2 from '../../assets/EcoFlare Solutions/2.jpg';
import img3 from '../../assets/EcoFlare Solutions/3.jpg';
import img5 from '../../assets/EcoFlare Solutions/6.jpg';
import img6 from '../../assets/EcoFlare Solutions/7.jpg';
import img7 from '../../assets/EcoFlare Solutions/8.jpg';
import img8 from '../../assets/EcoFlare Solutions/9.jpg';
import img9 from '../../assets/EcoFlare Solutions/10.jpg';
import img10 from '../../assets/EcoFlare Solutions/11.jpg';

import img15 from '../../assets/EcoFlare Solutions/16.jpg';

// import img22 from '../../assets/EcoFlare Solutions/23.jpg';
import YouTubeGallery from './YouTubeGallery';

interface GalleryItem {
  title: string;
  imageUrl: string;
}

const galleryItems: GalleryItem[] = [
  { title: 'Tea tasting', imageUrl: img1 },
  { title: 'Plethora of books', imageUrl: img2 },
  { title: 'Chrysanthemum farm', imageUrl: img3 },
  { title: 'Performances', imageUrl: img5 },
  { title: 'A miniature village', imageUrl: img6 },
  { title: 'Agricultural workshops', imageUrl: img7 },
  { title: 'Agricultural workshops', imageUrl: img8 },
  { title: 'Agricultural workshops', imageUrl: img9 },
  { title: 'Agricultural workshops', imageUrl: img10 },

  { title: 'Agricultural workshops', imageUrl: img15 },

  // { title: 'Agricultural workshops', imageUrl: img22 },
];

const GalleryWithPreview: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'videos'>('gallery');

  const handlePrev = () => {
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  const handleNext = () => {
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex + 1) % galleryItems.length);
    }
  };

  const closeModal = () => {
    setCurrentIndex(null);
  };

  useEffect(() => {
    if (currentIndex !== null) {
      setZoom(true);
      const timer = setTimeout(() => setZoom(false), 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-[#fefefe] py-10 px-4 md:px-16">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 border-l-4 border-primary pl-4">GALLERY</h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-2 px-4 font-medium text-sm md:text-base focus:outline-none ${
            activeTab === 'gallery'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('gallery')}
        >
          Photos
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm md:text-base focus:outline-none ${
            activeTab === 'videos'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'gallery' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className="relative overflow-hidden shadow-md rounded-md cursor-pointer group"
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-72 object-cover transform group-hover:scale-105 transition duration-300"
                />
                {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3 text-sm font-medium">
                  {item.title}
                </div> */}
              </div>
            ))}
          </div>

          {/* Preview Modal */}
          {currentIndex !== null && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
              <button 
                onClick={handlePrev} 
                className="absolute left-4 text-white text-3xl bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
              >
                &#8592;
              </button>

              <div
                className={`relative bg-white rounded-lg overflow-hidden max-w-3xl w-full transition-transform duration-300 ${
                  zoom ? 'scale-95' : 'scale-100'
                }`}
              >
                <img
                  src={galleryItems[currentIndex].imageUrl}
                  alt={galleryItems[currentIndex].title}
                  className="w-full object-contain max-h-[80vh]"
                />
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-800 transition"
                >
                  &times;
                </button>
              </div>

              <button 
                onClick={handleNext} 
                className="absolute right-4 text-white text-3xl bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
              >
                &#8594;
              </button>
            </div>
          )}
        </>
      ) : (
        <YouTubeGallery />
      )}
    </div>
  );
};

export default GalleryWithPreview;