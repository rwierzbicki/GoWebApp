var socket = io.connect('http://127.0.0.1:10086');
var accountInfo = null;
var currentGameMode = null;
var currentPlayer = null;
var currentBoard = null;

// Authentication function
function auth(username, password, callback){
	var authObj = {username : username, password: password};
	var saveCredentialToCookie = false;
	socket.emit('auth', JSON.stringify(authObj), function(result){
		switch(result){
			case -1:
				console.log('Already logged in. Please log out first.');
				break;
			case 0:
				console.log('Password incorrect');
				break;
			case 1:
				console.log('Login complete');
				saveCredentialToCookie = true;
				break;
			case 2:
				if(username.startsWith('temp_')){
					console.log('Temporary account created.');
				}else{
					console.log('Account created.');
				}
				console.log('Username: ' + username);
				console.log('Password: ' + password);
				break;
			case 3:
				console.log('Upgraded to formal account');
				saveCredentialToCookie = true;
				break;
			case 4:
				console.log('Transferred to formal account');
				saveCredentialToCookie = true;
				break;
			default:
				console.log('ERROR: Invalid response');
		}
		if(saveCredentialToCookie){
			setCookie('username', username, 365);
			setCookie('password', password, 365);
			callback(true, result);
		}else{
			callback(false, result);
		}
	});
}

function continueGame(gameID, gameParameters, callback) {
	socket.emit('continue', {'gameID' : gameID, 'gameParameters': gameParameters}, function(result){
		console.log(result);
		callback(result);
	});
}

function getAccountInfo(callback){
	socket.emit('getAccountInfo', null, function(result){
		accountInfo = result;
		callback(result);
	});
}

// Send general command
function send(command){
	socket.emit('control', command, function(response){
		console.log(response);
	});
}

// The following two functions were adopted from http://www.w3schools.com/js/js_cookies.asp
function getCookie(cname){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length,c.length);
		}
	}
	return "";
}

function setCookie(cname, cvalue, exdays){
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function delCookie(cname) {
	document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

function getCredentialCookie(){
	var username = getCookie('username');
	var password = getCookie('password');

	if(username == ''){
		// There's no cookie exist, create a temporary credential information
		username = 'temp_' + Math.random().toString(36).substring(2,10);
		password = Math.random().toString(36).substring(2,8);
		setCookie('username', username, 365);
		setCookie('password', password, 365);
	}
	return {username : username, password : password};
}

function delCredentialCookie(){
	delCookie('username');
	delCookie('password');
}

// boardSize: size of the board
// playMode: 0: Local 1: AI
// token: The token type (black == 1/white == 2)
function onNewGameButtonClick(boardSize, playMode, tokenType){
	var gameParameters = {
		boardSize : boardSize,
		playMode : playMode,
		tokenType : tokenType
	};

}

function updateGameStatus(){
	socket.emit();
}

socket.on('publish', function(data) {
	console.log('>> ' + data);
});

socket.on('connect', function(){
	var credential = getCredentialCookie();
	auth(credential.username, credential.password, function(isSucceed, statusNo){
		if(isSucceed){
			getAccountInfo(function(accountInfoObj) {
				if(accountInfoObj.currentGame){
					// There's an unfinished game, continue automatically
					continueGame(accountInfoObj.currentGame, function(result){
						// Resume game status here (i.e. tokens on the board, turn, steps, etc.)
						console.log('Unfinished game detected, automatically resume.');
					});
				}
				var player1TokenID = accountInfoObj.tokenId[0];
				var player2TokenID = accountInfoObj.tokenId[1];
				// Set token images here;
				console.log('Set token images to: P1: ' + player1TokenID + ', P2: ' + player2TokenID);
			});
		}
	});
});

