const messageController = require('./controllers/message')
const channelController = require('./controllers/channel')

const createMessage = async (data, io) => {
  let messageData = {
    author: data.author,
    body: data.body,
    created: data.created
  }
  try {
    let message = await messageController.create(messageData)
    io.sockets.emit('chat', message)
  } catch (error) {
    console.log(error)
  }
}

const createChannel = async (data, io) => {
  let channelData = {
    title: 'main'
  }
  try {
    let channel = await channelController.createChannel(channelData)
    console.log('channel created', channel)
  } catch (error) {
    console.log(error)
  }
}

const init = async io => {
  io.on('connection', socket => {
    console.log('connected ', socket.id)

    // uncomment to seed a main channel
    // createChannel()

    socket.on('getUsers', async () => {
      try {
        let channel = await channelController.getChannelByName('main')

        io.emit('chatroomUsers', channel.liveMembers)
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('createMessage', data => {
      createMessage(data, io)
    })

    socket.on('sendUserToServer', async user => {
      let channel = await channelController.addLiveMember(
        'main',
        user._id,
        socket.id
      )

      io.emit('chatroomUsers', channel.liveMembers)
    })

    socket.on('removeUserFromActiveChat', async user => {
      try {
        let channel = await channelController.removeLiveMember('main', user._id)

        io.sockets.emit('chatroomUsers', channel.liveMembers)
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('disconnect', async () => {
      console.log('disconnected')
    })
  })
}

module.exports = { init }
