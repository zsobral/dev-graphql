const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway')
const { ApolloServer } = require('apollo-server-express')
const waitOn = require('wait-on')

const initServer = async () => {
  const options = {
    resources: ['tcp:account:3000', 'tcp:content:3000', 'tcp:profile:3000'],
  }
  await waitOn(options)

  const gateway = new ApolloGateway({
    serviceList: [
      { name: 'account', url: 'http://account:3000' },
      { name: 'content', url: 'http://content:3000' },
      { name: 'profile', url: 'http://profile:3000' },
    ],
    buildService: ({ url }) => {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest: ({ request, context }) => {
          const { user } = context
          request.http.headers.set('user', user ? JSON.stringify(user) : null)
        },
      })
    },
  })

  return new ApolloServer({
    gateway,
    subscriptions: false,
    context: ({ req }) => {
      const user = req.user || null
      return { user }
    },
  })
}

module.exports = initServer
