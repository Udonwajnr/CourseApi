const mongoose = require('mongoose');
const Post = require('../model/posts'); // Adjust path as needed
const Comment = require('../model/comment'); // Adjust path as needed

// Create a new comment
const createComment = async (req, res) => {
  const { postId, nameOfCommenter, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid Post ID format' });
  }
// remeber to test when you want to update
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = new Comment({ nameOfCommenter, post: postId, text });
    const savedComment = await newComment.save();

    post.comments.push(savedComment._id);
    await post.save();

    return res.status(201).json({ message: 'Comment created successfully', comment: savedComment });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all comments
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('post', 'title body'); // Optionally populate post details
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a comment by ID
const getCommentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Comment ID format' });
  }

  try {
    const comment = await Comment.findById(id).populate('post', 'title body');
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a comment by ID
const updateCommentById = async (req, res) => {
  const { id } = req.params;
  const { nameOfCommenter, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Comment ID format' });
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, { nameOfCommenter, text }, { new: true, runValidators: true });
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a comment by ID
const deleteCommentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Comment ID format' });
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await Comment.findByIdAndDelete(id);

    // Remove comment from the associated post
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: id } });

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  updateCommentById,
  deleteCommentById,
};
