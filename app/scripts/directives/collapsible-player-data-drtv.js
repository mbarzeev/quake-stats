'use strict';

angular.module('quakeStatsApp')
    .directive('collapsiblePlayerData', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                player: '=',
                playersList: '=',
                collapsibleStyle: '@'
            },
            templateUrl: 'templates/collapsible-player-data-tmpl.html',
            link: function(scope) {
                scope.collapsed = false;

                scope.toggleCollapse = function () {
                    scope.collapsed = !scope.collapsed;
                };
            }
        };
    }]);