'use strict';

angular.module('quakeStatsApp')
    .controller('GamesCtrl', ['$scope', '$routeParams', 'Constants', 'stats', function ($scope, $routeParams, Constants, stats) {
        console.log($routeParams);
        $scope.game = stats;
        $scope.Constants = Constants;
    }]);