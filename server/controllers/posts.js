'use strict'
const Post = require('mongoose').model('Post')
const Category = require('mongoose').model('Category')
const User = require('mongoose').model('User')
const Answer = require('mongoose').model('Answer')

module.exports = {
  add: (req, res) => {
    if (req.user) {
      Category
        .find({})
        .then(categories => {
          res.render('posts/add', { categories })
        })
    } else {
      res.redirect('back')
    }
  },
  create: (req, res) => {
    let newPost = req.body
    newPost.author = req.user.username
    newPost.date = new Date()
    newPost.answers = []
    newPost.likes = []
    newPost.views = 0
    newPost.bannedUsers = []

    Post
      .create(newPost)
      .then(post => {
        User
          .findOneAndUpdate(
            { username: req.user.username },
            { $push: { posts: post._id } }
          )
          .then(() => { res.redirect('/') })
      })
  },
  list: (req, res) => {
    let category = req.params.category
    let query = category ? { category: category } : {}
    let page = req.query.page || 1
    let limit = 20

    // Post
    //   .aggregate([
    //     {'$project': {
    //       '$title': 1,
    //       '$content': 1,
    //       '$author': 1,
    //       '$views': 1,
    //       '$newestAnswer': { 'sort': '$answers.date' }
    //     }}
    //   ])
    //   .then(result => {
    //     console.log(result[0])
    //   })

    Post
      .find(query)
      .populate('Answer')
      .skip((page - 1) * limit)
      .limit(limit)
      // .paginate(query, { page: page })
      .then(posts => {
      // .then(result => {
        Post
          .count({})
          .then((count) => {
            // let posts = result.docs
            posts.count = count
            res.render('posts/list', { posts })
          })
      })
  },
  display: (req, res) => {
    let id = req.params.id
    Post
      .findOneAndUpdate(
        { _id: id },
        { $inc: { views: 1 } },
        { new: true }
      ).populate('answers')
      .then(post => {
        let query = { banned: false }
        req.user
          ? query.username = { $ne: req.user.username }
          : null
        User
          .find(query)
          .then(users => {
            res.render('posts/display', { post, users })
          })
      })
  },
  edit: (req, res) => {
    let id = req.params.id
    let currentUser = req.user
    Post
      .findOne({ _id: id })
      .then(post => {
        if (currentUser.username === post.author ||
            currentUser.roles.includes('Admin')) {
          Category
            .find({})
            .then(categories => {
              res.render('posts/edit', { post, categories, currentUser })
            })
        } else {
          res.redirect('back')
        }
      })
  },
  put: (req, res) => {
    let inputPost = req.body
    let postId = req.params.id
    Post
      .findOneAndUpdate(
        { _id: postId },
        inputPost,
        { new: true }
      ).then(post => {
        res.redirect(`/post/${post._id}/${post.title}`)
      })
  },
  remove: (req, res) => {
    let postId = req.params.id
    Post
      // .findOneAndRemove({ _id: postId })
      .findOne({ _id: postId })
      .then(
        Answer
          .find({ postId: postId })
          .then(answers => {
            console.log(answers)
            User
              .findOneAndUpdate(
                { posts: postId },
                { $pull: { posts: postId } },
                { $pull: { answers: answers } }
              )
              .then(res.redirect('/list'))
          })
      )
  },
  like: (req, res) => {
    let postId = req.params.id
    let username = req.user.username
    Post
      .findOneAndUpdate(
        { _id: postId },
        { $push: { likes: username } }
      ).then(res.redirect('back'))
  },
  dislike: (req, res) => {
    let postId = req.params.id
    let username = req.user.username
    Post
      .findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: username } }
      ).then(res.redirect('back'))
  }
}
