'use strict';

angular.module('quakeStatsApp')
    .controller('PlayerCtrl', ['$scope', 'gamesLog', 'KillsService', '$routeParams',
        function ($scope, gamesLog, KillsService, $routeParams) {
        var playerID = $routeParams.id;
        $scope.killStats = {};

        if (gamesLog.success === false) {
            console.log('Cannot load games.log - you wil not be able to see kills stats');
            return;
        }

        $scope.killsStats = KillsService.getKillsStats(gamesLog.result);
        var killStatsPlayer = $scope.killsStats.players[playerID];
        $scope.playerName = killStatsPlayer.name;
        $scope.playerKillsModes = KillsService.getPlayerKillsModes(killStatsPlayer);
	}]);