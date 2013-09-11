'use strict';

angular.module('quakeStatsApp').
    filter('ColorFilter', function () {
        var resultToName = ['Tie', 'Red', 'Blue'];

        return function (input) {
            return resultToName[input];
        };
    });