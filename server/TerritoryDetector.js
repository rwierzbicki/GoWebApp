//###############################################################################
//# Module Name: Territory detector
//# Author: Chenchen Guo
//# Email: guoc@uvic.ca
//# Modified: 2016-07-05 7:15 PM
//###############################################################################

// Utility function, generate a board with random tokens
function generateRandomBoard(size) {
	var tempBoard;
	for (var i = 0; i < size; i++) {
		var row = [];
		for (var j = 0; j < size; j++) {
			row.push(Math.floor(Math.random() * 10) % 3);
		}
		board.push(row);
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

// Return the territory information, including territory's size, owner, and corresponding coordinates
function getTerritories(board){
	var boardSize = board.length;
	// Find the coordinates of all empty spaces
	var zeroList = [];
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if(board[i][j] == 0){
				zeroList.push({x: j, y: i});
			}
		}
	}

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

// //====================================================================
// // Sample Usage (Local)
// //====================================================================
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
// console.log(getTerritories(board));

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

module.exports = {getTerritories : getTerritories};