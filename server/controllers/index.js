'use strict'
const home = require('./home')
const users = require('./users')
const notFound = (req, res) => {}

module.exports = {
  home,
  users,
  notFound
}
