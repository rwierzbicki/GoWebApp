var board;

window.onload = function() {
	// Event Listeners
	$('.new-game-button').click(renderNewGamePage);
	$('.home-button').click(renderHomePage);
	$('#submit-options-button').click(startGame); 
}

function renderHomePage() {
	$('.initially-hidden').hide();
	$('#home-navbar').show();
	$('#home-page').show();
}

function renderNewGamePage() {
	$('.page-section').hide();
	$('#other-navbar').show();
	$('#game-setup-page').show();
}

function renderGamePage() {
	$('.page-section').hide();
	$('#other-navbar').show();
	$('#game-page').show();
}

function startGame() {
	renderGamePage();
	$('#gameboard').empty();
	board = {
		size: parseInt($('input[name="board-size-radio"]:checked').val()),
		realSize: 600
	};
	setupGame($('#gameboard'), board.size, board.realSize);
}