const { rule, shield } = require('graphql-shield')

const isAuthenticated = rule()((parent, args, { user }, info) => {
  return user !== null
})

const permissions = shield(
  {
    Mutation: {
      createPost: isAuthenticated,
    },
  },
  { debug: process.env.NODE_ENV === 'development' }
)

module.exports = permissions
