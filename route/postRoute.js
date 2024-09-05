const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');

// Create a new post
router.post('/posts', postController.createPost);

// Get all posts
router.get('/posts', postController.getAllPosts);

// Get a post by ID
router.get('/posts/:id', postController.getPostById);

// Update a post by ID
router.put('/posts/:id', postController.updatePostById);

// Delete a post by ID
router.delete('/posts/:id', postController.deletePostById);

module.exports = router;
