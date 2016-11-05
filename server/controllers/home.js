'use strict'
const Post = require('mongoose').model('Post')

module.exports = {
  index: (req, res) => {
    Post
      .find({})
      .sort({ date: -1 })
      .limit(20)
      .then(posts => {
        res.render('home/index', { posts })
      })
  }
}
