var username1;
var username2;
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

	loadTokenSelectionModal();
}

function showHomePage() {
	$('.initially-hidden').hide();
	$('#home-page').show();
}

function showNewGamePage() {
	$('.page-section').hide();
	$('#game-setup-page').show();
	$('#logo').show();
}

function showGamePage() {
	$('.page-section').hide();
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
	renderNewGameBoard();
	updatePlayerInfo();
	showGamePage();
}

function submitLogin() {
	var form = document.getElementById("login-form").elements;
	if (userSigningIn == 1) {
		username1 = form["username"].value;
		var password = form["password"].value;
		// TODO authenticate user
		login();
	} else {
		username2 = form["username"].value;
		var password = form["password"].value;
		// TODO authenticate user
	}
	
}

function login() {
	$('#login-button').parent().parent().hide();
	$('#username-button').html(username1 + '<b class="caret"></b>');
	$('#username-button').parent().parent().show();
	updatePlayerInfo();
}

function logout() {
	$('#username-button').parent().parent().hide();
	$('#login-button').parent().parent().show();
	showHomePage();
}
