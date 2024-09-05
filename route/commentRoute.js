const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController'); // Adjust path as needed

// Create a new comment
router.post('/comments', commentController.createComment);

// Get all comments
router.get('/comments', commentController.getAllComments);

// Get a comment by ID
router.get('/comments/:id', commentController.getCommentById);

// Update a comment by ID
router.put('/comments/:id', commentController.updateCommentById);

// Delete a comment by ID
router.delete('/comments/:id', commentController.deleteCommentById);

module.exports = router;
