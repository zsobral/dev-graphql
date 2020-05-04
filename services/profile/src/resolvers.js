const resolvers = {
  Profile: {
    __resolveReference: (reference, { dataSources }, info) => {
      return dataSources.profileAPI.getProfileById(reference.id)
    },
    account: (profile, args, context, info) => {
      return { __typename: 'Account', id: profile.accountId }
    },
    id: (profile, args, context, info) => {
      return profile._id
    },
  },

  Account: {
    profile: (account, args, { dataSources }, info) => {
      return dataSources.profileAPI.getProfile({ accountId: account.id })
    },
  },

  Query: {
    profile: async (parent, args, { dataSources }, info) => {
      return dataSources.profileAPI.getProfile({
        ...(args.username && { username: args.username }),
        ...(args.accountId && { accountId: args.accountId }),
      })
    },

    profiles: async (parent, args, { dataSources }, info) => {
      return dataSources.profileAPI.getProfiles()
    },

    myProfile: async (parent, args, { dataSources, user }, info) => {
      return dataSources.profileAPI.getProfile({ accountId: user.sub })
    },
  },

  Mutation: {
    createProfile: async (parent, args, { dataSources, user }, info) => {
      return dataSources.profileAPI.createProfile({
        accountId: user.sub,
        username: args.username,
        fullName: args.fullName,
      })
    },
  },
}

module.exports = resolvers
