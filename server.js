var express = require('express'),
	bodyParser = require('body-parser'),
	multiparty = require('connect-multiparty'),
	mongodb = require('mongodb'),
	objectId = require('mongodb').ObjectId
	fs = require('fs');

var app = express();


app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());
app.use(multiparty());

app.use(function(req, res, next){

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "content-type");
	res.setHeader("Access-Control-Allow-Credentials", true);

	next();
});

var port = 8080;

app.listen(port);

var db = new mongodb.Db(
	'socialMedia',
	new mongodb.Server('localhost', 27017, {}),
	{}
);

console.log('Servidor HTTP esta escutando na porta ' + port);

app.get('/', function(req, res){

	res.send({msg:'Olá'});
});

//GET (ready)
app.get('/api', function(req, res){

	db.open( function(err, mongoclient){
		mongoclient.collection('post', function(err, collection){
			collection.find().toArray(function(err, results){
				if(err){
					res.json(err);
				} else {
					res.json(results);
				}
				mongoclient.close();
			});
		});
	});
});


//GET by ID (ready)

app.get('/user/:nickname', function(req, res){
	db.open( function(err, mongoclient){
		mongoclient.collection('personalInformation', function(err, collection){
			collection.find({"nickname": (req.params.nickname)}).limit(1).toArray(function(err, results){
				if(err){
					res.json(err);
				} else {
					res.status(200).json(results);
				}
				mongoclient.close();
			});
		});
	});

});

