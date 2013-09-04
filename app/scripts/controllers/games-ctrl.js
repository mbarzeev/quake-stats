'use strict';

angular.module('quakeStatsApp')
  .controller('GamesCtrl',  ['$scope', 'GameslogService', '$routeParams', function ($scope, GameslogService, $routeParams) {
  	$scope.game = GameslogService.getGame($routeParams.index);
  }]);