const Message = require('../models/Message')

module.exports = {
  index: async (req, res) => {
    try {
      let messages = await Message.find({}, '-password -__v')

      res.send(messages)
    } catch (err) {
      res.status(400).send(err)
    }
  },
  create: async (req, res) => {
    try {
      let { body } = req.body
      let message = await Message.create({
        body: body,
        author: req.user._id
      })

      res.send({ message })
    } catch (err) {
      res.status(400).send(err)
    }
  },
  update: async (req, res) => {
    try {
      let { id } = req.params
      let { body } = req.body

      let updatedUser = await Message.findByIdAndUpdate(
        id,
        { $set: { body: body } },
        { new: true, useFindAndModify: false }
      )

      res.send(updatedUser)
    } catch (err) {
      res.status(400).send(err)
    }
  },
  delete: async (req, res) => {
    try {
      let { id } = req.params

      let deletedMessage = await Message.findByIdAndDelete(id)

      res.send(deletedMessage)
    } catch (err) {
      res.status(400).send(err)
    }
  }
}
