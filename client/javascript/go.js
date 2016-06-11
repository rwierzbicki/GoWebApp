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

var boardSizePixels;
var boardSize;
var hotseat = true;
var currPlayer;

/*
* @param {container} the element in which the board will be created
* @param {size} the dimensions of the board (# of rows/columns)
* @param (realSize} the dimensions of the board in pixels
*/
function setupGame(container, size, realSize) {
	var gameboard = container;
	boardSize = size;
	boardSizePixels = realSize;

	var svg = $(makeSVG(boardSizePixels, boardSizePixels));

	currPlayer = PLAYER_1;

	var sqSize = boardSizePixels/(boardSize+1);
    var tokenSize = sqSize;

    // rectangles
    for (var row = 0; row < (boardSize+1); row++) {
    	for (var col = 0; col < (boardSize+1); col++) {
    		svg.append(makeSquare(col*sqSize, row*sqSize, sqSize));
    	}
    }

    // tokens
    for (var row = 0; row < (boardSize); row++) {
    	for (var col = 0; col < (boardSize); col++) {
    		svg.append(makeToken(col*sqSize+sqSize/2, row*sqSize+sqSize/2, col, row, tokenSize, PLAYER_1_TOKEN, onClickToken));
    	}
    }

	gameboard.append(svg);
};

function onClickToken(event) {
	var token = event.target;
	token.setAttributeNS(null, "class", "token-image placed");
	
	if (hotseat) {
		if (currPlayer == PLAYER_1) {
			currPlayer = PLAYER_2;
			var imgPath = PLAYER_2_TOKEN;
		} else {
			currPlayer = PLAYER_1;
			var imgPath = PLAYER_1_TOKEN;
		}
	}

	// switch unplaced token image
	var unplacedTokens = document.getElementsByClassName('token-image unplaced');
	for (var i = 0; i < unplacedTokens.length; i++)
		unplacedTokens[i].setAttributeNS('http://www.w3.org/1999/xlink','href', imgPath);
}