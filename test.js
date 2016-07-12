var assert = require('assert');
var compare = require('./server/compare');
var gameboard = require('./server/gameboard');

describe('gameboard', function() {
	describe('#init3Boards', function () {
		it('should initialize three 2D arrays with 0\'s', function () {
			var board1;
			var board2;
			var board3;
			var board = [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ];

			gameboard.init3Boards(3, board1, board2, board3);
			assert.deepEqual(board, board2);
			assert.deepEqual(board, board3);
			assert.deepEqual(board, board1);
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

	describe('#suicide', function() {
		var board = [ [0, 1], [1, 1] ];

		it('should return true if placing token in a corner surrounded by opponent tokens', function() {
			assert.equal(true, gameboard.suicide(board, 0, 0, 2));
		});

		it('should return true if placing token in the center surrounded by opponent tokens', function() {
			board = [ [2, 2, 2], [2, 0, 2], [2, 2, 2] ];
			assert.equal(true, gameboard.suicide(board, 1, 1, 1));
		});

		it('should return false if placing token in a corner not surrounded by opponent tokens', function() {
			board = [ [0, 1], [2, 1] ];
			assert.equal(false, gameboard.suicide(board, 0, 0, 2));
		});

		it('should return false if placing token in the center not surrounded by opponent tokens', function() {
			board = [ [0, 0, 2], [2, 0, 1], [2, 1, 1] ];
			assert.equal(false, gameboard.suicide(board, 1, 1, 2));
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
	    it('should return number of captured tokens CASE: capture 2 armies 2 tokens', function () {

	        board = [[2, 1, 0],
                        [0, 2, 1],
                        [0, 0, 2]];

	        gameboard.makeMove(board, 2, 0, 2, function (cap) {
	            assert.equal(cap, 2);
	        });
	    });

	    it('should return number of captured tokens CASE: capture 1 army 2 tokens', function () {
	        board = [[1, 2, 0],
                        [1, 0, 0],
                        [2, 1, 0]];
	        gameboard.makeMove(board, 1, 1, 2, function (cap) {
	            assert.equal(cap, 2);
	        });
	    });

	    it('should return number of captured tokens CASE: capture 2 armies 3 tokens', function () {
	        // captures multiple armies
	        board = [[1, 2, 0],
                        [1, 0, 0],
                        [2, 1, 2]];

	        gameboard.makeMove(board, 1, 1, 2, function (cap) {
	            assert.equal(3, cap);
	        });
	    });

	    it('should return number of captured tokens CASE: capture 1 army 1 token', function () {
	        board = [[0, 1, 0],
                        [1, 2, 0],
                        [0, 1, 0]];

	        gameboard.makeMove(board, 2, 1, 1, function (cap) {;
	            assert.equal(1, cap);
	        });
	    });

	});

	describe('#boardArrayToList', function () {
		it('should return empty list if no tokens placed', function () {
			board = [ [0, 0], [0,0] ];
			var list = gameboard.boardArrayToList(board);
			assert.deepEqual([], list)
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
			assert.deepEqual([ [0, 1], [0, 2] ], board);
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
			assert.deepEqual([score1, score2], gameboard.calculateScore(board, 4, 8));
		});
	});

	describe('#countTerritories', function() {
		it('should return both players\' territories', function() {
			board = [ [0, 1], [0, 2] ];
			assert.deepEqual([0, 0], gameboard.countTerritories(board));

			board = [ [0, 0, 0], [0, 1, 0], [0, 0, 0] ];
			assert.deepEqual([8, 0], gameboard.countTerritories(board));

			board = [ [0, 1, 2, 0], [0, 1, 2, 0], [1, 1, 2, 0], [0, 0, 2, 0] ];
			assert.deepEqual([2, 4], gameboard.countTerritories(board));
		});
	});

	describe('#applyMove', function() {
		it('should shift board data to prepare for next move', function() {
			var prevBoard = [ [0, 1], [2, 1] ];
			var currBoard = [ [1, 0], [1, 0] ];
			var tempBoard = [ [1, 1], [1, 2] ];
			gameboard.applyMove(prevBoard, currBoard, tempBoard);

			assert.deepEqual(prevBoard, [ [1, 0], [1, 0] ]);
			assert.deepEqual(currBoard, [ [1, 1], [1, 2] ]);
		});
	});
});

describe('compare', function () {
	describe('#unorderedArray2DEqual', function () {
		var arr1 = [ [0, 3], [1, 8], [10, 1] ];
		var arr2 = [ [0, 3], [1, 8], [10, 1] ];

		it('should return true if two arrays have the same subarrays in the same order', function () {
			assert.equal(true, compare.unorderedArray2DEqual(arr1, arr2));
		});

		it('should return true if two arrays have the same subarrays in a different order', function () {
			arr2 = [ [10, 1], [1, 8], [0, 3] ];
			assert.equal(true, compare.unorderedArray2DEqual(arr1, arr2));
		});

		it('should return true if two arrays are both empty', function() {
			assert.equal(true, compare.unorderedArray2DEqual([], []));
		});

		it('should return false if either input is not an array', function () {
			assert.equal(false, compare.unorderedArray2DEqual(arr1, "hello"));
			assert.equal(false, compare.unorderedArray2DEqual(4, arr1));
		});

		it('should return false if the arrays have different lengths', function () {
			arr2 = [ [10, 1], [1, 8], ];
			assert.equal(false, compare.unorderedArray2DEqual(arr1, arr2));
		});

		it('should return false if the arrays do not have the same subarrays', function () {
			arr2 = [ [10, 1], [1, 8], [1, 2]];
			assert.equal(false, compare.unorderedArray2DEqual(arr1, arr2));
		});
	});
});
