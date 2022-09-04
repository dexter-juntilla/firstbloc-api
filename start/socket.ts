import Ws from 'App/Services/Ws';
Ws.boot();

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
	socket.emit('news', { hello: 'world' });

	// client sends message to send-message with the values
	socket.on('send-message', (data) => {
		console.log(data);

		const { conversation_id } = data;
		socket.to(`${conversation_id}`).emit(data);
	});
});
