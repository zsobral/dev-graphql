const { gql } = require('apollo-server')

const typeDefs = gql`
  scalar DateTime

  type Account @key(fields: "id") {
    id: ID!
    email: String!
    createdAt: DateTime!
  }

  extend type Query {
    account(id: String!): Account!
    accounts: [Account]!
    me: Account!
  }
`

module.exports = typeDefs
