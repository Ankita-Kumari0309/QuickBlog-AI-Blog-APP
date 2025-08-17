import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaCommentAlt, FaShare } from "react-icons/fa";

function AdminBlogListWithView() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts/all-blocks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBlogs(res.data);

      const likesMap = {};
      const commentsMap = {};
      res.data.forEach((b) => {
        likesMap[b._id] = b.likes?.length || 0;
        commentsMap[b._id] = (b.comments || []).map((c) => ({
          text: c.text || c,
          user: c.user?.username || "User",
        }));
      });
      setLikes(likesMap);
      setComments(commentsMap);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/posts/${id}/unpublish`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchBlogs();
    } catch (err) {
      console.error("Error unpublishing blog:", err);
    }
  };

  const handlePublish = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/posts/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchBlogs();
    } catch (err) {
      console.error("Error publishing blog:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const handleUpdate = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      subTitle: blog.subTitle || "",
      category: blog.category || "",
      description: blog.description || "",
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/posts/${editingBlog._id}`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setBlogs(prevBlogs =>
        prevBlogs.map(b =>
          b._id === editingBlog._id ? { ...b, ...formData } : b
        )
      );

      if (selectedBlog && selectedBlog._id === editingBlog._id) {
        setSelectedBlog(prev => ({ ...prev, ...formData }));
      }

      setEditingBlog(null);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  const openModal = (blog) => setSelectedBlog(blog);
  const closeModal = () => {
    setSelectedBlog(null);
    setNewComment("");
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setLikes((prev) => ({ ...prev, [id]: res.data.likes }));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleAddComment = async (id) => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/${id}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setComments((prev) => ({
        ...prev,
        [id]: res.data.map((c) => ({
          text: c.text,
          user: c.user.username || "User",
        })),
      }));
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleRealShare = async (blog, platform) => {
    const postUrl = encodeURIComponent(`https://yourwebsite.com/blog/${blog._id}`);
    const text = encodeURIComponent(blog.title);

    let url = "";
    if (platform === "facebook") url = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
    else if (platform === "twitter") url = `https://twitter.com/intent/tweet?text=${text}&url=${postUrl}`;
    else if (platform === "whatsapp") url = `https://api.whatsapp.com/send?text=${text}%20${postUrl}`;

    window.open(url, "_blank", "width=600,height=400");

    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${blog._id}/share`);
      setBlogs((prev) =>
        prev.map((b) => (b._id === blog._id ? { ...b, shares: res.data.shares } : b))
      );
    } catch (err) {
      console.error("Error updating share count:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-6 bg-gray-50 min-h-screen gap-6">
      {/* Blog list */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">All Blogs</h2>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Blog Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <tr key={blog._id} className="hover:bg-gray-50 border-b">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td onClick={() => openModal(blog)} className="px-6 py-4 font-medium text-blue-600 hover:underline cursor-pointer">{blog.title}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(blog.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${blog.isPublished ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {blog.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button onClick={() => handleUpdate(blog)} className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50">Update</button>
                      {blog.isPublished ? (
                        <button onClick={() => handleUnpublish(blog._id)} className="px-3 py-1 text-sm border border-gray-400 text-gray-600 rounded hover:bg-gray-50">Unpublish</button>
                      ) : (
                        <button onClick={() => handlePublish(blog._id)} className="px-3 py-1 text-sm border border-green-500 text-green-500 rounded hover:bg-green-50">Publish</button>
                      )}
                      <button onClick={() => handleDelete(blog._id)} className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50">✕</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-6">No blogs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update panel */}
      {editingBlog && (
        <div className="w-full lg:w-1/3 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Update Blog</h3>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" className="w-full border px-3 py-2 rounded" />
            <input type="text" value={formData.subTitle} onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })} placeholder="Sub Title" className="w-full border px-3 py-2 rounded" />
            <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Category" className="w-full border px-3 py-2 rounded" />
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows="5" className="w-full border px-3 py-2 rounded"></textarea>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
              <button type="button" onClick={() => setEditingBlog(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Blog modal */}
      {selectedBlog && (
        <div onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-lg flex flex-col">
            <div className="flex justify-end p-4">
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>
            <div className="px-6 pb-6 overflow-y-auto flex flex-col space-y-6">
              <img src={selectedBlog.image || "/placeholder.jpg"} alt={selectedBlog.title} className="w-full h-auto object-cover rounded" />
              <h2 className="text-3xl font-serif text-gray-800">{selectedBlog.title}</h2>
              {selectedBlog.subTitle && <h3 className="text-xl font-sans text-gray-600">{selectedBlog.subTitle}</h3>}
              <p className="text-sm text-gray-500">
                Author: {selectedBlog.author?.username || "Unknown"} |{" "}
                {selectedBlog.isPublished ? <span className="text-green-600">Published</span> : <span className="text-red-600">Unpublished</span>}
              </p>
              <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedBlog.description }}></div>

              {/* Likes/Comments */}
              <div className="flex items-center gap-6 mt-4">
                <button onClick={() => handleLike(selectedBlog._id)} className="flex items-center gap-2 text-blue-600">
                  <FaThumbsUp /> {likes[selectedBlog._id] || 0}
                </button>
                <span className="flex items-center gap-2 text-gray-600">
                  <FaCommentAlt /> {comments[selectedBlog._id]?.length || 0}
                </span>
              </div>

              {/* Share */}
              <div className="flex items-center gap-4 mt-2">
                <button onClick={() => handleRealShare(selectedBlog, "facebook")} className="flex items-center gap-2 text-blue-600"><FaShare /> Facebook {selectedBlog.shares || 0}</button>
                <button onClick={() => handleRealShare(selectedBlog, "twitter")} className="flex items-center gap-2 text-cyan-600"><FaShare /> Twitter</button>
                <button onClick={() => handleRealShare(selectedBlog, "whatsapp")} className="flex items-center gap-2 text-green-500"><FaShare /> WhatsApp</button>
              </div>

              {/* Comments */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Comments</h4>
                {comments[selectedBlog._id]?.length > 0 ? (
                  comments[selectedBlog._id].map((c, idx) => (
                    <div key={idx} className="border-b py-2">
                      <p className="text-sm font-medium">{c.user || "User"}</p>
                      <p className="text-gray-700">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}

                <div className="flex mt-3 gap-2">
                  <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="flex-1 border px-3 py-2 rounded" />
                  <button onClick={() => handleAddComment(selectedBlog._id)} disabled={!newComment.trim()} className={`px-4 py-2 rounded text-white ${newComment.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBlogListWithView;
