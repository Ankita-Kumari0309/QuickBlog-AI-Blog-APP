import React, { useState } from 'react';
import { blog_data, blogCategories } from '../assets/assets';
import { motion } from "motion/react";
import BlogCard from './BlogCard';

const BlogList = () => {
  const [menu, setMenu] = useState("All");

  return (
    <div>
      {/* Category Selector */}
      <div className="flex justify-center gap-4 sm:gap-8 my-10">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
              className={`relative z-10 px-4 py-1 rounded-full transition-colors duration-200 ${
                menu === item ? 'text-white' : 'text-gray-500'
              }`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {blog_data
          .filter((blog) => (menu === "All" ? true : blog.category === menu))
          .map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
      </div>
    </div>
  );
};

export default BlogList;
