'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const requiredValidationMessage = '{PATH} is required'

let answerSchema = mongoose.Schema({
  postId: ({ type: Schema.Types.ObjectId, required: requiredValidationMessage, ref: 'Posts' }),
  postTitle: ({ type: String, required: requiredValidationMessage }),
  body: ({ type: String, required: requiredValidationMessage }),
  author: ({ type: String, required: requiredValidationMessage, ref: 'User' }),
  date: ({ type: Date, required: requiredValidationMessage })
})

mongoose.model('Answer', answerSchema)
