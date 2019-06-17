
"use strict";

angular.module('conext_gateway.svg-images').directive('sidemenuInvchgImage', [function() {
  return {
    restrict: 'E',
    templateUrl: "app/svg-directives/xw/sidemenu-InvChg-image.html",
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
      element[0].firstElementChild.setAttribute("style", scope.style);
    }
  };
}]);
