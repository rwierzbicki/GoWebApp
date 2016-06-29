// Token colours
var NONE = 0;
var BLACK = 1;
var WHITE = 2;

var board; 		// {2D array}
var prevBoard;	// {2D array}

/**
 * Initializes board and prevBoard
 *
 * @param size {int} board length/width
 */
function initiateBoard(size) {

}

/**
 * If move is valid, the move is made
 *
 * @param x {int} x coordinate of token
 * @param y {int} y coordinate of token
 * @param colour {int} colour of token
 * @return statusCode {int}
 *		0 - OK
 *		1 - position not available
 *		2 - suicide
 *		3 - reverts board state
 */
function validateMove(x, y, colour) {
	// if not position taken, suicide(), and not revertsGameBoard(), 
	// makeMove() and saveMove() (in database adapter class)
}

/**
 * Determines if playing a move would result in suicide
 *
 * @param x {int} x coordinate of token
 * @param y {int} y coordinate of token
 * @param colour {int} colour of token
 * @return {boolean} true if move would result in suicide 
 */

function suicide(x, y, colour) {
	// if each board spot around (x,y) is opponent colour, return false, else true
}

/**
 * Determines if playing a move would revert the game board
 * to the previous state
 *
 * @param x {int} x coordinate of token
 * @param y {int} y coordinate of token
 * @param colour {int} colour of token
 * @return {boolean} true if move would revert the game board 
 */
function revertsGameBoard(x, y, colour) {
	// place token onto board, compare prevBoard with board
	// if they are the same, return true, else remove token
	// from board and return false
}

/**
 * Sends the board state back to the client
 *
 * @param x {int} x coordinate of token
 * @param y {int} y coordinate of token
 * @param colour {int} colour of token
 */
function makeMove(x, y, colour) {
	// send boardArrayToList(board) to client
}

/**
 * Converts board from 2D array to list of form
 * [ [x, y, colour], ...]
 *
 * @param boardArray {2D array} board in array form
 * @return boardList {array} board in list form
 */
function boardArrayToList(boardArray) {

}

/**
 * Converts board from list to 2D array
 *
 * @param boardList {array of form [ [x, y, colour], ...]}
 * @return boardArray {array} board in list form
 */
function boardListToArray(boardList) {

}
