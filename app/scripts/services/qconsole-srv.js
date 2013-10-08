'use strict';

angular.module('quakeStatsApp').service('QConsoleLogService', ['$http', '$q', function ($http, $q) {
    var me = this;
    this.qconsoleLog = null;
    this.loadLog = function () {
        var deferred = $q.defer();
        if (me.qconsoleLog) {
            deferred.resolve(me.qconsoleLog);
        } else {
            $http.get('/rest/games/qconsole')
            .success(function (data) {
                me.qconsoleLog = data.split('\n');
                deferred.resolve(me.qconsoleLog);
            }).
            error(function(data) {
                deferred.reject(data);
            });
        }
        return deferred.promise;
    };
}]);