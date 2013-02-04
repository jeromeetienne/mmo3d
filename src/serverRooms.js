var ServerRooms	= function(io){
	this._rooms	= {};
	this._io	= io;
}

ServerRooms.prototype.destroy = function() {
	// body...
};

// export the module in node.js
if( typeof(window) === 'undefined' )	module.exports = ServerRooms;

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

ServerRooms.prototype.join = function(roomName, socket) {
	// create the room if needed
	if( this._rooms[roomName] === undefined ){
		var worldName	= roomName.split('/')[0];
		var filepath	= '../public/worlds/'+worldName+'/server/room';
		var RoomClass	= require(filepath);
		this._rooms[roomName]	= new RoomClass(roomName, this._io);
	}
	// get the room
	var room	= this._rooms[roomName];
	// add the socket
	room.join(socket)
	// return the room
	return room;
}

ServerRooms.prototype.leave = function(roomName, socket) {
	// get the room
	var room	= this._rooms[roomName];
	if( room === undefined )	return;
	console.assert( room !== undefined );
	// remove the socket
	room.leave(socket);
	// destroy the room if empty
	if( room.count() === 0 ){
		room.destroy();
		delete this._rooms[roomName];
	}
}

ServerRooms.prototype.exists	= function(roomName){
	return this._rooms[roomName]	? true : false;
};

ServerRooms.prototype.get	= function(roomName){
	console.assert( this.exists(roomName) );
	return this._rooms[roomName];
};

/**
 * update each rooms
 * 
 * @param  {Number} delta seconds since last update
 * @param  {Number} now   seconds since the begining of time
 */
ServerRooms.prototype.update = function(delta, now){
	Object.keys(this._rooms).forEach(function(roomName){
		var room	= this._rooms[roomName];
		room.update(delta, now)
	}.bind(this));
}
