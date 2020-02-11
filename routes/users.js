const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const passport = require('passport')

let auth = passport.authenticate('jwt-user')

router.get('/', auth, userController.index)
router.post('/signup', userController.signup)
router.post('/signin', userController.signin)
router.get('/get-user', auth, userController.getUser)

module.exports = router
