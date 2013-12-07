'use strict';

angular.module('quakeStatsApp')
    .directive('dashboardItem', [function () {
        return {
            restrict: 'A',
            scope: {
                playersList: '=',
                itemProperty: '@',
                itemTitle: '@',
                iconName: '@?'
            },
            templateUrl: '/templates/dashboard-item-tmpl.html',
            link: function(scope) {
                scope.getValue = function (object) {
                    if (scope.itemProperty) {
                        var properties = scope.itemProperty.split('.');

                        for (var i = 0, n = properties.length; i < n; i++){
                            object = object[properties[i]];
                        }

                        return object;
                    }
                };

                scope.routeParams = scope.$root.routeParams;
            }
        };
    }]);