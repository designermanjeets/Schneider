"use strict";

angular.module('conext_gateway').config(
  ['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('login', {
          url: "/login",
          views: {
            'homeview': {
              templateUrl: "app/login.html"
            }
          }
        });

      $stateProvider
        .state('cli', {
          url: "/console",
          views: {
            'homeview': {
              templateUrl: "site/console.html"
            }
          }
        });

      $stateProvider
        .state('deviceselect', {
          url: "/deviceselect",
          views: {
            'homeview': {
              templateUrl: "site/devices.html"
            }
          }
        });

      $stateProvider
        .state('filebrowser', {
          url: "/filebrowser",
          views: {
            'homeview': {
              templateUrl: "site/filebrowser.html"
            }
          }
        });

      $stateProvider
        .state('firmwareupdate', {
          url: "/firmwareupdate",
          views: {
            'homeview': {
              templateUrl: "site/firmwareupdate.html"
            }
          }
        });

      $stateProvider
        .state('configviewer', {
          url: "/configviewer",
          views: {
            'homeview': {
              templateUrl: "site/configviewer.html"
            }
          }
        });
    }
  ]);
