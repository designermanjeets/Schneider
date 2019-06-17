"use strict";

// Make an accordion panel with a button to expand & collapse it.
angular.module('conext_gateway.utilities').directive('sePanel', [
  function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/utilities/panel.html',
      scope: {
        panelTitle: '@value',
      },
      link: function(scope, element, attrs, control) {
        if(attrs.isOpen === 'true') {
          scope.status = {
            open: true,
          };
        } else {
          scope.status = {
            open: false,
          };
        }

        if (attrs.callback !== undefined  && attrs.callback === 'true') {
          scope.$watch('status.open', function(newValue, oldValue) {
            scope.$parent.$parent.panelToggled();
          }, true);
        }
      },
    }
  }
]);
