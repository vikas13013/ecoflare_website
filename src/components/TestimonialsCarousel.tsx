import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { Quote, Star, CalendarDays, User } from "lucide-react";
import Banner from "./Banner";
import VeggieMan from "../assets/images/man-holding-box-vegetables-with-smile-his-face 1.png";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  date: string;
  image: string;
  rating: number;
}

const TestimonialsCarousel = () => {
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Restaurant Owner',
      text: 'EcoFlare has transformed how we source our produce. The quality is consistently excellent and the transparent pricing helps us manage costs effectively.',
      date: '18 Nov 2024',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5
    },
    {
      name: 'John Doe',
      role: 'Farmer',
      text: 'EcoFlare has been a game-changer for my family business. The transparency and trustworthiness of the platform have made a huge  in our supply chain.',
      date: '12 Dec 2024',
      image: 'https://randomuser.me/api/portraits/men/78.jpg',
      rating: 4
    },
    {
      name: 'Emily Smith',
      role: 'Buyer',
      text: 'EcoFlare has been a game-changer for our family business. The transparency and trustworthiness of the platform have made a huge  in our supply chain.',
      date: '10 Jan 2025',
      image: 'https://randomuser.me/api/portraits/women/79.jpg',
      rating: 5
    },

    
  ];

  return (
    <section className="pt-8   bg-gradient-to-b from-white to-gray-50">
      {/* Hero Banner */}
      <div className="container mx-auto px-4 ">
        <Banner
          imageSrc={VeggieMan}
          title="Fresh Produce, Direct From Farm To Your Table"
          subtitle="Connecting local farmers with businesses for sustainable, transparent food sourcing"
          buttonText="Explore Marketplace"
        />
      </div>

      {/* Testimonial Section */}
      <div className="container mx-auto px-4">
        {/* <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-green-700 text-sm font-medium bg-green-100 px-4 py-2 rounded-full mb-4 shadow-sm"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            <Quote className="w-4 h-4 inline mr-1" />
            Customer Voices
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Trusted by <span className="text-green-700">Farmers & Buyers</span> Worldwide
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Hear from our community about their experiences with EcoFlare's transparent marketplace
          </p>
        </motion.div> */}

        {/* Swiper Slider */}
        {/* <motion.div
          className="px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={1000}
            pagination={{ clickable: true }}
            breakpoints={{
              1024: { slidesPerView: 3 },
              768: { slidesPerView: 2 },
              640: { slidesPerView: 1.5 },
              0: { slidesPerView: 1 },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all h-full flex flex-col"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex-grow">
                    <div className="flex items-center mb-4">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>

                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 mb-6 italic relative pl-4">
                      <Quote className="absolute -left-1 top-0 w-4 h-4 text-green-600 opacity-20" />
                      {testimonial.text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      {testimonial.date}
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div> */}
      </div>
    </section>
  );
};

export default TestimonialsCarousel ;