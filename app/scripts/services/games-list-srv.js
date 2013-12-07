/**
 * Fetches list of games from server
 */

'use strict';

angular.module('quakeStatsApp').service('GamesListService', ['$http', '$q', function ($http, $q) {
    var me = this;
    this.gamesList = null;

    this.loadGamesList = function () {
        var deferred = $q.defer();
        if (me.gamesList) {
            deferred.resolve(me.gamesList);
        } else {
            $http.get('/rest/games/list')
                .success(function (data) {
                    me.gamesList = data;
                    deferred.resolve(me.gamesList);
                })
                .error(deferred.reject);
        }
        return deferred.promise;
    };
}]);