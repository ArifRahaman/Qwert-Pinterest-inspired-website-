const mongoose = require("mongoose");
const passport = require("passport");
const Schema = mongoose.Schema;
mongoose.connect("mongodb://127.0.0.1:27017/Pinterestwebdata");

const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
     ref:"User"
  },
  image:{
    type:String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
