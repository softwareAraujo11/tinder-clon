// socket.js
const Message = require('./models/Message');
const User = require('./models/User');

function configureSocket(io) {
  io.on('connection', (socket) => {
    console.log('Usuario conectado vía socket:', socket.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Usuario unido a la sala: ${roomId}`);
    });

    socket.on('sendMessage', async ({ senderUuid, receiverUuid, content }) => {
      try {
        const sender = await User.findOne({ uuid: senderUuid });
        const receiver = await User.findOne({ uuid: receiverUuid });

        if (!sender || !receiver) {
          socket.emit('message_error', { message: 'Remitente o receptor no encontrado' });
          return;
        }

        const newMessage = new Message({
          senderUuid,
          receiverUuid,
          content,
        });

        const savedMessage = await newMessage.save();

        const roomId = [senderUuid, receiverUuid].sort().join('_');

        io.to(roomId).emit('receive_message', {
          _id: savedMessage._id,
          senderUuid,
          receiverUuid,
          content,
          timestamp: savedMessage.timestamp,
        });
      } catch (error) {
        console.error('Error al guardar o emitir mensaje:', error);
        socket.emit('message_error', { message: 'Error interno del servidor' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });
}

module.exports = configureSocket;
