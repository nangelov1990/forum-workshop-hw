'use strict'
const controllers = require('../controllers')
const auth = require('../config/auth')

module.exports = app => {
  app.get('/', controllers.home.index) // Home page, displays top 20 posts, ordered by last answer's date desc

  app.get('/categories', auth.isAuthenticated, controllers.categories.list)
  app.post('/categories/create', auth.isInRole('Admin'), controllers.categories.create)
  app.post('/categories/:name/delete', auth.isInRole('Admin'), controllers.categories.delete)

  app.get('/list/:category?', controllers.posts.list) // List all posts, for category, paging - 20 posts per page // TODO: pagination
  app.get('/add', auth.isAuthenticated, auth.isBanned(), controllers.posts.add) // Add new post form
  app.post('/post/create', auth.isAuthenticated, auth.isBanned(), controllers.posts.create) // Adds new post
  app.get('/post/:id/edit', auth.isAuthenticated, auth.isBanned(), controllers.posts.edit) // Edit post form
  app.post('/post/:id/put', auth.isAuthenticated, auth.isBanned(), controllers.posts.put) // Edit post
  app.post('/post/:id/delete', auth.isAuthenticated, auth.isBanned(), controllers.posts.remove) // Delete post
  app.post('/post/:id/like', auth.isAuthenticated, auth.isBanned(), controllers.posts.like) // Delete post
  app.post('/post/:id/dislike', auth.isAuthenticated, auth.isBanned(), controllers.posts.dislike) // Delete post
  app.get('/post/:id/:title', controllers.posts.display) // View single post details, view answers, add answer

  app.post('/post/:postId/:postTitle/answers/create', auth.isAuthenticated, auth.isBanned(), controllers.answers.create)
  app.post('/post/:postId/:postTitle/answers/:id/delete', auth.isAuthenticated, auth.isBanned(), controllers.answers.create)

  app.get('/profile/:username', auth.isAuthenticated, controllers.users.display)

  app.all('/users/:method', (req, res, next) => {
    let method = req.params.method
    try {
      controllers.users[method](req, res)
    } catch (err) {
      console.error(err)
      next()
    }
  })

  app.get('/admins/all', auth.isInRole('Admin'), controllers.admins.all) // View all admins
  app.get('/admins/add', auth.isInRole('Admin'), controllers.admins.add) // Add new admin form
  app.post('/admins/:username/update', auth.isInRole('Admin'), controllers.admins.update) // Add new admin
  app.post('/admins/:username/delete', auth.isInRole('Admin'), controllers.admins.delete) // Remove admin
  app.post('/admins/:username/ban', auth.isInRole('Admin'), controllers.admins.ban) // Ban user
  app.post('/admins/:username/unban', auth.isInRole('Admin'), controllers.admins.unban) // Unban user

  app.all('*', controllers.notFound)
}
