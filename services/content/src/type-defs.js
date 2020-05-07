const { gql } = require('apollo-server')

const typeDefs = gql`
  type Post @key(fields: "id") {
    id: ID!
    text: String!
    profile: Profile!
    createdAt: String!
  }

  extend type Profile @key(fields: "id") {
    id: ID! @external
    posts: [Post]!
  }

  extend type Query {
    post(id: ID!): Post!
    posts(
      first: Int
      after: String
      last: Int
      before: String
      orderBy: PostOrderByInput
    ): PostConnection
  }

  input CreatePostInput {
    text: String!
  }

  type CreatePostPayload {
    post: Post!
  }

  extend type Mutation {
    createPost(input: CreatePostInput!): CreatePostPayload
  }

  type PageInfo {
    endCursor: String
    startCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type PostConnection {
    edges: [PostEdge]
    pageInfo: PageInfo!
  }

  type PostEdge {
    cursor: ID!
    node: Post!
  }

  enum PostOrderByInput {
    CREATED_AT_ASC
    CREATED_AT_DESC
  }
`

module.exports = typeDefs
