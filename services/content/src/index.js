const { ApolloServer } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')
const { applyMiddleware } = require('graphql-middleware')

const Post = require('./models/post')
const ContentDataSource = require('./content-data-source')
const initMongo = require('./mongoose')
const typeDefs = require('./type-defs')
const resolvers = require('./resolvers')
const permissions = require('./permissions')

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
    contentAPI: new ContentDataSource({ Post }),
  }),
})

initMongo()

server.listen({ port: 3000 })
