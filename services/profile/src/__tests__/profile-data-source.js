const { UserInputError } = require('apollo-server')

const auth0 = require('../auth0')
const Profile = require('../models/profile')
const ProfileDataSource = require('../profile-data-source')

jest.mock('auth0', () => ({
  ManagementClient: function () {
    return { getUser: jest.fn() }
  },
}))

describe('[profileAPI.getProfileById]', () => {
  it('returns undefined if no profile found', async () => {
    const dataSource = new ProfileDataSource({ Profile })
    const profile = await dataSource.getProfileById('507f1f77bcf86cd799439011')
    expect(profile).toBeUndefined()
  })

  it('returns a profile', async () => {
    const dataSource = new ProfileDataSource({ Profile })
    const expectedProfile = await new Profile({
      _id: 'id',
      avatar: 'avatar',
      fullName: 'fullname',
      username: 'mateus',
    }).save()
    const profile = await dataSource.getProfileById(expectedProfile._id)
    expect(profile.toJSON()).toEqual(expectedProfile.toJSON())
  })
})

describe('[profileAPI.createProfile]', () => {
  it('create a profile with an avatar from auth0 and returns the profile', async () => {
    const user = { picture: 'avatar' }
    auth0.getUser.mockResolvedValueOnce(user)
    const dataSource = new ProfileDataSource({ Profile, auth0 })
    const expectedProfile = await dataSource.createProfile({
      _id: 'id',
      avatar: user.avatar,
      fullName: 'fullname',
      username: 'mateus',
    })
    const profile = await Profile.findOne({}).exec()
    expect(profile.toJSON()).toEqual(expectedProfile.toJSON())
    expect(auth0.getUser).toHaveBeenCalledTimes(1)
    expect(auth0.getUser).toHaveBeenCalledWith({ id: expectedProfile._id })
  })
})

describe('[profileAPI.updateProfile]', () => {
  it('throws an error if no args is passed', async () => {
    const dataSource = new ProfileDataSource({ Profile })
    try {
      await dataSource.updateProfile('id', {})
    } catch (error) {
      expect(error).toBeInstanceOf(UserInputError)
      expect(error).toMatchInlineSnapshot(
        `[UserInputError: You must supply some profile data to update.]`
      )
    }
  })

  it('update the profile and returns the updated profile', async () => {
    const dataSource = new ProfileDataSource({ Profile })
    const profile = await new Profile({
      _id: 'id',
      username: 'mateus',
      fullName: 'name',
    }).save()
    const expectedUsername = 'edited'
    const expectedFullName = 'edited fullname'
    const updatedProfile = await dataSource.updateProfile(profile._id, {
      username: expectedUsername,
      fullName: expectedFullName,
    })
    expect(updatedProfile.username).toBe(expectedUsername)
    expect(updatedProfile.fullName).toBe(expectedFullName)
  })
})
