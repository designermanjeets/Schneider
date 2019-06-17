
"use strict";

angular.module('conext_gateway.svg-images').directive('xwImage', [function() {
  return {
    restrict: 'E',
    templateUrl: "app/svg-directives/xw/xw-image.html",
    scope: {
      width: '@',
      height: '@',
      fill: '@',
      device: '=',
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

      scope.$watch('device', function() {
        element.find("#alarm-icon")[0].setAttribute('class', scope.device.attributes.alarms === '0' ? 'pf-hide' : '');
        element.find("#warning-icon")[0].setAttribute('class', scope.device.attributes.warnings === '0' ? 'pf-hide' : '');
      });
      element.find("#alarm-icon")[0].setAttribute('class', scope.device.attributes.alarms === '0' ? 'pf-hide' : '');
      element.find("#warning-icon")[0].setAttribute('class', scope.device.attributes.warnings === '0' ? 'pf-hide' : '');
      element[0].firstElementChild.setAttribute("style", element[0].firstElementChild.getAttribute("style") + scope.style);
    }
  };
}]);
