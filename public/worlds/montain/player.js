//////////////////////////////////////////////////////////////////////////////////
// require.js module definition
define( [ 'tquery.keyboard'
	, 'character'
], function(){
//////////////////////////////////////////////////////////////////////////////////


var Player	= function(opts){
	// handle default values
	this._opts	= opts	= tQuery.extend(opts, {
		world	: tQuery.world
	});
	// call parent
	Character.call(this, opts);

	var world	= opts.world;	
	var character3D	= this.object3D();
	
	// to enable a tracking camera
	var cameraControls	= tQuery.createCameraFpsControls({
		trackedObject	: character3D.get(0),
		tCamera		: world.tCamera(),
	});
	world.setCameraControls(cameraControls)
	//cameraControls.deltaCamera().position(0, 0.7, -0.07)

	//////////////////////////////////////////////////////////////////////////
	// user controls on keyboard						//
	//////////////////////////////////////////////////////////////////////////
	tQuery.createMinecraftCharKeyboard2({
		object3D	: character3D.get(0),
		lateralMove	: 'rotationY',
	});
	
	// test if the character is out of the world
	world.loop().hook(function(){
		var position	= character3D.position();
		var maxLength	= 16;
		if( position.length() > maxLength ){
			position.setLength(maxLength)				
		}
	});
};

Player.prototype.destroy = function() {
};

Player.prototype = Object.create( Character.prototype );



//////////////////////////////////////////////////////////////////////////////////
// require.js module definition END

// export to global namespace
window.Player	= Player;
});	
// end of require.js define()
//////////////////////////////////////////////////////////////////////////////////
