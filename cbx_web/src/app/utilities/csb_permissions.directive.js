"use strict";

angular.module('conext_gateway.utilities').directive('csbPermissions', ['$sessionStorage', function ($sessionStorage) {

  function link(scope, element, attrs) {
    var userName = $sessionStorage.userName;
    var users = attrs.csbPermissions.split(" ");

    if (users.indexOf("show") < 0) {
      if (userName === 'Admin' && users.indexOf('Guest') < 0) {
        return;
      }

      if(users.indexOf('Guest') >= 0 && userName !== 'Guest') {
        element.hide();
        return;
      }

      if (attrs.csbPermissions === '' && userName !== 'Admin') {
        element.hide();
        return;
      }

      if (users.indexOf(userName) >= 0) {
        return;
      } else {
        element.hide();
      }
    } else {
      if (userName === 'Admin') {
        element.hide();
      }

      if (attrs.csbPermissions === '' && userName !== 'Admin') {
        return;
      }

      if (users.indexOf(userName) >= 0) {
        element.hide();
      } else {
        return;
      }

    }

  }

  return {
    restrict: 'A',
    link: link
  };
}]);
