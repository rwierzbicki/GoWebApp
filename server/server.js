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
