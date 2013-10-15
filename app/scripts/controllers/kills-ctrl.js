'use strict';

angular.module('quakeStatsApp')
    .controller('KillsCtrl', ['$scope', 'gamesLog', 'KillsService',
		function ($scope, gamesLog, KillsService) {
		$scope.killStats = {};

		if (gamesLog.success === false) {
			console.log('Cannot load games.log - you wil not be able to see kills stats');
			return;
		}

		$scope.killsStats = KillsService.getKillsStats(gamesLog.result);

		var killByVictimFilter = function(element) {
			return element.victim === this.victimID;
		};

		$scope.getTotalKillsByPlayers = function(killerID, victimID) {
			var kills = $scope.killsStats.players[killerID].kills,
				obj = {victimID:victimID};
			return kills.filter(killByVictimFilter, obj).length;
		};

		$scope.getTotalKills = function(killerID) {
			return $scope.killsStats.players[killerID].kills.length;
		};

		$scope.getTotalDeaths = function(victimID) {
			return $scope.killsStats.players[victimID].deaths.length;
		};

		$scope.getTopKiller = function() {
			var topPlayer = null,
				player = null;
			for (var playerID in $scope.killsStats.players) {
				player = $scope.killsStats.players[playerID];
				if (topPlayer) {
					if (player.kills.length > topPlayer.kills.length) {
						topPlayer = player;
					}
				} else {
					topPlayer = player;
				}
			}
			return topPlayer;
		};

		$scope.getTopVictim = function() {
			var topPlayer = null,
				player = null;
			for (var playerID in $scope.killsStats.players) {
				player = $scope.killsStats.players[playerID];
				if (topPlayer) {
					if (player.deaths.length > topPlayer.deaths.length) {
						topPlayer = player;
					}
				} else {
					topPlayer = player;
				}
			}
			return topPlayer;
		};
	}]);