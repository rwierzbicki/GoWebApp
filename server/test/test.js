var assert = require('chai').assert;
var gameboard = require('../gameboard');
var compare = require('../compare');

describe('gameboard', function() {
	describe('#init3Boards', function () {
		it('should initialize three 2D arrays with 0\'s', function () {
			var board1;
			var board2;
			var board3;
			var board = [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ];

			gameboard.init3Boards(3, board1, board2, board3);
			assert.equal(true, compare.array2DEqual(board, board1));
			assert.equal(true, compare.array2DEqual(board, board2));
			assert.equal(true, compare.array2DEqual(board, board3));
		});
	});

	describe('#validateMoveAndCalculateCapturedTokens', function () {
		it('should return -1 if position is taken', function () {
			// position (0,0), same colour
			var board = [ [1, 0], [0, 0] ];
			assert.equal(-1, gameboard.validateMoveAndCalculateCapturedTokens(null, null, board, 0, 0, 1));

			// position (0,1), same colour
			board = [ [0, 0], [1, 0] ];
			assert.equal(-1, gameboard.validateMoveAndCalculateCapturedTokens(null, null, board, 0, 1, 1));

			// position (0,1), other colour
			board= [ [0, 0], [1, 0] ];
			assert.equal(-1, gameboard.validateMoveAndCalculateCapturedTokens(null, null, board, 0, 1, 1));
		});
		it('should capture tokens before checking suicide', function () {
			// would be suicide if tokens could not be captured
			board = [ [2, 1, 0], [0, 2, 1], [0, 0, 2] ];
			assert.equal(2, gameboard.validateMoveAndCalculateCapturedTokens(null, null, board, 2, 0, 2));
		});
	});

	describe('#suicide', function () {
		it('should return true if move results in suicide', function () {
			// edge of board
			board = [ [1, 0], [0, 1], [1, 0] ];
			assert.equal(true, gameboard.suicide(board, 0, 1, 2));

			// middle of board
			board = [ [0, 0, 0], [0, 2, 0], [2, 0, 2], [0, 2, 0] ];
			assert.equal(-1, gameboard.suicide(board, 2, 1, 1));
		});
	});

	describe('#revertsGameBoard', function () {
		it('should return true if move reverts game board to previous state', function () {
			// edge of board
			var prevBoard = [ [1, 0, 0, 0], [0, 1, 0, 0], [1, 2, 0, 0], [2, 0, 0, 0] ];
			var tempBoard = [ [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0] ];
			assert.equal(true, gameboard.revertsGameBoard(tempBoard, prevBoard, 0, 1, 2));

			// middle of board
			prevBoard = [ [0, 1, 2, 0], [1, 2, 0, 2], [0, 1, 2, 0], [0, 0, 0, 0] ];
			tempBoard = [ [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0] ];
			assert.equal(true, gameboard.revertsGameBoard(tempBoard, prevBoard, 2, 1, 1));

			// corner
			prevBoard = [ [0, 0, 0], [0, 2, 1], [2, 1, 0] ];
			tempBoard = [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ];
			assert.equal(true, gameboard.revertsGameBoard(tempBoard, prevBoard, 2, 2, 2));
		});
	});

	describe('#makeMove', function () {
		it('should return number of captured tokens', function () {
			board = [ [2, 1, 0], [0, 2, 1], [0, 0, 2] ];
			assert.equal(2, gameboard.makeMove(board, 2, 0, 2));

			board = [ [1, 2, 0], [1, 0, 0], [2, 1, 0] ];
			assert.equal(2, gameboard.makeMove(board, 1, 1, 2));

			// captures multiple armies
			board = [ [1, 2, 0], [1, 0, 0], [2, 1, 2] ];
			assert.equal(3, gameboard.makeMove(board, 1, 1, 2));

			board = [ [0, 1, 0], [1, 2, 0], [0, 1, 0] ];
			assert.equal(1, gameboard.makeMove(board, 2, 1, 1));
		});
	});

	describe('#boardArrayToList', function () {
		it('should return empty list if no tokens placed', function () {
			board = [ [0, 0], [0,0] ];
			assert.equal([], gameboard.boardArrayToList(board));
		});
		it('should return board in list form', function () {
			board = [ [0, 1], [0, 2] ];
			assert.equal(true, compare.unorderedArray2DEqual([ [1, 0, 1], [1, 1, 2] ], gameboard.boardArrayToList(board)));
		});
	});

	describe('#boardListToArray', function () {
		it('should return the board in 2D array form', function () {
			board = [ [0, 1], [0, 2] ];
			var boardList = gameboard.boardArrayToList(board);
			board = [ [1, 2], [1, 0] ];
			gameboard.boardListToArray(boardList, board);
			assert.equal(true, compare.array2DEqual([ [0, 1], [0, 2] ], board));
		});
	});

	describe('#calculateScore', function () {
		it('should return the final scores of both players', function () {
			board = [
				[0, 1, 0, 2, 1, 2, 0, 0, 0],
				[0, 0, 1, 0, 1, 2, 0, 0, 0],
				[0, 1, 0, 1, 1, 2, 0, 0, 0],
				[1, 0, 0, 0, 1, 0, 2, 2, 2],
				[0, 1, 1, 1, 2, 2, 0, 2, 1],
				[0, 0, 0, 2, 0, 2, 2, 1, 0],
				[0, 1, 0, 2, 2, 1, 1, 2, 1],
				[0, 0, 1, 2, 0, 1, 0, 2, 2],
				[0, 0, 0, 0, 0, 0, 2, 0, 0]
			];
			// score1 = handicap + armies + territory + captured tokens
			var score1 = 2.5 + 20 + 9 + 4;
			// score2 = armies + territory + captured tokens
			var score2 = 20 + 13 + 8;
			assert.equal(true, compare.arrayEqual([score1, score2], gameboard.calculateScore(board, 4, 8)));
		});
	});

	describe('#countTerritories', function() {
		it('should return both players\' territories', function() {
			board = [ [0, 1], [0, 2] ];
			assert.equal(true, compare.arrayEqual([0, 0], gameboard.countTerritories(board)));

			board = [ [0, 0, 0], [0, 1, 0], [0, 0, 0] ];
			assert.equal(true, compare.arrayEqual([8, 0]), gameboard.countTerritories(board));

			board = [ [0, 1, 2, 0], [0, 1, 2, 0], [1, 1, 2, 0], [0, 0, 2, 0] ];
			assert.equal(true, compare.arrayEqual([2, 4]), gameboard.countTerritories(board));
		});
	});

	describe('#applyMove', function() {
		it('should shift board data to prepare for next move', function() {
			var prevBoard = [ [0, 1], [2, 1] ];
			var currBoard = [ [1, 0], [1, 0] ];
			var tempBoard = [ [1, 1], [1, 2] ];
			gameboard.applyMove(prevBoard, currBoard, tempBoard);

			assert.equal(true, compare.array2DEqual(prevBoard, [ [1, 0], [1, 0] ]));
			assert.equal(true, compare.array2DEqual(currBoard, [ [1, 1], [1, 2] ]));
		});
	});
});

