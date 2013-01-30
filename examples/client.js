var SimpleMMOServer	= function(roomName, userInfo, serverUrl){
	this._roomName	= roomName || '';	
	this._userInfo	= userInfo || {};
	serverUrl	= serverUrl || ''
	var socket	= io.connect(serverUrl);
	this._socket	= socket;

	//////////////////////////////////////////////////////////////////////////
	//		userInfo						//
	//////////////////////////////////////////////////////////////////////////
	this._sourceId	= null;
	this._usersInfo	= {};
	
	socket.emit('joinRoom', {
		roomName	: this._roomName,
		userInfo	: this._userInfo 
	});

	socket.on('roomJoined', function(data){
		console.log('roomJoined', data)
		console.assert(this._sourceId === null)
		this._sourceId	= data.sourceId;
		this._usersInfo	= data.usersInfo;
		this.dispatchEvent('roomJoined', this._sourceId, this._usersInfo);		
	}.bind(this));
	


	socket.on('connect', function(data){
		console.log('event connect')
	});

	
	socket.on('disconnect', function(socket){
		console.log('event disconnect')
	}.bind(this))

	// listen on user info
	socket.on('userInfo', function(data){
		console.log('received userInfo', JSON.stringify(data, null, '\t'))
		// 
		var oldUserInfo	= this._usersInfo[data.sourceId]
		// test if it is a new user
		var newUser	= oldUserInfo === undefined ? true : false;
		// update usersInfo
console.log('pre usersInfo', this._usersInfo, data.sourceId)
		this._usersInfo[data.sourceId]	= data.userInfo;
console.log('post usersInfo', this._usersInfo,  JSON.stringify(this._usersInfo, null, '\t'))
		// notify event
		if( newUser && data.sourceId !== this._sourceId){
			this.dispatchEvent('userJoin', data);			
		}
		
		this.dispatchEvent('userInfo', data.sourceId, data.userInfo, oldUserInfo);
	}.bind(this));

	// listen on userLeft
	socket.on('userLeft', function(data){
		console.log('received userLeft ', JSON.stringify(data, null, '\t'));

		var userInfo	= this._usersInfo[data.sourceId];
		delete this._usersInfo[data.sourceId]
		this.dispatchEvent('userLeft', {
			sourceId	: data.sourceId,
			userInfo	: userInfo
		});
	}.bind(this));

	//////////////////////////////////////////////////////////////////////////
	//		Ping							//
	//////////////////////////////////////////////////////////////////////////

	// ping server every seconds
	this._latency	= undefined;
	setInterval(function(){
		socket.emit('ping', { time	: Date.now() });
	}, 1000)
	socket.on('pong', function(data){
		var rtt		= Date.now() - data.time;
		var smoother	= 0.3;
		this._latency	= this._latency === undefined ? rtt : this._latency;
		this._latency	= (1-smoother)*this._latency  + smoother * rtt;
		//console.log('received pong. rtt ', rtt, 'ms.', 'Smoothed Latency:', this._latency);
		this.dispatchEvent('pong', data)
	}.bind(this));


	//////////////////////////////////////////////////////////////////////////
	//		client2client messaging					//
	//////////////////////////////////////////////////////////////////////////

	socket.on('clientEcho', function(data){
		this.dispatchEvent('clientEcho', data)
	}.bind(this));
	socket.on('clientBroadcast', function(data){
		this.dispatchEvent('clientBroadcast', data)
	}.bind(this));
}


SimpleMMOServer.prototype.clientEcho	= function(data){
	this._socket.emit('clientEcho', data)
}

SimpleMMOServer.prototype.clientBroadcast	= function(data){
	this._socket.emit('clientBroadcast', data)
}

SimpleMMOServer.prototype.latency	= function(){
	return this._latency;
}

SimpleMMOServer.prototype.usersInfo	= function(){
	return this._usersInfo;
}

SimpleMMOServer.prototype.userInfo	= function(value){
	if( value === undefined ) 	return this._userInfo;
	this._userInfo	= value;
	// emit  userInfo
	this._socket.emit('userInfo', this._userInfo);
	return this;
}
//////////////////////////////////////////////////////////////////////////////////
//		SimpleMMOServer microevent					//
//////////////////////////////////////////////////////////////////////////////////

SimpleMMOServer.MicroeventMixin	= function(destObj){
	destObj.addEventListener	= function(event, fct){
		if(this._events === undefined) 	this._events	= {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
		return fct;
	};
	destObj.removeEventListener	= function(event, fct){
		if(this._events === undefined) 	this._events	= {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	};
	destObj.dispatchEvent		= function(event /* , args... */){
		if(this._events === undefined) 	this._events	= {};
		if( this._events[event] === undefined )	return;
		var tmpArray	= this._events[event].slice(); 
		for(var i = 0; i < tmpArray.length; i++){
			tmpArray[i].apply(this, Array.prototype.slice.call(arguments, 1))
		}
	};
};

SimpleMMOServer.MicroeventMixin(SimpleMMOServer.prototype);


