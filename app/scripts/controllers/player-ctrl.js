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
                'cols': me.getDeathsByWeaponCols(),
                'rows': me.getDeathsByWeaponRows($scope.playerWeaponsStats)
            },
            'options': {
                'title': 'Deaths by Weapon',
                'is3D':true,
                'displayExactValues': true
            },
            'formatters': {}
        };
	}]);