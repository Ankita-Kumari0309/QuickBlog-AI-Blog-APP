import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/5">
      <div className="flex flex-col items-center justify-center gap-6 py-12 text-gray-600">
        {/* Logo & Description */}
        <img src={assets.logo} alt="logo" className="w-32 sm:w-44 mb-4" />
        <p className="text-center text-sm sm:text-base leading-relaxed text-gray-700 max-w-md">
          Welcome to your personal blogging space. Share your thoughts, ideas, and stories effortlessly with your audience.
        </p>
      </div>

      {/* Copyright */}
      <p className="py-6 text-center text-sm md:text-base text-gray-500/80">
        Copyright 2025 © QuickBlog Ankita - All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
