const { gql } = require('apollo-server')

const typeDefs = gql`
  scalar DateTime

  type Account @key(fields: "id") {
    id: ID!
    email: String!
    createdAt: DateTime!
  }
`

module.exports = typeDefs
