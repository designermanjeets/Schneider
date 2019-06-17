
"use strict";

angular.module('conext_gateway.svg-images').directive('solarBattImage', [function() {
  return {
    restrict: 'E',
    templateUrl: "app/svg-directives/other/battery/solar-batt-image.html",
    scope: {
      width: '@',
      height: '@',
      fill: '@',
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
      element[0].firstElementChild.setAttribute("style", scope.style);
    }
  };
}]);
