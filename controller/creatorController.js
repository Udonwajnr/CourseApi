const mongoose = require('mongoose');
const Creator = require('../model/creator'); // Adjust the path as needed
const Course = require('../model/course'); // Adjust the path as needed
// Create a new creator
exports.createCreator = async (req, res) => {
    const { name, email, posts, courses } = req.body;
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const existingCreator = await Creator.findOne({ email });
    if (existingCreator) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
  
    try {
      const creator = new Creator({
        name,
        email,
        posts,
        courses,
        createdAt: new Date(), // Ensure createdAt is set to the current date
      });
  
      await creator.save();
      res.status(201).json({ success: true, data: creator });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  // Get all creators
exports.getAllCreators = async (req, res) => {
    try {
      const creators = await Creator.find().populate('posts').populate('courses');
      res.status(200).json({ success: true, data: creators });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  // Get a single creator by ID
exports.getCreatorById = async (req, res) => {
    const { id } = req.params;
  
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Creator ID format' });
    }
  
    try {
      const creator = await Creator.findById(id).populate('posts').populate('courses');
      if (!creator) {
        return res.status(404).json({ success: false, message: 'Creator not found' });
      }
      res.status(200).json({ success: true, data: creator });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  // Update a creator by ID
exports.updateCreatorById = async (req, res) => {
    const { id } = req.params;
    const { name, email, posts, courses } = req.body;
  
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Creator ID format' });
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
  
    try {
      const creator = await Creator.findByIdAndUpdate(
        id,
        { name, email, posts, courses },
        { new: true, runValidators: true }
      ).populate('posts').populate('courses');
  
      if (!creator) {
        return res.status(404).json({ success: false, message: 'Creator not found' });
      }
      res.status(200).json({ success: true, data: creator });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

// Delete a creator by ID
exports.deleteCreatorById = async (req, res) => {
    const { id } = req.params;
  
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Creator ID format' });
    }
  
    try {
      const creator = await Creator.findByIdAndDelete(id);
      if (!creator) {
        return res.status(404).json({ success: false, message: 'Creator not found' });
      }
      res.status(200).json({ success: true, message: 'Creator deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };