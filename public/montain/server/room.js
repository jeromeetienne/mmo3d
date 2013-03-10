/**
 * handle the server side for this world
 */
var Room	= function(roomName, io){
	console.log('Room ctor');
	this._sockets		= [];
	this._bots		= [];
	this._roomName		= roomName;
	this._io		= io;

	// create a bot
	var Bot	= require('./bot.js')
	this._bots.push(new Bot(this));
};

/**
 * destructor
 */
Room.prototype.destroy	= function(){
	console.log('Room dtor');
	console.assert(this.count() === 0);
};



//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////


/**
 * update this room
 * @param  {Number} delta seconds since last update
 * @param  {Number} now   seconds since the begining of time
 */
Room.prototype.update	= function(delta, now){
	this._bots.forEach(function(bot){
		bot.update(delta, now)
	})
}

Room.prototype.emit = function(event, message) {
	var sockets	= this._io.sockets;
	var roomName	= this._roomName;
	sockets.in(roomName).emit(event, message);
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

Room.prototype.usersInfo = function() {
	var usersInfo	= [];
	this._bots.forEach(function(bot){
		usersInfo[bot.sourceId()]	= bot.userInfo();
	})
	return usersInfo;
};

Room.prototype.roomName = function() {
	return this._roomName;
};

Room.prototype.join	= function(socket){
	this._sockets.push(socket);
};

Room.prototype.leave	= function(socket){
	var index	= this._sockets.indexOf(socket);
	console.assert( index !== -1 );
	this._sockets.splice(index, 1);
};

Room.prototype.contain	= function(socket){
	var index	= this._sockets.indexOf(socket);
	return index !== -1 ? true : false;
};

Room.prototype.count	= function() {
	return this._sockets.length;
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

// export the module in node.js
if( typeof(window) === 'undefined' )	module.exports = Room;

