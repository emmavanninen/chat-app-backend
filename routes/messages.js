const express = require('express')
const router = express.Router()
const messageController = require('../controllers/message')
const passport = require('passport')

let auth = passport.authenticate('jwt-user')

router.get('/', auth, messageController.index)
router.post('/', auth, messageController.create)
router.put('/:id', auth, messageController.update)
router.delete('/:id', auth, messageController.delete)

module.exports = router
