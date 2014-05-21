'use strict';

angular.module('quakeStatsApp')
	.controller('NavigationCtrl', ['$scope', 'GamesLogService', 'KillsService',
		function ($scope, GamesLogService, KillsService) {
			var me = this;
			GamesLogService.loadLog().then(
				function(result) {
					me.onGamesLogLoaded(result);
				},
				function(error) {
					console.error(error);
					return;
				});

			this.onGamesLogLoaded = function(log) {
				$scope.killsStats = KillsService.getKillsStats(log);
				$scope.players = $scope.killsStats.players;
			};

			var menu = {};
            menu.items = [
                {label:'Dashboard', data:'dashboard'},
                {label:'Flags', data:'flags'},
                {label:'Kills', data:'kills'},
                {label:'Teams', data:'teams'}
            ];
            $scope.menu = menu;
            $scope.menu.selectedMenuItemIndex = -1;

            $scope.onMenuItemClick = function(index) {
                if ($scope.menu.selectedMenuItemIndex !== index) {
                    $scope.menu.selectedMenuItemIndex = index;
                }
            };
		}]);