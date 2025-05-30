// socket.js
const Message = require('./models/Message');

function configureSocket(io) {
  io.on('connection', (socket) => {
    console.log('Usuario conectado al socket', socket.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    socket.on('sendMessage', async ({ senderUuid, receiverUuid, content }) => {
      try {
        const newMessage = new Message({
          senderUuid,
          receiverUuid,
          content,
        });

        const savedMessage = await newMessage.save();

        const roomId = [senderUuid, receiverUuid].sort().join('_');
        io.to(roomId).emit('receive_message', savedMessage);
      } catch (error) {
        socket.emit('message_error', { message: 'Error interno del servidor' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado del socket', socket.id);
    });
  });
}

module.exports = configureSocket;
