'use strict';

angular.module('quakeStatsApp')
    .controller('KillsCtrl', ['$scope', '$routeParams', 'gamesLog', 'KillsService',
		function ($scope, $routeParams, gamesLog, KillsService) {
        $scope.gameId = $routeParams.gameId;
		$scope.killStats = {};

		if (gamesLog.success === false) {
			console.log('Cannot load games.log - you wil not be able to see kills stats');
			return;
		}

		$scope.killsStats = KillsService.getKillsStats(gamesLog.result, $scope.gameId);
		$scope.players = $scope.killsStats.players;
		$scope.topQScorer = $scope.killsStats.topQScorer;

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
		
		$scope.objectToArray = function(items) {
		    var result = [];
		    angular.forEach(items, function(value) {
		        result.push(value);
		    });
		    return result;
		};

        $scope.onTableHover = function (row, col) {
            $scope.hoveredColumn = col;
            $scope.hoveredRow = row;
        };

        $scope.onLeaveTable = function () {
            $scope.hoveredColumn = null;
            $scope.hoveredRow = null;
        };

        $scope.playersSortedByKills = _.sortBy($scope.players, function (player) {
            return - player.kills.length;
        });
	}]);