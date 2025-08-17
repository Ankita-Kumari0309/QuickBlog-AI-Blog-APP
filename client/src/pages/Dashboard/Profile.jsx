import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../context/UserContext";

function Profile() {
  const { user: contextUser, updateUser } = useUser();
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({
    username: "",
    email: "",
    bio: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(res.data);
      setTempUser({
        username: res.data.username || "",
        email: res.data.email || "",
        bio: res.data.bio || "",
        image: null,
      });
      setPreviewImage(res.data.image || null);
      updateUser({ ...res.data, profilePic: res.data.image });
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  const handleEditProfile = () => setEditMode(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setTempUser({ ...tempUser, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", tempUser.username);
      formData.append("email", tempUser.email);
      formData.append("bio", tempUser.bio);
      if (tempUser.image) formData.append("image", tempUser.image);

      const res = await axios.put(`${API_URL}/api/users/me`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data);
      setEditMode(false);
      setPreviewImage(res.data.image || null);
      updateUser({ ...res.data, profilePic: res.data.image });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 transition-transform hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Profile</h2>

        {editMode ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-300 shadow-xl"
                />
              )}

              {/* Hidden file input */}
              <input
                type="file"
                id="profileImage"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Styled label */}
              <label
                htmlFor="profileImage"
                className="cursor-pointer px-6 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition font-medium shadow"
              >
                Upload New Image
              </label>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Name</p>
              <input
                type="text"
                value={tempUser.username}
                onChange={(e) => setTempUser({ ...tempUser, username: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Email</p>
              <input
                type="email"
                value={tempUser.email}
                onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Bio</p>
              <textarea
                value={tempUser.bio}
                onChange={(e) => setTempUser({ ...tempUser, bio: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex justify-center">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-300 shadow-xl"
                />
              )}
            </div>

            <div className="text-center">
              <p className="text-gray-500">Name</p>
              <p className="text-xl font-semibold">{user.username || "Unknown"}</p>
            </div>

            <div className="text-center">
              <p className="text-gray-500">Email</p>
              <p className="text-gray-800">{user.email || "Unknown"}</p>
            </div>

            <div className="text-center">
              <p className="text-gray-500">Role</p>
              <p className="text-gray-800">{user.role || "User"}</p>
            </div>

            <div className="text-center">
              <p className="text-gray-500">Bio</p>
              <p className="text-gray-800">{user.bio || "No bio"}</p>
            </div>

            <div className="text-center">
              <p className="text-gray-500">Total Posts</p>
              <p className="text-gray-800">{user.totalPosts || 0}</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditProfile}
                className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
