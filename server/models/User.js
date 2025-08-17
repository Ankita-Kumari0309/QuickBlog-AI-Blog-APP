import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true }, 
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, 
  bio: { type: String, default: "" }, // short description about the user
  image: { // profile photo
    data: Buffer,
    contentType: String
  }
}, { timestamps: true }); 

// Create User model from schema
const User = mongoose.model('User', userSchema);

export default User;
