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
}

module.exports = resolvers
