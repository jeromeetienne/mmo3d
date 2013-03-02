//////////////////////////////////////////////////////////////////////////////////
// require.js module definition
define( [ 'tquery.webaudio'
], function(){
//////////////////////////////////////////////////////////////////////////////////

var Sounds	= function(opts){
	// handle default arguments
	opts	= tQuery.extend(opts, {
		world	: tQuery.world,
	});

	// if webaudio api isnt available return now	
	if( WebAudio.isAvailable === false )	return;
	// enable webaudio in this world
	opts.world.enableWebAudio();
	// load sound
	this.chatReceived	= tQuery.createSound().load('../../sounds/checkpoint.wav');
	this.skinChange		= tQuery.createSound().load('../../sounds/eatpill.mp3');
	this.nickChange		= tQuery.createSound().load('../../sounds/gearwhine.wav');
	this.userJoin		= tQuery.createSound().load('../../sounds/gearwhine.wav');
	this.userLeft		= tQuery.createSound().load('../../sounds/gearwhine.wav');
}


//////////////////////////////////////////////////////////////////////////////////
// require.js module definition END

// export to global namespace
window.Sounds	= Sounds;
});	
// end of require.js define()
//////////////////////////////////////////////////////////////////////////////////
