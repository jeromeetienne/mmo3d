var express	= require('express');
var app		= express()

var listenPort	= process.argv[2] || 8000;
console.log('listen on', '0.0.0.0:'+listenPort)

var server	= require('http').createServer(app)
server.listen(listenPort);

// export static files
app.use('/worlds', express.static(__dirname + '/../public/worlds'));
app.use('/sounds', express.static(__dirname + '/../public/sounds'));
app.use('/vendor', express.static(__dirname + '/../public/vendor'));
app.use('/montain', express.static(__dirname + '/../public/montain'));

app.use('/', express.static(__dirname + '/..'));


/**
 * Note on transition
 * - rooms = { 'roomName' : { roomName: name, usersList : userslist }
 * - userslist == { socket: , userInfo}
*/

var io		= require('socket.io').listen(server);
var serverRooms	= new (require('./serverRooms'))(io);


var updatePeriod= 1/60;
setInterval(function(){
	var now		= Date.now()/1000;
	serverRooms.update(updatePeriod, now);
}, updatePeriod*1000)

io.set('log level', 2);
io.sockets.on('connection', function(socket){
	var roomName	= null;
	var userInfo	= null;
	var sourceId	= socket.id;

	socket.on('joinRoom', function(data){
		console.log('********** JOIN', data, socket.id)
		// copy parameters
		roomName	= data.roomName;
		userInfo	= data.userInfo;
		// store info in the socket
		console.assert( socket._smmo === undefined );
		socket._smmo	= {
			roomName	: roomName,
			userInfo	: userInfo
		};
		// join the room
		socket.join(roomName);
		
		serverRooms.join(roomName, socket);
		
		// acknowledge the join to the sender
		var usersInfo	= {};
		io.sockets.clients(roomName).forEach(function(client){
			usersInfo[client.id]	= client._smmo.userInfo;
		});
		
		// update usersInfo with botsInfo
		var botsUserInfo= serverRooms.get(roomName).usersInfo();
		Object.keys(botsUserInfo).forEach(function(sourceId){
			var userInfo		= botsUserInfo[sourceId]
			usersInfo[sourceId]	= userInfo;
		});
			
		// tell this socket, the room is joined
		socket.emit('roomJoined', {
			sourceId	: sourceId,
			usersInfo	: usersInfo
		});
		// tell everybody in the room you joined		
		io.sockets.in(roomName).emit('userInfo', {
			sourceId	: sourceId,
			userInfo	: userInfo
		});
	});


	// handle userInfo
	socket.on('userInfo', function(data){
		console.assert( socket._smmo !== undefined );
		userInfo	= socket._smmo.userInfo = data;
		io.sockets.in(roomName).emit('userInfo', {
			sourceId	: sourceId,
			userInfo	: userInfo
		});
	});

	// // handle disconnection
	socket.on('disconnect', function(){
		console.log('client', sourceId, 'disconnect')
		io.sockets.in(roomName).emit('userLeft', {
			sourceId	: sourceId,
			reason		: 'disconnect'
		});
		serverRooms.leave(roomName, socket);
	})
	
	//////////////////////////////////////////////////////////////////////////
	//		ping/pong						//
	//////////////////////////////////////////////////////////////////////////

	// handle ping
	socket.on('ping', function(data){
		socket.emit('pong', data);
	});


	//////////////////////////////////////////////////////////////////////////
	//		echo/broadcast						//
	//////////////////////////////////////////////////////////////////////////

	// handle clientEcho
	socket.on('clientEcho', function(data){
		io.sockets.in(roomName).emit('clientEcho', {
			sourceId	: this.id,
			message		: data
		});
	});
	// handle clientEcho
	socket.on('clientBroadcast', function(data){
		socket.broadcast.to(roomName).emit('clientBroadcast', {
			sourceId	: sourceId,
			message		: data
		});
	});
});