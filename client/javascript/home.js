var userSigningIn; //which player is signing in

window.onload = function() {
	// Event Listeners
	$('.new-game-button').click(showNewGamePage);
	$('.home-button').click(showHomePage);
	$('#submit-options-button').click(startGame);
	$('#submit-login-button').click(function() {
		userSigningIn = 1;
		submitLogin();
	});
	$('#game-history-button').click(showHistoryPage);
	$('#logout-button').click(logout);
	$('#chooseTokenModal').on('show.bs.modal', onTokenModalOpened);
	$('#prev-board-button').click(clickPrevBoard);
	$('#next-board-button').click(clickNextBoard);

	loadTokenSelectionModal();
	loadGameHistory();
}

function showHomePage() {
	$('.initially-hidden').hide();
	if (player1.username)	// if logged in, show username
		$('#username-button').parent().parent().show();
	$('#home-page').show();
}

function showNewGamePage() {
	$('.page-section').hide();
	$('#game-setup-page').show();
	$('#logo').show();
}

function showGamePage() {
	$('.page-section').hide();
	$('#history-controls').hide();
	$('#game-page').show();
	$('#logo').show();
}

function showHistoryPage() {
	$('.page-section').hide();
	$('#history-page').show();
	$('#logo').show();
}


function startGame() {
	board.setSize(parseInt($('input[name="board-size-radio"]:checked').val()));
	currPlayer = 1;
	renderNewGameBoard();
	updatePlayerInfo();
	showGamePage();
}

function submitLogin() {
	var form = document.getElementById("login-form").elements;
	if (userSigningIn == 1) {
		player1.username = form["username"].value;
		var password = form["password"].value;
		// TODO authenticate user
		login();
	} else {
		player2.username = form["username"].value;
		var password = form["password"].value;
		// TODO authenticate user
	}
}

function login() {
	$('#login-button').parent().parent().hide();
	$('#username-button').html(player1.username + '<b class="caret"></b>');
	$('#username-button').parent().parent().show();
	updatePlayerInfo();
}

function logout() {
	player1.username = undefined;
	$('#username-button').parent().parent().hide();
	$('#login-button').parent().parent().show();
	showHomePage();
}