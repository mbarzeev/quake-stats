'use strict';

angular.module('quakeStatsApp')
    .controller('MapsCtrl', ['$scope', '$routeParams', 'Constants', 'qconsoleLog', 'FlagsService',
        function ($scope, $routeParams, Constants, qconsoleLog, FlagsService) {
        $scope.gameId = $routeParams.gameId;
        var flagsMapsIndex = $routeParams.flagsmapindex;
        $scope.stats = {};

        if (qconsoleLog.success === false) {
            console.log('Cannot load qconsole - you wil not be able to see Flag stats');
        } else {
            $scope.stats = FlagsService.getFlagsStats(qconsoleLog.result, $scope.gameId);
            $scope.flagsMapStats = $scope.stats.maps[flagsMapsIndex];
        }
    }]);