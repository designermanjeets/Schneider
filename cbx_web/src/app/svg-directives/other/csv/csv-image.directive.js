
"use strict";

angular.module('conext_gateway.svg-images').directive('csvImage', [function() {
  return {
    restrict: 'E',
    templateUrl: "app/svg-directives/other/csv/csv-image.html",
    scope: {
      width: '@',
      height: '@',
      fill: '@',
      stroke: '@',
    },
    link: function(scope, element, attrs) {
      scope.style = "";
      if (scope.width) {
        scope.style = "width: " + scope.width + "px;";
      }
      if (scope.height) {
        scope.style += "height: " + scope.height + "px;";
      }
      if (scope.fill) {
        scope.style += "fill: " + scope.fill + ";";
      }
      if (scope.stroke) {
        scope.style += "stroke: " + scope.stroke + ";";
      }
      element[0].firstElementChild.setAttribute("style", scope.style);
    }
  };
}]);
