'use strict';

angular.module('quakeStatsApp', ['ngResource'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/flags', {
                templateUrl: 'views/flags.html',
                controller: 'FlagsCtrl',
                resolve: {
                    qconsoleLog: ['$q', 'QConsoleService', function($q, QConsoleService) {
                        var dfd = $q.defer();
                        QConsoleService.loadLog().then(
                            function(result) {
                                dfd.resolve({
                                    success: true,
                                    result : result
                                });
                            }, function(error) {
                                dfd.resolve({
                                    success : false,
                                    reason : error
                                });
                            });
                        return dfd.promise;
                    }],
                      
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
