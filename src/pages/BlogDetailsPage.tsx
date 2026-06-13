import React from 'react';
import { Link, useParams } from "react-router-dom";
import { blogData } from '../data/blogData';
import { Calendar, Home, MessageSquare, User, Tag, ChevronRight } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { motion } from 'framer-motion';
import bannerImg from "../assets/slider-images/our Solutions.jpg";
import authorImage from "../assets/images/founders/Kushwant singh.png";
import rct1 from '../assets/new-images/Page Header Banner/About Us.jpg';
import rct2 from '../assets/new-images/Page Header Banner/About Us.jpg';
import rct3 from '../assets/new-images/Page Header Banner/About Us.jpg';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

const BlogDetailsPage = () => {

  const { t, i18n } = useTranslation();

  const { id } = useParams();
  const blogPost = blogData.find((post) => post.id === parseInt(id!));
  console.log(blogPost);


  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-20 max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl mb-4 text-gray-400"
          >
            ❌
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("post_not_found")}</h2>
          <p className="text-gray-600 mb-6">{t("the_blog_post_your_looking_for_doesnt_exist_or_may_have_been_removed")}</p>
          <Link
            to="/blog"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {t("browse_all_posts")}
          </Link>
        </div>
      </div>
    );
  }



  const {
    title = "Untitled Post",
    fullContent = "",
    author = "Kushwant Singh",
    date = "2021-04-25",
    image = "default-image-path.jpg",
    tags = [],
    comments = 0,
    description = ""
  } = blogPost || {};

  const recentlyAdded = [
    { title: 'Curabitur porttitor orci eget neque accumsan.', date: 'Apr 25, 2021', image: rct1 },
    { title: 'Donec mattis arcu faucibus suscipit viverra.', date: 'Apr 25, 2021', image: rct2 },
    { title: 'Quisque posuere tempus rutrum. Integer velit ex.', date: 'Apr 25, 2021', image: rct3 },
  ];




  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };


  // Build translated HTML from post.fullContent (string containing quoted keys like "blog6_p1")
  const translatedHtml = useMemo(() => {
    if (!fullContent) return "";

    // Replace tokens like "blog6_p1" (quoted) with the translation
    // If key missing, show visible fallback so missing keys are easy to spot
    return fullContent.replace(/"([a-zA-Z0-9_]+)"/g, (_, key) => {
      if (i18n.exists(key)) return t(key);
      return `⚠️ Missing: ${key}`;
    });
  }, [fullContent, t, i18n]);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className='mb-10'>
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center bg-no-repeat h-72 md:h-96 flex items-center"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${bannerImg})` }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <nav className="flex items-center justify-center md:justify-start space-x-2 text-white mb-4">
              <Link to="/" className="hover:text-yellow-300 transition-colors flex items-center">
                <Home className="w-4 h-4 mr-1" />
                {t("home")}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/blog" className="hover:text-yellow-300 transition-colors">{t("blog")}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-yellow-300">Post</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{t("blog_details")}</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto md:mx-0">{t("discover_insights_and_stories_about_healthy_living")}</p>
          </motion.div>
        </div>
      </section>

      <div className="container  mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">


        {/* Main Content */}
        <main className="md:col-span-3 space-y-8">
          {/* Blog Content */}
          <motion.article
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <motion.div variants={itemVariants}>
              {image && (
                <div className="overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'default-image-path.jpg';
                    }}
                  />
                </div>
              )}
            </motion.div>

            <div className="p-6 md:p-8">
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {author}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {date}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" /> {comments} {t("comments")}
                </span>
                {tags.length > 0 && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {tags.join(', ')}
                    </span>
                  </>
                )}
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {t(title)}
              </motion.h1>

              {description && (
                <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-6">
                  {t(description)}
                </motion.p>
              )}

              {/* Fixed: Use fullContent instead of content */}
              <motion.div
                variants={itemVariants}
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: translatedHtml }}
              />


              {/* Tags and Share */}
              <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

              </motion.div>
            </div>
          </motion.article>

          {/* Author Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-6"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-100 flex-shrink-0">
              <img
                src={authorImage} // fixed male image ID
                alt={author}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-semibold text-xl mb-1">{author}</h4>
              <p className="text-sm text-gray-600 mb-3">{t("food_blogger_and_nutritionist")}</p>
              <p className="text-gray-700 mb-4">{t("passionate_about_creating_healthy_delicious_recipes_that_nourish")}</p>

            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >

            {/* Comment Form */}
            <h3 className="text-2xl font-semibold mb-6">{t("leave_a_comment")}</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("name")} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder={t("your_name")}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("email")} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder={t("your_email")}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("comment")} *
                </label>
                <textarea
                  id="comment"
                  placeholder={t("your_thoughts")}
                  rows={5}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="save-info"
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="save-info" className="ml-2 text-sm text-gray-600">
                  {t("save_my_name_email_and_website_in_this_browser_for_the_next_time")}
                </label>
              </div>


              <div>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                >
                  {t("post_comment")}
                </Link>
              </div>
            </form>

          </motion.div>
        </main>

        {/* Sidebar */}
        <aside className="space-y-8">


          {/* Recently Added Widget */}
          {/* Recently Added Widget */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="font-semibold text-lg mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-green-500">
              {t("recent_posts")}
            </h3>
            <div className="space-y-4">
              {blogData
                .slice(0, 3) // Get first 3 posts
                .map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="overflow-hidden rounded-lg w-16 h-16 flex-shrink-0">
                      <img
                        src={post.image}
                        alt={t(post.title)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'default-image-path.jpg';
                        }}
                      />
                    </div>
                    <div className="text-sm flex-1">
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-gray-700 font-medium group-hover:text-green-600 transition-colors line-clamp-2 block"
                      >
                        {t(post.title)}
                      </Link>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
};

export default BlogDetailsPage;