const mongoose = require('mongoose')

let uniqueValidator = require('mongoose-unique-validator')

let ChannelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Message'
      }
    ],
    liveMembers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
)

ChannelSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Channel', ChannelSchema)
