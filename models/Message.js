const mongoose = require('mongoose')

let MessageSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: 'Text is required'
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    created: {
      type: String
    },
    channel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Channel',
      required: 'Channel is required'
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Message', MessageSchema)
