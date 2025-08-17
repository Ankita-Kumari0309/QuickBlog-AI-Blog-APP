// WriteBlog.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { assets } from "../../assets/assets";

const blogCategories = ["All", "Startup", "Tech", "Health", "Education"];

function WriteBlog({ onBlogAdded, existingBlog }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState(existingBlog?.title || "");
  const [subTitle, setSubTitle] = useState(existingBlog?.subTitle || "");
  const [category, setCategory] = useState(existingBlog?.category || "All");
  const [isPublished, setIsPublished] = useState(existingBlog?.isPublished ?? true);

const API_URL = "https://quickblog-backend-3w61.onrender.com";


  // Initialize Quill editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ header: [1, 2, 3, false] }],
            [{ align: [] }],
            ["clean"],
          ],
        },
      });

      if (existingBlog) quillRef.current.root.innerHTML = existingBlog.description;
    }
  }, [existingBlog]);

  // Submit blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !quillRef.current.root.innerHTML.trim()) {
      alert("Title and description are required");
      return;
    }

    setIsAdding(true);
    try {
      const formData = new FormData();
      const blogData = {
        title,
        subTitle,
        category,
        description: quillRef.current.root.innerHTML.trim(),
        isPublished,
      };
      formData.append("blog", JSON.stringify(blogData));
      if (image) formData.append("image", image);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to publish a blog");

      if (existingBlog) {
        await axios.put(`${API_URL}/api/posts/${existingBlog._id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        alert("Blog updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/posts`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        alert("Blog added successfully!");
      }

      setTitle("");
      setSubTitle("");
      setCategory("All");
      quillRef.current.setText("");
      setImage(null);
      setIsPublished(true);

      if (onBlogAdded) onBlogAdded();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Error submitting blog");
    } finally {
      setIsAdding(false);
    }
  };

  // AI Blog Generation
  const handleGenerateAI = async () => {
    setError("");
    if (!title.trim() || !subTitle.trim() || !category.trim()) {
      setError("⚠️ Please fill in Title, Subtitle, and Category before generating AI content.");
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/ai/generate-blog`,
        { title, subTitle, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const generatedContent = response.data?.content || "";
      if (!generatedContent) {
        setError("⚠️ No content generated. Try again.");
        return;
      }

      quillRef.current.root.innerHTML = generatedContent;
    } catch (err) {
      console.error("Error generating blog:", err);
      setError(" Failed to generate blog. Please check backend API.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white max-w-3xl p-6 shadow-xl rounded-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          {existingBlog ? "Edit Blog" : "Write a New Blog"}
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        {/* Thumbnail */}
        <div className="mb-4">
          <p className="text-gray-600 font-medium">Upload Thumbnail</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : existingBlog?.image || assets.upload_area}
              alt="Upload preview"
              className="mt-2 h-24 w-40 object-cover rounded cursor-pointer border border-gray-300 shadow-sm hover:opacity-80 transition"
            />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} id="image" hidden />
          </label>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-4">
          <p className="text-gray-600 font-medium">Blog Title</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Blog Title"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        <div className="mb-4">
          <p className="text-gray-600 font-medium">Blog Subtitle</p>
          <input
            type="text"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            placeholder="Enter Blog Subtitle"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* AI Generate Button */}
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate AI Blog"}
          </button>
          <span className="text-gray-500 text-sm">Generate blog content automatically</span>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-600 font-medium mb-1">Blog Description</p>
          <div className="border border-gray-300 rounded-lg min-h-[200px]">
            <div ref={editorRef} className="h-64 p-2" />
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <p className="text-gray-600 font-medium">Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            {blogCategories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Publish */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-400"
          />
          <span className="text-gray-600 font-medium">Publish Now</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isAdding}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          {isAdding ? (existingBlog ? "Updating..." : "Adding...") : existingBlog ? "Update Blog" : "Publish Blog"}
        </button>
      </div>
    </form>
  );
}

export default WriteBlog;
