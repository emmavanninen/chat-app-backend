const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const passport = require('passport')

router.get('/', passport.authenticate('jwt-user'), userController.index)
router.post('/signup', userController.signup)
router.post('/signin', userController.signin)

module.exports = router
