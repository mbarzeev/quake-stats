'use strict';

angular.module('quakeStatsApp')
    .controller('MainCtrl', ['$scope', 'Constants', 'stats', function ($scope, Constants, stats) {
        $scope.games = stats.gamesStats;
        $scope.crossGamesStats = stats.crossGamesStats;
        $scope.Constants = Constants;
    }]);
