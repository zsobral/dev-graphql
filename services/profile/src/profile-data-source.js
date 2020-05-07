const { UserInputError } = require('apollo-server')
const { DataSource } = require('apollo-datasource')
const DataLoader = require('dataloader')
const Pagination = require('pagination')

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
    this.pagination = new Pagination(Profile)
    this.profileByIdLoader = new DataLoader(async (ids) => {
      const profiles = await this.Profile.find({ _id: { $in: ids } }).exec()
      return ids.map((id) =>
        profiles.find((profile) => profile._id.toString() === id)
      )
    })
  }

  getUserById(id) {
    return this.auth0.getUser({ id })
  }

  getProfileById(id) {
    return this.profileByIdLoader.load(id)
  }

  getProfile(filter) {
    return this.Profile.findOne(filter).exec()
  }

  async getProfiles({ after, before, first, last, orderBy }) {
    const sort = this._getProfileSort(orderBy)
    const queryArgs = { after, before, first, last, sort }
    const edges = await this.pagination.getEdges(queryArgs)
    const pageInfo = this.pagination.getPageInfo(edges, queryArgs)

    return { edges, pageInfo }
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

  _getProfileSort(sortEnum) {
    let sort = {}
    if (sortEnum) {
      const [field, direction] = sortEnum.split('_')
      sort[field.toLowerCase()] = direction === 'DESC' ? -1 : 1
    } else {
      sort['username'] = 1
    }
    return sort
  }
}

module.exports = ProfileDataSource
