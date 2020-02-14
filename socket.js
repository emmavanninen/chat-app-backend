const messageController = require('./controllers/message')
const channelController = require('./controllers/channel')

const createMessage = async (data, io, roomName) => {
  let messageData = {
    author: data.author,
    body: data.body,
    created: data.created,
    channel: data.channel
  }

  try {
    let message = await messageController.create(messageData)
    io.to(roomName).emit('chat', message)
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
  } catch (error) {
    console.log(error)
  }
}

const init = async io => {
  io.on('connection', socket => {
    let { roomName } = socket.handshake.query

    socket.join(roomName)

    socket.on('getUsers', async roomName => {
      try {
        // await createChannel('General')
        // uncomment to seed a General channel
        let channel = await channelController.getChannelByName(roomName)

        io.to(roomName).emit('chatroomUsers', channel.liveMembers)
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('createNewChannel', async () => {
      await createChannel(roomName)
    })

    socket.on('createMessage', message => {
      createMessage(message, io, roomName)
    })

    socket.on('sendUserToServer', async (user, roomName) => {
      let channel = await channelController.addLiveMember(
        roomName,
        user._id,
        socket.id
      )

      io.to(roomName).emit('chatroomUsers', channel.liveMembers)
    })

    socket.on('removeUserFromActiveChat', async (user, roomName) => {
      try {
        let channel = await channelController.removeLiveMember(
          roomName,
          user._id
        )

        if (channel) {
          io.emit('chatroomUsers', channel.liveMembers, user._id, true)
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
