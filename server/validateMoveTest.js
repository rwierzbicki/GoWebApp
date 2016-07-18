var gameboard = require('./gameboard');

var board = [
	[1, 0],
	[0, 0]
];


var lastMove = {
	x : 0,
	y : 0,
	c : 1,
	pass: false
}

var tempboard = board;

var a = gameboard.validateMoveAndCalculateCapturedTokens(null,board,tempboard, 0, 0, 1, lastMove,function(res){

	console.log("\nvalidateMoveTest Case 1: position taken:")
	console.log("expected: -1\t" + "result: " + res + "\n");
});


//test 2
/**********************************************************/

var board = [
	[1, 0],
	[0, 1]
];


var lastMove = {
	x : 0,
	y : 0,
	c : 1,
	pass: false
}

var prevboard = [
	[0 , 0],
	[0 , 1]
];

var tempboard = board;

var a = gameboard.validateMoveAndCalculateCapturedTokens(null,board,tempboard, 0, 1, 2, lastMove,function(res){

	console.log("\nvalidateMoveTest Case 2: suicidal:")
	console.log("expected: -3\t" + "result: " + res + "\n");
});


//test 3
/**********************************************************/


var board = [
	[ 0, 2 , 0],
	[ 2, 1 , 0],
	[ 1, 0 , 0]
];


var lastMove = {
	x : 0,
	y : 1,
	c : 2,
	pass: false
}

var prevboard = [
	[ 1, 2 , 0],
	[ 0, 1 , 0],
	[ 1, 0 , 0]
]

var tempboard = board;

var a = gameboard.validateMoveAndCalculateCapturedTokens(prevboard,board,tempboard, 0, 0, 1, lastMove,function(res){

	console.log("\nvalidateMoveTest Case 3: reverts board")
	console.log("expected: -2\t" + "result: " + res + "\n");
});

//test 4
/**********************************************************/


var board = [
	[ 1, 2 , 0],
	[ 0, 1 , 0],
	[ 1, 0 , 0]
];


var lastMove = {
	x : 0,
	y : 0,
	c : 1,
	pass: false
}

var prevboard = [
	[ 0, 2 , 0],
	[ 0, 1 , 0],
	[ 1, 0 , 0]
]

var tempboard = board;

var a = gameboard.validateMoveAndCalculateCapturedTokens(prevboard,board,tempboard, 0, 1, 2, lastMove,function(res){

	console.log("\nvalidateMoveTest Case 4: captures")
	console.log("expected: 1\t" + "result: " + res + "\n");
});



