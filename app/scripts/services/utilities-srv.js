/**
 * Fetches games statistics
 */

'use strict';

angular.module('quakeStatsApp').service('UtilitiesService', ['Constants', function (Constants) {

    this.getWinner = function (redScore, blueScore) {
        var winner;
        if (redScore > blueScore) {
            winner = Constants.RED;
        } else if (blueScore > redScore) {
            winner = Constants.BLUE;
        } else {
            winner = Constants.TIE;
        }

        return winner;
    };
}]);