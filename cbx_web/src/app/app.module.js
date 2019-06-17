
"use strict";

angular.module('conext_gateway', [
  // Angular built-ins
  "ngStorage",
  "ngMessages",
  "ngSanitize",
  "ngAnimate",

  // External libraries
  "ui.router",
  "ui.bootstrap",
  "angularjs-gauge",
  "SchneiderAppServices",
  "angularFileUpload",
  "rzModule",


  // App modules
  "csbIdleTimer",
  "conext_gateway.charting",
  "conext_gateway.dashboard",
  "conext_gateway.devices",
  "conext_gateway.xbgateway",
  "conext_gateway.disclaimer",
  "conext_gateway.events",
  "conext_gateway.language",
  "conext_gateway.layout",
  "conext_gateway.change_password",
  "conext_gateway.password_recovery",
  "conext_gateway.setup",
  "conext_gateway.smart_install",
  "conext_gateway.utilities",
  "conext_gateway.svg-images",
  "conext_gateway.device_config",
  "conext_gateway.query"
]);
