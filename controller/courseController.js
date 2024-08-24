const mongoose = require('mongoose');
const Course = require('../model/course');

// Helper function to validate input
const validateCourseInput = (data) => {
  const { title, description, image, courseContent, price, downloadableContent } = data;
  return title && description && image && courseContent && price != null && downloadableContent;
};


// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, image, courseContent, price, downloadableContent } = req.body;

    // Check if all required fields are present
    if (!validateCourseInput(req.body)) {
      return res.status(400).json({ message: 'All fields are required and price cannot be null' });
    }

    // Create and save the course
    const newCourse = new Course({ title, description, image, courseContent, price, downloadableContent });
    const savedCourse = await newCourse.save();

    return res.status(201).json({ message: 'Course created successfully', course: savedCourse });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses
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
    const course = await Course.findById(id);

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
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

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
