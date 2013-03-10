//////////////////////////////////////////////////////////////////////////////////
// require.js module definition
define( [ 'tquery.playerinput'
	, 'js/character'
], function(){
//////////////////////////////////////////////////////////////////////////////////


var Player	= function(opts){
	// call parent
	Character.call(this, opts);
	// handle default values
	opts	= tQuery.extend(opts, {
		world	: tQuery.world,
	});
	// sanity check
	console.assert( opts.gameServer );

	var world	= opts.world;
	this._gameServer= opts.gameServer;
	var character3D	= this.object3D();
	
	character3D.addClass('player')
	
	// to enable a tracking camera
	var cameraControls	= tQuery.createCameraFpsControls({
		trackedObject	: character3D.get(0),
		tCamera		: world.tCamera(),
		deltaCamera	: tQuery.createVector3(0, 1.5, -3).setLength(3),

	});
	world.setCameraControls(cameraControls)

	//////////////////////////////////////////////////////////////////////////
	// init player input							//
	//////////////////////////////////////////////////////////////////////////
	var onMobile	= 'ontouchstart' in window ? true : false;
	var playerInput	= tQuery.createPlayerInput();
	// TOTO make them compatible one with the others. 
	onMobile === true	&& tQuery.PlayerInput.createVirtualJoystick(playerInput)
	onMobile === false 	&& tQuery.PlayerInput.createKeyboard(playerInput)

	//////////////////////////////////////////////////////////////////////////
	// user controls on keyboard						//
	//////////////////////////////////////////////////////////////////////////
	var controls	= tQuery.createMinecraftCharControls(this._character)
		.input(playerInput)

	
	// test if the character is out of the world
	world.loop().hook(function(){
		var position	= character3D.position();
		var maxLength	= 16;
		if( position.length() > maxLength ){
			position.setLength(maxLength)				
		}
	});
	
	// emit playerMove to yeller
	world.loop().hook(function(){
		yeller.dispatchEvent('playerMove', character3D);
	});
};

/**
 * destructor
 */
Player.prototype.destroy = function() {
};

Player.prototype = Object.create( Character.prototype );

/**
 * make it say something
 * @param  {string} text the text to say
 */
Player.prototype.say = function(text){
	// call parent function
	Character.prototype.say.apply(this, arguments)
	// send it to the server
	gameServer.clientBroadcast({
		type	: 'chatText',
		text	: text,
	});
};

/**
 * getter/setter for userInfo's nickName
 * @param  {string|undefined} value 
 */
Player.prototype.nickName = function(value){
	if( value === undefined ){
		return Character.prototype.nickName.apply(this, arguments)		
	}
	// call parent function
	Character.prototype.nickName.apply(this, arguments)
	// send it to the server
	var userInfo	= this.userInfo();
	gameServer.userInfo( userInfo );
};

/**
 * getter/setter for userInfo's skinBasename
 * @param  {string|undefined} value 
 */
Player.prototype.skinBasename = function(value){
	if( value === undefined ){
		return Character.prototype.skinBasename.apply(this, arguments)		
	}
	// call parent function
	Character.prototype.skinBasename.apply(this, arguments)
	// send it to the server
	var userInfo	= this.userInfo();
	gameServer.userInfo( userInfo );
};

//////////////////////////////////////////////////////////////////////////////////
// require.js module definition END

// export to global namespace
window.Player	= Player;
});	
// end of require.js define()
//////////////////////////////////////////////////////////////////////////////////
