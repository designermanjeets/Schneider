"use strict";

angular.module('conext_gateway.dashboard').factory('powerFlowService', ['queryService',
  function(queryService) {

    //SYSvars used to populate the powerflow diagram
    var sysVars = [
      '/SYS/GRID_NET/P',
      '/SYS/GRID/V',
      '/SYS/GRID_IN/ACTIVE_LIFETIME',
      '/SYS/GRID_OUT/ACTIVE_LIFETIME',
      '/SYS/GEN/P',
      '/SYS/GEN/ACTIVE_LIFETIME',
      '/SYS/INV_GRID/P',
      '/SYS/INVCHG_GRID/P',
      '/SYS/INVCHG_BATT/P',
      '/SYS/INVCHG_LOAD/P',
      '/SYS/LOAD/P',
      '/SYS/LOAD/ACTIVE_LIFETIME',
      '/SYS/LOAD/P_MIN',
      '/SYS/MLT_LOAD/P',
      '/SYS/LSYS/MULTI_CLUSTER_MODE',
      '/SYS/INV_LOAD/P',
      '/SYS/BATT/P',
      '/SYS/BATT1/V',
      '/SYS/BATT1/P',
      '/SYS/BATT1/SOC',
      '/SYS/BATT2/V',
      '/SYS/BATT2/P',
      '/SYS/BATT2/SOC',
      '/SYS/BATT3/V',
      '/SYS/BATT3/P',
      '/SYS/BATT3/SOC',
      '/SYS/BATT4/V',
      '/SYS/BATT4/P',
      '/SYS/BATT4/SOC',
      '/SYS/BATT5/V',
      '/SYS/BATT5/P',
      '/SYS/BATT5/SOC',
      '/SYS/PV/P',
      '/SYS/PV/V',
      '/SCB/DEVSERVER/COUNTER'
    ];

    var service = {
      getPowerFlow: getPowerFlow,
      getDevList: getDevList,
    };

    //returns the sysvars needed to populate the powerflow diagram
    function getPowerFlow(devices) {
      var extraSysvars = [];
      var index;
      for (index = 0; index < devices.length; index++) {
        switch (devices[index].name) {
          case "BATTMON":
            extraSysvars.push("[" + devices[index].instance + "]/BATTMON/ASSOC/CFG_DC_INPUT_OUTPUT");
            break;
          case "GT":
            extraSysvars.push("[" + devices[index].instance + "]/" + devices[index].name + "/ASSOC/CFG_AC_OUTPUT");
            break;
          case "CL25":
            extraSysvars.push("[" + devices[index].instance + "]/" + devices[index].name + "/ASSOC/CFG_AC_OUTPUT");
            break;
          case "CL36":
            extraSysvars.push("[" + devices[index].instance + "]/" + devices[index].name + "/ASSOC/CFG_AC_OUTPUT");
            break;
          case "CL60":
            extraSysvars.push("[" + devices[index].instance + "]/" + devices[index].name + "/ASSOC/CFG_AC_OUTPUT");
            break;
          default:
        }
      }

      return queryService.getSysvars(sysVars.concat(extraSysvars), {
        keepDeviceId: true
      });
    }

    function getDevList(battmons) {
      return queryService.getSysvars(['DEVLIST'], {});
    }

    return service;
  }
]);
