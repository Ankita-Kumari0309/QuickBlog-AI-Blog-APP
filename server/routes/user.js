import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalPosts = await Post.countDocuments({ author: req.user.id });

    // Include bio and image in response
    let image = null;
    if (user.image?.data) {
      image = `data:${user.image.contentType};base64,${user.image.data.toString("base64")}`;
    }

    res.json({ ...user._doc, totalPosts, image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching user info" });
  }
});

// Update user info (username, email, bio, image)
router.put("/me", auth, upload.single("image"), async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;

    if (req.file) {
      user.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await user.save();

    let image = null;
    if (user.image?.data) {
      image = `data:${user.image.contentType};base64,${user.image.data.toString("base64")}`;
    }

    res.json({ ...user._doc, image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating user info" });
  }
});

export default router;
