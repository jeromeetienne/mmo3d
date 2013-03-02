//////////////////////////////////////////////////////////////////////////////////
// require.js module definition
define( [ 'tquery.skymap'
	, 'tquery.grassground'
	, 'tquery.montainarena'
	, 'tquery.text'
	, 'tquery.checkerboard'
], function(){
//////////////////////////////////////////////////////////////////////////////////

/**
 * init the lights for the scene
 * 
 * @param {Object} opts the options 
 */
var SceneGround	= function(opts){
	opts	= tQuery.extend(opts, {
		world	: tQuery.world,
		roomName: "Public"
	});
	var world	= opts.world;
	
	// add a skybox
	if( true ){
		var textureUrls	= tQuery.TextureCube.createUrls('mars', '.jpg', '../../vendor/tquery/plugins/assets/images/textures/cube');
		var textureCube	= tQuery.createCubeTexture(textureUrls);
		tQuery.createSkymap({
			textureCube	: textureCube
		}).addTo(world);
	}

	// create the text
	if( true ){
		var text	= tQuery.createText(opts.roomName, {
			bevelThickness	: 0.1,
			bevelSize	: 0.03,
			bevelEnabled	: true,
		}).addTo(world).scaleBy(1/2).translateY(0.5)
			.setLambertMaterial({
				ambient	: 0x444444,
				color	: 0x888888,
				envMap	: textureCube
			}).back()
			.castShadow(true)
		world.loop().hook(function(delta, now){
			var deltaAngle	= 0.05 * delta * Math.PI * 2;
			text.rotateY(deltaAngle)
		})
	}

	// create ground
	if( true ){
		tQuery.createCheckerboard({
			segmentsW	: 20,
			segmentsH	: 20
		}).addTo(world).scaleBy(40)
			.receiveShadow(true)
	}

	// create ground
	if( false ){
		var ground	= tQuery.createGrassGround({
			textureRepeatX	: 20,
			textureRepeatY	: 20,
		}).addTo(world)
			.receiveShadow(true)
			.scale(40)
		// TODO to merge all the montains
		tQuery.MontainArena.createBasicArena().addTo(world)
			.scale(40)
	}

}

/**
 * destructor
 */
SceneGround.prototype.destroy = function() {
	// TODO unbind yeller
	console.assert(false, 'not yet implemented')
};


//////////////////////////////////////////////////////////////////////////////////
// require.js module definition END

// export to global namespace
window.SceneGround	= SceneGround;
});	
// end of require.js define()
//////////////////////////////////////////////////////////////////////////////////
