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
app.use(express.static('client'));
app.use(express.static('client/html'));
app.use('/js', express.static('node_modules/bootstrap/dist/js'));		// redirect bootstrap JS
app.use('/js', express.static('node_modules/jquery/dist'));				// redirect JS jQuery
app.use('/css', express.static('node_modules/bootstrap/dist/css'));		// redirect CSS bootstrap

// redirect empty url to home page
app.get("/", function(req, res) {
	res.redirect('/home.html');
});

app.listen(30094, function() {
	console.log("Listening on port 30094");
});

/* =========================================== */
var conenctionList = {};
var dbInterface = require('./DBInterface.js');
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var io = require('socket.io').listen(10086);

var db = new dbInterface(null, null);

db.connect(function(error){
	if(error){
		console.log('Database connection failed');
	}else{
		console.log('Database connection established');
	}
});

io.sockets.on('connection', function(socket){
	console.log("Connection accepted: %s", socket.id);
	// conenctionList.push({id : socket.id, socket : socket});
	conenctionList[socket.id] = socket;
	var isLoggedIn = false;
	var userObjID = null;
	var username = null;


	socket.on('auth', function(data, response){
		var credential = JSON.parse(data);
		console.log('Authenticating: ' + credential.username + ' Password: ' + credential.password);
		if(!isLoggedIn){
			db.authenticateUser(credential.username, credential.password, function(objID, result){
				if(result > 0){
					isLoggedIn = true;
					userObjID = objID;
					username = credential.username;
				}
				response(result); // 0: Password incorrect 1: Login succeed 2: Account created
			});
		}else{
			if(username.startsWith('temp_')){
				// Currently the user is using a temporary account
				// Check whether the credential information is valid
				db.isAccountExist(credential.username, credential.password, function(isAccountExist, isPasswordCorrect, objID){
					if(!isAccountExist){
						// The credential information doesn't correspond to any existing account
						// Simply rename the credential information to the new one
						db.modifyAccountInformation(userObjID, {username : credential.username, password : credential.password}, function (err, result) {
							assert.equal(err, null);
							username = credential.username;
							response(3); // 3: Account upgraded
						});
					}else{
						if(isPasswordCorrect){
							// Migrate the information in the temporary account to the formal account
							db.mergeAccount(userObjID, objID, function(isAccountMerged) {
								userObjID = objID;
								username = credential.username;
								if(isAccountMerged){
									response(4); // Temporary account merged to formal account
								}else{
									response(1);
								}
							});
						}else{
							response(0); // 0: Password incorrect
						}
					}
				});
			}else{
				response(-1); // -1: Already logged in
			}
		}
	});

	socket.on('continue', function(data, response){
		if(!isLoggedIn){
			response('ERROR: Not logged in');
			return;
		}
		var parameterObject = data;
		var gameID = parameterObject.gameID;
		var gameParameters = parameterObject.gameParameters;

		if(gameID){
			// Continue a specific game
			console.log('Continue the game: ' + gameID);
			response('Cont.');
		}else{
			// Start a new game
			console.log('Start a new game');
			var boardSize = gameParameters.boardSize;
			var playMode = gameParameters.playMode;
			
			response('New');
		}
	});

	socket.on('getAccountInfo', function(options, response){
		if(!isLoggedIn){
			response('ERROR: Not logged in');
			return;
		}
		db.getAccountInfo(userObjID, function(info) {
			response(info);
		});
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
