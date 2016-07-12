//###############################################################################
//# Module Name: Territory detector
//# Author: Chenchen Guo
//# Email: guoc@uvic.ca
//# Modified: 2016-07-10 8:50 PM
//###############################################################################

// Utility function, generate a board with random tokens
function generateRandomBoard(size) {
	var tempBoard = [];
	for (var i = 0; i < size; i++) {
		var row = [];
		for (var j = 0; j < size; j++) {
			row.push(Math.floor(Math.random() * 10) % 3);
		}
		tempBoard.push(row);
	}
	return tempBoard;
}

// Check whether two coordinate is spatially connected
function isConnect(token1, token2) {
	var deltaX = Math.abs(token2.x - token1.x);
	var deltaY = Math.abs(token2.y - token1.y);
	return (deltaX == 1 && deltaY == 0 || deltaX == 0 && deltaY == 1);
}

// Check whether two group of coordinates are spatially connected
function isGroupConnect(group1, group2){
	for (var i = 0; i < group1.length; i++) {
		for (var j = 0; j < group2.length; j++) {
			// If any of the two coordinates are connected, then the entire group is connected
			if(isConnect(group1[i], group2[j])){
				return true;
			}
		}
	}
	return false;
}

// Merge spatially connected groups into a larger group
function connectGroup(groupList){
	var newConnectionFormed = false;
	var connectivityArray = [];
	for (var i = 0; i < groupList.length; i++) {
		connectivityArray.push(i);
	}

	for (var i = 0; i < groupList.length; i++) {
		for (var j = i + 1; j < groupList.length; j++) {
			if(isGroupConnect(groupList[i], groupList[j])){
				newConnectionFormed = true;
				connectivityArray[j] = connectivityArray[i];
			}
		}
	}

	var newGroupList = [];
	for (var i = 0; i < connectivityArray.length; i++) {
		var newGroup = [];
		for (var j = 0; j < connectivityArray.length; j++) {
			if(connectivityArray[j] == i){
				newGroup = newGroup.concat(groupList[j]);
			}
		}
		if(newGroup.length != 0){
			newGroupList.push(newGroup);
		}
	}
	return {newGroupList: newGroupList, newConnectionFormed: newConnectionFormed};
}

// Return the groups of adjacent coordinates, given a list of coordinates
function groupAdjacentTokens(tokenList) {
	var tokenGroups = [];
	for (var i = 0; i < tokenList.length; i++) {
		tokenGroups.push([tokenList[i]]); 
	}

	var newConnectionFormed = true;
	// Connect adjacent groups, until no new connection has been formed
	while(newConnectionFormed){
		var result = connectGroup(tokenGroups);
		tokenGroups = result.newGroupList;
		newConnectionFormed = result.newConnectionFormed;
	}
	return tokenGroups;
}

// Check whether a coordinate is already in the list
function isCoordinateInList(coordinate, list){
	for (var i = 0; i < list.length; i++) {
		if(list[i].x == coordinate.x && list[i].y == coordinate.y){
			return true;
		}
	}
	return false;
}

// Check whether a coordinate is valid, given the board size
function isCoordinateValid(coordinate, boardSize){
	return (coordinate.x >= 0 && coordinate.x < boardSize && coordinate.y >= 0 && coordinate.y < boardSize);
}

// Return the valid neighbor coordinates (i.e. up, down, left and right)
function getNeighborCoordinates(coordinate, boardSize){
	var coordinateList = [];
	var x = coordinate.x;
	var y = coordinate.y;
	var up = {x: x, y: y - 1};
	var down = {x: x, y: y + 1};
	var left = {x: x - 1, y: y};
	var right = {x: x + 1, y: y};

	if(isCoordinateValid(up, boardSize))
		coordinateList.push(up);
	if(isCoordinateValid(down, boardSize))
		coordinateList.push(down);
	if(isCoordinateValid(left, boardSize))
		coordinateList.push(left);
	if(isCoordinateValid(right, boardSize))
		coordinateList.push(right);
	return coordinateList;
}

// Return the coordinates of the border of a territory
function getBorderOfGroup(group, boardSize){
	var borderList = [];
	for (var i = 0; i < group.length; i++) {
		var neighborCoordinateList = getNeighborCoordinates(group[i], boardSize);
		for (var j = 0; j < neighborCoordinateList.length; j++) {
			// If the coordinate is not belongs to the body of the group
			if(!isCoordinateInList(neighborCoordinateList[j], group)){
				// If the coordinate is not already in the borderList, append it to the list
				if(!isCoordinateInList(neighborCoordinateList[j], borderList)){
					borderList.push(neighborCoordinateList[j]);
				}
			}
		}
	}
	return borderList;
}

// Return values: 0: Neutral 1: Black 2: White
function getBorderOwner(borderList, board){
	var owner = board[borderList[0].y][borderList[0].x];
	for (var i = 1; i < borderList.length; i++) {
		if(board[borderList[i].y][borderList[i].x] != owner){
			return 0;
		}
	}
	return owner;
}

// Return the list of coordinates of a specific token type
function getTokenCoordinates(board, tokenType) {
	var list = [];
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board.length; j++) {
			if(board[i][j] == tokenType){
				list.push({x: j, y: i});
			}
		}
	}
	return list;
}

// Return the territory information, including territory's size, owner, and corresponding coordinates
function getTerritories(board){
	var boardSize = board.length;
	// Find the coordinates of all empty spaces
	var zeroList = getTokenCoordinates(board, 0);

	var territories = groupAdjacentTokens(zeroList);
	var territoryList = [];
	for (var i = 0; i < territories.length; i++) {
		var territory = territories[i];
		var size = territory.length;
		var owner = getBorderOwner(getBorderOfGroup(territory, boardSize), board);
		territoryList.push({
			owner : owner,
			size : size,
			listOfCoordinates: territory
		});
	}
	return territoryList;
}

// Return tokens that could be captured
function getCapturedTokens(board) {
	var boardSize = board.length;
	//Find the coordinates of all black tokens
	var blackList = getTokenCoordinates(board, 1);
	
	var blackArmies = groupAdjacentTokens(blackList);
	var capturedBlackArmyList = [];
	for (var i = 0; i < blackArmies.length; i++) {
		var army = blackArmies[i];
		var size = army.length;
		var borderOwner = getBorderOwner(getBorderOfGroup(army, boardSize), board);
		
		if(borderOwner == 2){
			// It's completely surrounded by white tokens, thus it can be captured 
			capturedBlackArmyList.push({
				armyOwner: 1,
				capturedBy: 2,
				size: size,
				listOfCoordinates: army
			})
		}
	}

	var whiteList = getTokenCoordinates(board, 2);
	
	var whiteArmies = groupAdjacentTokens(whiteList);
	var capturedWhiteArmyList = [];
	for (var i = 0; i < whiteArmies.length; i++) {
		var army = whiteArmies[i];
		var size = army.length;
		var borderOwner = getBorderOwner(getBorderOfGroup(army, boardSize), board);
		
		if(borderOwner == 1){
			// It's completely surrounded by black tokens, thus it can be captured 
			capturedWhiteArmyList.push({
				armyOwner: 2,
				capturedBy: 1,
				size: size,
				listOfCoordinates: army
			})
		}
	}

	return {capturedBlackArmyList: capturedBlackArmyList, capturedWhiteArmyList: capturedWhiteArmyList};
}

function isSuicide(board, x, y, colour) {
	var surrounding = getBorderOwner(getBorderOfGroup([{x: x, y: y}], board.length), board);
	if (colour == 1 && surrounding == 2 || colour == 2 && surrounding == 1){
		return true;
	}else{
		return false;
	}
}


//====================================================================
// Sample Usage (Local)
//====================================================================
// var board = [[1, 1, 2, 0, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 0, 0, 1],
// 			 [0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 2],
// 			 [1, 2, 2, 0, 0, 0, 1, 0, 2, 1, 2, 2, 0, 0, 0, 1, 0, 2, 0],
// 			 [2, 0, 0, 1, 0, 1, 2, 2, 0, 2, 0, 0, 1, 0, 1, 2, 2, 0, 0],
// 			 [0, 0, 0, 0, 2, 0, 1, 1, 2, 0, 0, 0, 0, 2, 0, 1, 1, 2, 2],
// 			 [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
// 			 [0, 1, 1, 0, 2, 0 ,0 ,2, 1, 0, 1, 1, 0, 2, 0 ,0 ,2, 1, 1],
// 			 [2, 2, 2, 1, 0, 0, 0, 1, 0, 2, 2, 2, 1, 0, 0, 0, 1, 0, 2],
// 			 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
// 			 [0, 1, 1, 0, 2, 0 ,0 ,2, 1, 0, 1, 1, 0, 2, 0 ,0 ,2, 1, 2],
// 			 [2, 2, 2, 1, 0, 0, 0, 1, 0, 2, 2, 2, 1, 0, 0, 0, 1, 0, 2],
// 			 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 			 [2, 0, 0, 1, 0, 1, 2, 2, 0, 2, 0, 0, 1, 0, 1, 2, 2, 0, 2],
// 			 [0, 0, 0, 0, 2, 0, 1, 1, 2, 0, 0, 0, 0, 2, 0, 1, 1, 2, 2],
// 			 [0, 0, 0, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2],
// 			 [0, 1, 1, 0, 2, 2 ,2 ,1, 2, 0, 1, 1, 0, 2, 0 ,0 ,2, 1, 1],
// 			 [2, 0, 0, 1, 1, 1, 1, 2, 1, 2, 0, 0, 1, 0, 1, 2, 2, 0, 2],
// 			 [0, 0, 0, 0, 2, 0, 1, 1, 2, 0, 0, 0, 0, 2, 0, 1, 1, 2, 2],
// 			 [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0]];

// console.log(getTerritories(board));
// console.log(getCapturedTokens(board));
// console.log(isSuicide(board, 8, 16, 1));


// //====================================================================
// // Sample Usage (Cross File)
// //====================================================================
// var territoryDetector = require('./TerritoryDetector')
// var board = [[0, 1, 2, 0, 0, 0, 0, 0, 0],
// 			 [0, 1, 1, 0, 0, 0, 0, 1, 0],
// 			 [1, 2, 2, 0, 0, 0, 1, 0, 2],
// 			 [2, 0, 0, 1, 0, 1, 2, 2, 0],
// 			 [0, 0, 0, 0, 2, 0, 1, 1, 2],
// 			 [0, 0, 0, 0, 0, 0, 0, 2, 0],
// 			 [0, 1, 1, 0, 2, 0 ,0 ,2, 1],
// 			 [2, 2, 2, 1, 0, 0, 0, 1, 0],
// 			 [0, 0, 0, 0, 0, 0, 0, 0, 0]];
//
// console.log(territoryDetector.getTerritories(board));

module.exports = {getTerritories	:	getTerritories,
				getCapturedTokens	:	getCapturedTokens,
						isSuicide	:	isSuicide};