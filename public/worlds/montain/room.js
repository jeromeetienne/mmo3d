/**
 * handle the server side for this world
 */
var Room	= function(){
	console.log('Room ctor');
	this._sockets	= [];
};

/**
 * destructor
 */
Room.prototype.destroy	= function(){
	console.log('Room dtor');
	console.assert(this.count() === 0);
};

/**
 * update this room
 * @param  {Number} delta seconds since last update
 * @param  {Number} now   seconds since the begining of time
 */
Room.prototype.update	= function(delta, now){
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

