const { rule, shield, chain } = require('graphql-shield')

const isAuthenticated = rule()((parent, args, { user }, info) => {
  return user !== null
})

const isCreatingOwnProfile = rule()((parent, args, { user }, info) => {
  return args.accountId === user.sub
})

const isEditingOwnProfile = rule()(
  async (parent, args, { dataSources, user }, info) => {
    const profile = await dataSources.profileAPI.getProfileById(args.profileId)
    return profile && user.sub === profile.accountId
  }
)

const permissions = shield(
  {
    Query: {
      myProfile: isAuthenticated,
    },
    Mutation: {
      createProfile: chain(isAuthenticated, isCreatingOwnProfile),
      updateProfile: chain(isAuthenticated, isEditingOwnProfile),
    },
  },
  {
    debug: process.env.NODE_ENV === 'development',
  }
)

module.exports = permissions
