"use strict";

angular.module('conext_gateway.setup').directive('importhelper', function () {
    return {
      restrict: 'A',
      link: function(scope, element) {

        element.bind('click', function(e) {
            angular.element(e.target).siblings('#upload').trigger('click');
        });
      }
    };
});

angular.module('conext_gateway.setup').directive("fileread", [function () {
    return {
        scope: {
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.$parent.import(loadEvent.target.result);
                        element.value = "";
                    });
                }
                reader.readAsText(changeEvent.target.files[0]);
            });
        }
    }
}]);
