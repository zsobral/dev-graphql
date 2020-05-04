const { ApolloServer } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')

const initMongo = require('./mongoose')
const Profile = require('./models/profile')
const ProfileDataSource = require('./profile-data-source')
const typeDefs = require('./type-defs')
const resolvers = require('./resolvers')
const auth0 = require('./auth0')

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: ({ req }) => {
    const user = req.headers.user ? JSON.parse(req.headers.user) : null
    return { user }
  },
  dataSources: () => ({
    profileAPI: new ProfileDataSource({ Profile, auth0 }),
  }),
})

initMongo()

server.listen({ port: 3000 })
