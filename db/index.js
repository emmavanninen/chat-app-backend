const mongoose = require('mongoose')

module.exports = async () => {
  try {
    mongoose.set('useCreateIndex', true)

    await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
  } catch (error) {
    console.log(error)
  }
}
