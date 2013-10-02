'use strict';

angular.module('quakeStatsApp').service('QConsoleService', ['$http', '$q', function ($http, $q) {

    this.loadLog = function () {
        var deferred = $q.defer();
        $http.get('/rest/games/qconsole')
            .success(function (data) {
                var log = data.split('\n');
                deferred.resolve(log);
            }).
            error(function(data) {
                deferred.reject(data);
            });
        return deferred.promise;
    };
}]);