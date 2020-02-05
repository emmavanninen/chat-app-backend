const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const usersRouter = require('./routes/users')
const messagesRouter = require('./routes/messages')
const channelsRouter = require('./routes/channels')
const app = express()

require('dotenv').config()
require('./db')()
require('./passport')(app)

app.use(logger('dev'))
app.use(express.json())
app.use(cors())

app.use('/api/users', usersRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/channels', channelsRouter)

module.exports = app
