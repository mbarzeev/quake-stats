'use strict';

angular.module('quakeStatsApp').directive('fileInput', ['$window', '$parse', function ($window, $parse) {
    return {
        scope: {
            onFileReadEnd: '&'
        },
        template: '<input type="file"/>',

        link: function (scope, element, attrs) {
            var method = attrs.method;
            if ($window.File === undefined || $window.FileReader === undefined) {
                throw new Error('Not supported');
            }

            var fileReader = new FileReader();
            fileReader.onloadend = function (evt) {
                scope.$apply(function () {
                    scope.onFileReadEnd({file: evt.target.result});
                });
            };

            element.on('change', function (evt) {
                var files = evt.target.files;
                fileReader[method](files[0]);
            });
        }
    };
}]);