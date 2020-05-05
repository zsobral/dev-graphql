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
    profiles: [Profile]!
  }

  extend type Mutation {
    createProfile(username: String!, fullName: String): Profile
    updateProfile(username: String, fullName: String, avatar: String): Profile
  }
`

module.exports = typeDefs
