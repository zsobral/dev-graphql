const mongoose = require('mongoose')

const isDevelopmentEnv = process.env.NODE_ENV === 'development'
const isTestEnv = process.env.NODE_ENV === 'test'

const initMongo = async () => {
  mongoose.set('debug', isDevelopmentEnv)

  const connectionUrl = isTestEnv
    ? process.env.MONGO_URL
    : process.env.MONGODB_URL

  if (isDevelopmentEnv) {
    mongoose.connection.on('connected', () => {
      console.log(`Mongoose default connection ready at ${connectionUrl}`)
    })

    mongoose.connection.on('error', (error) => {
      console.log('Mongoose default connection error:', error)
    })
  }

  return mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
}

module.exports = initMongo
