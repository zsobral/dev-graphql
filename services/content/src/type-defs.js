const { gql } = require('apollo-server')

const typeDefs = gql`
  type Post @key(fields: "id") {
    id: ID!
    text: String!
    profile: Profile!
    createdAt: Int!
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
    createPost(text: String!, profileId: ID!): Post!
  }
`

module.exports = typeDefs
