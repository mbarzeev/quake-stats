'use strict';

angular.module('quakeStatsApp')
    .directive('dashboardItem', ['$parse', '$interpolate', function ($parse, $interpolate) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: '/templates/dashboard-item-tmpl.html',
            link: function(scope, element, attrs) {
                scope.playersList = $parse(attrs.playersList)(scope);
                scope.itemProperty = $interpolate(attrs.itemProperty)(scope);
                scope.itemTitle = $interpolate(attrs.itemTitle)(scope);
                scope.description = $parse(attrs.itemDescription)(scope);
                scope.iconName = $interpolate(attrs.iconName)(scope);
                scope.type = $parse(attrs.itemType)(scope);
                if (scope.type === 'custom') {
                    scope.template = $parse(attrs.itemTemplate)(scope);
                }

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