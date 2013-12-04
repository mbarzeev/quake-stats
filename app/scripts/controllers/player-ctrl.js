'use strict';

angular.module('quakeStatsApp')
    .controller('PlayerCtrl', ['$scope', 'gamesLog', 'qconsoleLog', 'KillsService', 'FlagsService','$routeParams', '$filter',
        function ($scope, gamesLog, qconsoleLog, KillsService, FlagsService, $routeParams, $filter) {
        var playerID = $routeParams.id,
            me = this;
        $scope.killStats = {};
        $scope.flagsStats = {};

        if (gamesLog.success === false) {
            console.log('Cannot load games.log - you wil not be able to see kills stats');
            return;
        }

        if (qconsoleLog.success === false) {
            console.log('Cannot load qconsole - you wil not be able to see Flag stats');
            return;
        }

        $scope.killsStats = KillsService.getKillsStats(gamesLog.result);
        var killStatsPlayer = $scope.killsStats.players[playerID];
        $scope.playerName = killStatsPlayer.name;
        $scope.playerWeaponsStats = KillsService.getPlayerWeaponsStats(killStatsPlayer);
        $scope.flagsStats = FlagsService.getFlagsStats(qconsoleLog.result);

        $scope.getPlayerCaptureRatio = function() {
            return FlagsService.getPlayerCaptureRatio(killStatsPlayer);
        };

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
                    'label': 'Kills (' + $scope.killsStats.players[playerID].kills.length + ')',
                    'type': 'number'
                },
                {
                    'id': 'deaths',
                    'label': 'Deaths (' + $scope.killsStats.players[playerID].deaths.length + ')',
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
                            'v': map.players[playerID] ? map.players[playerID].kills.length : 0
                        },
                        {
                            'v': map.players[playerID] ? map.players[playerID].deaths.length : 0
                        }
                    ]
                });
            }
            return rows;
        };

        this.getFlagsOverMapsCols = function() {
            return [
                {
                    'id': 'map',
                    'label': 'Map',
                    'type': 'string'
                },
                {
                    'id': 'scores',
                    'label': 'Scores (' + FlagsService.getPlayerOverallTotal(playerID, 'scores') + ')',
                    'type': 'number'
                },
                {
                    'id': 'fetches',
                    'label': 'Fetches (' + FlagsService.getPlayerOverallTotal(playerID, 'fetches') + ')',
                    'type': 'number'
                },
                {
                    'id': 'returns',
                    'label': 'Returns (' + FlagsService.getPlayerOverallTotal(playerID, 'returns') + ')',
                    'type': 'number'
                },
                {
                    'id': 'carrierFrags',
                    'label': 'Carrier Frags (' + FlagsService.getPlayerOverallTotal(playerID, 'carrierFrags') + ')',
                    'type': 'number'
                }
            ];
        };

        this.getFlagsOverMapsRows = function(data) {
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
                            'v': map.players[playerID] ? map.players[playerID].scores : 0
                        },
                        {
                            'v': map.players[playerID] ? map.players[playerID].fetches : 0
                        },
                        {
                            'v': map.players[playerID] ? map.players[playerID].returns : 0
                        },
                        {
                            'v': map.players[playerID] ? map.players[playerID].carrierFrags : 0
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
                'displayExactValues': true,
                'height': 500
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
                'displayExactValues': true,
                'height': 500
            },
            'formatters': {}
        };

        $scope.deathsKillsOverMapsChart = {
            'type': 'LineChart',
            'displayed': true,
            'data': {
                'cols': me.getDeathsKillsOverMapsCols(),
                'rows': me.getDeathsKillsOverMapsRows($scope.killsStats)
            },
            'options': {
                'title': 'Kills & Deaths across maps',
                'displayExactValues': true,
                'height': 200
            },
            'formatters': {}
        };

        $scope.flagsOverMapsChart = {
            'type': 'ColumnChart',
            'displayed': true,
            'data': {
                'cols': me.getFlagsOverMapsCols(),
                'rows': me.getFlagsOverMapsRows($scope.flagsStats)
            },
            'options': {
                'title': 'Flags across maps',
                'displayExactValues': true,
                'height': 200
            },
            'formatters': {}
        };
	}]);