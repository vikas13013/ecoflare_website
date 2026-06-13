import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MessageSquare } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { blogData } from '../../data/blogData';

const Sidebar = () => {
  const tags = ['Healthy', 'Organic', 'Vegetarian', 'Recipes', 'Nutrition'];
  const socialIcons = [
    { icon: <FaFacebookF />, color: 'bg-blue-600' },
    { icon: <FaTwitter />, color: 'bg-sky-500' },
    { icon: <FaInstagram />, color: 'bg-pink-600' },
    { icon: <FaLinkedinIn />, color: 'bg-blue-700' }
  ];

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: '300px',
      }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed lg:sticky top-32 left-0 h-[calc(100vh-8rem)] lg:h-auto w-72 bg-white z-40 shadow-xl lg:shadow-sm p-6 overflow-y-auto"
    >
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-xl mb-4">About Our Blog</h3>
          <p className="text-gray-600 mb-4">
            Welcome to our sustainable living blog where we share insights on organic farming,
            eco-friendly practices, and healthy living.
          </p>
          <div className="h-px bg-gray-200 my-4"></div>
          <div className="flex gap-3">
            {socialIcons.map((social, index) => (
              <a
                key={index}
                href="#"
                className={`w-10 h-10 ${social.color} text-white rounded-full flex items-center justify-center hover:opacity-90 transition`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-xl mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link
                key={tag}
                to="#"
                className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-full hover:bg-green-100 hover:text-green-800 transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-xl mb-4">Featured Post</h3>
          {blogData.slice(0, 1).map(post => (
            <div key={post.id} className="space-y-3">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h4 className="font-medium text-lg">
                <Link to={`/blog/${post.id}`} className="hover:text-green-600 transition">
                  {post.title}
                </Link>
              </h4>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;