const { ApolloError } = require('apollo-server')
const { GraphQLScalarType } = require('graphql')
const { isISO8601 } = require('validator')

const DateTimeResolver = new GraphQLScalarType({
  name: 'DateTime',
  description: 'An ISO 8601-encoded UTC date string.',
  parseValue: (value) => {
    if (!isISO8601(value)) {
      throw new ApolloError('DateTime must be a valid ISO 8601 Date string')
    }

    return value
  },
  serialize: (value) => {
    if (typeof value !== 'string') {
      value = value.toISOString()
    }

    if (isISO8601(value)) {
      return value
    }

    throw new ApolloError('DateTime must be a valid ISO 8601 Date string')
  },
})

module.exports = {
  DateTimeResolver,
}
