'use strict';

var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var importLogs = require('./import-logs.js');
var Game = require('./mongo-models').Game;

app.use(logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser());
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
            next(err);
        }
        if (!game) {
            next(new Error('game id ' + logId + 'not found'));
            return;
        }

        res.send(game.log);
    });
});

app.get('/rest/games/qconsole/:id', function(req, res, next){
    var logId = req.params.id;

    Game.findOne({gameId: logId}, function (err, game) {
        if (err) {
            next(err);
        }
        if (!game) {
            next(new Error('game id ' + logId + 'not found'));
            return;
        }

        res.send(game.qconsole);
    });
});

app.get('/rest/games/list', function(req, res, next) {
    Game.find({}, 'gameId label', function (err, games) {
        if (err) {
            next(err);
        }

        res.send(games);
    });
});

app.get('/rest/admin/syncLogs', function(req, res) {
    importLogs.sync().then(function () {
        res.send('Sync OK');
    }, function (err) {
        res.send(err);
    });
});

// Sync when server starts
importLogs.sync();

module.exports = app;