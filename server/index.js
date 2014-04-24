'use strict';

var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var uploadGames = require('./upload-games.js');
var Game = require('./mongo-models').Game;

app.use(logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser({limit: '5mb'}));
app.use(function(err, req, res, next){
    console.log(err);
    res.send(500, err);
});

app.get('/rest/games/log/:id', function(req, res, next){
    var logId = req.params.id;
    if (!logId) {
        res.send(new Error('must provide id'));
    }

    Game.findOne({gameId: logId}, function (err, game) {
        if (err) {
            return next(err);
        }
        if (!game) {
            return next(new Error('game id ' + logId + 'not found'));
        }

        res.send(game.log);
    });
});

app.get('/rest/games/qconsole/:id', function(req, res, next){
    var logId = req.params.id;

    Game.findOne({gameId: logId}, function (err, game) {
        if (err) {
            return next(err);
        }
        if (!game) {
            return next(new Error('game id ' + logId + 'not found'));
        }

        res.send(game.qconsole);
    });
});

app.get('/rest/games/list', function(req, res, next) {
    Game.find({}, 'gameId label', {sort: {gameId: -1}}, function (err, games) {
        if (err) {
            return next(err);
        }

        res.send(games);
    });
});

app.post('/rest/admin/upload-game', function(req, res) {
    uploadGames.upload(req.body).then(function () {
        res.send('Upload OK');
    }, function (err) {
        res.send(err);
    });
});

module.exports = app;