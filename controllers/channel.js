const Channel = require('../models/Channel')
const User = require('../models/User')

module.exports = {
  index: async (req, res) => {
    try {
      let channels = await Channel.find(
        {},
        '-password -__v -liveMembers -members -messages'
      )
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
  getChannelUsers: async (req, res) => {
    try {
      let channel = await Channel.findOne({ title: req.params.roomName })
        .populate('liveMembers')
        .populate({ path: 'messages', populate: { path: 'author' } })
        .exec()

      res.send(channel)
    } catch (error) {
      res.status(400).send(error)
    }
  },
  getChannelMessages: async (req, res) => {
    try {
      let channel = await Channel.findOne({ title: req.params.roomName })

      res.send(channel.messages)
    } catch (error) {
      res.status(400).send(error)
    }
  },
  addLiveMember: async (query, userId, socketId) => {
    try {
      let channel = await Channel.findOne({ title: query })
        .populate('liveMembers')
        .exec()

      let user = await User.findById(userId)

      if (user) {
        channel.liveMembers = channel.liveMembers.filter(
          member => member._id.toString() !== userId
        )

        if (
          !channel.liveMembers.find(member => member._id.toString() === userId)
        ) {
          channel.liveMembers.push(user)
        }

        await channel.save()

        return channel
      } else {
        return new Error(`No user was found with ${userId}`)
      }
    } catch (error) {
      console.log(error)
    }
  },
  removeLiveMember: async (query, userId) => {
    try {
      let channels = await Channel.updateMany(
        {},
        { $pull: { liveMembers: userId } },
        { multi: true }
      )

      let channel = await Channel.findOne({ title: query })
      let data = await channel.populate('liveMembers').execPopulate()

      return data
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
