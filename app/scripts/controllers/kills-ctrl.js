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
			return element.victimName === this.victimName;
		};

		$scope.getTotalKillsByPlayers = function(killerName, victimName) {
			var kills = $scope.killsStats.players[killerName].kills,
				obj = {victimName:victimName};
			return kills.filter(killByVictimFilter, obj).length;
		};

		$scope.getTotalKills = function(killerName) {
			return $scope.killsStats.players[killerName].kills.length;
		};

		$scope.getTotalDeaths = function(victimName) {
			return $scope.killsStats.players[victimName].deaths.length;
		};

		$scope.getTopKiller = function() {
			var topPlayer = null,
				player = null;
			for (var playerName in $scope.killsStats.players) {
				player = $scope.killsStats.players[playerName];
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
			for (var playerName in $scope.killsStats.players) {
				player = $scope.killsStats.players[playerName];
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

		$scope.greaterThanNum = function(item) {
			return item.humliations.length > 0;
		};
	}]);