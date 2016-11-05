'use strict'
const encryption = require('../utilities/encryption')
const User = require('mongoose').model('User')

module.exports = {
  register: (req, res) => {
    res.render('users/register')
  },
  create: (req, res) => {
    let user = req.body
    let confirmedPassIncorrect =
      user.password !== user.confirmPassword
    if (confirmedPassIncorrect) {
      user.globalError = 'Passwords do not match'
      res.render('users/register', user)
    } else {
      user.salt = encryption.generateSalt()
      user.hashedPass = encryption.generateHashedPass(user.salt, user.password)
      user.banned = false

      User
        .create(user)
        .then(user => {
          req.logIn(user, (err, user) => {
            if (err) {
              user.globalError = err
              res.render('user/register', user)
            } else {
              res.redirect('/')
            }
          })
        })
    }
  },
  login: (req, res) => {
    res.render('users/login')
  },
  authenticate: (req, res) => {
    let inputUser = req.body
    let returnUrl =
      req.header('referer').toString().split('?')[1] ||
        '/'

    User
      .findOne({ username: inputUser.username })
      .then(user => {
        if (user) {
          let correctPassword = false
          if (inputUser.password) {
            correctPassword = user.authenticate(inputUser.password)
          }

          if (!correctPassword) {
            res.render('users/login', { globalError: 'Invalid username or password' })
          } else {
            req.logIn(user, (err, user) => {
              if (err) {
                console.error(err)
                res.status(500)
                res.render('users/login', { globalError: 'Ooops, server error...' })
                return
              }

              res.redirect(returnUrl)
            })
          }
        } else {
          res.render('users/login', { globalError: 'Invalid username or password' })
        }
      })
  },
  display: (req, res) => {
    let username = req.params.username
    let currentUser = req.user
    User
      .findOne({ username: username })
      .populate('posts')
      .populate('answers')
      .then(user => {
        if (user) {
          res.render('users/display', { user, currentUser })
        }
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  }
}
