const { DataSource } = require('apollo-datasource')

class ContentDataSource extends DataSource {
  /**
   *
   * @param {Object} param
   * @param {import('./models/post')} param.Post
   */
  constructor({ Post }) {
    super()
    this.Post = Post
  }

  getPost(id) {
    return this.Post.findById(id).exec()
  }

  getPosts(filter) {
    return this.Post.find(filter).exec()
  }

  createPost(post) {
    return new this.Post(post).save()
  }
}

module.exports = ContentDataSource
