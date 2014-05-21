// Reading material
// ----------------
// http://www.nanobit.net/doxy/quake3/g__client_8c-source.html
// G_LogPrint is the method name for printing to the log on this file: https://github.com/id-Software/Quake-III-Arena/blob/dbe4ddb10315479fc00086f08e25d968b4b43c49/code/game/g_main.c
// http://planetquake.gamespy.com/View.php?view=Guides.Detail&id=51&game=4
// This is where the flags are being caclulated: https://github.com/id-Software/Quake-III-Arena/blob/dbe4ddb10315479fc00086f08e25d968b4b43c49/code/game/g_team.c

/**
 * Fetches log from server
 */

'use strict';

angular.module('quakeStatsApp').service('GamesLogService', ['$http', '$q', '$cacheFactory', function ($http, $q, $cacheFactory) {
    var gamesLogCache = $cacheFactory('log');

    this.loadLog = function (game) {
        var deferred = $q.defer();
        var gamesLogData = gamesLogCache.get(game);
        if (gamesLogData) {
            deferred.resolve(gamesLogData);
        } else {
            $http.get('/rest/games/log/' + game)
            .success(function (data) {
                gamesLogData = data.split('\n');
                gamesLogCache.put(game, gamesLogData);
                deferred.resolve(gamesLogData);
            })
            .error(deferred.reject);
        }
        return deferred.promise;
    };
}]);