/**
 * process game stats into cross game stats
 */

'use strict';

angular.module('quakeStatsApp').service('CrossGamesStatsService', ['$q', 'LogService', 'UtilitiesService', 'Constants', function ($q, LogService, UtilitiesService, Constants) {
    this.getCrossGamesStats = function(games) {
        return [
            {
                name: 'Winnings',
                value: getWinStats(games)
            },
            {
                name: 'Flag Caps',
                value: getFlagCapsStats(games)
            }
        ];
    };

    function getWinStats(games) {
        var result = {
            winner: '',
            score: {}
        };
        var allGamesScore = getAllGamesScore(games);
        var redScore = allGamesScore[Constants.RED];
        var blueScore = allGamesScore[Constants.BLUE];
        var winner = UtilitiesService.getWinner(redScore, blueScore);

        result.score[Constants.RED] = redScore;
        result.score[Constants.BLUE] = blueScore;
        result.score[Constants.TIE] = allGamesScore[Constants.TIE];
        result.winner = winner;

        return result;
    }

    function getFlagCapsStats(games) {
        var result = {
            winner: '',
            score: {}
        };
        var allGamesScore = getAllGamesFlagCaps(games);
        var redScore = allGamesScore[Constants.RED];
        var blueScore = allGamesScore[Constants.BLUE];
        var winner = UtilitiesService.getWinner(redScore, blueScore);

        result.score[Constants.RED] = redScore;
        result.score[Constants.BLUE] = blueScore;
        result.winner = winner;

        return result;
    }

    function getAllGamesScore(games) {
        var allGamesScore = {};
        allGamesScore[Constants.RED] = 0;
        allGamesScore[Constants.BLUE] = 0;
        allGamesScore[Constants.TIE] = 0;

        for (var i = 0; i < games.length; i++) {
            var game = games[i];
            allGamesScore[game.winner] += 1;
        }

        return allGamesScore;
    }

    function getAllGamesFlagCaps(games) {
        var allGamesFlagCaps = {};
        allGamesFlagCaps[Constants.RED] = 0;
        allGamesFlagCaps[Constants.BLUE] = 0;

        for (var i = 0; i < games.length; i++) {
            var game = games[i];
            allGamesFlagCaps[Constants.RED] += game.score[Constants.RED];
            allGamesFlagCaps[Constants.BLUE] += game.score[Constants.BLUE];
        }

        return allGamesFlagCaps;
    }
}]);