// src/App.jsx
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import HomeOverview from "./pages/Dashboard/HomeOverview";
import WriteBlog from "./pages/Dashboard/WriteBlog";
import BlogList from "./pages/Dashboard/BlogList";
import Profile from "./pages/Dashboard/Profile";
import ProtectedRoute from "./components/ProtectedRoutes";
import SearchPage from "./pages/Dashboard/SearchPage"; // <- Correct import

const noNavbarPaths = ["/login", "/signup"];

function App() {
  const location = useLocation();

  return (
    <div>
      {/* Show Navbar only for public pages */}
      {!noNavbarPaths.includes(location.pathname) &&
        !location.pathname.startsWith("/dashboard") && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomeOverview />} />
            <Route path="write" element={<WriteBlog />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="search" element={<SearchPage />} /> {/* Fixed */}
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
