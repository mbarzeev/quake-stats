var mongo = require('mongoose');

mongo.connect('mongodb://localhost/quakeStats');
var Game = mongo.model('game', {gameId: String, log: String, qconsole: String, label: String});
exports.Game = Game;
