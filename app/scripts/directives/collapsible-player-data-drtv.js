'use strict';

angular.module('quakeStatsApp')
    .directive('collapsiblePlayerData', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                player: '=',
                playersList: '=',
                collapsibleIdPrefix: '=',
                collapsibleStyle: '@'
            },
            templateUrl: 'templates/collapsible-player-data-tmpl.html'
        };
    }]);