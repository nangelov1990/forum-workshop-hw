'use strict'
const mongoose = require('mongoose')
const requiredValidationMessage = '{PATH} is required'

let categorySchema = mongoose.Schema({
  name: ({ type: String, required: requiredValidationMessage })
})

let Category = mongoose.model('Category', categorySchema)

module.exports.seedCategories = () => {
  Category
    .find({})
    .then(categories => {
      if (categories.length > 0) return
      let seedCategories = [
        { name: 'Contemporary' },
        { name: 'Commercial' }
      ]
      Category
        .create(seedCategories)
    })
}
