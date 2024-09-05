const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  courses:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
  ],
  
});

module.exports = mongoose.model("Creator", creatorSchema);
