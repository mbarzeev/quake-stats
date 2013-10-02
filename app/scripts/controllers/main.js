'use strict';

angular.module('quakeStatsApp')
    .controller('MainCtrl', ['$scope', 'Constants', 'stats', 'qconsoleLog', 'FlagsService',
        function ($scope, Constants, stats, qconsoleLog, FlagsService) {

        $scope.games = stats.gamesStats;
        $scope.crossGamesStats = stats.crossGamesStats;
        $scope.Constants = Constants;

        $scope.stats = {};

        if (qconsoleLog.success === false) {
            console.log('Cannot load qconsole - you wil not be able to see Flag stats');
        } else {
            $scope.stats = FlagsService.getFlagsStats(qconsoleLog.result);
        }
    }]);
