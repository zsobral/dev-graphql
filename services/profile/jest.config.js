module.exports = {
  displayName: 'services/profile',
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: [require.resolve('./setup-env')],
}
