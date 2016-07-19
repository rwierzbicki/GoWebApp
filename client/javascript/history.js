var history = {
	list: [],
	currHistoryIndex: 0
}


function loadGameHistory() {
	// TODO: get game history data from server
	var data = [
		{
			gameId: 99838472,
			date: 437298759875,
			player1: "mystigan",
			player2: "tigger342",
			finished: false
		},
		{
			gameId: 234252,
			date: 51235750293,
			player1: "wileycoyote",
			player2: null,
			finished: true,
			winner: 1
		}
	];

	var table = document.getElementById('game-history-table');
	for (var i = 0; i < data.length; i++) {
		var row = table.insertRow(-1);	// insert row at end

		// Date
		var cell = row.insertCell();
		cell.innerHTML = (new Date(data[i].date)).toDateString();

		// Player 1
		cell = row.insertCell();
		cell.innerHTML = data[i].player1;

		// Player 2
		cell = row.insertCell();
		if (data[i].player2)
			cell.innerHTML = data[i].player2;
		else
			cell.innerHTML = "CPU";

		// Replay or continue
		cell = row.insertCell();
		var button = document.createElement('button');
		button.setAttribute('gameId', data[i].gameId);
		button.className = "btn btn-primary";
		if (data[i].finished) {
			button.innerHTML = "Replay";
			button.onclick = clickReplayGame;
		} else {
			button.innerHTML = "Continue";
			button.onclick = clickContinueGame;
		}
		cell.appendChild(button);
	}
}

function clickContinueGame(event) {
	var gameId = event.target.getAttribute('gameId');

	// TODO get game data from server using gameId
	var data = {
		player1: "mystigan",
		player2: "tigger342",
		boardSize: 9,
		currPlayer: 2,
		boardState: {
			board: [ [0, 0, 1], [4, 2, 2], [6, 7, 1] ],
			capturedTokens1: 18,
			capturedTokens2: 4,
			playerPassed1: false,
			playerPassed2: false
		}
	};

	board.setSize(data.boardSize);
	if (data.player2)
		board.hotseat = true;
	else
		board.hotseat = false
	currPlayer = data.currPlayer;
	board.state = boardListToArray(data.boardSize, data.boardState.board);

	renderUnfinishedGameBoard();
	showGamePage();
}

function clickReplayGame(event) {
	var gameId = event.target.getAttribute('gameId');

	// TODO get game data from server using gameId
	var data = {
		player1: "mystigan",
		player2: "tigger342",
		boardSize: 9,
		history: [
			{
				board: [ ],
				capturedTokens1: 0,
				capturedTokens2: 0,
				playerPassed1: false,
				playerPassed2: false
			},
			{
				board: [ [3, 8, 1] ],
				capturedTokens1: 3,
				capturedTokens2: 0,
				playerPassed1: false,
				playerPassed2: false
			},
			{
				board: [ [2, 3, 2], [3, 8, 1] ],
				capturedTokens1: 9,
				capturedTokens2: 2,
				playerPassed1: false,
				playerPassed2: false
			},
			{
				board: [ [5, 1, 1 ], [2, 3, 2], [3, 8, 1] ],
				capturedTokens1: 9,
				capturedTokens2: 2,
				playerPassed1: false,
				playerPassed2: false
			},
			{
				board: [ [5, 1, 1 ], [2, 3, 2], [6, 5, 2], [3, 8, 1] ],
				capturedTokens1: 14,
				capturedTokens2: 2,
				playerPassed1: false,
				playerPassed2: false
			}
		]
	};

	board.setSize(data.boardSize);
	if (data.player2)
		board.hotseat = true;
	else
		board.hotseat = false
	history.list = data.history;
	history.currHistoryIndex = data.history.length-1;
	if (data.history.length > 1)
		$('#prev-board-button').show();

	renderHistoryGameBoard();
	updateHistoryInfo();
	showGamePage();
}

function clickPrevBoard(event) {
	$('#next-board-button').show();
	history.currHistoryIndex -= 1;
	if (history.currHistoryIndex === 0)
		$('#prev-board-button').hide();
	renderHistoryGameBoard();
	updateHistoryInfo();
}

function clickNextBoard(event) {
	$('#prev-board-button').show();
	history.currHistoryIndex += 1;
	if (history.currHistoryIndex === history.list.length-1)
		$('#next-board-button').hide();
	renderHistoryGameBoard();
	updateHistoryInfo();
}

function renderHistoryGameBoard() {
	var boardArr = boardListToArray(board.size, history.list[history.currHistoryIndex].board);
	$('#gameboard').empty();
	var svg = makeGameBoard();
	
	// tokens
    for (var row = 0; row < (board.size); row++) {
    	for (var col = 0; col < (board.size); col++) {
    		if (boardArr[row][col] == 1)
    			svg.append(makeToken(col, row, board.sqSize, PLAYER_1_TOKEN, "token-image placed 1"));
    		else if (boardArr[row][col] == 2)
    			svg.append(makeToken(col, row, board.sqSize, PLAYER_2_TOKEN, "token-image placed 2"));
    	}
    }

	$('#gameboard-container').append(svg);
}

function updateHistoryInfo() {
	currPlayer = (history.currHistoryIndex%2 == 0 ? 1 : 2);
	updatePlayerInfo();
	$('#board-page-number').html((history.currHistoryIndex+1) + "/" + history.list.length);
}
