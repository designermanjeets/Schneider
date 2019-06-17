"use strict";

angular.module('conext_gateway.login')
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptorService');
  }])
