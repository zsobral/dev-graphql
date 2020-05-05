const { UserInputError } = require('apollo-server')
const { DataSource } = require('apollo-datasource')

class ProfileDataSource extends DataSource {
  /**
   *
   * @param {Object} param
   * @param {import('./models/profile')} param.Profile
   * @param {import('auth0').ManagementClient} param.auth0
   */
  constructor({ Profile, auth0 }) {
    super()
    this.Profile = Profile
    this.auth0 = auth0
  }

  getUserById(id) {
    return this.auth0.getUser({ id })
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

  async createProfile(profile) {
    const user = await this.auth0.getUser({ id: profile._id })
    profile.avatar = user.picture
    return new this.Profile(profile).save()
  }

  async updateProfile(profileId, { username, fullName }) {
    if (!username && !fullName) {
      throw new UserInputError('You must supply some profile data to update.')
    }

    const data = {
      ...(username && { username }),
      ...(fullName && { fullName }),
    }

    return this.Profile.findOneAndUpdate({ _id: profileId }, data, {
      new: true,
    }).exec()
  }
}

module.exports = ProfileDataSource
