import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import bannerImg from "../assets/slider-images/our Solutions.jpg";
import { blogData } from '../data/blogData';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import HeroSection from '../components/sidebar-pages/HeroSection';
import Sidebar from '../components/sidebar-pages/Sidebar';
import { useTranslation } from 'react-i18next';

const BlogPage = () => {

  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const postsPerPage = 4;

  // Calculate current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogData.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogData.length / postsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <HeroSection
        bannerImg={bannerImg}
        title={t("ecoflare_insights")}
        subtitle={t("discover_sustainable_living_tips_and_organic")}
      />

      {/* Main Content */}
      <div className="relative mx-auto px-4 py-12">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-12 right-4 z-50 bg-green-800 text-white p-2 rounded-md shadow-lg hover:bg-green-700 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          {/* Sidebar - Animated */}
          <AnimatePresence>
            {sidebarOpen && <Sidebar />}
          </AnimatePresence>

          {/* Blog Posts */}
          <main className={`w-full transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : 'ml-0'}`}>
            <div className="mb-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 leading-snug">
                {t("latest")} <span className="text-highlight">{t("articles")}</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                {t("discover_our_newest_content_on_sustainable_living")}
              </p>
            </div>


            {/* Grid layout for blog cards */}
            <div className="space-y-6 px-4 sm:px-8 md:px-12 lg:px-20">
              {currentPosts.map((post) => (
                <motion.article
                  key={post.id}
                  className="flex flex-col md:flex-row group items-start md:items-center gap-4 md:gap-6 bg-white border-t-4 hover:border-secondary rounded-xl p-4 md:p-6 hover:shadow-md transition-all"
                  whileHover={{ y: -3 }}
                >
                  {/* Image */}
                  <Link to={`/blog/${post.id}`} className="flex-shrink-0">
                    <img
                      src={post.image}
                      alt={t(post.title)}
                      className="w-full md:w-52 h-40 md:h-32 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Middle Content */}
                  <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full">
                    {/* Date Box */}
                    <div className="bg-green-900 group-hover:bg-secondary text-white text-center px-6 py-6 md:py-8 rounded-xl min-w-[160px] max-w-[160px]">
                      <p className="text-xl md:text-2xl font-bold">{post.date.split(" ")[0]}</p>
                      <p className="uppercase text-xs md:text-sm tracking-widest">
                        {post.date.split(" ")[1]} {post.date.split(" ")[2]}
                      </p>
                    </div>

                    {/* Category + Title */}
                    <div className="flex-1">
                      <p className="text-xs md:text-sm uppercase text-gray-500 mb-1">
                        {t(post.description)}
                      </p>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 leading-snug">
                        <Link
                          to={`/blog/${post.id}`}
                          className="hover:text-green-700 transition"
                        >
                          {t(post.title)}
                        </Link>
                      </h3>
                    </div>
                  </div>

                  {/* Arrow Button */}
                  <Link
                    to={`/blog/${post.id}`}
                    className="self-end md:self-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-900 group-hover:bg-secondary flex items-center justify-center text-white hover:bg-green-700 transition"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </Link>
                </motion.article>
              ))}
            </div>



            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full text-sm font-medium ${currentPage === i + 1
                      ? 'bg-green-800 text-white'
                      : 'bg-yellow-200 text-black hover:bg-yellow-300'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {t("next_page")}
                </button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;