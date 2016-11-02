'use strict'
const mongoose = require('mongoose')
const requiredValidationMessage = '{PATH} is required'

let categorySchema = mongoose.Schema({
  name: ({ type: String, required: requiredValidationMessage })
})

mongoose.model('Category', categorySchema)
