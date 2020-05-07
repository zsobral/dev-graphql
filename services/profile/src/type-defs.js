const { gql } = require('apollo-server')

const typeDefs = gql`
  type Profile @key(fields: "id") {
    id: ID!
    account: Account!
    avatar: String
    fullName: String
    username: String!
  }

  extend type Account @key(fields: "id") {
    id: ID! @external
  }

  extend type Query {
    me: Profile
    profile(username: String, id: String): Profile
    profiles(
      first: Int
      after: String
      last: Int
      before: String
      orderBy: ProfileOrderByInput
    ): ProfileConnection
  }

  input CreateProfileInput {
    username: String!
    fullName: String
  }

  type CreateProfilePayload {
    profile: Profile
  }

  input UpdateProfileInput {
    username: String
    fullName: String
  }

  type UpdateProfilePayload {
    profile: Profile!
  }

  extend type Mutation {
    createProfile(input: CreateProfileInput!): CreateProfilePayload
    updateProfile(input: UpdateProfileInput!): UpdateProfilePayload
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
  }

  type ProfileConnection {
    edges: [ProfileEdge]
    pageInfo: PageInfo!
  }

  type ProfileEdge {
    cursor: ID!
    node: Profile!
  }

  enum ProfileOrderByInput {
    USERNAME_ASC
    USERNAME_DESC
  }
`

module.exports = typeDefs
