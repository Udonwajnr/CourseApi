const mongoose = require('mongoose');
const Course = require('../model/course'); // Adjust the path as needed
const Creator = require('../model/creator'); // Adjust the path as needed

// Helper function to validate input
const validateCourseInput = (data) => {
  const { title, description, image, courseContent, price, downloadableContent } = data;
  return title && description && image && courseContent && price != null && downloadableContent;
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, image, courseContent, price, downloadableContent,creatorId } = req.body;

    // Check if all required fields are present
    if (!validateCourseInput(req.body)) {
      return res.status(400).json({ message: 'All fields are required and price cannot be null' });
    }

    // Validate Creator
    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      return res.status(400).json({ message: 'Invalid Creator ID format' });
    }

    const creator = await Creator.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    // Create and save the course
    const newCourse = new Course({ title, description, image, courseContent, price, downloadableContent, creatorId: creatorId });
    const savedCourse = await newCourse.save();

    // Update the Creator’s courses
    creator.courses.push(savedCourse._id);
    await creator.save();

    return res.status(201).json({ message: 'Course created successfully', course: savedCourse });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('creatorId'); // Fetch all courses and populate creator
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a course by ID
const getCourseById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Course ID format' });
  }

  try {
    const course = await Course.findById(id).populate('creatorId');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a course by ID
const updateCourseById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Course ID format' });
  }

  try {
    const { title, description, image, courseContent, price, downloadableContent, creatorId } = req.body;

    // Find the course
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the provided creatorId matches the course's creator
    if (course.creatorId.toString() !== creatorId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(id, { title, description, image, courseContent, price, downloadableContent }, { new: true, runValidators: true });

    return res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a course by ID
const deleteCourseById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Course ID format' });
  }

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Remove the course reference from the creator
    await Creator.findByIdAndUpdate(deletedCourse.creator, { $pull: { courses: deletedCourse._id } });

    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourseById,
  updateCourseById,
  deleteCourseById,
  getAllCourses,
};
