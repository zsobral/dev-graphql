const { DataSource } = require('apollo-datasource')

class AccountDataSource extends DataSource {
  /**
   *
   * @param {Object} param
   * @param {import('auth0').ManagementClient} param.auth0
   */
  constructor({ auth0 }) {
    super()
    this.auth0 = auth0
  }

  getAccounts() {
    return this.auth0.getUsers()
  }

  getAccountById(id) {
    return this.auth0.getUser({ id })
  }
}

module.exports = AccountDataSource
