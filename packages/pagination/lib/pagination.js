const { UserInputError } = require('apollo-server')

class Pagination {
  constructor(Model) {
    this.Model = Model
  }

  async getEdges(queryArgs) {
    const { after, before, first, last, filter = {}, sort = {} } = queryArgs
    let edges

    if (!first && !last) {
      throw new UserInputError(
        'Provide a "first" or "last" value to paginate this connection.'
      )
    } else if (first && last) {
      throw new UserInputError(
        'Passing "first" and "last" is not supported with this connection'
      )
    } else if (first < 0 || last < 0) {
      throw new UserInputError(
        'Minimum record request for "first" and "last" argument is 0.'
      )
    } else if (first > 100 || last > 100) {
      throw new UserInputError(
        'Maximum record request for "first" and "last" arguments is 100.'
      )
    }

    if (first) {
      const operator = this._getOperator(sort)
      const queryDoc = after
        ? await this._getFilterWithCursor(after, filter, operator, sort)
        : filter
      const docs = await this.Model.find(queryDoc)
        .sort(sort)
        .limit(first)
        .exec()
      edges = docs.length
        ? docs.map((doc) => ({ cursor: doc._id, node: doc }))
        : []
    } else {
      const reverseSort = this._reverseSortDirection(sort)
      const operator = this._getOperator(reverseSort)
      const queryDoc = before
        ? await this._getFilterWithCursor(before, filter, operator, reverseSort)
        : filter
      const docs = await this.Model.find(queryDoc)
        .sort(reverseSort)
        .limit(last)
        .exec()
      edges = docs.length
        ? docs.map((doc) => ({ cursor: doc._id, node: doc })).reverse()
        : []
    }

    return edges
  }

  async getPageInfo(edges, queryArgs) {
    if (edges.length > 0) {
      const { filter = {}, sort = {} } = queryArgs
      const startCursor = this._getStartCursor(edges)
      const endCursor = this._getEndCursor(edges)
      const hasNextPage = await this._getHasNextPage(endCursor, filter, sort)
      const hasPreviousPage = await this._getHasPreviousPage(
        startCursor,
        filter,
        sort
      )

      return {
        hasNextPage,
        hasPreviousPage,
        startCursor,
        endCursor,
      }
    }

    return {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    }
  }

  async _getFilterWithCursor(fromCursorId, filter, operator, sort) {
    let filterWithCursor = { $and: [filter] }
    const fieldArr = Object.keys(sort)
    const field = fieldArr.length ? fieldArr[0] : '_id'
    const fromDoc = await this.Model.findOne({ _id: fromCursorId })
      .select(field)
      .exec()

    if (!fromDoc) {
      throw new UserInputError(`No record found for ID "${fromCursorId}"`)
    }

    filterWithCursor.$and.push({ [field]: { [operator]: fromDoc[field] } })

    return filterWithCursor
  }

  async _getSearchPipeline(fromCursorId, filter, first, operator, sort) {}

  _reverseSortDirection(sort) {
    const fieldArr = Object.keys(sort)
    if (fieldArr.length === 0) {
      return { $natural: -1 }
    }

    const field = fieldArr[0]
    return { [field]: sort[field] * -1 }
  }

  _getOperator(sort, options = {}) {
    const orderArr = Object.values(sort)
    return orderArr.length && orderArr[0] === -1 ? '$lt' : '$gt'
  }

  _isSearchQuery(sort) {}

  async _getHasNextPage(endCursor, filter, sort) {
    const operator = this._getOperator(sort)
    const queryDoc = await this._getFilterWithCursor(
      endCursor,
      filter,
      operator,
      sort
    )
    const nextPage = await this.Model.findOne(queryDoc)
      .select('_id')
      .sort()
      .exec()

    return Boolean(nextPage)
  }

  async _getHasPreviousPage(startCursor, filter, sort) {
    const reverseSort = this._reverseSortDirection(sort)
    const operator = this._getOperator(reverseSort)
    const queryDoc = await this._getFilterWithCursor(
      startCursor,
      filter,
      operator,
      reverseSort
    )
    const prevPage = await this.Model.findOne(queryDoc)
      .select('_id')
      .sort(reverseSort)
      .exec()

    return Boolean(prevPage)
  }

  _getStartCursor(edges) {
    if (edges.length === 0) {
      return null
    }

    return edges[0].cursor
  }

  _getEndCursor(edges) {
    if (edges.length === 0) {
      return null
    }

    return edges[edges.length - 1].cursor
  }
}

module.exports = Pagination
