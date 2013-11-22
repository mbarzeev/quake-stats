'use strict';

angular.module('quakeStatsApp')
    .controller('DashboardCtrl', ['$scope', 'gamesLog', 'qconsoleLog', 'KillsService', 'FlagsService',
        function ($scope, gamesLog, qconsoleLog, KillsService, FlagsService) {

        $scope.killStats = {};
        $scope.flagsStats = {};

        if (gamesLog.success === false) {
            console.log('Cannot load games.log - you wil not be able to see kills stats');
            return;
        }

        if (qconsoleLog.success === false) {
            console.log('Cannot load qconsole - you wil not be able to see Flag stats');
            return;
        }

        $scope.killsStats = KillsService.getKillsStats(gamesLog.result);
        $scope.flagsStats = FlagsService.getFlagsStats(qconsoleLog.result);
        $scope.playersCount = Object.keys($scope.killsStats.players).length;
	}]);