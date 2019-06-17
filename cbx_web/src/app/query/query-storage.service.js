"use strict";

angular.module('conext_gateway.query').factory('queryStorageService', ['saveAs', '$rootScope',
  function(saveAs, $rootScope) {
    var queryVars = {};

    $rootScope.$on("addQueryVars", addVars);

    function addVars(e, response) {
      if (response.hasOwnProperty('values')) {
        var values = response.values;
        for (var index = 0; index < values.length; index++) {
          queryVars[values[index].name] = values[index];
        }
      }
    }

    function getVars() {
      var blob = new Blob([JSON.stringify(queryVars)], {
        type: "text"
      });

      var DISABLE_AUTO_BOM = true;
      saveAs(blob, "queryvars.json", DISABLE_AUTO_BOM);
    }

    return {
      addVars: addVars,
      getVars: getVars,
    };
  }
]);
