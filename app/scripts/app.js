'use strict';

angular.module('quakeStatsApp', ['ngResource'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/games/:index', {
        templateUrl: 'views/games.html',
        controller: 'GamesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
