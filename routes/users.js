const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const passport = require('passport')

let auth = passport.authenticate('jwt-user')

router.get('/', auth, userController.index)
router.post('/signup', userController.signup)
router.post('/signin', userController.signin)

module.exports = router
