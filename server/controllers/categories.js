'use strict'
const Category = require('mongoose').model('Category')

module.exports = {
  list: (req, res) => {
    Category
      .find({})
      .then(categories => {
        res.render('categories/list', { categories })
      })
  },
  create: (req, res) => {
    let newCategory = req.body
    Category
      .create(newCategory)
      .then(res.redirect('back'))
  },
  delete: (req, res) => {
    let categoryName = req.params.name
    Category
      .findOneAndRemove({ name: categoryName })
      .then(res.redirect('back'))
  }
}
