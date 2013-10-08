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

angular.module('quakeStatsApp').service('GamesLogService', ['$http', '$q', function ($http, $q) {
    var me = this;
    this.gamesLog = null;
    this.loadLog = function () {
        var deferred = $q.defer();
        if (me.gamesLog) {
            deferred.resolve(me.gamesLog);
        } else {
        $http.get('/rest/games/log')
            .success(function (data) {
                me.gamesLog = data.split('\n');
                deferred.resolve(me.gamesLog);
            })
            .error(deferred.reject);

        return deferred.promise;
    };
}]);