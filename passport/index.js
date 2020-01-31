const { Strategy, ExtractJwt } = require('passport-jwt')
const passport = require('passport')
const User = require('../models/User')

module.exports = app => {
  app.use(passport.initialize())

  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.USER_SECRET_KEY
  }

  passport.serializeUser((user, cb) => {
    cb(null, user)
  })

  passport.deserializeUser((user, cb) => {
    cb(null, user)
  })

  passport.use(
    'jwt-user',
    new Strategy(jwtOpts, async (payload, done) => {
      try {
        if (payload._id) {
          const user = (await User.findById(payload._id)) || false
          return done(null, user)
        }
      } catch (error) {
        return done(null, false)
      }
    })
  )
}
