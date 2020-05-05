const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  accountId: { type: String, required: true, unique: true },
  avatar: { type: String },
  fullName: { type: String, trim: true },
  username: { type: String, required: true, unique: true },
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile
