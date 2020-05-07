const mongoose = require('mongoose')

const Profile = require('./src/models/profile')
const initMongo = require('./src/mongoose')

beforeAll(async () => {
  await initMongo()
})

beforeEach(async () => {
  await Profile.deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.close()
})
