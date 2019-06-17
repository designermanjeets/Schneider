"use strict";

angular.module('conext_gateway.utilities').factory('httpInterceptorService', ['$window', '$q', '$injector', function ($window, $q, $injector) {

  return {
    'response': function (response) {
      return response || $q.when(response);
    },
    'responseError': function (response) {
      var connectionCheckService = $injector.get('connectionCheckService');
      var redirectService = $injector.get('redirectService');
      switch (response.status) {
        case -1:
          connectionCheckService.connectionLost();
          break;
        case 403:
          redirectService.redirectToLogin();
          break;
        case 500:
          break;
        default:
      }

      return $q.reject(response);
    }
  };
}
]);
