const mongoose = require('mongoose')

const initMongo = async () => {
  mongoose.set('debug', process.env.NODE_ENV === 'development')

  const connectionUrl = process.env.MONGODB_URL

  mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })

  mongoose.connection.on('connected', () => {
    console.log(`Mongoose default connection ready at ${connectionUrl}`)
  })

  mongoose.connection.on('error', (error) => {
    console.log('Mongoose default connection error:', error)
  })
}

module.exports = initMongo
