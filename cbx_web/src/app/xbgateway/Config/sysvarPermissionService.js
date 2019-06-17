"use strict";

//This service is for checking users permissions associated with sysvars
angular.module('conext_gateway.xbgateway').factory('sysvarPermissionService', ["$sessionStorage",
  function($sessionStorage) {
    var users = {
      "Admin": "user01",
      "User": "user02",
      "Guest": "user03"
    }


    var service = {
      hasPermission: hasPermission,
      hasReadPermission: hasReadPermission,
      hasWritePermission: hasWritePermission
    }

    function hasPermission(template) {
      var permission = false;
      var userName = $sessionStorage.userName;

      if (template.hasOwnProperty('read') && template.read.indexOf(users[userName]) > -1) {
        permission = true;
      }

      if (template.hasOwnProperty('write') && template.write.indexOf(users[userName]) > -1) {
        permission = true;
      }

      if(template.hasOwnProperty("type") && template.type === 'Control' && (!template.hasOwnProperty('write') || template.write.indexOf(users[userName]) === -1)) {
        permission = false;
      }

      if(template.type !== 'Control' && (!template.hasOwnProperty('read') || template.read.indexOf(users[userName]) === -1)) {
        permission = false;
      }

      return permission;
    }

    function hasReadPermission(template) {
      var userName = $sessionStorage.userName;
      return template.hasOwnProperty('read') && template.read.indexOf(users[userName]) > -1;
    }

    function hasWritePermission(template) {
      var userName = $sessionStorage.userName;
      return template.hasOwnProperty('write') && template.write.indexOf(users[userName]) > -1;
    }

    return service;
  }
]);
