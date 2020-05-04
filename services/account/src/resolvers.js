const { DateTimeResolver } = require('scalar')

const resolvers = {
  DateTime: DateTimeResolver,
  Account: {
    __resolveReference: async (reference, { dataSources }, info) => {
      return dataSources.accountAPI.getAccountById(reference.id)
    },
    id: (account, args, context, info) => {
      return account.user_id
    },
    createdAt: (account, args, context, info) => {
      return account.created_at
    },
  },

  Query: {
    account: async (parent, args, { dataSources }, info) => {
      return dataSources.accountAPI.getAccountById(args.id)
    },
    accounts: async (parent, args, { dataSources }, info) => {
      return dataSources.accountAPI.getAccounts()
    },
    me: async (parent, args, { dataSources, user }, info) => {
      return user && user.sub
        ? dataSources.accountAPI.getAccountById(user.sub)
        : null
    },
  },
}

module.exports = resolvers
