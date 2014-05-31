'use strict';

angular.module('quakeStatsApp')
    .controller('DashboardCtrl', ['$scope', '$routeParams', 'gamesLog', 'qconsoleLog', 'KillsService', 'FlagsService',
        function ($scope, $routeParams, gamesLog, qconsoleLog, KillsService, FlagsService) {
        $scope.gameId = $routeParams.gameId;
        $scope.flagsStats = {};

        if (gamesLog.success === false) {
            console.log('Cannot load games.log - you wil not be able to see kills stats');
            return;
        }

        if (qconsoleLog.success === false) {
            console.log('Cannot load qconsole - you wil not be able to see Flag stats');
            return;
        }

        $scope.killsStats = KillsService.getKillsStats(gamesLog.result, $scope.gameId);
        $scope.flagsStats = FlagsService.getFlagsStats(qconsoleLog.result, $scope.gameId);
        $scope.playersCount = Object.keys($scope.killsStats.players).length;

        $scope.dashboardItems = [
            {
                playersList: $scope.killsStats.topKillers,
                title: 'Top Killer',
                property: 'kills.length'
            },
            {
                title: 'Wins',
                type: 'custom',
                template: '/templates/custom-dashboard-item-wins-tmpl.html'
            },
            {
                playersList: $scope.flagsStats.topOverallScorers,
                title: 'Top Scorer',
                property: 'value',
                icon: 'medal_frags'
            },
            {
                playersList: $scope.killsStats.topVictims,
                title: 'Top Victim',
                property: 'deaths.length'
            },
            {
                playersList: $scope.killsStats.topHumilators,
                title: 'Top Humiliator',
                property: 'humiliations.length',
                icon: 'gauntlet'
            },
            {
                playersList: $scope.killsStats.topFifthColumns,
                title: 'Top Fifth Column',
                property: 'teammatesKills.length'
            },
            {
                playersList: $scope.flagsStats.topOverallFetchToCaptureRatioPlayers,
                title: 'Top Fetch To Capture Ratio',
                property: 'value',
                description: '/templates/description-dashboard-item-fetch-to-capture-ratio-tmpl.html'
            },
            {
                title: 'Total Players',
                type: 'custom',
                template: '/templates/custom-dashboard-item-players-count-tmpl.html'
            }
        ];
	}]);