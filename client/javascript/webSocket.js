var socket = io.connect('http://127.0.0.1:10086');

socket.on('publish', function(data) {
	console.log('>> ' + data);
});

function auth(username, password){
	var authObj = {username : username, password: password};
	socket.emit('auth', JSON.stringify(authObj), function(result){
		if(result == true){
			console.log('Login complete');
		}else{
			console.log('Invalid credential');
		}
	});
}

function send(command){
	socket.emit('control', command, function(response){
		console.log(response);
	});
}