"use strict";

angular
  .module("conext_gateway.login", [
    "ui",
    "ngAnimate",
    "ngStorage",
    "ui.bootstrap",

    "csbQueryModule",
    "csbModal",
    "conext_gateway.query",
    "conext_gateway.utilities"
  ])
.run(['$http', function ($http) {
  $http.defaults.headers.post['Content-Type'] = "text/plain;charset=utf-8";
}]);
