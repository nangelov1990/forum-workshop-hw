'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const requireValidetionMessage = '{PATH} is required'

let answerSchema = mongoose.Schema({
  postId: ({ type: Schema.Types.ObjectId, required: requireValidetionMessage }),
  body: ({ type: String, required: requireValidetionMessage }),
  author: ({ type: String, ref: 'User' })
})

mongoose.model('Answer', answerSchema)
