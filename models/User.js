const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var uniqueValidator = require('mongoose-unique-validator')

let userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: 'Email is required'
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: 'Username is required'
    },
    password: {
      type: String,
      required: 'Password is Required'
    },
    photo: {
      type: String,
      default: ''
    },
    messages: [{ type: mongoose.Schema.ObjectId, ref: 'Message' }]
  },
  {
    timestamps: true
  }
)

userSchema.plugin(uniqueValidator)

userSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    let salt = await bcrypt.genSalt(8)
    user.password = await bcrypt.hash(user.password, salt)
  }
  next()
})

userSchema.methods.generateAuthToken = async function() {
  const user = this

  let token = jwt.sign(
    {
      _id: user._id.toString(),
      username: user.username
    },
    process.env.USER_SECRET_KEY,
    {
      expiresIn: 3600
    }
  )

  return token
}

userSchema.statics.comparePassword = async function(username, password) {
  const user = await User.findOne({ username })

  if (!user) {
    throw 'User not found, please sign up'
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw 'Check your email or password'
  }

  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
