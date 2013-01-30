var app		= require('express')()

var listenPort	= process.argv[2] || 80;
console.log('listen on', '0.0.0.0:'+listenPort)

var server	= require('http').createServer(app)
server.listen(listenPort);

// export static files
app.use(require('express').static(__dirname + '/'));


/**
 * Note on transition
 * - rooms = { 'roomName' : { roomName: name, usersList : userslist }
 * - userslist == { socket: , userInfo}
*/

var usersInfo	= {}
var io		= require('socket.io').listen(server);
io.set('log level', 2);
io.sockets.on('connection', function(socket){
console.log('socket', socket)
	socket.emit('connected', {
		sourceId	: socket.id,
		usersInfo	: usersInfo
	});
	// handle userInfo
	socket.on('userInfo', function(data){
		usersInfo[this.id]	= data;
		io.sockets.emit('userInfo', {
			sourceId	: this.id,
			userInfo	: data
		});
	});
	// handle disconnection
	socket.on('disconnect', function(){
		socket.broadcast.emit('userLeft', {
			sourceId	: this.id
		});
		delete usersInfo[this.id]		
	})
	// handle ping
	socket.on('ping', function(data){
		socket.emit('pong', data);
	});
	// handle clientEcho
	socket.on('clientEcho', function(data){
		io.sockets.emit('clientEcho', {
			sourceId	: this.id,
			message		: data
		});
	});
	// handle clientEcho
	socket.on('clientBroadcast', function(data){
		socket.broadcast.emit('clientBroadcast', {
			sourceId	: this.id,
			message		: data
		});
	});
});