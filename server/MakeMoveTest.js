// JavaScript source code
var stuff = require("./gameboard");

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

var a = stuff.makeMove(board, 2, 0, 2, lastMove, function (cap) {
    console.log("CASE 1 CAPTURED: " + cap);
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

var a = stuff.makeMove(board, 0, 1, 2, lastMove, function (cap) {
    console.log("CASE 2 CAPTURED: " +cap);
});