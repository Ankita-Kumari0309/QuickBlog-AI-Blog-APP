import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext"; // ✅ import context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useUser(); // ✅ get updater from context

  const API_URL = "https://quickblog-backend-3w61.onrender.com"; // <-- deployed backend
  console.log(process.env.REACT_APP_API_URL);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/authRoutes/login`, {
        email,
        password,
      });

      console.log("Login response:", res.data);

      // ✅ Save token & update user in context (this also updates localStorage)
      localStorage.setItem("token", res.data.token);
      updateUser(res.data.user);

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-primary text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
