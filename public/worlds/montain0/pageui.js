//////////////////////////////////////////////////////////////////////////////////
// require.js module definition
//define( [], function(){
//////////////////////////////////////////////////////////////////////////////////

var PageUI	= function(){
	document.body.setAttribute("tabIndex", "0");	// make body focusable

	// handle roomNameForm
	var roomNameForm	= document.getElementById('roomNameForm')
	roomNameForm.addEventListener('keydown', function(event){ event.stopPropagation();	});
	roomNameForm.addEventListener('submit', function(){
		window.location.hash	= '#' + roomNameForm[0].value;
		window.location.reload();
	});

	// handle nicknameForm
	var nicknameForm	= document.getElementById('nicknameForm')
	nicknameForm.addEventListener('keydown', function(event){ event.stopPropagation();	});
	nicknameForm.addEventListener('submit', function(){
		// dispatch event with new value
		var nickName	= nicknameForm[0].value;
		this.dispatchEvent('nickNameChange', nickName);
		// put back the focus on body
		document.body.focus();
	}.bind(this));

	// handle skinSelection
	var skinSelectEl	= document.getElementById('skinSelect')
	skinSelectEl.addEventListener('change', function(){
		// dispatch event with new value
		var skinBasename	= skinSelectEl.value;
		this.dispatchEvent('skinBasenameChange', skinBasename)
		// put back the focus on body
		document.body.focus();		
	}.bind(this));

	// handle chatInputForm
	var chatInputForm	= document.getElementById('chatInputForm')
	chatInputForm.addEventListener('keydown', function(event){ event.stopPropagation();	});
	chatInputForm.addEventListener('change', function(){
		// dispatch event with new value
		var text	= chatInputForm[0].value
		this.dispatchEvent('say', text)
		// zero the chat input
		chatInputForm[0].value	= null;
		// put back the focus on body
		document.body.focus();		
	}.bind(this));

}

PageUI.prototype.destroy = function() {
};

tQuery.MicroeventMixin(PageUI.prototype);

PageUI.prototype.nickName = function(value){
	var nicknameForm	= document.getElementById('nicknameForm')
	nicknameForm[0].value	= value;
	return this;
};

PageUI.prototype.roomName = function(value){
	var roomNameForm	= document.getElementById('roomNameForm')
	roomNameForm[0].value	= value;
	return this;
};

//////////////////////////////////////////////////////////////////////////////////
// require.js module definition END

// export to global namespace
window.PageUI	= PageUI;
//});	
// end of require.js define()
//////////////////////////////////////////////////////////////////////////////////
