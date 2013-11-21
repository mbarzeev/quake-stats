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
		$scope.players = $scope.killsStats.players;

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

		$scope.filterPropArrayLength = function(items, prop) {
		    var result = [];
		    angular.forEach(items, function(value) {
		        if (value[prop].length > 0) {
		            result.push(value);
		        }
		    });
		    return result;
		};

		$scope.objectToArray = function(items) {
		    var result = [];
		    angular.forEach(items, function(value) {
		        result.push(value);
		    });
		    return result;
		};

		$scope.countDuplicatesKills = function(items) {
			var result = {};
			angular.forEach(items, function(value) {
					result[value.victimName] = result[value.victimName] || {};
					result[value.victimName].name = value.victimName;
					result[value.victimName].count = result[value.victimName].count + 1 || 1;
			});
			return result;
		};
	}]);