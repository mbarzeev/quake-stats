'use strict';

angular.module('quakeStatsApp').
    filter('MapNameFilter', ['MapConstants', function (MapConstants) {
        return function (input) {
        	var key = input.toLowerCase();
        	if (MapConstants.hasOwnProperty(key)) {
                return MapConstants[key];
            }
            return 'N/A';
        };
    }]);