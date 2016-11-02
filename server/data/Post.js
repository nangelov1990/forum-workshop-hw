'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const requiredValidationMessage = '{PATH} is required'

let postSchema = mongoose.Schema({
  title: ({ type: String, required: requiredValidationMessage }),
  content: ({ type: String, required: requiredValidationMessage }),
  author: ({ type: String, ref: 'User', required: requiredValidationMessage  }),
  categories: [{ type: String, ref: 'Category', required: requiredValidationMessage  }],
  asnwers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  views: Number
})

postSchema.method({
  addView: function () {
    ++this.views
  },
  like: function (userId) {
    this.likes.push(userId)
  },
  dislike: function (userId) {
    this.likes.remove(userId)
  },
  likesCount: function () {
    return this.likes.length
  },
  addCategory: function (categoryId) {
    this.categories.push(categoryId)
  },
  removeCategory: function (categoryId) {
    this.categories.remove(categoryId)
  },
  addAnswer: function (answerId) {
    this.asnwers.push(answerId)
  },
  removeAnswer: function (answerId) {
    this.answers.remove(answerId)
  }
})

mongoose.model('Post', postSchema)
