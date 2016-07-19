var http = require("http");

function getRandomMove(size, board, lastMove, cb){

    // TODO: Implement me...

	var postData = {
		'size' : size,
		'board' : board,
		'last' : lastMove
	};

	postData = JSON.stringify(postData);

    // See https://nodejs.org/api/http.html#http_http_request_options_callback
	var options = {
		// host : 'roberts.seng.uvic.ca',
		host : '127.0.0.1',
		path : '/ai/random',
		port : '30000',
		method : 'POST',
		headers: {
			'Content-Type' : 'application/json',
			'Content-Length' : Buffer.byteLength(postData)
		}
	};

	var callback = function (response) {
		var str = '';
		response.on('data', function (chunk) {
			// console.log(chunk.toString());
			str += chunk.toString();
		});

		response.on('end', function () {
			console.log(str);
			console.log('No more response');
			var move = JSON.parse(str);
			cb(move);
		});
	};

	var req = http.request(options, callback);

	req.on('error', function (e) {
		console.log('Problem with request: ${e.message}' + e.toString());
	});

	req.write(postData);

	req.end();
}

module.exports = {
    getRandomMove : getRandomMove
}