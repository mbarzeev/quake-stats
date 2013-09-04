'use strict';

angular.module('quakeStatsApp')
  .controller('MainCtrl', ['$scope', 'GameslogService', function ($scope, GameslogService) {
    var games = GameslogService.getAllGames();
    $scope.games = games;
}]);
