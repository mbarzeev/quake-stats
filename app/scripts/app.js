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
                    }]
                }
            })
            .when('/maps/:flagsmapindex', {
                templateUrl: 'views/maps.html',
                controller: 'MapsCtrl',
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
                    }]
                }
            })
            .otherwise({
                redirectTo: '/flags'
            });

        // TODO: resolve error handling
    }]);
