var express = require("express");
var bodyParser = require("body-parser");

var app = express();

// use parser to get JSON objects ouf of request
app.use(bodyParser.json());

/* where to look for files
	html files can be referenced just by their name (eg 'home.html')
	other static files must be referenced by their folder first
		js -> javascript/
		css -> css/
		images -> assets/
	(eg. 'javascript/home.js')
*/
app.use(express.static('../client'));
app.use(express.static('../client/html'));
app.use('/js', express.static('../node_modules/bootstrap/dist/js'));		// redirect bootstrap JS
app.use('/js', express.static('../node_modules/jquery/dist'));				// redirect JS jQuery
app.use('/css', express.static('../node_modules/bootstrap/dist/css'));		// redirect CSS bootstrap

// redirect empty url to home page
app.get("/", function(req, res) {
	res.redirect('/home.html');
});

app.listen(30094, function() {
	console.log("Listening on port 30094");
});

/* =========================================== */
var conenctionList = {};

var io = require('socket.io').listen(10086);

function validateUser(username, password){
	result = (Math.floor(Math.random() * 10) % 2) == 0;
	return result;
}

io.sockets.on('connection', function(socket){
	console.log("Connection accepted: %s", socket.id);
	// conenctionList.push({id : socket.id, socket : socket});
	conenctionList[socket.id] = socket;
	var username;
	var password;
	var isLoggedIn = false;

	socket.on('auth', function(data, response){
		var credential = JSON.parse(data);
		if(validateUser(credential.username, credential.password)){
			username = credential.username;
			password = credential.password;
			isLoggedIn = true;
			response(true);
		}else{
			response(false);
		}
	});

	socket.on('control', function(command, response){
		if(command == 'getAuthStatus'){
			response('' + isLoggedIn.toString());
		}
		if(command == 'dbTest'){

		}
	});

	socket.emit('publish', 'Welcome, your id is: ' + socket.id);

	socket.on('publish', function (data) {
		console.log("ID: %s; Sent: %s", socket.id, data);
		// for (var socketID in conenctionList){
		// 	if(socketID != socket.id){
		// 		conenctionList[socketID].emit('publish', data);
		// 	}
		// }

		if(data.startsWith("/")){
			data = data.slice(1);
			var args = data.split(':');
			var command = args[0];
				
			if(command == 'list'){
				response = 'The user list is as follows:<br>';
				for(var socketID in conenctionList){
					if(socketID != socket.id)
						response += (socketID + '<br>');
				}
				socket.emit('publish', response);
			}else if(command == 'pvt'){
				var user = args[1];
				var msg = args[2];
			 	if(conenctionList[user] == undefined){
					socket.emit('publish', 'Specified user does not exist');
				}else{
					conenctionList[user].emit('publish', '[Private @ ' + socket.id + ']: ' + msg);
					socket.emit('publish', '[Private - ' + user + ']: ' + msg);
				}
			}else{
				socket.emit('publish', 'Invalid Command');
			}
		}else{
			io.sockets.emit('publish', data);
		}
	});
	socket.on('disconnect', function(){
		console.log("Connection closed, removing socket..");
		delete conenctionList[socket.id];
	});
});

process.on('SIGINT', function(){
	console.log(' Ctrl+C Pressed. Saving changes...');
	// Save changes here
	console.log('Exiting...')
	process.exit(0);
});
