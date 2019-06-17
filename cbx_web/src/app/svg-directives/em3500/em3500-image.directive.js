
"use strict";

angular.module('conext_gateway.svg-images').directive('em3500Image', [function() {
  return {
    restrict: 'E',
    templateUrl: "app/svg-directives/em3500/em3500-image.html",
    scope: {
      width: '@',
      height: '@',
      device: '=',
    },
    link: function(scope, element, attrs) {
      scope.style = "";
      if (scope.width) {
        scope.style = "width: " + scope.width + "px;";
      }
      if(scope.height) {
        scope.style += "height: " + scope.height + "px;";
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
