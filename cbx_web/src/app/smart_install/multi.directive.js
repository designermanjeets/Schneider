"use strict";
angular.module('conext_gateway.smart_install').directive('multi', ['$parse', '$rootScope', function ($parse, $rootScope) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elem, attrs, ngModelCtrl) {
      var validate = $parse(attrs.multi)(scope);

      ngModelCtrl.$viewChangeListeners.push(function () {
        $rootScope.$broadcast('multi:valueChanged');
      });

      var deregisterListener = scope.$on('multi:valueChanged', function (event) {
        ngModelCtrl.$setValidity('multi', validate());
      });
      scope.$on('$destroy', deregisterListener); // optional, only
      // required for
      // $rootScope.$on
    }
  };
}]);
