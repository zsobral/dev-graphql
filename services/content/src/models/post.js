const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    profileId: { type: String, required: true },
    text: { type: String, required: true, maxlength: 256 },
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
