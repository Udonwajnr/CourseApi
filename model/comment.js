const mongoose = require("mongoose")
const commentSchema = new mongoose.Schema({
    nameOfCommenter:{
        type:String,
        required:true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
module.exports = mongoose.model("Comment", commentSchema);
