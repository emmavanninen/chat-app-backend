const messageController = require('./controllers/message')
const channelController = require('./controllers/channel')

const createMessage = async (data, io) => {
  let messageData = {
    author: data.author,
    body: data.body,
    created: data.created,
    channel: data.channel
  }

  try {
    let message = await messageController.create(messageData)
    io.sockets.emit('chat', message)
  } catch (error) {
    console.log(error)
  }
}

const createChannel = async roomName => {
  let channelData = {
    title: roomName
  }
  try {
    let channel = await channelController.createChannel(channelData)
    console.log('channel created ', channel)
  } catch (error) {
    console.log(error)
  }
}

const init = async io => {
  io.on('connection', socket => {
    socket.on('getUsers', async roomName => {
      try {
        // uncomment to seed a General channel
        // await createChannel(roomName)
        let channel = await channelController.getChannelByName(roomName)

        io.emit('chatroomUsers', channel.liveMembers)
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('createMessage', message => {
      createMessage(message, io)
    })

    socket.on('sendUserToServer', async (user, roomName) => {
      let channel = await channelController.addLiveMember(
        roomName,
        user._id,
        socket.id
      )

      io.emit('chatroomUsers', channel.liveMembers)
    })

    socket.on('removeUserFromActiveChat', async (user, roomName) => {
      try {
        let channel = await channelController.removeLiveMember(
          roomName,
          user._id
        )

        if (channel) {
          io.sockets.emit('chatroomUsers', channel.liveMembers)
        }
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('disconnect', async () => {
      // console.log('disconnected')
    })
  })
}

module.exports = { init }
