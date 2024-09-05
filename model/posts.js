const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  body: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Ensure this is capitalized
  },
  numberOfLikes: {
    type: Number, // Consider using Number for counting
    default: 0, // Initialize with a default value
  },
  numberOfShares: {
    type: Number, // Consider using Number for counting
    default: 0, // Initialize with a default value
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // Reference the comment schema
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator", // Reference to the Creator schema
    required: true, // Ensure every course has a creator
  },
});

module.exports = mongoose.model("Post", postSchema);
