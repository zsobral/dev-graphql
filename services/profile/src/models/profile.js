const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  _id: { type: String },
  avatar: { type: String },
  fullName: { type: String, trim: true },
  username: { type: String, required: true, unique: true },
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile
