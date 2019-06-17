"use strict";

//This service is used apply scale and offset to a value and to also remove the scale
//and offset
angular.module('conext_gateway.xbgateway').factory('sysvarFormatterService', [
  function() {

    var service = {
      formatSysvar: formatSysvar
    }

    //   /XW/LOAD/CFG_LOAD_SHAVE_START becomes CFG_LOAD_SHAVE_START
    function formatSysvar(sysVar) {
      var sysVarName = sysVar.split('/');
      sysVarName.splice(0, 2);
      sysVarName = sysVarName.join('_');
      return sysVarName;
    }

    return service
  }
]);
