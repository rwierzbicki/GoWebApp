'use strict';

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

class DBInterface{
	constructor(u, p, db, host, port){
		this._user = u;
		this._passwd = p;
		this._dbname = db || 'go';
		this._host = host || '127.0.0.1';
		this._port = port || 27017;

		this._db = null;
	}

	// Establish the connection to the database and perform callback() operation
	// after the connection has been established. Use existing connection if possible.
	connect(callback){
		var self = this;

		// Reuse the database connection to reduce connection creation overhead
		if(self._db == null){
			var url;
			// If a user name is provided, assume authentication enabled
			if(this._user != null){
				url = 'mongodb://' + this._user + ':' + this._passwd + '@' + this._host + ':' + 
						this._port + '/' + this._dbname + '?authMechanism=DEFAULT&authSource=admin'; 
			}else{
				url = 'mongodb://' + this._host + ':' + this._port + '/' + this._dbname;
			}

			MongoClient.connect(url, function(err, db){
				if(err){
					console.log('Error connecting to the database');
					self._db = null;
					callback(err);
				}else{
					console.log('Connection established');
					self._db = db;
					callback(null);
				}
			});
		}else{
			callback(null);
		}
	}

	// Close the connection
	close(){
		if(this._db)
			this._db.close();
	}

	// Initialize the database with basic documents and collections
	init(){
		// Put initializations here if there are any
	}

	// Remove the database "go". Use for debugging purpose only.
	dropDatabase(){
		var self = this;
		this.connect(function(){
			db.dropDatabase(function(err, result) {
				if(err != null){
					console.log('Database "go" has been successfully deleted.');
					console.log(result.toString());
				}else{
					console.log('Error occurred when deleting database "go".')
					console.log(result.toString());
				}
			});
		});
	}
}

module.exports = DBInterface;