const Channel = require('../models/Channel')
const User = require('../models/User')

module.exports = {
  index: async (req, res) => {
    try {
      let channels = await Channel.find({}, '-password -__v')
      res.send(channels)
    } catch (err) {
      res.status(400).send(err)
    }
  },
  getChannelByName: async query => {
    try {
      let channel = await Channel.findOne({ title: query })
        .populate('liveMembers')
        .exec()

      return channel
    } catch (err) {
      console.log(error)
    }
  },
  addLiveMember: async (query, userId, socketId) => {
    try {
      let channel = await Channel.findOne({ title: query })
        .populate('liveMembers')
        .exec()

      let user = await User.findById(userId)

      channel.liveMembers.push(user)

      await channel.save()
      return channel
    } catch (error) {
      console.log(error)
    }
  },
  removeLiveMember: async (query, userId) => {
    try {
      let channel = await Channel.findOne({ title: query })
      channel.liveMembers.pull(userId)
      await channel.save()

      return channel.populate('liveMembers').execPopulate()
    } catch (error) {
      console.log(error)
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
  createChannel: async data => {
    let { title } = data
    try {
      let channel = await Channel.create({
        title: title
      })

      return channel
    } catch (err) {
      console.log(err)
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
