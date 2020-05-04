const { DataSource } = require('apollo-datasource')

class ProfileDataSource extends DataSource {
  /**
   *
   * @param {Object} param
   * @param {import('./models/profile')} param.Profile
   */
  constructor({ Profile }) {
    super()
    this.Profile = Profile
  }

  getProfileById(id) {
    return this.Profile.findById(id).exec()
  }

  getProfile(filter) {
    return this.Profile.findOne(filter).exec()
  }

  getProfiles() {
    return this.Profile.find({}).exec()
  }

  createProfile(profile) {
    return new this.Profile(profile).save()
  }
}

module.exports = ProfileDataSource
