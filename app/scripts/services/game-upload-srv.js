'use strict';

angular.module('quakeStatsApp').service('GameUploadService', ['$http', '$q', function ($http, $q) {

    this.uploadGame = function (gameData) {
        var deferred = $q.defer();
        $http.post('/rest/admin/upload-game', gameData)
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };
}]);