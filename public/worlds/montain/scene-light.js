//////////////////////////////////////////////////////////////////////////////////
// require.js module definition
define( [ 'tquery.light'
], function(){
//////////////////////////////////////////////////////////////////////////////////

/**
 * init the lights for the scene
 * 
 * @param {Object} opts the options 
 */
var SceneLights	= function(opts){
	opts	= tQuery.extend(opts, {
		world	: tQuery.world,
	});
	var world	= opts.world;
	
	tQuery.createAmbientLight().addTo(world)
		.color(0xFFFFFF);
	tQuery.createDirectionalLight().addTo(world)
		.position(1,1,-1).color(0xffffff).intensity(2);
	var light	= tQuery.createDirectionalLight().addTo(world)
		.position(-1, 2, 3)
		.color(0xffffff).intensity(4)
		.castShadow(true)
		.shadowDarkness(0.4)
		.shadowMap(512*2,512*2)
		.shadowCamera(8, -8, 8, -8, 0.1, 10)
		//.shadowCameraVisible(true)

	yeller.addEventListener('playerMove', function(position, rotation){
		var delta	= tQuery.createVector3(-1,2,3);
		var position	= position.clone().addSelf(delta);
		light.position(position);
	}.bind(this))	
}

/**
 * destructor
 */
SceneLights.prototype.destroy = function() {
	// TODO unbind yeller
	console.assert(false, 'not yet implemented')
};

//////////////////////////////////////////////////////////////////////////////////
// require.js module definition END

// export to global namespace
window.SceneLights	= SceneLights;
});	
// end of require.js define()
//////////////////////////////////////////////////////////////////////////////////
