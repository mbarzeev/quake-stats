'use strict';

angular.module('quakeStatsApp', ['ngResource', 'ngAnimate', 'ngRoute', 'googlechart'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/flags', {
                templateUrl: '/views/flags.html',
                controller: 'FlagsCtrl',
                resolve: {
                    qconsoleLog: ['$q', 'QConsoleLogService', function($q, QConsoleLogService) {
                        var dfd = $q.defer();
                        QConsoleLogService.loadLog().then(
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
                    }]
                }
            })
            .when('/maps/:flagsmapindex', {
                templateUrl: '/views/maps.html',
                controller: 'MapsCtrl',
                resolve: {
                    qconsoleLog: ['$q', 'QConsoleLogService', function($q, QConsoleLogService) {
                        var dfd = $q.defer();
                        QConsoleLogService.loadLog().then(
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
                    }]
                }
            })
            .when('/kills', {
                templateUrl: '/views/kills.html',
                controller: 'KillsCtrl',
                resolve: {
                    gamesLog: ['$q', 'GamesLogService', function($q, GamesLogService) {
                        var dfd = $q.defer();
                        GamesLogService.loadLog().then(
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
                    }]
                }
            })
            .when('/players', {
                templateUrl: '/views/players.html',
                controller: 'PlayersCtrl',
                resolve: {
                    gamesLog: ['$q', 'GamesLogService', function($q, GamesLogService) {
                        var dfd = $q.defer();
                        GamesLogService.loadLog().then(
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
                    }]
                }
            })
            .when('/players/:id', {
                templateUrl: '/views/player.html',
                controller: 'PlayerCtrl',
                resolve: {
                    gamesLog: ['$q', 'GamesLogService', function($q, GamesLogService) {
                        var dfd = $q.defer();
                        GamesLogService.loadLog().then(
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
                    qconsoleLog: ['$q', 'QConsoleLogService', function($q, QConsoleLogService) {
                        var dfd = $q.defer();
                        QConsoleLogService.loadLog().then(
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
                    }]
                }
            })
            .when('/dashboard', {
                templateUrl: '/views/dashboard.html',
                controller: 'DashboardCtrl',
                resolve: {
                    gamesLog: ['$q', 'GamesLogService', function($q, GamesLogService) {
                        var dfd = $q.defer();
                        GamesLogService.loadLog().then(
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
                    qconsoleLog: ['$q', 'QConsoleLogService', function($q, QConsoleLogService) {
                        var dfd = $q.defer();
                        QConsoleLogService.loadLog().then(
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
                    }]
                }
            })
            .when('/teams', {
                templateUrl: '/views/teams.html',
                controller: 'TeamsCtrl',
                resolve: {
                    gamesLog: ['$q', 'GamesLogService', function($q, GamesLogService) {
                        var dfd = $q.defer();
                        GamesLogService.loadLog().then(
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
                    qconsoleLog: ['$q', 'QConsoleLogService', function($q, QConsoleLogService) {
                        var dfd = $q.defer();
                        QConsoleLogService.loadLog().then(
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
                    }]
                }
            })
            .otherwise({
                redirectTo: '/dashboard'
            });

        // TODO: resolve error handling
    }]);
