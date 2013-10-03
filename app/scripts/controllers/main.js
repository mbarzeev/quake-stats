'use strict';

angular.module('quakeStatsApp')
    .controller('MainCtrl', ['$scope',
        function ($scope) {
            var menu = {};
            menu.items = [
                {label:'Dashboard', data:'dashboard'},
                {label:'Flags', data:'flags'},
                {label:'Kills', data:'kills'},
                {label:'Players', data:'players'}
            ];
            $scope.menu = menu;
            $scope.menu.selectedMenuItemIndex = -1;

            $scope.onMenuItemClick = function(index) {
                if ($scope.menu.selectedMenuItemIndex !== index) {
                    $scope.menu.selectedMenuItemIndex = index;
                }
            };
        }
    ]
);
