'use strict';

angular.module('quakeStatsApp').
  filter('ColorFilter', function() {
    return function(input) {     
      return input === 1 ? "Red" : "Blue";
    }
  });