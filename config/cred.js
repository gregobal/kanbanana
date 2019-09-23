if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cred.prod')
} else {
  module.exports = require('./cred.dev')
}
