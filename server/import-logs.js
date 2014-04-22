'use strict';

var Q = require('q');
var fs = require('fs');
var Game = require('./mongo-models.js').Game;
var rimraf = require('rimraf');

function getLogsToSync() {
    var deferred = Q.defer();
    fs.readdir('./logs', function(err, files) {
        if (err) {
            deferred.reject();
        } else {
            deferred.resolve(files);
        }
    });

    return deferred.promise;
}

function readLogAndAddToMap(logDir, fileName, map) {
    var deferred = Q.defer();
    fs.readFile('./logs/' + logDir + '/' + fileName + '.log', function (err, content) {
        if (err) {
            deferred.reject();
            return;
        }
        map[fileName] = content;
        deferred.resolve();
    });

    return deferred.promise;
}

function getLogsContent(logDirs) {
    var deferred = Q.defer();
    var logs = {};
    var promiseArray = [];
    logDirs.forEach(function (logDir) {
        logs[logDir] = {};
        var gamesLogPromise = readLogAndAddToMap(logDir, 'games', logs[logDir]);
        var qconsoleLogPromise = readLogAndAddToMap(logDir, 'qconsole', logs[logDir]);

        promiseArray.push(gamesLogPromise, qconsoleLogPromise);
    });

    Q.all(promiseArray).then(function () {
        deferred.resolve(logs);
    }).done();

    return deferred.promise;
}

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

function persistGame(logs, label, id) {
    var deferred = Q.defer();

    new Game({
        gameId: id,
        label: label,
        log: logs.games,
        qconsole: logs.qconsole
    }).save(function (err) {
        if (err) {
            deferred.reject();
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function removeDir(path) {
    var deferred = Q.defer();
    rimraf(path, function (err) {
        if (err) {
            deferred.reject();
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function clearPersistedLogs(logDirNames) {
    var promiseArray = [];
    var i;
    for (i = 0; i < logDirNames.length; i++) {
        promiseArray.push(removeDir('./logs/' + logDirNames[i]));
    }

    return Q.all(promiseArray).promise;
}

exports.sync = function () {
    var deferred = Q.defer();
    var logsPromise = getLogsToSync().then(getLogsContent);
    var countPromise = getPersistedLogsCount();
    var gamesPromises = [];

    Q.all([logsPromise, countPromise]).then(function (results) {
        var logs = results[0];
        var count = results[1];
        var i;
        var keys = Object.keys(logs);
        for (i = 0; i < keys.length; i++) {
            gamesPromises.push(persistGame(logs[keys[i]], keys[i], count++));
        }

        Q.all(gamesPromises).then(function () {
            clearPersistedLogs(keys).then(deferred.resolve, deferred.reject);
        }, deferred.reject);
    });

    return deferred.promise;
};
