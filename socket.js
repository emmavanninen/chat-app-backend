const messageController = require('./controllers/message')

let chatroom = []

const refreshChatroom = io => {
  console.log('refresh chatroom hit')
  io.sockets.emit('chatroomUsers', chatroom)
}

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

const init = async io => {
  io.on('connection', socket => {
    console.log('connected ', socket.id)

    socket.on('createMessage', data => {
      createMessage(io)
    })

    socket.on('test', data => {
      console.log('hit')
    })

    socket.on('getChatroomUsers', () => {
      refreshChatroom(io)
    })

    socket.on('sendUserToServer', data => {
      console.log('======================')
      console.log(' 4 made it to send user to server ', data)
      if (!chatroom.find(item => item._id === data._id)) {
        console.log(chatroom.length)
        chatroom.push({ ...data, socketId: socket.id })
        console.log(chatroom.length)
        io.sockets.emit('chatroomUsers', chatroom)
      }
    })

    socket.on('disconnect', () => {
      chatroom = chatroom.filter(user => user.socketId !== socket.id)
      io.sockets.emit('chatroomUsers', chatroom)
    })
  })
}

module.exports = { init }
