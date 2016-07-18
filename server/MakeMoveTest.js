// JavaScript source code
var gameboard = require("./gameboard");

board = [
    [2, 1, 0],
    [0, 2, 1],
    [0, 0, 2]
];

lastMove = {
    "x": 0,
    "y": 1,
    "c": 1,
    "pass": false
}

var a = gameboard.makeMove(board, 2, 0, 2, lastMove, function (cap) {
    console.log("CASE 1 CAPTURED: " + cap.captured + "\n");
    var i=0;

    console.log("original board:\n[2, 1, 0]\n[0, 2, 1]\n[0, 0, 2]\n\nCaptured Tokens:")

    for(i = 0;i<cap.capturedTokens.length;i++){
        console.log(cap.capturedTokens[i]);
    };

    console.log("current board:");
    console.log(cap.board);
    
});


board = [
    [1, 2, 0],
    [0, 2, 0],
    [0, 1, 0]
];

lastMove = {
    "x": 0,
    "y": 0,
    "c": 1,
    "pass": false
}

var a = gameboard.makeMove(board, 0, 1, 2, lastMove, function (cap) {
    console.log("CASE 2 CAPTURED: " +cap.captured);
    var i=0;
    for(i = 0;i<cap.capturedTokens.length;i++){
        console.log(cap.capturedTokens[i]);
    };
});

