var board;

window.onload = function() {
	hidePages();
	renderHomePage();

	$('.new-game-button').click(renderNewGamePage);
	$('.home-button').click(renderHomePage);
	$('#submit-options-button').click(startGame); 
}

function renderHomePage() {
	hidePages();
	$('#home-navbar').show();
	$('#home-page').show();
}

function renderNewGamePage() {
	hidePages();
	$('#other-navbar').show();
	$('#game-setup-page').show();
}

function renderGamePage() {
	hidePages();
	$('#other-navbar').show();
	$('#game-page').show();
}

function hidePages() {
	$('#home-navbar').hide();
	$('#other-navbar').hide();
	$('#home-page').hide();
	$('#game-setup-page').hide();
	$('#game-page').hide();
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