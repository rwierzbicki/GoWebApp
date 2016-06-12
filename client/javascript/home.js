window.onload = function() {
	// Event Listeners
	$('.new-game-button').click(showNewGamePage);
	$('.home-button').click(showHomePage);
	$('#submit-options-button').click(startGame); 
}

function showHomePage() {
	$('.initially-hidden').hide();
	$('#home-navbar').show();
	$('#home-page').show();
}

function showNewGamePage() {
	$('.page-section').hide();
	$('#other-navbar').show();
	$('#game-setup-page').show();
}

function showGamePage() {
	$('.page-section').hide();
	$('#other-navbar').show();
	$('#game-page').show();
}

function startGame() {
	showGamePage();
	$('#gameboard').empty();
	board.setSize(parseInt($('input[name="board-size-radio"]:checked').val()));
	renderNewGameBoard($('#gameboard'));
}