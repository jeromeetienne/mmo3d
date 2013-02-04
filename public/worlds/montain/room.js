/**
 * handle the server side for this world
 */
var Room	= function(){
	console.log('Room ctor');
	this._sockets		= [];
	this._botsUserInfo	= {};
	
	// create bot identity
	var clientId		= 'Bot-clientid-'+Math.floor(Math.random()*10000).toString(16);
	this._botsUserInfo[clientId]	= {
		nickName	: 'Bot-'+Math.floor(Math.random()*10000).toString(16),
		skinBasename	: 'char.png',
	};
};

/**
 * destructor
 */
Room.prototype.destroy	= function(){
	console.log('Room dtor');
	console.assert(this.count() === 0);
};

Room.prototype.botsUserInfo = function() {
	return this._botsUserInfo;
};

/**
 * update this room
 * @param  {Number} delta seconds since last update
 * @param  {Number} now   seconds since the begining of time
 */
Room.prototype.update	= function(delta, now){
// TODO how to handle bots at this level ?
// a cross world class ?
// - user info needed
// - location in the world too
}

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


// export the module in node.js
if( typeof(window) === 'undefined' )	module.exports = Room;

