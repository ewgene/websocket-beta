const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({ port: 8000 });

webSocketServer.on('connection', webSocket => {
	webSocket.on('message', message => {
		try {
			JSON.parse(message)
		} catch(e) {
			sendError(ws, 'Wrong format');
			return;
		}
		console.log('Received:', message);
		broadcast(message);
		});
	});

	function broadcast(data) {
		webSocketServer.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
}