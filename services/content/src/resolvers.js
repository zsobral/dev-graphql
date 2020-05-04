const resolvers = {
  Post: {
    __resolveReference: async (reference, { dataSources }, info) => {
      return dataSources.getPostById(reference.id)
    },
    id: (post) => post._id,
    profile: (post) => ({ __typename: 'Profile', id: post.profileId }),
  },

  Profile: {
    posts: async (profile, args, { dataSources }) => {
      return dataSources.contentAPI.getPosts({ profileId: profile.id })
    },
  },

  Query: {
    post: async (parent, args, { dataSources }, info) => {
      return dataSources.contentAPI.getPostById(args.id)
    },
    posts: async (parent, args, { dataSources }, info) => {
      return dataSources.contentAPI.getPosts()
    },
  },

  Mutation: {
    createPost: async (parent, args, { dataSources, user }, info) => {
      return dataSources.contentAPI.createPost({
        text: args.text,
        profileId: args.profileId,
      })
    },
  },
}

module.exports = resolvers
