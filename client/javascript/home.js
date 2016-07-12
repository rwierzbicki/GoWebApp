window.onload = function() {
	// Event Listeners
	$('.new-game-button').click(showNewGamePage);
	$('.home-button').click(showHomePage);
	$('#submit-options-button').click(startGame);
	$('#submit-login-button').click(submitLogin);
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

function startGame() {
	showGamePage();
	$('#gameboard').empty();
	board.setSize(parseInt($('input[name="board-size-radio"]:checked').val()));
	renderNewGameBoard($('#gameboard-container'));
	updatePlayerInfo();
}

function submitLogin() {
	var form = document.getElementById("login-form").elements;
	var username = form["username"].value;
	var password = form["password"].value;

	console.log("Username: " + username);
	console.log("Password: " + password);
}
