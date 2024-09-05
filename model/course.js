const mongoose = require('mongoose');

// Define the Course Schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
  },
  image: {
      type: String,
    required: [true, 'Course image URL is required'],
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator", // Reference to the Creator schema
    required: true, // Ensure every course has a creator
  },
  courseContent: [
    {
      chapterTitle: {
        type: String,
        required: [true, 'Chapter title is required'],
      },
      topics: [
        {
          type: String,
          required: [true, 'Topic title is required'],
        },
      ],
    },
  ],
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative'],
  },
  downloadableContent: {
    type: [String],
    validate: {
      validator: function (urls) {
        return urls.every(url => /^https?:\/\/.+/.test(url));
      },
      message: 'Each item in downloadableContent must be a valid URL',
    },
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create and export the model
module.exports = mongoose.model('Course', courseSchema);
