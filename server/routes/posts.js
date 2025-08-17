import express from 'express';
import multer from 'multer';
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// ---------------- Multer setup for image uploads ----------------
const storage = multer.memoryStorage(); // store in memory as buffer
const upload = multer({ storage });

// ---------------- Helper to safely parse JSON ----------------
const parseBlogJSON = (blogStr) => {
  try {
    return JSON.parse(blogStr || '{}');
  } catch (err) {
    return {};
  }
};

// ---------------- Create a new post ----------------
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, subTitle, category, description, isPublished } = parseBlogJSON(req.body.blog);

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const newPost = new Post({
      title,
      subTitle,
      description,
      category: category || 'All',
      isPublished: !!isPublished,
      author: req.user.id,
    });

    if (req.file) {
      newPost.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const savedPost = await newPost.save();
    res.status(201).json({ success: true, post: savedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while creating post' });
  }
});

// ---------------- Dashboard Routes ----------------
router.get('/dashboard/total-blogs', auth, async (req, res) => {
  try {
    const totalBlogs = await Post.countDocuments({ author: req.user.id, isPublished: true });
    res.json({ totalBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while counting blogs' });
  }
});

router.get('/dashboard/latest-blogs', auth, async (req, res) => {
  try {
    const latestBlogs = await Post.find({ author: req.user.id, isPublished: true })
                                  .sort({ createdAt: -1 })
                                  .limit(5);
    res.json(latestBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching latest blogs' });
  }
});

router.get('/dashboard/topics-graph', auth, async (req, res) => {
  try {
    const topicsData = await Post.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(req.user.id), isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json(topicsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while generating topics graph' });
  }
});

// ---------------- All Blogs by Logged-in User ----------------
router.get('/all-blocks', auth, async (req, res) => {
  try {
    const blogs = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate('author', 'username');

    const blogsWithImages = blogs.map(blog => {
      let image = null;
      if (blog.image?.data) {
        image = `data:${blog.image.contentType};base64,${blog.image.data.toString('base64')}`;
      }
      return { ...blog._doc, image };
    });

    res.json(blogsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching all blocks' });
  }
});

// ---------------- Get single post ----------------
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    let image = null;
    if (post.image?.data) {
      image = `data:${post.image.contentType};base64,${post.image.data.toString('base64')}`;
    }

    res.json({ ...post._doc, image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching the post' });
  }
});

// ---------------- Update post ----------------
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, subTitle, category, description, isPublished } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this post' });
    }

    post.title = title || post.title;
    post.subTitle = subTitle || post.subTitle;
    post.description = description || post.description;
    post.category = category || post.category;
    post.isPublished = typeof isPublished === 'boolean' ? isPublished : post.isPublished;

    if (req.file) {
      post.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedPost = await post.save();

    let image = null;
    if (updatedPost.image?.data) {
      image = `data:${updatedPost.image.contentType};base64,${updatedPost.image.data.toString('base64')}`;
    }

    res.json({ ...updatedPost._doc, image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating the post' });
  }
});

// ---------------- Unpublish a post ----------------
router.put('/:id/unpublish', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    post.isPublished = false;
    await post.save();
    res.json({ message: 'Post unpublished successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while unpublishing post' });
  }
});

// ---------------- Republish a post ----------------
router.put('/:id/publish', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    post.isPublished = true;
    await post.save();
    res.json({ message: 'Post published successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while publishing post' });
  }
});

// ---------------- Delete post ----------------
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting the post' });
  }
});

// Toggle like/unlike
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      // Unlike
      post.likes.pull(userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length, likedBy: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while liking post' });
  }
});

// Add a comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      user: req.user.id,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // Populate user to get username
    const updatedPost = await Post.findById(req.params.id).populate('comments.user', 'username');

    res.json(updatedPost.comments); // frontend can now use res.data directly
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while commenting' });
  }
});

// Increment share count
router.put('/:id/share', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json({ shares: post.shares });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while sharing' });
  }
});


export default router;
