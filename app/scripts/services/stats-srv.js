/**
 * Fetches games statistics
 */

'use strict';

angular.module('quakeStatsApp').service('StatsService', ['$q', 'LogService', 'GameStatsService', 'CrossGamesStatsService',
    function ($q, LogService, GameStatsService, CrossGamesStatsService) {

        // TODO: add force refresh button.
        // Cache gamesStats
        var gamesStats;

        function processStats(processFunction) {
            var deferred = $q.defer();
            var processedStats;
            if (gamesStats) {
                processedStats = processFunction(gamesStats);
                deferred.resolve(processedStats);
            } else {
                // Fetch stats if not exists
                LogService.loadLog().then(function (log) {
                    gamesStats = GameStatsService.getAllGames(log);
                    processedStats = processFunction(gamesStats);
                    deferred.resolve(processedStats);
                }, deferred.reject);
            }

            return deferred.promise;
        }

        this.getAllGamesStats = function () {
            return processStats(function (gamesStats) {
                return {
                    gamesStats: gamesStats,
                    crossGamesStats: CrossGamesStatsService.getCrossGamesStats(gamesStats)
                };
            });
        };

        this.getGameStats = function (index) {
            return processStats(function (gamesStats) {
                return gamesStats[index];
            });
        };
    }]);