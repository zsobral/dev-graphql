const Profile = require('../models/profile')
const resolvers = require('../resolvers')
const ProfileDataSource = require('../profile-data-source')

const mockProfile = {
  _id: '123',
  username: 'john',
  fullName: 'john doe',
  avatar: 'myavatar',
}

describe('[Profile.id]', () => {
  it('returns the id', () => {
    const { Profile } = resolvers
    const id = Profile.id(mockProfile)
    expect(id).toBe(mockProfile._id)
  })
})

describe('[Profile.account]', () => {
  it('returns the expected account', () => {
    const { Profile } = resolvers
    const expectedAccount = { id: mockProfile._id, __typename: 'Account' }
    const account = Profile.account(mockProfile)
    expect(account).toEqual(expectedAccount)
  })
})

describe('[Profile.__resolveReference]', () => {
  it('returns the profile', async () => {
    const dataSources = { profileAPI: new ProfileDataSource({ Profile }) }
    const expectedProfile = await new Profile(mockProfile).save()
    const profile = await resolvers.Profile.__resolveReference(
      expectedProfile,
      { dataSources }
    )
    expect(profile.toJSON()).toEqual(expectedProfile.toJSON())
  })
})
