'use strict';

angular.module('quakeStatsApp').
    filter('ColorFilter', function () {
        return function (input) {
            if (input === 1) {
                return 'Red';
            } else if (input === 2) {
                return 'Blue';
            } else {
                return 'Tie';
            }
        };
    });