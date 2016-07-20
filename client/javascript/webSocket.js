var socket = io.connect('http://127.0.0.1:10086');
var accountInfo = null;
var currentGameMode = null;
var currentPlayer = null;
var currentBoard = null;
var player1Passed = false;
var player2Passed = false;
var accountHolderTokenType = null;
var player1UserName = null;
var player2UserName = null;
var primaryAccountUserName = null;

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
			primaryAccountUserName = username;
			callback(true, result);
		}else{
			callback(false, result);
		}
	});
}

function continueGame(gameID, gameParameters, callback) {
	socket.emit('continue', {'gameID' : gameID, 'gameParameters': gameParameters}, function(gameInfo){
		console.log('Resuming game');
		console.log(gameInfo);
		currentGameMode = gameInfo.gameMode;
		player1UserName = gameInfo.player1;
		player2UserName = gameInfo.player2;
		accountHolderTokenType = gameInfo.accountHolderTokenType;
		callback(gameInfo);
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
function onNewGameButtonClick(boardSize, playMode, tokenType, callback){
	var gameParameters = {
		boardSize : boardSize,
		playMode : playMode,
		tokenType : tokenType
	};
	continueGame(null, gameParameters, function(result){
		console.log('callback - onNewGameButtonClick');
		if(callback){
			console.log('New game created.');
			updateGameStatus(callback);
		}
	});
}

function updateGameStatus(callback){
	socket.emit('update', null, function(data){
		console.log(data);
		currentBoard = data.board;
		currentPlayer = data.currentTurn;
		console.log(currentBoard);
		if(callback){
			callback(data);
		}
	});
}

function makeMove(x, y, c, pass, callback) {
	var moveObj = {x: x, y: y, c: c, pass: pass};
	socket.emit('makeMove', moveObj, function(result) {
		console.log('Move result: ' + result);
		if(result >= 0){
			updateGameStatus();
		}else{
			alert('Invalid move: status code: ' + result);
		}
		if(callback){
			callback(result);
		}
	});
}

function changeTokenImgs(tokenIds) {
	socket.emit('changePrimaryTokenImage', tokenIds, function(isOk){
		console.log(isOk);
	})
}

socket.on('actionRequired', function(action){
	switch(action){
		case 0:
			updateGameStatus();
			break;
		default:
			console.log('Unsupported action');
	}
	console.log('updateRequired signal received');
});

socket.on('publish', function(data) {
	console.log('>> ' + data);
});

socket.on('connect', function(){
	var credential = getCredentialCookie();
	auth(credential.username, credential.password, function(isSucceed, statusNo){
		initialize(credential.username, credential.password, isSucceed);
	});
});

function initialize(username, password, isSucceed) {
	if(isSucceed){
		getAccountInfo(function(accountInfoObj) {
			if(accountInfoObj.currentGame){
				// There's an unfinished game, continue automatically
				continueGame(accountInfoObj.currentGame, null, function(gameInfo){
					// Resume game status here (i.e. tokens on the board, turn, steps, etc.)
					console.log('Unfinished game detected, automatically resume.');
					updateGameStatus();
				});
			}
			var player1TokenID = accountInfoObj.tokenId[0];
			var player2TokenID = accountInfoObj.tokenId[1];
			// Set token images here;
			console.log('Set token images to: P1: ' + player1TokenID + ', P2: ' + player2TokenID);

			player1.token = player1TokenID;
			player2.token = player2TokenID;

			if (username.substring(0,5) !== "temp_") {
				player1.username = username;
				login();
			}

		});
	}
}