const { ApolloServer } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')
const { applyMiddleware } = require('graphql-middleware')

const initMongo = require('./mongoose')
const Profile = require('./models/profile')
const ProfileDataSource = require('./profile-data-source')
const typeDefs = require('./type-defs')
const resolvers = require('./resolvers')
const permissions = require('./permissions')
const auth0 = require('./auth0')

const server = new ApolloServer({
  schema: applyMiddleware(
    buildFederatedSchema([{ typeDefs, resolvers }]),
    permissions
  ),
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
