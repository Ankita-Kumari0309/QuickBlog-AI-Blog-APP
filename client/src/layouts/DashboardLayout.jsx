import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaHome, FaEdit, FaList, FaUser, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import { assets } from "../assets/assets"; 

const DashboardLayout = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, updateUser } = useUser();

  const username = user.username || "User";
  const profilePic = user.profilePic || "https://via.placeholder.com/40";

  const changeProfilePic = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updatedUser = { ...user, profilePic: reader.result };
      updateUser(updatedUser);
    };
    reader.readAsDataURL(file);
  };

  const links = [
    { name: "Home", path: "/dashboard/home", icon: <FaHome /> },
    { name: "Write Blog", path: "/dashboard/write", icon: <FaEdit /> },
    { name: "All Blogs", path: "/dashboard/blogs", icon: <FaList /> },
    { name: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg flex flex-col justify-between transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="p-6 flex flex-col justify-between h-full">
          <div>
            {/* Logo */}
            <div className="flex items-center justify-between mb-10">
              {!isCollapsed && (
                <img
                  src={assets.logo}
                  alt="QuickBlog Logo"
                  className="w-32 object-contain"
                />
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-600 hover:text-indigo-500 p-2 rounded"
              >
                <FaBars />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-3">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md hover:bg-indigo-50 ${
                      isActive
                        ? "bg-indigo-100 text-indigo-600 font-medium"
                        : "text-gray-700"
                    }`}
                    title={isCollapsed ? link.name : ""}
                  >
                    {link.icon} {!isCollapsed && <span>{link.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout */}
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg shadow-sm transition"
              title={isCollapsed ? "Logout" : ""}
            >
              <FaSignOutAlt /> {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-20 bg-white shadow flex items-center justify-end px-8 gap-4 border-b border-gray-200">
          <span className="font-medium text-gray-700">{username}</span>
          <label className="cursor-pointer relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-sm"
            />
            <input
              type="file"
              onChange={changeProfilePic}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
