import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center py-5 px-6 sm:px-20 xl:px-32 bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer transition-transform hover:scale-105"
      />

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 rounded-full bg-primary text-white text-sm px-5 py-2.5 transition-transform hover:scale-105 hover:bg-primary/90"
        >
          Login
          <img src={assets.arrow} alt="arrow" className="w-3" />
        </button>

        <button
          onClick={() => navigate('/signup')}
          className="flex items-center gap-2 rounded-full border border-primary text-primary text-sm px-5 py-2.5 transition-transform hover:scale-105 hover:bg-primary/10"
        >
          Sign Up
          <img src={assets.arrow} alt="arrow" className="w-3" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
