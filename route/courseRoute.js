const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourseById,
  deleteCourseById,
} = require('../controller/courseController'); // Adjust the path as needed

// Route to create a new course
router.post('/', createCourse);

// Route to get a course by ID
router.get('/', getAllCourses);

// Route to get a course by ID
router.get('/:id', getCourseById);

// Route to update a course by ID
router.put('/:id', updateCourseById);

// Route to delete a course by ID
router.delete('/:id', deleteCourseById);

module.exports = router;
