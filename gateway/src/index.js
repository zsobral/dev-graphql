const initServer = require('./config/apollo')
const app = require('./config/app')

const init = async () => {
  const server = await initServer()

  server.applyMiddleware({ app })

  app.listen({ port: 3000 }, () => {
    console.log(`Gateway ready at http://localhost/graphql`)
  })
}

init()
