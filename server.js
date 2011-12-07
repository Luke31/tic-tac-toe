var crypto = require('crypto');
var express = require('express');
var _ = require('underscore');

var port = 1337; //ユヨヨワ Woow
var server = express.createServer();
var games = {};

function randomHash() {
    value = new Date().getTime().toString() + Math.random().toString();
    shasum = crypto.createHash('sha1');
    shasum.update(value);
    return shasum.digest('hex');
}

server.use(express.static(__dirname + '/public'));

server.post('/game/create/:name', function(req, res) {
	name = req.params.name;
	//Check ALL the servers if name already exists
	_.each(games, function(game){
		if(game.name == name){
			res.json({ 'success': false });
		}
	});
	
	//Name is free - Create the Server!
    id = randomHash();
    playerKey = randomHash();
	
    games[id] = {
        id      : id,
		name	: name,
        players : [playerKey],
        state   : [0, 0, 0, 0, 0, 0, 0, 0, 0],
        winner  : 0,
        next    : 1
    };
    res.json({ 'id': id, 'key': playerKey });
});

server.put('/game/:id/join', function(req, res) {
    game = games[req.params.id];
    if (game) {
        playerKey = randomHash();
        game.players.push(playerKey);
        res.json({ 'key': playerKey, 'success': true });
    } else {
        res.json({ 'success': false });
    }
});

server.put('/game/mark/:key/:field', function(req, res) {
    field = req.params.field;
	playerKey = req.params.key;
	var currentGame;
	//Get Game of playerKey
	_.each(games, function(game){
		_.each(game.players, function(player){
			if(player == playerKey){currentGame = game;}
		});
	});
	
	console.log('Player ' + playerKey + ' is on Server: '+ currentGame.id);
});

server.listen(port);
console.log('Server is listening on port ' + port);
