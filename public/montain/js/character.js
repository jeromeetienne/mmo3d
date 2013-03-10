//////////////////////////////////////////////////////////////////////////////////
// require.js module definition
define( [  'tquery.minecraft'
], function(){
//////////////////////////////////////////////////////////////////////////////////
	

var Character	= function(opts){
	// handle default values
	this._opts	= opts	= tQuery.extend(opts, {
		world		: tQuery.world
	});
	// handle parameter check
	console.assert(opts.sourceId)
	console.assert(opts.userInfo)
	
	this._sourceId	= opts.sourceId;
	this._userInfo	= opts.userInfo;
	
	// create the minecraft character
	var skinUrl	= '../../vendor/tquery/plugins/minecraft/examples/images/'+opts.userInfo.skinBasename;
	this._character	= tQuery.createMinecraftChar({
		skinUrl	: skinUrl
	}).addTo(opts.world);
	var character3D	= this._character.object3D('root');
	tQuery('mesh', character3D).castShadow(true)
	// add a class
	character3D.addClass('character')
	// add a nickname cartouche
	var canvas	= this._buildNickCartouche(this._userInfo.nickName);
	tQuery.createSprite().addTo(character3D)
		.addClass('cartouche')
		.scaleBy(1.3)
		.positionY(1.1)
		.setSpriteMaterial()
			.map(canvas)
			.back()
		
	// init bodyAnims
	this._bodyAnims	= new tQuery.MinecraftCharAnimations(this._character);
	this._bodyAnims.start('run');
	// init headAnims
	this._headAnims	= new tQuery.MinecraftCharHeadAnimations(this._character);
	this._headAnims.start('still');

	// update this._bodyAnim depending on velocity
	var prevRotation= tQuery.createVector3();
	var prevPosition= tQuery.createVector3();
	this._timerId	= setInterval(function(){
		// compute player velocity
		var velocity	= character3D.position().clone().sub(prevPosition);
		// set bodyAnim according to velocity value
		var animName	= velocity.length() ? 'run' : 'stand';
		this._bodyAnims.start(animName);
		// update player.prevPosition/player.prevRotation
		prevPosition.copy( character3D.position() )
		prevRotation.copy( character3D.rotation() )
	}.bind(this), 1000/5);	// Important to be less than framerate - thus you dont misdetect still 

	yeller.addEventListener('clientBroadcast.positionChange.'+this._sourceId, function(data){
		var message	= data.message;
		var position	= message.position;
		var rotation	= message.rotation;
		character3D.positionX( position.x )
		character3D.positionY( position.y )
		character3D.positionZ( position.z )
		character3D.rotationX( rotation.x )
		character3D.rotationY( rotation.y )
		character3D.rotationZ( rotation.z )
	}.bind(this));

	yeller.addEventListener('clientBroadcast.chatText.'+this._sourceId, function(data){
		var message	= data.message;
		var text	= message.text;
		this.say(text);
	}.bind(this));

	yeller.addEventListener('userInfo.update.'+this._sourceId, function(curUserInfo){
		if( curUserInfo.skinBasename !== this._userInfo.skinBasename ){
			this.skinBasename(curUserInfo.skinBasename)
		}
		if( curUserInfo.nickName !== this._userInfo.nickName ){
			this.nickName(curUserInfo.nickName)
		}
	}.bind(this));
};

Character.prototype.destroy = function() {
	this.object3D().detach();
	this._bodyAnims.stop();
	this._headAnims.stop();
	clearInterval(this._timerId)
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

Character.prototype.object3D = function(){
	var character3D	= this._character.object3D('root');		
	return character3D;
};

Character.prototype.userInfo = function(){
	var userInfo	= this._userInfo
	return userInfo;
};

/**
 * getter for sourceId
 * @return {String} opaque string which identify this character
 */
Character.prototype.sourceId = function() {
	return this._sourceId;
};

Character.prototype.nickName = function(value){
	var userInfo	= this._userInfo
	
	if( value === undefined )	return userInfo.nickName;

	userInfo.nickName	= value;

	var character3D	= this._character.object3D('root');		
	var texture	= tQuery('.cartouche', character3D).get(0).material.map;
	texture.image	= this._buildNickCartouche(userInfo.nickName)
	texture.needsUpdate	= true;
	// TODO reenable sound
	sounds.nickChange	&& sounds.nickChange.play()
};

Character.prototype.skinBasename = function(value){
	var userInfo	= this._userInfo
	
	if( value === undefined )	return userInfo.skinBasename;

	userInfo.skinBasename	= value;

	var skinUrl	= '../../vendor/tquery/plugins/minecraft/examples/images/'+userInfo.skinBasename;
	this._character.loadSkin(skinUrl)
	// play sound
	sounds.skinChange	&& sounds.skinChange.play()
};

Character.prototype.say = function(text){
	var character3D	= this.object3D();
	// remove previous message if any
	tQuery('.chatMessage', character3D).detach()
	// add text
	var canvas	= this._buildChatBubble(text);
	var sprite	= tQuery.createSprite().addTo(character3D)
		.translateY(1.4).scaleBy(4)
		.addClass('chatMessage')
		.setSpriteMaterial()
			.map(canvas)
			.back()

	// remove the text after a while
	// TODO handle stopping this timer
	setTimeout(function(){
		sprite.detach();
	}, 10*1000);
	// play sound
	sounds.chatReceived	&& sounds.chatReceived.play()
};

//////////////////////////////////////////////////////////////////////////////////
//		static function							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Build a canvas for the chat bubble
 */
Character.prototype._buildChatBubble = function(text) {
	// create the canvas
	var canvas	= document.createElement("canvas");
	var context	= canvas.getContext("2d");
	canvas.width	= 1024;
	canvas.height	= 512;
	// center the origin
	context.translate( canvas.width/2, canvas.height/2 );
	// measure text
	var fontSize	= 24;
	context.font	= "bolder "+fontSize+"px Verdana";
	var fontH	= fontSize;
	var fontW	= context.measureText(text).width;
	// build the background
	context.fillStyle = "rgba(255,255,255,0.3)";
	var scale	= 1.2;
	context.fillRect(-fontW*scale/2,-fontH*scale/1.3,fontW*scale,fontH*scale)
	// display the text
	context.fillStyle = "rgba(0,0,0,0.7)";
	context.fillText(text, -fontW/2, 0);
	// return the canvas element
	return canvas;
};

/**
 * Build a canvas for the nickname cartouche
 */
Character.prototype._buildNickCartouche = function(text){
	// create the canvas
	var canvas	= document.createElement("canvas");
	var context	= canvas.getContext("2d");
	canvas.width	= 256;
	canvas.height	= 128;
	// center the origin
	context.translate( canvas.width/2, canvas.height/2 );
	// measure text
	var fontSize	= 36;
	context.font	= "bolder "+fontSize+"px Verdana";
	var fontH	= fontSize;
	var fontW	= context.measureText(text).width;
	// build the background
	context.fillStyle = "rgba(0,0,255,0.3)";
	var scale	= 1.2;
	context.fillRect(-fontW*scale/2,-fontH*scale/1.3,fontW*scale,fontH*scale)
	// display the text
	context.fillStyle = "rgba(0,0,0,0.7)";
	context.fillText(text, -fontW/2, 0);
	// return the canvas element
	return canvas;
};


//////////////////////////////////////////////////////////////////////////////////
// require.js module definition END

// export to global namespace
window.Character	= Character;
});	
// end of require.js define()
//////////////////////////////////////////////////////////////////////////////////
