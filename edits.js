var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8080');

ws.on('open', function () {
	var msg = {
		type: 'auth',
		uid: 'unique_id_1234',
		services: [
			'Google Play Music'
		]
	};
	ws.send(Buffer.from(JSON.stringify(msg)));
});

ws.on('message', function (msg) {
	console.log(JSON.parse(msg.toString('utf8')));
});