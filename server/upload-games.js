'use strict';

var Q = require('q');
var Game = require('./mongo-models.js').Game;

function getPersistedLogsCount() {
    var deferred = Q.defer();
    Game.count(function (err, count) {
        if (err) {
            deferred.reject();
            return;
        }
        deferred.resolve(count);
    });
    return deferred.promise;
}

function persistGame(game, id) {
    var deferred = Q.defer();

    new Game({
        gameId: id,
        label: game.label,
        log: game.log,
        qconsole: game.qconsole
    }).save(function (err) {
        if (err) {
            deferred.reject();
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

exports.upload = function (game) {
    var deferred = Q.defer();

    getPersistedLogsCount().then(function (count) {
        persistGame(game, count)
            .then(deferred.resolve, deferred.reject);
    }, deferred.reject);

    return deferred.promise;
};