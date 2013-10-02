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

angular.module('quakeStatsApp').service('LogService', ['$http', '$q', function ($http, $q) {
    this.loadLog = function () {
        var deferred = $q.defer();
        $http.get('/rest/games/log')
            .success(function (data) {
                var log = data.split('\n');
                deferred.resolve(log);
            })
            .error(deferred.reject);

        return deferred.promise;
    };
}]);