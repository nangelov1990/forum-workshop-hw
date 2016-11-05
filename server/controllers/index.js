'use strict'
const home = require('./home')
const users = require('./users')
const admins = require('./admins')
const posts = require('./posts')
const answers = require('./answers')
const categories = require('./categories')
const notFound = (req, res) => {}

module.exports = {
  home,
  users,
  admins,
  posts,
  answers,
  categories,
  notFound
}
