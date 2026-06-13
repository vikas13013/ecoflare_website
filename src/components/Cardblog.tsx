import { Link } from 'react-router-dom';
import { Calendar, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Card = ({ id, title, description, image, date, comments, category }) => {
  return (
    <motion.article 
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
      whileHover={{ y: -5 }}
    >
      <Link to={`/blog/${id}`}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
      </Link>
      
      <div className="p-5">
        <span className="inline-block px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full mb-3">
          {category}
        </span>
        
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link to={`/blog/${id}`} className="hover:text-green-600 transition">
            {title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <span className="mr-4">{date}</span>
          
          <MessageSquare className="w-4 h-4 mr-1" />
          <span>{comments} Comments</span>
        </div>
      </div>
    </motion.article>
  );
};

export default Card;