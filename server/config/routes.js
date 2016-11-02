'use strict'
const controllers = require('../controllers')

module.exports = app => {
  app.get('/', controllers.home.index) // Home page, displays top 20 posts, ordered by last answer's date desc

  app.get('/add') // Add new post form TODO: add auth and controller

  app.get('/list') // List all posts, paging - 20 posts per page TODO: add controller
  app.get('/list/:category') // View a;; posts from that category TODO: controller

  app.get('/post/:id/:title') // View single post details, view answers, add answer TODO: add auth
  app.post('/post/create') // Add new post TODO: add auth and controller

  app.all('/users/:method', (req, res, next) => {
    let method = req.params.method
    try {
      controllers.users[method](req, res)
    } catch (err) {
      console.error(err)
      next()
    }
  })
  app.get('/users/profile/:username') // User info view TODO: add auth and controller

  app.get('/admins/all') // View all admins TODO: add auth and controller
  app.get('/admins/add') // Add new admin form TODO: add auth and controller
  app.post('/admins/create') // Add new admin TODO: add auth and controller

  app.get('/categories') // View all categories TODO: add auth and controller
  app.post('/categories/create') // Add new category TODO: add auth and controller

  app.all('*', controllers.notFound)
}
