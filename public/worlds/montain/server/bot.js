var Bot	= function(room){
	this._room	= room;
	this._sourceId	= 'botClientID-'+Math.floor(Math.random()*10000).toString(16);
	this._userInfo	= {
		nickName	: 'Jumper-'+Math.floor(Math.random()*100).toString(16),
		skinBasename	: 'char.png',
	};

	this._room.emit('userJoin', {
		sourceId	: this._sourceId,
		userInfo	: this._userInfo
	});
	
	// encode the positionChange parameter
	this._positionChange	= {
		type		: 'positionChange',
		position	: {
			x	: 0,
			y	: 0,
			z	: 0,
		},
		rotation	: {
			x	: 0,
			y	: 0,
			z	: 0
		}
	};
}

Bot.prototype.destroy = function() {
	this._room.emit('userLeft', {
		sourceId	: this._sourceId
	});
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

Bot.prototype.sourceId = function() {
	return this._sourceId;
};

Bot.prototype.userInfo = function() {
	return this._userInfo;
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

Bot.prototype.update = function(delta, now) {
	//console.log('update bot', this._userInfo.nickName)
	//
	var angle	= 0.2 * now * Math.PI * 2;
	this._positionChange.position.x	= 2.0 * Math.cos(angle);
	this._positionChange.position.y	= 0.2 * Math.abs(Math.cos(4*angle));
	this._positionChange.position.z	= 2.0 * Math.sin(angle);
	this._positionChange.rotation.y	= -(Math.PI-(- angle - Math.PI));

	this._room.emit('clientEcho', {
		sourceId	: this._sourceId,
		message		: this._positionChange
	});
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

// export the module in node.js
if( typeof(window) === 'undefined' )	module.exports = Bot;

