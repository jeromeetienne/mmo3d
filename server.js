var app		= require('express')()

var listenPort	= process.argv[2] || 8000;
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

/**
 * to store the rooms object
 * @type {Object} key are the roomname and value are the server side of the room
 */
var rooms	= {};

var roomJoin	= function(roomName, socket){
	// create the room if needed
	if( rooms[roomName] === undefined ){
		var worldName	= roomName.split('/')[0];
		var filepath	= './public/worlds/'+worldName+'/room';
		var RoomClass	= require(filepath);
		rooms[roomName]	= new RoomClass(roomName);
	}
	// get the room
	var room	= rooms[roomName];
	// add the socket
	room.addSocket(socket)
	// return the room
	return room;
}

var roomLeave	= function(roomName, socket){
	// get the room
	var room	= rooms[roomName];
	console.assert( room !== undefined );
	// remove the socket
	room.removeSocket(socket);
	// destroy the room if empty
	if( room.countSockets() === 0 ){
		room.destroy();
		delete rooms[roomName];
	}
}

/**
 * update each rooms
 * 
 * @param  {Number} delta seconds since last update
 * @param  {Number} now   seconds since the begining of time
 */
 */
var roomUpdate	= function(delta, now){
	rooms.forEach(function(room){
		room.update(delta, now)
	});
}

var io		= require('socket.io').listen(server);
io.set('log level', 2);
io.sockets.on('connection', function(socket){
	var roomName	= null;
	var userInfo	= null;
	var sourceId	= socket.id;

	socket.on('joinRoom', function(data){
		console.log('********** JOIN', data)
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
		
		roomJoin(roomName, socket);
		
		
		
		// acknowledge the join to the sender
		var usersInfo	= {};
		io.sockets.clients(roomName).forEach(function(client){
			usersInfo[client.id]	= client._smmo.userInfo;
		});
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
		
		roomLeave(roomName, socket);
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