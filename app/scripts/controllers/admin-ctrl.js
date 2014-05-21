'use strict';

angular.module('quakeStatsApp')
    .controller('AdminCtrl', ['$scope', 'GameUploadService',
        function ($scope, GameUploadService) {
            $scope.game = {
                label: ''
            };

            $scope.onGameLogRead = function (file) {
                $scope.game.log = file;
            };

            $scope.onQconsoleLogRead = function (file) {
                $scope.game.qconsole = file;
            };

            $scope.onSend = function () {
                GameUploadService.uploadGame($scope.game).then(function () {
                    $scope.response = 'Success!';
                }, function () {
                    $scope.response = 'Failed :(';
                });
            };
        }]);