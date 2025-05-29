// socket.js
const Message = require('./models/Message');
const User = require('./models/User');

function configureSocket(io) {
  io.on('connection', (socket) => {

    socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
      try {
        const sender = await User.findOne({ id: senderId });
        const receiver = await User.findOne({ id: receiverId });

        if (!sender || !receiver) {
          socket.emit('message_error', { message: 'Remitente o receptor no encontrado' });
          return;
        }

        const newMessage = new Message({
          senderId,
          receiverId,
          content,
        });

        const savedMessage = await newMessage.save();

        io.emit('receive_message', {
          senderId,
          receiverId,
          content,
          timestamp: savedMessage.timestamp,
          senderName: sender.name,
        });
      } catch (error) {
        socket.emit('message_error', { message: 'Error interno del servidor' });
      }
    });

    socket.on('disconnect', () => {});
  });
}

module.exports = configureSocket;
