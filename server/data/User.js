'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const encryption = require('../utilities/encryption')
const requiredValidationMessage = '{PATH} is required'

let userSchema = mongoose.Schema({
  username: ({ type: String, required: requiredValidationMessage, unique: true }),
  name: ({ type: String, required: requiredValidationMessage }),
  salt: String,
  hashedPass: String,
  roles: [{ type: String, default: ['User'] }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  asnwers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }]
})

userSchema.method({
  authenticate: function (password) {
    let correctPassword =
      encryption.generateHashedPass(this.salt, password) === this.hashedPass
    return correctPassword
  },
  addPost: function (postId) {
    this.posts.push(postId)
  },
  removePost: function (postId) {
    this.posts.remove(postId)
  },
  addAnswer: function (answerId) {
    this.asnwers.push(answerId)
  },
  removeAnswer: function (answerId) {
    this.answers.remove(answerId)
  }
})

let User = mongoose.model('User', userSchema)

module.exports.seedAdminUser = () => {
  User
    .find({})
    .then(users => {
      if (users.length > 0) return

      let salt = encryption.generateSalt()
      let hashedPass = encryption.generateHashedPass(salt, 'admin')
      User
        .create({
          username: 'admin',
          name: 'Nikola Angelov',
          salt: salt,
          hashedPass: hashedPass,
          roles: ['Admin'],
          posts: Array.empty,
          answers: Array.empty
        })
    })
}
