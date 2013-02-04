var ServerRooms	= function(){
	this._rooms	= {};
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
		var filepath	= '../public/worlds/'+worldName+'/room';
		var RoomClass	= require(filepath);
		this._rooms[roomName]	= new RoomClass(roomName);
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
	console.assert( room !== undefined );
	// remove the socket
	room.leave(socket);
	// destroy the room if empty
	if( room.count() === 0 ){
		room.destroy();
		delete this._rooms[roomName];
	}
}

/**
 * update each rooms
 * 
 * @param  {Number} delta seconds since last update
 * @param  {Number} now   seconds since the begining of time
 */
ServerRooms.prototype.update = function(delta, now){
	this._rooms.forEach(function(room){
		room.update(delta, now)
	});
}
