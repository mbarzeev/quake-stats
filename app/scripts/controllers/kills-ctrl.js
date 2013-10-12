'use strict';

angular.module('quakeStatsApp')
    .controller('KillsCtrl', ['$scope', 'gamesLog', 'KillsService',
        function ($scope, gamesLog, KillsService) {
        
        $scope.killStats = {};

        if (gamesLog.success === false) {
            console.log('Cannot load games.log - you wil not be able to see kills stats');
        } else {
            $scope.killsStats = KillsService.getKillsStats(gamesLog.result);
        }
	}]);