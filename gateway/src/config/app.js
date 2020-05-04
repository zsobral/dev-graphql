const express = require('express')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

const app = express()

app.use(
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: process.env.AUTH0_ISSUER,
    algorithms: ['RS256'],
    credentialsRequired: false,
  })
)

app.use((err, req, res, next) => {
  if (err.code === 'invalid_token') {
    return next()
  }
  return next(err)
})

module.exports = app
