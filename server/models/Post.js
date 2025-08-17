import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subTitle: { type: String, trim: true },
    category: { type: String, default: "All" },
    description: { type: String, required: true }, // HTML content from Quill

    image: {
      data: Buffer,          // the actual image
      contentType: String,   // e.g., 'image/png'
    },

    isPublished: { type: Boolean, default: false },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // New fields for engagement
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // store user IDs
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      }
    ],
    shares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
