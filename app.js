'use strict'
const express = require('express')
const app = express()

const env = process.env.NODE_ENV || 'development'
let config = require('./server/config/config')[env]

require('./server/config/express')(app, config)
require('./server/config/database')(config)
require('./server/config/routes')(app)

// TODO: passport

app.listen(config.port)
