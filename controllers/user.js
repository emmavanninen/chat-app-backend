const User = require('../models/User')

module.exports = {
  index: async (req, res) => {
    try {
      let users = await User.find()

      res.send(users)
    } catch (err) {
      res.status(400).send(err)
    }
  },

  signup: async (req, res) => {
    try {
      let user = await User.create(req.body)
      const token = await user.generateAuthToken()

      res.send({ user, token })
    } catch (error) {
      res.status(400).send(error)
    }
  },
  signin: async (req, res) => {
    let { username, password } = req.body
    console.log(req.body)
    try {
      console.log('hit')
      const user = await User.comparePassword(username, password)
      console.log(user)
      const token = await user.generateAuthToken()

      res.send({
        user,
        token
      })
    } catch (error) {
      res.status(400).send(error)
    }
  }
}
