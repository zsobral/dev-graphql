const { rule, shield, chain } = require('graphql-shield')

const isAuthenticated = rule()((parent, args, { user }, info) => {
  return user !== null
})

const isOwner = rule()((parent, args, { user }, info) => {
  return parent.user_id === user.sub
})

const permissions = shield(
  {
    Account: chain(isAuthenticated, isOwner),
  },
  { debug: process.env.NODE_ENV === 'development' }
)

module.exports = permissions
