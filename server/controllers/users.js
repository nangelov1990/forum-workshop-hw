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
          } else {
            res.render('users/login', { globalError: 'Please enter password'})
            return
          }

          if (!correctPassword) {
            res.render('users/login', { globalError: 'Invalid username or password'})
          } else {
            req.logIn(user, (err, user) => {
              if (err) {
                console.error(err)
                res.status(500)
                res.render('users/login', { globalError: 'Ooops, server error...'})
                return
              }

              res.redirect(returnUrl)
            })
          }
        } else {
          res.render('users/login', { globalError: 'Invalid username or password'})
        }
      })
  },
  display: (req, res) => {
    if (req.locals.user) {
      let user = req.locals.user
      User
        .findOne({ username: user.username })
        .then(user => {
          if (user) {
            
          }
        })
    } else {
      res.redirect('/users/login')
    }
    User
      .findOne({ username: req.locals.user.username })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  }
}
