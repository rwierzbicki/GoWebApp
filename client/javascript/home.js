window.onload = function() {
	hidePages();
	renderHomePage();

	$('.new-game-button').click(renderNewGamePage);
	$('.home-button').click(renderHomePage);
}

function renderHomePage() {
	hidePages();
	$('#home-page').show();
}

function renderNewGamePage() {
	hidePages();
	$('#game-setup-page').show();
}

function hidePages() {
	$('#home-page').hide();
	$('#game-setup-page').hide();
}
