'use strict';

angular.module('quakeStatsApp')
    .controller('TeamsCtrl', ['$scope', 'gamesLog', 'qconsoleLog', 'KillsService', 'FlagsService',
        function ($scope, gamesLog, qconsoleLog, KillsService, FlagsService) {

        $scope.flagsStats = {};
        $scope.players = [];

        if (gamesLog.success === false) {
            console.log('Cannot load games.log - you wil not be able to see kills stats');
            return;
        }

        if (qconsoleLog.success === false) {
            console.log('Cannot load qconsole - you wil not be able to see Flag stats');
            return;
        }

        $scope.killsStats = KillsService.getKillsStats(gamesLog.result);
        $scope.flagsStats = FlagsService.getFlagsStats(qconsoleLog.result);
        
        this.populatePlayers = function() {
            var result = [],
                player,
                iterPlayer,
                playerWeaponStats;
            for (var i in $scope.killsStats.players) {
                player = {};
                iterPlayer = $scope.killsStats.players[i];
                player.name = iterPlayer.name;
                player.kills = iterPlayer.kills.length;
                player.scores = FlagsService.getPlayerOverallTotal(player.name, 'scores');
                player.returns = FlagsService.getPlayerOverallTotal(player.name, 'returns');
                playerWeaponStats = KillsService.getPlayerWeaponsStats(iterPlayer);
                var railWeapon = _.find(playerWeaponStats, this.weaponFinder(10));
                player.rails = railWeapon ? railWeapon.kills : 0;
                result.push(player);
            }
            $scope.players = result;
        };

        this.weaponFinder = function(weaponId) {
            return function(weapon) {
                return weapon.id === weaponId;
            };
        };

        this.populatePlayers();
    }]);