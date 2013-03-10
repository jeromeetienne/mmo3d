var Bot	= function(room){
	this._room	= room;
	this._sourceId	= 'botClientID-'+Math.floor(Math.random()*10000).toString(16);
	this._userInfo	= {
		nickName	: 'Jumpy-'+Math.floor(Math.random()*100).toString(16),
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
	var angle	= 0.2 * now * Math.PI * 2;
	this._positionChange.position.x	= 2.0 * Math.cos(angle);
	this._positionChange.position.y	= 0.2 * Math.abs(Math.cos(4*angle));
	this._positionChange.position.z	= 2.0 * Math.sin(angle);
	this._positionChange.rotation.y	= -angle;

	this._room.emit('clientBroadcast', {
		sourceId: this._sourceId,
		message	: this._positionChange
	});

	if( Math.random() < 1/100 ){
return		
		var nickName	= 'Jumpy-'+Math.floor(Math.random()*100).toString(16);
		this.nickName(nickName)
	}
	
	if( Math.random() < 1/100 ){
return		
		var sentences	= [
			'I am me! Are you you?',
			'I gonna kick your ass!',
			'Chuck Noris beats elvis anyday!',
			'I need love :('
		];
		var idx		= Math.floor(Math.random() * sentences.length);
		var sentence	= sentences[idx];
		this.say(sentence);
	}
};


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

Bot.prototype.say = function(text){
	this._room.emit('clientBroadcast', {
		sourceId	: this._sourceId,
		message		: {
			type	: 'chatText',
			text	: text
		}
	});
};

Bot.prototype.nickName = function(value){
	// if it is a getter, return the value
	if( value === undefined )	return this._userInfo.nickName;
	// set the new value
	this._userInfo.nickName	= value;
	// send update
	this._room.emit('userInfo', {
		sourceId	: this._sourceId,
		userInfo	: this._userInfo
	});
};

Bot.prototype.skinBasename = function(value){
	// if it is a getter, return the value
	if( value === undefined )	return this._userInfo.skinBasename;
	// set the new value
	this._userInfo.skinBasename	= value;
	// send update
	this._room.emit('userInfo', {
		sourceId	: this._sourceId,
		userInfo	: this._userInfo
	});
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

// export the module in node.js
if( typeof(window) === 'undefined' )	module.exports = Bot;

