'use strict'
const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  'development': {
    rootPath,
    db: 'mongodb://localhost:27017/forum-workshop-hw',
    port: 2993,
    sessionSecret: '@def-session-secret#'
  }
}
