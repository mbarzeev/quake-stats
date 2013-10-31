'use strict';

angular.module('quakeStatsApp')
    .controller('PlayerCtrl', ['$scope', 'gamesLog', 'KillsService', '$routeParams', '$filter',
        function ($scope, gamesLog, KillsService, $routeParams, $filter) {
        var playerID = $routeParams.id,
            me = this;
        $scope.killStats = {};

        if (gamesLog.success === false) {
            console.log('Cannot load games.log - you wil not be able to see kills stats');
            return;
        }

        $scope.killsStats = KillsService.getKillsStats(gamesLog.result);
        var killStatsPlayer = $scope.killsStats.players[playerID];
        $scope.playerName = killStatsPlayer.name;
        $scope.playerWeaponsStats = KillsService.getPlayerWeaponsStats(killStatsPlayer);

        this.getWeaponsChartData = function(rawData) {
            var data = {
                    'cols': [
                        {
                            'id': 'weapon',
                            'label': 'Weapon',
                            'type': 'string'
                        },
                        {
                            'id': 'kills',
                            'label': 'Kills',
                            'type': 'number'
                        }
                    ],
                    'rows':[]
                },
                weapon;

            for (var i = 0; i < rawData.length; i++) {
                weapon = rawData[i];
                data.rows = me.getKillsByWeaponRows(rawData);
            }
            return data;
        };

        this.getKillsByWeaponCols = function() {
            return [
                {
                    'id': 'weapon',
                    'label': 'Weapon',
                    'type': 'string'
                },
                {
                    'id': 'kills',
                    'label': 'Kills',
                    'type': 'number'
                }
            ];
        };

        this.getKillsByWeaponRows = function(data) {
            var weapon,
                rows = [];
            for (var i = 0; i < data.length; i++) {
                weapon = data[i];
                rows.push({
                    'c':[
                        {
                            'v': $filter('WeaponsFilter')(weapon.id)
                        },
                        {
                            'v': weapon.kills
                        }
                    ]
                });
            }
            return rows;
        };

        this.getDeathsByWeaponCols = function() {
            return [
                {
                    'id': 'weapon',
                    'label': 'Weapon',
                    'type': 'string'
                },
                {
                    'id': 'deaths',
                    'label': 'Deaths',
                    'type': 'number'
                }
            ];
        };

        this.getDeathsByWeaponRows = function(data) {
            var weapon,
                rows = [];
            for (var i = 0; i < data.length; i++) {
                weapon = data[i];
                rows.push({
                    'c':[
                        {
                            'v': $filter('WeaponsFilter')(weapon.id)
                        },
                        {
                            'v': weapon.deaths
                        }
                    ]
                });
            }
            return rows;
        };

        this.getDeathsKillsOverMapsCols = function() {
            return [
                {
                    'id': 'map',
                    'label': 'Map',
                    'type': 'string'
                },
                {
                    'id': 'kills',
                    'label': 'Kills',
                    'type': 'number'
                },
                {
                    'id': 'deaths',
                    'label': 'Deaths',
                    'type': 'number'
                }
            ];
        };

        this.getDeathsKillsOverMapsRows = function(data) {
            var map,
                rows = [];
            for (var item in data.maps) {
                map = data.maps[item];
                rows.push({
                    'c':[
                        {
                            'v': $filter('MapNameFilter')(map.name)
                        },
                        {
                            'v': map.players[playerID].kills.length
                        },
                        {
                            'v': map.players[playerID].deaths.length
                        }
                    ]
                });
            }
            return rows;
        };

        $scope.killsChart = {
            'type': 'PieChart',
            'displayed': true,
            'cssStyle': 'height:500px; width:100%;',
            'data': {
                'cols': me.getKillsByWeaponCols(),
                'rows': me.getKillsByWeaponRows($scope.playerWeaponsStats)
            },
            'options': {
                'title': 'Kills by Weapon',
                'is3D':true,
                'displayExactValues': true
            },
            'formatters': {}
        };

        $scope.deathsChart = {
            'type': 'PieChart',
            'displayed': true,
            'cssStyle': 'height:500px; width:100%;',
            'data': {
                'cols': me.getDeathsByWeaponCols($scope.playerWeaponsStats),
                'rows': me.getDeathsByWeaponRows($scope.playerWeaponsStats)
            },
            'options': {
                'title': 'Deaths by Weapon',
                'is3D':true,
                'displayExactValues': true
            },
            'formatters': {}
        };

        $scope.deathsKillsOverMapsChart = {
            'type': 'LineChart',
            'displayed': true,
            'cssStyle': 'height:300px; width:100%;',
            'data': {
                'cols': me.getDeathsKillsOverMapsCols(),
                'rows': me.getDeathsKillsOverMapsRows($scope.killsStats)
            },
            'options': {
                'title': 'Kills & Deaths across maps',
                'is3D':true,
                'displayExactValues': true
            },
            'formatters': {}
        };
	}]);