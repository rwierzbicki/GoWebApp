window.onload = function() {
	// Event Listeners
	$('.new-game-button').click(showNewGamePage);
	$('.home-button').click(showHomePage);
	$('#submit-options-button').click(startGame); 
}

function showHomePage() {
	$('.initially-hidden').hide();;
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
}