const { DateTimeResolver } = require('scalar')

const resolvers = {
  DateTime: DateTimeResolver,
  Post: {
    __resolveReference: async (reference, { dataSources }, info) => {
      return dataSources.getPostById(reference.id)
    },
    id: (post) => post._id,
    profile: (post) => ({ __typename: 'Profile', id: post.profileId }),
    createdAt: (post) => new Date(post.createdAt).toISOString(),
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
      return dataSources.contentAPI.getPosts(args)
    },
  },

  Mutation: {
    createPost: async (parent, { input }, { dataSources, user }, info) => {
      const post = await dataSources.contentAPI.createPost({
        text: input.text,
        profileId: user.sub,
      })
      return { post }
    },
  },
}

module.exports = resolvers
