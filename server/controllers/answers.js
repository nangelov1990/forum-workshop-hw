'use strict'
const Answer = require('mongoose').model('Answer')
const Post = require('mongoose').model('Post')
const User = require('mongoose').model('User')

module.exports = {
  create: (req, res) => {
    let currentUser = req.user
    let postId = req.params.postId
    let postTitle = req.params.postTitle
    let newAnswer = req.body

    newAnswer.postId = postId
    newAnswer.postTitle = postTitle
    newAnswer.author = currentUser.username
    newAnswer.date = new Date()

    Answer
      .create(newAnswer)
      .catch(err => { console.error(err) })
      .then(answer => {
        User
          .findOneAndUpdate(
            { _id: currentUser._id },
            { $push: { answers: answer._id } },
            { new: true }
          ).catch(err => { console.error(err) })
          .then(
            Post
              .findOneAndUpdate(
                { _id: postId },
                { $push: { answers: answer._id } },
                { new: true }
              ).catch(err => { console.error(err) })
              .then(res.redirect('back'))
        )
      })
  },
  remove: (req, res) => {
    let asnwerId = req.params.id
    Answer
      .findOneAndRemove({ _id: asnwerId })
      .then(res.redirect('back'))
  }
}
