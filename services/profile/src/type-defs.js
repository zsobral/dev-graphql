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
    profile: Profile
  }

  extend type Query {
    myProfile: Profile
    profile(username: String, accountId: String): Profile
    profiles: [Profile]!
  }

  extend type Mutation {
    createProfile(username: String!, fullName: String): Profile
  }
`

module.exports = typeDefs
