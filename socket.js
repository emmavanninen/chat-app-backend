let messageController = require('./controllers/message')

module.exports = {
  init: async io => {
    io.on('connection', socket => {
      console.log('new client connected', socket.id)

      socket.on('message', socket => {
        console.log(socket)
      })

      socket.on('createMessage', async socket => {
        let messageData = {
          author: socket.author,
          body: socket.body,
          created: socket.created
        }
        try {
          let message = await messageController.create(messageData)

          io.sockets.emit('chat', message)
        } catch (error) {
          console.log(error)
        }
      })

      socket.on('disconnect', () => {
        console.log('client disconnected')
      })
    })
  }
}
