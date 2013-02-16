//////////////////////////////////////////////////////////////////////////////////
// require.js module definition
define( [ 'tquery.minecraft'
], function(){
//////////////////////////////////////////////////////////////////////////////////
	

var Character	= function(opts){
	// handle default values
	this._opts	= opts	= tQuery.extend(opts, {
		world	: tQuery.world
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
	// add a nickname cartouche
	var canvas	= this._buildNickCartouche(this._userInfo.nickName);
	tQuery.createSprite().addTo(character3D)
		.addClass('cartouche')
		.scaleBy(1/200).positionY(1.1)
		.map(canvas)
	// init bodyAnims
	this._bodyAnims	= new tQuery.MinecraftCharAnimations(this._character);
	this._bodyAnims.start('run');
	// init headAnims
	this._headAnims	= new tQuery.MinecraftCharHeadAnimations(this._character);
	this._headAnims.start('still');
	
	
	// update this._bodyAnim depending on velocity
	var prevRotation	= tQuery.createVector3();
	var prevPosition	= tQuery.createVector3();
	setInterval(function(){
		// compute player velocity
		var velocity	= character3D.position().clone().subSelf(prevPosition);
		// set bodyAnim according to velocity value
		var animName	= velocity.length() ? 'run' : 'stand';
		this._bodyAnims.start(animName);
		// update player.prevPosition/player.prevRotation
		prevPosition.copy( character3D.position() )
		prevRotation.copy( character3D.rotation() )
	}.bind(this), 1000/5);	// Important to be less than framerate - thus you dont misdetect still 
};

Character.prototype.destroy = function() {
	var character3D	= this._character.object3D('root');
	character3D.detach();
	this._bodyAnims.stop();
	this._headAnims.stop();
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

Character.prototype.nickName = function(value){
	var userInfo	= this._userInfo
	
	if( value === undefined )	return userInfo.nickName;

	userInfo.nickName	= value;

	var character3D	= this._character.object3D('root');		
	var texture	= tQuery('.cartouche', character3D).get(0).map;
	texture.image	= this._buildNickCartouche(userInfo.nickName)
	texture.needsUpdate	= true;
	// TODO reenable sound
	// sounds.nickChange	&& sounds.nickChange.play()
};

Character.prototype.skinBasename = function(value){
	var userInfo	= this._userInfo
	
	if( value === undefined )	return userInfo.skinBasename;

	userInfo.skinBasename	= value;

	var skinUrl	= '../../vendor/tquery/plugins/minecraft/examples/images/'+userInfo.skinBasename;
	this._character.loadSkin(skinUrl)
	// TODO reenable sound
	// sounds.skinChange	&& sounds.skinChange.play()
};

Character.prototype.updateUserInfo	= function(sourceId, curUserInfo, oldUserInfo){
	// update the skin if needed
	if( !oldUserInfo || curUserInfo.skinBasename !== oldUserInfo.skinBasename ){
		this.skinBasename(curUserInfo.skinBasename)
	}
	// update the nickname cartouche if needed
	if( !oldUserInfo || curUserInfo.nickName !== oldUserInfo.nickName ){
		this.nickName(curUserInfo.nickName)
	}
}

Character.prototype.say = function(text){
	var character3D	= this.object3D();
	// remove previous message if any
	tQuery('.chatMessage', character3D).detach()
	// add text
	var canvas	= this._buildChatBubble(text);
	var sprite	= tQuery.createSprite().addTo(character3D)
		.translateY(1.4).scaleBy(1/200)
		.addClass('chatMessage')
		.map(canvas)
	// remove the text after a while
	// TODO handle stopping this timer
	setTimeout(function(){
		sprite.detach();
	}, 10*1000);
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
