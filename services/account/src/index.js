const { ApolloServer } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')

const AccountDataSource = require('./account-data-source')
const auth0 = require('./auth0')
const typeDefs = require('./type-defs')
const resolvers = require('./resolvers')

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: ({ req }) => {
    const user = req.headers.user ? JSON.parse(req.headers.user) : null
    return { user }
  },
  dataSources: () => ({
    accountAPI: new AccountDataSource({ auth0 }),
  }),
})

server.listen({ port: 3000 })
