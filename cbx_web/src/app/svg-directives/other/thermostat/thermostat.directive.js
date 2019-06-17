"use strict";

angular.module('conext_gateway.svg-images').directive('thermostatImage', [function() {
  return {
    restrict: 'E',
    templateUrl: "app/svg-directives/other/thermostat/thermostat.html",
    scope: {
      width: '@',
      height: '@',
    },
    link: function(scope, element, attrs) {
      scope.style = "";
      if (scope.width) {
        scope.style = "width: " + scope.width + "px;";
      }
      if (scope.height) {
        scope.style += "height: " + scope.height + "px;";
      }
      element[0].firstElementChild.setAttribute("style", scope.style);
    }
  };
}]);
