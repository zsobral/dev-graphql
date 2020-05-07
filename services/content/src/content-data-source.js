const { DataSource } = require('apollo-datasource')
const DataLoader = require('dataloader')
const Pagination = require('pagination')

class ContentDataSource extends DataSource {
  /**
   *
   * @param {Object} param
   * @param {import('./models/post')} param.Post
   */
  constructor({ Post }) {
    super()
    this.Post = Post
    this.pagination = new Pagination(Post)
    this.postByIdLoader = new DataLoader(async (ids) => {
      const posts = await this.Post.find({ _id: { $in: ids } }).exec()
      return ids.map((id) => posts.find((post) => post._id.toString() === id))
    })
  }

  getPost(id) {
    return this.postByIdLoader.load(id)
  }

  async getPosts({ after, before, first, last, orderBy }) {
    const sort = this._getPostSort(orderBy)
    const queryArgs = { after, before, first, last, sort }
    const edges = await this.pagination.getEdges(queryArgs)
    const pageInfo = this.pagination.getPageInfo(edges, queryArgs)

    return { edges, pageInfo }
  }

  createPost(post) {
    return new this.Post(post).save()
  }

  _getPostSort(sortEnum) {
    let sort = {}
    if (sortEnum) {
      const [direction, ...rest] = sortEnum.split('_').reverse()
      const field = this._toCamelCase(rest.reverse().join('_'))
      sort[field] = direction === 'DESC' ? -1 : 1
    } else {
      sort['createdAt'] = -1
    }

    return sort
  }

  _toCamelCase(string) {
    return string
      .toLowerCase()
      .replace(/([_][a-z])/gi, ($1) => $1.toUpperCase().replace('_', ''))
  }
}

module.exports = ContentDataSource
