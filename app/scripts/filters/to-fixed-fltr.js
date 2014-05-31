'use strict';

angular.module('quakeStatsApp').
    filter('toFixed', [function () {
        return function (input, percision) {
            if (input) {
                return Number(input.toFixed(percision));
            }
            return 'N/A';
        };
    }]);