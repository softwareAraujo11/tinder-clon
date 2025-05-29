// socket.js
const Message = require('./models/Message');
const Match = require('./models/Match');

module.exports = (io) => {
  io.on('connection', (socket) => {

    socket.on('join_room', ({ userUuid1, userUuid2 }) => {
      const roomId = [userUuid1, userUuid2].sort().join('_');
      socket.join(roomId);
    });

    socket.on('sendMessage', async ({ senderUuid, receiverUuid, content }) => {
      if (!senderUuid || !receiverUuid || !content) {
        socket.emit('message_error', { message: 'Faltan datos para enviar el mensaje.' });
        return;
      }

      const matchExists = await Match.findOne({
        $or: [
          { user1Uuid: senderUuid, user2Uuid: receiverUuid },
          { user1Uuid: receiverUuid, user2Uuid: senderUuid }
        ]
      });

      if (!matchExists) {
        socket.emit('message_error', { message: 'No tienes un match con este usuario.' });
        return;
      }

      try {
        const newMessage = new Message({ senderUuid, receiverUuid, content });
        const savedMessage = await newMessage.save();

        const roomId = [senderUuid, receiverUuid].sort().join('_');
        io.to(roomId).emit('receive_message', savedMessage);
      } catch (error) {
        socket.emit('message_error', { message: 'Error al guardar el mensaje.' });
      }
    });

    socket.on('disconnect', () => {});
  });
};
