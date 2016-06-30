// Token colours
const NONE = 0;
const BLACK = 1;
const WHITE = 2;


/**
 * Initializes three objects to 2D arrays with 0s
 *
 * @param size {int} board length/width
 * @param board1 {obj}
 * @param board2 {obj}
 * @param board3 {obj}
 */
function init3Boards(size, board1, board2, board3) {

	}
}

/**
 * Determines if a move is valid
 *
 * @param prevBoard {2D array} board state last turn
 * @param currBoard {2D array} current board state
 * @param tempBoard {2D array} board state after placing token
 * @param x {int} x coordinate of token
 * @param y {int} y coordinate of token
 * @param colour {int} colour of token
 * @return status code / captured tokens {int}
 *		Error codes are negative
 *		Positive or 0 is number of captured tokens
 *		0+ - number of captured tokens
 *		-1 - position not available
 *		-2 - reverts board state
 *		-3 - suicide
 */
function validateMoveAndCalculateCapturedTokens(prevBoard, currBoard, tempBoard, x, y, colour) {
	/* 
	if position taken in currBoard
		return -1
	
	tempBoard = copy of board
	capturedTokens = makeMove(tempBoard, x, y, colour)
	
	if revertsBoard(tempBoard, prevBoard, x, y, colour)
		return -2
	if suicide(tempBoard, x, y, colour)
		return -3
	
	return capturedTokens
	*/
}

/**
 * Determines if playing a move would result in suicide
 * Note: apply army captures first
 *
 * @param board {2D array}
 * @param x {int} x coordinate of token
 * @param y {int} y coordinate of token
 * @param colour {int} colour of token
 * @return {boolean} true if move would result in suicide 
 */

function suicide(board, x, y, colour) {
	// if each board spot around (x,y) in board is opponent colour, return false, else true
}

/**
 * Determines if playing a move would revert the game board
 * to the previous state
 *
 * @param tempBoard {2D array} board after placing token
 * @param prevBoard {2D array} board last turn
 * @param x {int} x coordinate of token
 * @param y {int} y coordinate of token
 * @param colour {int} colour of token
 * @return {boolean} true if move would revert the game board 
 */
function revertsGameBoard(tempBoard, prevBoard, x, y, colour) {
	// if tempBoard is same as prevBoard, return true
}

/**
 * Places token onto board
 *
 * @param board {2D array}
 * @param x {int} x coordinate of token
 * @param y {int} y coordinate of token
 * @param colour {int} colour of token
 * @return captured tokens {int} 
 */
function makeMove(board, x, y, colour) {
	
	captureCount=0;
	//CURRENTLY USING XHR, BUT WILL CHANGE TO WEB SOCKET
	// make the move if it is not suicidal
	if(!suicide(board,x,y,colour) && colour!==0){
		
		
	
		//initialize http request, then send current board to GoAI
		var xhr = new XMLHttpRequest();
		xhr.open('POST','/util/findArmies',true);
		xhr.setRequestHeader("Content-type","application/json");

		//dont know what the input of findArmie is yet.
		obj = {
			"board" : board,
		};

		xhr.send(JSON.stringify(obj));


		xhr.onreadystatechange = function(){
			//got response from GoAI
			if(xhr.readyState == 4 && xhr.status == 200){
				//need to test results
				response = JSON.parse(xhr.responseText);			
				var i;

				// check all armies
				for(i = 0; i<response.armies.length;i++){
					//if that armies has only one liberty AND color is different from armie
					if(response.armies[i].liberties.length === 1 && (response.armies[i].colour != colour) ){
						// if the only liberty is the place that the token is going to be placed
						if(response.armies[i].liberties[0][0] === x && response.armies[i].liberties[0][1] === y){
							//place the token and capture this army
							board[y][x] = colour;
							for(var j=0;j<response.armies[i].size;j++){
								var tempx = response.armies[i].tokens[j].position[0];
								var tempy = response.armies[i].tokens[j].position[1];
								board[tempy][tempx] = 0;
								captureCount++;

							}
						}
						
					}
				}
				
			}

		}

	}

	return captureCount;
	// place token onto board
	// capture armies if applicable
	// return number of captured tokens (could be 0)
}

/**
 * Converts board from 2D array to list of form
 * [ [x, y, colour], ...]. Tokens of colour NONE
 * are not included
 *
 * @param boardArray {2D array} board in array form
 * @return boardList {array} board in list form
 */
function boardArrayToList(boardArray) {
	var boardList = [];
	for(var i=0;i< boardArray.length;i++){
		for(var j=0; j<boardArray.length; j++){
			if(boardArray[i][j] != 0){
				var temp = [ j, i, boardArray[i][j]];
				boardList.push(temp);
			}
		}
	}
	return boardList;
}

/**
 * Converts board from list to 2D array
 *
 * @param boardList {array of form [ [x, y, colour], ...]}
 * @param boardArray {obj}
 * @return boardArray {array} board in list form
 */
function boardListToArray(boardList, boardArray) {
	for(var i=0;i< boardArray.length;i++){
		for(var j=0; j<boardArray.length; j++){
			boardArray[i][j] = 0;
		}
	}

	for(var k = 0 ; k< boardList.length; k++){
		boardArray[boardList[k][1],boardList[k][0]] = boardList[k][2];
	}

}

/**
 * Calculates both players' scores
 *
 * @param board {2D array}
 * @param capturedTokens1 {int} player 1's captured tokens
 * @param capturedTokens1 {int} player 2's captured tokens
 * @return scores { [player1Score player2Score ] }
 */
function calculateScore(board, capturedTokens1, capturedTokens2) {
	// score = army tokens + captured tokens + territory (use countTerritories()) + handicap (for white)
	// handicap scores: 9x9 - 2.5 points, 13x13 - 4.5 points, 19x19 - 7.5 points
}

/**
 * Counts both players' territory
 *
 * @param board {2D array}
 * @return territory count { [player1Territory player2Territory ] }
 */
function countTerritories(board) {
	// Go through 2D array. For each board space equal to NONE,
	// for each neigbour, if not NONE record it say WHITE, if
	// NONE visit that neighbour. If a neighbour is encountered
	// which is neither NONE nor WHITE, the territory belongs to
	// no one. If all neighbours are either NONE or WHITE the 
	// spaces which are NONE are WHITE's territory
}

/**
 * Applies the move after validation
 *
 *	@return board list {array} list form of board state
 */
function applyMove(prevBoard, currBoard, tempBoard) {
	// move currBoard data to prevBoard and
	// tempBoard to currBoard
	// return boardArrayToList(currBoard)
}