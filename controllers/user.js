const User = require("../models/User")

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
    try {
      const user = await User.comparePassword(username, password)
      const token = await user.generateAuthToken()

      res.send({
        user,
        token
      })
    } catch (error) {
      res.status(400).send(error)
    }
  },
  getUser: async (req, res) => {
    let user = req.user

    try {
      let userInfo = {
        email: user.email,
        username: user.username,
        photo: user.photo,
        // messages: user.messages,
        timestamps: user.timestamp
      }
      res.send(userInfo)
    } catch (e) {
      res.status(400).send(e)
    }
  },
  editUser: async (req, res) => {
    let userid = req.user._id
    let updatedUser = req.body

    try {
      if (updatedUser["oldPassword"]) {
        await User.comparePassword(req.user.username, updatedUser.oldPassword)
      }

      let success = await User.findByIdAndUpdate(userid, updatedUser, {
        new: true
      })
      console.log(success)
    } catch (e) {
      res.status(400).send(e)
    }
  }
}
