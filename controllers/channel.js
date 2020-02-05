const Channel = require('../models/Channel')

module.exports = {
  index: async (req, res) => {
    try {
      let channels = await Channel.find({}, '-password -__v')

      res.send(channels)
    } catch (err) {
      res.status(400).send(err)
    }
  },
  create: async (req, res) => {
    let { title } = req.body
    try {
      let channel = await Channel.create({
        creator: req.user._id,
        title: title
      })

      res.send({ channel })
    } catch (err) {
      res.status(400).send(err)
    }
  },
  updateTitle: async (req, res) => {
    try {
      let { id } = req.params
      let { title } = req.body

      let updatedChannel = await Channel.findByIdAndUpdate(
        id,
        { $set: { title: title } },
        { new: true, useFindAndModify: false }
      )

      res.send(updatedChannel)
    } catch (err) {
      res.status(400).send(err)
    }
  },
  delete: async (req, res) => {
    try {
      let { id } = req.params

      let deletedChannel = await Channel.findByIdAndDelete(id)

      res.send(deletedChannel)
    } catch (err) {
      res.status(400).send(err)
    }
  }
}
