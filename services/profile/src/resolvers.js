const resolvers = {
  Profile: {
    __resolveReference: (reference, { dataSources }, info) => {
      return dataSources.profileAPI.getProfileById(reference.id)
    },
    account: (profile, args, context, info) => {
      return { __typename: 'Account', id: profile._id }
    },
    id: (profile, args, context, info) => {
      return profile._id
    },
  },

  Query: {
    profile: async (parent, args, { dataSources }, info) => {
      return dataSources.profileAPI.getProfile({
        ...(args.username && { username: args.username }),
        ...(args.id && { _id: args.id }),
      })
    },

    profiles: async (parent, args, { dataSources }, info) => {
      return dataSources.profileAPI.getProfiles(args)
    },

    me: async (parent, args, { dataSources, user }, info) => {
      return dataSources.profileAPI.getProfile({ _id: user.sub })
    },
  },

  Mutation: {
    createProfile: async (parent, { input }, { dataSources, user }, info) => {
      return {
        profile: await dataSources.profileAPI.createProfile({
          _id: user.sub,
          username: input.username,
          fullName: input.fullName,
        }),
      }
    },

    updateProfile: async (parent, { input }, { dataSources, user }, info) => {
      return dataSources.profileAPI.updateProfile(user.sub, input)
    },
  },
}

module.exports = resolvers
