'use strict';

angular.module('quakeStatsApp', ['ngResource'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    stats: ['StatsService', function (StatsService) {
                        return StatsService.getAllGamesStats();
                    }]
                }
            })
            .when('/games/:index', {
                templateUrl: 'views/games.html',
                controller: 'GamesCtrl',
                resolve: {
                    stats: ['$route', 'StatsService', function ($route, StatsService) {
                        return StatsService.getGameStats($route.current.params.index);
                    }]
                }
            })
            .otherwise({
                redirectTo: '/'
            });

        // TODO: resolve error handling
    }]);
