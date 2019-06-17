"use strict";

angular.module('conext_gateway.devices').controller("InverterTableContentController", [
  "$scope", function ($scope) {
    $scope.onRowClick = function(inverter, $event) {
      // CSBQNX-516: If the user clicked directly on a checkbox, then
      // the value of inverter.selected has already changed. Don't
      // change it back.
      if ($event.target.type === 'checkbox') {
        return;
      }

      inverter.selected = !inverter.selected;
      $event.stopPropagation();
      $event.preventDefault();
    };
  }
]);
