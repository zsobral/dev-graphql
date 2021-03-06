const { rule, shield } = require('graphql-shield')

const isAuthenticated = rule()((parent, args, { user }, info) => {
  return user !== null
})

const permissions = shield(
  {
    Profile: {
      account: isAuthenticated,
    },
    Query: {
      me: isAuthenticated,
    },
    Mutation: {
      createProfile: isAuthenticated,
      updateProfile: isAuthenticated,
    },
  },
  {
    debug: process.env.NODE_ENV === 'development',
  }
)

module.exports = permissions
