// Constants

PLAYER_1 = 1;
PLAYER_2 = 2;

TOKEN_IMGS = {
		cat: "assets/token_cat.svg",
		wolf: "assets/token_wolf.svg",
		raccoon: "assets/token_raccoon.svg",
		panda: "assets/token_panda.svg",
		fox: "assets/token_fox.svg",
		bear: "assets/token_bear.svg"
	}

PLAYER_1_TOKEN = TOKEN_IMGS.raccoon;
PLAYER_2_TOKEN = TOKEN_IMGS.fox;

// Variables

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
 * Loads each player's name and token onto the screen as well
 * as highlighting the current player
 */
function updatePlayerInfo() {
	// if player 1 signed in, use username else "Player 1"
	if (username1)
		document.getElementById('p1-name').innerHTML = username1;
	else
		document.getElementById('p1-name').innerHTML = "Player 1";

	document.getElementById('p1-token').src = PLAYER_1_TOKEN;

	// if player 2 signed in, use username else if
	// hotseat, "Player 2", if not hotseat, "CPU"
	if (username2)
		document.getElementById('p2-name').innerHTML = username2;
	else {
		if (board.hotseat)
			document.getElementById('p2-name').innerHTML = "Player 2";
		else
			document.getElementById('p2-name').innerHTML = "CPU";
	}

	document.getElementById('p2-token').src = PLAYER_2_TOKEN;

	if (currPlayer == 1) {	// if player 1 is current player
		$('#player-1').addClass("curr-player");
		$('#player-2').removeClass("curr-player");
	} else {
		$('#player-1').removeClass("curr-player");
		$('#player-2').addClass("curr-player");
	}
}

// load tokens into Token Selection Modal
function loadTokenSelectionModal() {
	var modalBody = document.getElementById('chooseTokenBody');
	for (var key in TOKEN_IMGS) {
		var a = document.createElement('a');
		var img = document.createElement('img');
		img.src = TOKEN_IMGS[key];
		img.id = TOKEN_IMGS[key];
		a.onclick = onClickNewToken;

		// token is already being used
		if (TOKEN_IMGS[key] === PLAYER_1_TOKEN || TOKEN_IMGS[key] === PLAYER_2_TOKEN ) {
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

function onClickNewToken(event) {
	if (event.target.className === "choose-token-image taken") {
		return;
	}

	if (playerNewToken === 1) {
		document.getElementById(PLAYER_1_TOKEN).className = "choose-token-image";
		PLAYER_1_TOKEN = event.target.id;
		document.getElementById(PLAYER_1_TOKEN).className = "choose-token-image taken";
		document.getElementById("p1-token").src = PLAYER_1_TOKEN;
		if (playerNewToken === currPlayer)
			swapUnplacedTokens(PLAYER_1_TOKEN);
		swapPlacedTokens(1, PLAYER_1_TOKEN);
	} else {
		document.getElementById(PLAYER_2_TOKEN).className = "choose-token-image";
		PLAYER_2_TOKEN = event.target.id;
		document.getElementById(PLAYER_2_TOKEN).className = "choose-token-image taken";
		document.getElementById("p2-token").src = PLAYER_2_TOKEN;
		if (playerNewToken === currPlayer)
			swapUnplacedTokens(PLAYER_2_TOKEN);
		swapPlacedTokens(2, PLAYER_2_TOKEN);
	}

	$('#chooseTokenModal').modal('hide');
}

/*
* @param container {div DOM} the element in which the board will be created
*/
function renderNewGameBoard() {
	$('#gameboard').empty();
	var svg = makeGameBoard();
	
	// tokens
    for (var row = 0; row < (board.size); row++) {
    	for (var col = 0; col < (board.size); col++) {
    		svg.append(makeToken(col, row, board.sqSize, PLAYER_1_TOKEN, "token-image unplaced", onClickToken));
    	}
    }

	$('#gameboard-container').append(svg);
};

function renderUnfinishedGameBoard() {
	var boardState = board.state;
	$('#gameboard').empty();
	var svg = makeGameBoard();
	var unplacedToken = (currPlayer == 1 ? PLAYER_1_TOKEN : PLAYER_2_TOKEN);
	
	// tokens
    for (var row = 0; row < (board.size); row++) {
    	for (var col = 0; col < (board.size); col++) {
    		if (boardState[row][col] == 1)
    			svg.append(makeToken(col, row, board.sqSize, PLAYER_1_TOKEN, "token-image placed 1"));
    		else if (boardState[row][col] == 2)
    			svg.append(makeToken(col, row, board.sqSize, PLAYER_2_TOKEN, "token-image placed 2"));
    		else
    			svg.append(makeToken(col, row, board.sqSize, unplacedToken, "token-image unplaced", onClickToken));
    	}
    }

	$('#gameboard-container').append(svg);
}

function makeGameBoard() {
	var size = board.size;

	var svg = $(makeSVG("100%", "100%", "gameboard"));
	
	var sqSize = board.sqSize;

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

	token.setAttributeNS(null, "class", "token-image placed " + currPlayer);
	
	if (board.hotseat) {
		if (currPlayer == PLAYER_1) {
			currPlayer = PLAYER_2;
			var imgPath = PLAYER_2_TOKEN;
		} else {
			currPlayer = PLAYER_1;
			var imgPath = PLAYER_1_TOKEN;
		}
	}

	updatePlayerInfo();
	swapUnplacedTokens(imgPath);
	
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

function swapUnplacedTokens(imgPath) {
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
