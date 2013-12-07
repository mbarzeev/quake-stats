'use strict';

angular.module('quakeStatsApp').service('QConsoleLogService', ['$http', '$q', '$cacheFactory', function ($http, $q, $cacheFactory) {
    var qconsoleLogCache = $cacheFactory('qconsole');

    this.loadLog = function (game) {
        var deferred = $q.defer();
        var logData = qconsoleLogCache.get(game);
        if (logData) {
            deferred.resolve(logData);
        } else {
            $http.get('/rest/games/qconsole/' + game)
            .success(function (data) {
                logData = data.split('\n');
                qconsoleLogCache.put(game, logData);
                deferred.resolve(logData);
            }).
            error(function(data) {
                deferred.reject(data);
            });
        }
        return deferred.promise;
    };
}]);