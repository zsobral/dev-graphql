const { gql } = require('apollo-server')

const typeDefs = gql`
  type Post @key(fields: "id") {
    id: ID!
    text: String!
    profile: Profile!
    createdAt: Float!
  }

  extend type Profile @key(fields: "id") {
    id: ID! @external
    posts: [Post]!
  }

  extend type Query {
    post(id: ID!): Post!
    posts: [Post]!
  }

  extend type Mutation {
    createPost(text: String!): Post!
  }
`

module.exports = typeDefs
