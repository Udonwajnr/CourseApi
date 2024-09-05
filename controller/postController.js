const mongoose = require('mongoose');
const Post = require('../model/posts');
const Creator = require('../model/creator');

// Helper function to validate input
const validatePostInput = (data) => {
  const { title, body, creator } = data;
  return title && body && creator;
};

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, description, body, image, creator } = req.body;

    // Validate input
    if (!validatePostInput(req.body)) {
      return res.status(400).json({ message: 'Title, body, and creator are required' });
    }

    // Validate the creator ID format
    if (!mongoose.Types.ObjectId.isValid(creator)) {
      return res.status(400).json({ message: 'Invalid Creator ID format' });
    }

    // Check if the creator exists
    const creatorDoc = await Creator.findById(creator);
    if (!creatorDoc) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    // Create and save the post
    const newPost = new Post({ title, description, body, image, creator });
    const savedPost = await newPost.save();

    // Add post to creator's list of posts
    creatorDoc.posts.push(savedPost._id);
    await creatorDoc.save();

    return res.status(201).json({ message: 'Post created successfully', post: savedPost });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('creator', 'name email').populate('comments'); // Populate creator details
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Post ID format' });
  }

  try {
    const post = await Post.findById(id).populate('creator', 'name email').populate('comments');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a post by ID
const updatePostById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Post ID format' });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a post by ID
const deletePostById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Post ID format' });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Remove post from creator's list of posts
    await Creator.findByIdAndUpdate(deletedPost.creator, { $pull: { posts: id } });

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPost,
  getPostById,
  updatePostById,
  deletePostById,
  getAllPosts,
};
