'use strict';

angular.module('quakeStatsApp')
    .controller('MapsCtrl', ['$scope', 'Constants', 'qconsoleLog', 'FlagsService', '$routeParams',
        function ($scope, Constants, qconsoleLog, FlagsService, $routeParams) {
        var flagsMapsIndex = $routeParams.flagsmapindex;
        $scope.stats = {};

        if (qconsoleLog.success === false) {
            console.log('Cannot load qconsole - you wil not be able to see Flag stats');
        } else {
            $scope.stats = FlagsService.getFlagsStats(qconsoleLog.result);
            $scope.flagsMapStats = $scope.stats.maps[flagsMapsIndex];
        }
    }]);