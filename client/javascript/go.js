TOKEN_IMGS = {
		cat: "assets/token_cat.svg",
		wolf: "assets/token_wolf.svg",
		raccoon: "assets/token_raccoon.svg",
		panda: "assets/token_panda.svg",
		fox: "assets/token_fox.svg",
		bear: "assets/token_bear.svg"
	}

// Variables

var primary = 1;	// player who is the primary account holder

player1 = {
	username: null,
	token: "raccoon",
	capturedTokens: 0,
	passsed: false
}

player2 = {
	username: null,
	token: "fox",
	capturedTokens: 0,
	passed: false,
}

var board = {
	size: 0,
	sqSize: 0,		// in percent
	hotseat: true,	// TODO: get from game options
	state: [],		// board as 2D array
	setSize: function(sizeValue){
		this.size = sizeValue;
		this.sqSize = 100 / (this.size + 1);
	}
}

var currPlayer;
var playerNewToken; // which player is changing their token

/**
 * Loads each player's name, token, captured tokens, and passed state onto
 * the screen as well as highlighting the current player
 */
function updatePlayerInfo() {

	// USERNAME

	// if player 1 signed in, use username else "Player 1"
	if (player1.username)
		document.getElementById('p1-name').innerHTML = player1.username;
	else
		document.getElementById('p1-name').innerHTML = "Player 1";	

	// if player 2 signed in, use username else if
	// hotseat, "Player 2", if not hotseat, "CPU"
	if (player2.username)
		document.getElementById('p2-name').innerHTML = player2.username;
	else {
		if (board.hotseat)
			document.getElementById('p2-name').innerHTML = "Player 2";
		else
			document.getElementById('p2-name').innerHTML = "CPU";
	}

	// TOKEN
	
	document.getElementById('p1-token').src = TOKEN_IMGS[player1.token];
	document.getElementById('p2-token').src = TOKEN_IMGS[player2.token];

	// CAPTURED TOKENS

	document.getElementById('p2-captured-tokens').innerHTML = player2.capturedTokens;
	document.getElementById('p1-captured-tokens').innerHTML = player1.capturedTokens;

	// PASSED

	if (player1.passed) {
		$('#p1-pass-button').addClass("active");
	} else {
		$('#p1-pass-button').removeClass("active");
	}

	if (player2.passed) {
		$('#p2-pass-button').addClass("active");
	} else {
		$('#p2-pass-button').removeClass("active");
	}
	
	// HIGHLIGHT CURRENT PLAYER

	if (currPlayer == 1) {	// if player 1 is current player
		$('#player-1').addClass("curr-player");
		$('#player-2').removeClass("curr-player");
	} else {
		$('#player-1').removeClass("curr-player");
		$('#player-2').addClass("curr-player");
	}
}

function clickPass(event) {
	if (replay)
		return;

	if (currPlayer === 1 && event.target.id === "p1-pass-button") {	// if player 1 passed
		player1.passed = true;
		currPlayer = 2;
	} else if (currPlayer === 2 && event.target.id === "p2-pass-button") {
		if (player1.passed) {
			player2.passed = true;
			alert("This game is finished");	// TODO end game!
		} else {
			currPlayer = 1;
		}
	} else {
		alert("You can only pass on your turn!");
	}

	updatePlayerInfo();
	updateUnplacedTokens();
}

// load tokens into Token Selection Modal
function loadTokenSelectionModal() {
	var modalBody = document.getElementById('chooseTokenBody');
	for (var key in TOKEN_IMGS) {
		var a = document.createElement('a');
		var img = document.createElement('img');
		img.src = TOKEN_IMGS[key];
		img.id = key;
		a.onclick = onClickNewToken;

		// token is already being used
		if (key === player1.token || key === player2.token ) {
			img.className = "choose-token-image taken";
		} else {
			img.className = "choose-token-image";
		}

		a.appendChild(img);
		modalBody.appendChild(a);
	}
}

function onTokenModalOpened(event) {
	playerNewToken = (event.relatedTarget.childNodes[0].id === "p1-token" ? 1 : 2);
}

// Clicked a new token image in the Token Selection modal
function onClickNewToken(event) {
	if (event.target.className === "choose-token-image taken") {
		return;
	}

	if (playerNewToken === 1) {
		document.getElementById(player1.token).className = "choose-token-image";
		player1.token = event.target.id;
		document.getElementById(player1.token).className = "choose-token-image taken";
		document.getElementById("p1-token").src = TOKEN_IMGS[player1.token];
		if (playerNewToken === currPlayer)
			updateUnplacedTokens();
		swapPlacedTokens(1, TOKEN_IMGS[player1.token]);
	} else {
		document.getElementById(player2.token).className = "choose-token-image";
		player2.token = event.target.id;
		document.getElementById(player2.token).className = "choose-token-image taken";
		document.getElementById("p2-token").src = TOKEN_IMGS[player2.token];
		if (playerNewToken === currPlayer)
			updateUnplacedTokens();
		swapPlacedTokens(2, TOKEN_IMGS[player2.token]);
	}

	$('#chooseTokenModal').modal('hide');
}

function renderNewGameBoard() {
	$('#gameboard').empty();
	var svg = makeGameBoard();
	
	// tokens
    for (var row = 0; row < (board.size); row++) {
    	for (var col = 0; col < (board.size); col++) {
    		svg.append(makeToken(col, row, board.sqSize, TOKEN_IMGS[player1.token], "token-image unplaced", onClickToken));
    	}
    }

	$('#gameboard-container').append(svg);
};

function renderUnfinishedGameBoard() {
	var boardState = board.state;
	$('#gameboard').empty();
	var svg = makeGameBoard();
	var unplacedToken = (currPlayer == 1 ? TOKEN_IMGS[player1.token] : TOKEN_IMGS[player2.token]);
	
	// tokens
    for (var row = 0; row < (board.size); row++) {
    	for (var col = 0; col < (board.size); col++) {
    		if (boardState[row][col] == 1)
    			svg.append(makeToken(col, row, board.sqSize, TOKEN_IMGS[player1.token], "token-image placed 1"));
    		else if (boardState[row][col] == 2)
    			svg.append(makeToken(col, row, board.sqSize, TOKEN_IMGS[player2.token], "token-image placed 2"));
    		else
    			svg.append(makeToken(col, row, board.sqSize, unplacedToken, "token-image unplaced", onClickToken));
    	}
    }

	$('#gameboard-container').append(svg);
}

function makeGameBoard() {
	var size = board.size;
	var sqSize = board.sqSize;

	var svg = $(makeSVG("100%", "100%", "gameboard"));
	
	// board background
    svg.append(makeSquare(0, 0, "100%"));

    // inner board (playfield)
    for (var row = 1; row < (size); row++) {
    	for (var col = 1; col < (size); col++) {
    		svg.append(makeSquare(col*sqSize+"%", row*sqSize+"%", sqSize+"%"));
    	}
    }

    return svg;
}

function onClickToken(event) {
	var token = event.target;
	if (token.getAttribute("class") !== "token-image unplaced")
		return;

	token.setAttribute("class", "token-image placed " + currPlayer);
	
	if (board.hotseat) {
		currPlayer = (currPlayer === 1 ? 2 : 1);
	}

	player1.passed = false;
	updatePlayerInfo();
	updateUnplacedTokens();
	
}

function swapPlacedTokens(player, newImage) {
	if (player === 1) 
		var tokens = document.getElementsByClassName('token-image placed 1');
	else
		var tokens = document.getElementsByClassName('token-image placed 2');

	for (var i = 0; i < tokens.length; i++) {
		tokens[i].setAttributeNS('http://www.w3.org/1999/xlink','href', newImage);
	}

}

function updateUnplacedTokens() {
	var imgPath = (currPlayer == 1 ? TOKEN_IMGS[player1.token] : TOKEN_IMGS[player2.token]);
	var unplacedTokens = document.getElementsByClassName('token-image unplaced');
	for (var i = 0; i < unplacedTokens.length; i++)
		unplacedTokens[i].setAttributeNS('http://www.w3.org/1999/xlink','href', imgPath);
}

/**
 * Converts board from list to 2D array
 *
 * @param boardList {array of form [ [x, y, colour], ...]}
 * @param boardArray {obj}
 * @return boardArray {array} board in list form
 */
function boardListToArray(size, boardList) {
	var boardArr = [];
	for(var i = 0; i < size; i++){
		boardArr.push([]);
		for(var j = 0; j < size; j++){
			boardArr[i].push(0);
		}
	}

	for(var k = 0 ; k < boardList.length; k++){
		boardArr[boardList[k][1]][boardList[k][0]] = boardList[k][2];
	}

	return boardArr;
}

/**
 * Returns a token image which is not already taken
 * (more specifically, the next available token)
 *
 * @param token {key in TOKEN_IMGS} token which is already taken
 */
function getOtherToken(token) {
	keys = Object.keys(TOKEN_IMGS);
	return keys[(keys.indexOf(token)+1)%keys.length];
}
