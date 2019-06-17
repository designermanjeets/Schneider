"use strict";

angular.module('conext_gateway.xbgateway').factory('devlistQueryService', [
  function() {

    var service = {
      getXWSysvars: getXWSysvars,
      getCSWSysvars: getCSWSysvars,
      getGTSysvars: getGTSysvars,
      getMPPTSysvars: getMPPTSysvars,
      getHVMPPTSysvars: getHVMPPTSysvars,
      getBattmonSysvars: getBattmonSysvars,
      getAGSSysvars: getAGSSysvars,
      getSCPSysvars: getSCPSysvars,
      getFSWSysvars: getFSWSysvars,
      getEM3500Sysvars: getEM3500Sysvars,
      getCL25Sysvars: getCL25Sysvars,
      getCL60Sysvars: getCL60Sysvars,
      getCL36Sysvars: getCL36Sysvars,
      getIEM32XXSysvars: getIEM32XXSysvars,
      getPM2XXXSysvars: getPM2XXXSysvars,
      getPM32XXSysvars: getPM32XXSysvars,
      getPM8XXSysvars: getPM8XXSysvars
    };

    function getXWSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/XW/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/XW/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/XW/DEV/CFG_OPMODE');
      sysVars.push('[' + instanceID + ']/XW/INV/STS');
      sysVars.push('[' + instanceID + ']/XW/CHG/STS');
      sysVars.push('[' + instanceID + ']/XW/INV/CFG_MODE');
      sysVars.push('[' + instanceID + ']/XW/LOAD/P');
      sysVars.push('[' + instanceID + ']/XW/LOAD/V');
      sysVars.push('[' + instanceID + ']/XW/LOAD/F');
      sysVars.push('[' + instanceID + ']/XW/AC1_IN/P');
      sysVars.push('[' + instanceID + ']/XW/AC1_IN/V');
      sysVars.push('[' + instanceID + ']/XW/AC1_IN/F');
      sysVars.push('[' + instanceID + ']/XW/AC2/P');
      sysVars.push('[' + instanceID + ']/XW/AC2/V');
      sysVars.push('[' + instanceID + ']/XW/AC2/F');
      sysVars.push('[' + instanceID + ']/XW/DC/P');
      return sysVars;
    }

    function getCSWSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/CSW/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/CSW/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/CSW/DEV/CFG_OPMODE');
      sysVars.push('[' + instanceID + ']/CSW/INV/STS');
      sysVars.push('[' + instanceID + ']/CSW/CHG/STS');
      sysVars.push('[' + instanceID + ']/CSW/INV/CFG_MODE');
      sysVars.push('[' + instanceID + ']/CSW/LOAD/P');
      sysVars.push('[' + instanceID + ']/CSW/LOAD/V');
      sysVars.push('[' + instanceID + ']/CSW/LOAD/F');
      sysVars.push('[' + instanceID + ']/CSW/AC1/P');
      sysVars.push('[' + instanceID + ']/CSW/AC1/V');
      sysVars.push('[' + instanceID + ']/CSW/AC1/F');
      sysVars.push('[' + instanceID + ']/CSW/DC/P');
      return sysVars;
    }

    function getFSWSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/FSW/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/FSW/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/FSW/DEV/CFG_OPMODE');
      sysVars.push('[' + instanceID + ']/FSW/INV/STS');
      sysVars.push('[' + instanceID + ']/FSW/CHG/STS');
      sysVars.push('[' + instanceID + ']/FSW/INV/CFG_MODE');
      sysVars.push('[' + instanceID + ']/FSW/LOAD/P');
      sysVars.push('[' + instanceID + ']/FSW/LOAD/V');
      sysVars.push('[' + instanceID + ']/FSW/LOAD/F');
      sysVars.push('[' + instanceID + ']/FSW/AC1/P');
      sysVars.push('[' + instanceID + ']/FSW/AC1/V');
      sysVars.push('[' + instanceID + ']/FSW/AC1/F');
      sysVars.push('[' + instanceID + ']/FSW/DC/P');
      return sysVars;
    }

    function getGTSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/GT/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/GT/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/GT/DEV/CFG_OPMODE');
      sysVars.push('[' + instanceID + ']/GT/INV/STS');
      sysVars.push('[' + instanceID + ']/GT/ASSOC/CFG_AC_OUTPUT');
      sysVars.push('[' + instanceID + ']/GT/ASSOC/CFG_DC_INPUT');
      sysVars.push('[' + instanceID + ']/GT/LOAD/P');
      sysVars.push('[' + instanceID + ']/GT/AC1/P');
      sysVars.push('[' + instanceID + ']/GT/AC1/V');
      sysVars.push('[' + instanceID + ']/GT/AC1/F');
      sysVars.push('[' + instanceID + ']/GT/GRID/P');
      return sysVars;
    }

    function getMPPTSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/MPPT/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/MPPT/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/MPPT/DEV/CFG_OPMODE');
      sysVars.push('[' + instanceID + ']/MPPT/CHG/STS');
      sysVars.push('[' + instanceID + ']/MPPT/CHG/MODE');
      sysVars.push('[' + instanceID + ']/MPPT/ASSOC/CFG_DC_INPUT');
      sysVars.push('[' + instanceID + ']/MPPT/DC_IN/P');
      sysVars.push('[' + instanceID + ']/MPPT/DC_IN/V');
      sysVars.push('[' + instanceID + ']/MPPT/ASSOC/CFG_DC_OUTPUT');
      sysVars.push('[' + instanceID + ']/MPPT/DC_OUT/P');
      sysVars.push('[' + instanceID + ']/MPPT/DC_OUT/V');
      return sysVars;
    }

    function getHVMPPTSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/HVMPPT/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/HVMPPT/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/HVMPPT/DEV/CFG_OPMODE');
      sysVars.push('[' + instanceID + ']/HVMPPT/CHG/STS');
      sysVars.push('[' + instanceID + ']/HVMPPT/CHG/MODE');
      sysVars.push('[' + instanceID + ']/HVMPPT/ASSOC/CFG_DC_INPUT');
      sysVars.push('[' + instanceID + ']/HVMPPT/DC_IN/P');
      sysVars.push('[' + instanceID + ']/HVMPPT/DC_IN/V');
      sysVars.push('[' + instanceID + ']/HVMPPT/ASSOC/CFG_DC_OUTPUT');
      sysVars.push('[' + instanceID + ']/HVMPPT/DC_OUT/P');
      sysVars.push('[' + instanceID + ']/HVMPPT/DC_OUT/V');
      return sysVars;
    }

    function getBattmonSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/BATTMON/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/BATTMON/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/BATTMON/ASSOC/CFG_DC_INPUT_OUTPUT');
      sysVars.push('[' + instanceID + ']/BATTMON/BATT/SOC');
      sysVars.push('[' + instanceID + ']/BATTMON/BATT/V');
      sysVars.push('[' + instanceID + ']/BATTMON/BATT/I');
      sysVars.push('[' + instanceID + ']/BATTMON/BATT/TEMP');
      return sysVars;
    }

    function getAGSSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/AGS/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/AGS/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/AGS/DEV/CFG_OPMODE');
      sysVars.push('[' + instanceID + ']/AGS/GEN/CFG_MODE');
      sysVars.push('[' + instanceID + ']/AGS/GEN/STATE');
      sysVars.push('[' + instanceID + ']/AGS/ASSOC/CFG_AC_OUTPUT');
      sysVars.push('[' + instanceID + ']/AGS/ASSOC/CFG_AC_INPUT_1');
      sysVars.push('[' + instanceID + ']/AGS/ASSOC/CFG_DC_INPUT');
      return sysVars;
    }

    function getSCPSysvars(device) {
      var sysVars = [];
      sysVars.push('[' + device.instance + ']/' + device.name + '/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + device.instance + ']/' + device.name + '/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + device.instance + ']/' + device.name + '/DEV/CFG_OPMODE');
      sysVars.push('[' + device.instance + ']/' + device.name + '/DEV/STATE');
      sysVars.push('[' + device.instance + ']/' + device.name + '/DEV/ACTIVE');

      return sysVars;
    }

    function getEM3500Sysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/EM3500/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/EM3500/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/EM3500/METER/CFG_ASSOCIATION');
      sysVars.push('[' + instanceID + ']/EM3500/AC/F');
      sysVars.push('[' + instanceID + ']/EM3500/AC/REAL_P_TOT');
      sysVars.push('[' + instanceID + ']/EM3500/AC/TOT_P_FACTOR');
      sysVars.push('[' + instanceID + ']/EM3500/AC/REAL_P_A');
      sysVars.push('[' + instanceID + ']/EM3500/AC/REAL_P_B');
      sysVars.push('[' + instanceID + ']/EM3500/AC/REAL_P_C');
      sysVars.push('[' + instanceID + ']/EM3500/AC/I_A');
      sysVars.push('[' + instanceID + ']/EM3500/AC/I_B');
      sysVars.push('[' + instanceID + ']/EM3500/AC/I_C');
      sysVars.push('[' + instanceID + ']/EM3500/AC/V_A');
      sysVars.push('[' + instanceID + ']/EM3500/AC/V_B');
      sysVars.push('[' + instanceID + ']/EM3500/AC/V_C');

      return sysVars;
    }

    function getCL25Sysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/CL25/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/CL25/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/CL25/ASSOC/CFG_AC_OUTPUT');
      sysVars.push('[' + instanceID + ']/CL25/DEV/STATE');
      sysVars.push('[' + instanceID + ']/CL25/AC/REAL_P');
      sysVars.push('[' + instanceID + ']/CL25/AC/F');
      sysVars.push('[' + instanceID + ']/CL25/AC/I_AC_TOTAL');
      sysVars.push('[' + instanceID + ']/CL25/AC/I_A');
      sysVars.push('[' + instanceID + ']/CL25/AC/I_B');
      sysVars.push('[' + instanceID + ']/CL25/AC/I_C');
      sysVars.push('[' + instanceID + ']/CL25/AC/V_A');
      sysVars.push('[' + instanceID + ']/CL25/AC/V_B');
      sysVars.push('[' + instanceID + ']/CL25/AC/V_C');
      sysVars.push('[' + instanceID + ']/CL25/PV1/P');
      sysVars.push('[' + instanceID + ']/CL25/PV1/V');
      sysVars.push('[' + instanceID + ']/CL25/PV1/I');
      sysVars.push('[' + instanceID + ']/CL25/PV2/P');
      sysVars.push('[' + instanceID + ']/CL25/PV2/V');
      sysVars.push('[' + instanceID + ']/CL25/PV2/I');

      return sysVars;
    }

    function getCL60Sysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/CL60/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/CL60/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/CL60/ASSOC/CFG_AC_OUTPUT');
      sysVars.push('[' + instanceID + ']/CL60/DEV/STATE');
      sysVars.push('[' + instanceID + ']/CL60/PV/PV_PWR');
      sysVars.push('[' + instanceID + ']/CL60/PV/PV1_V');
      sysVars.push('[' + instanceID + ']/CL60/PV/PV1_I');
      sysVars.push('[' + instanceID + ']/CL60/AC/REAL_P');
      sysVars.push('[' + instanceID + ']/CL60/AC/V_AN');
      sysVars.push('[' + instanceID + ']/CL60/AC/V_BN');
      sysVars.push('[' + instanceID + ']/CL60/AC/V_CN');
      sysVars.push('[' + instanceID + ']/CL60/AC/I_A');
      sysVars.push('[' + instanceID + ']/CL60/AC/I_B');
      sysVars.push('[' + instanceID + ']/CL60/AC/I_C');
      sysVars.push('[' + instanceID + ']/CL60/AC/F');

      return sysVars;
    }

    function getCL36Sysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/CL36/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/CL36/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/CL36/ASSOC/CFG_AC_OUTPUT');
      sysVars.push('[' + instanceID + ']/CL36/DEV/STATE');
      sysVars.push('[' + instanceID + ']/CL36/AC/REAL_P');
      sysVars.push('[' + instanceID + ']/CL36/AC/F');
      sysVars.push('[' + instanceID + ']/CL36/AC/V_AN');
      sysVars.push('[' + instanceID + ']/CL36/AC/V_BN');
      sysVars.push('[' + instanceID + ']/CL36/AC/V_CN');
      sysVars.push('[' + instanceID + ']/CL36/AC/I_A');
      sysVars.push('[' + instanceID + ']/CL36/AC/I_B');
      sysVars.push('[' + instanceID + ']/CL36/AC/I_C');
      sysVars.push('[' + instanceID + ']/CL36/PV/PV_PWR');
      sysVars.push('[' + instanceID + ']/CL36/PV/PV1_V');
      sysVars.push('[' + instanceID + ']/CL36/PV/PV2_V');
      sysVars.push('[' + instanceID + ']/CL36/PV/PV3_V');
      sysVars.push('[' + instanceID + ']/CL36/PV/PV1_I');
      sysVars.push('[' + instanceID + ']/CL36/PV/PV2_I');
      sysVars.push('[' + instanceID + ']/CL36/PV/PV3_I');
      return sysVars;
    }

    function getIEM32XXSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/IEM32XX/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/IEM32XX/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/IEM32XX/METER/CFG_ASSOCIATION');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_P_A');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_P_B');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_P_C');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/V_A');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/V_B');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/V_C');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/I_A');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/I_B');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/I_C');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/PHASE_A_B_VOLTAGE');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/PHASE_B_C_VOLTAGE');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/PHASE_C_A_VOLTAGE');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_P_TOT');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/REACTIVE_P');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/APPARENT_P');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/P_FACTOR');
      sysVars.push('[' + instanceID + ']/IEM32XX/AC/F');


      return sysVars;
    }

    function getPM2XXXSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/PM2XXX/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/PM2XXX/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/PM2XXX/METER/CFG_ASSOCIATION');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/REAL_P_TOT');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/REAL_P_A');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/REAL_P_B');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/REAL_P_C');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/V_A');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/V_B');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/V_C');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/I_A');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/I_B');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/I_C');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/P_FACTOR');
      sysVars.push('[' + instanceID + ']/PM2XXX/AC/F');

      return sysVars;
    }

    function getPM8XXSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/PM8XX/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/PM8XX/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/PM8XX/METER/CFG_ASSOCIATION');
      sysVars.push('[' + instanceID + ']/PM8XX/AC/REAL_P');
      sysVars.push('[' + instanceID + ']/PM8XX/AC/V_AVG');
      sysVars.push('[' + instanceID + ']/PM8XX/AC/V_A');
      sysVars.push('[' + instanceID + ']/PM8XX/AC/V_B');
      sysVars.push('[' + instanceID + ']/PM8XX/AC/V_C');
      sysVars.push('[' + instanceID + ']/PM8XX/AC/I_AVG');
      sysVars.push('[' + instanceID + ']/PM8XX/AC/I_A');
      sysVars.push('[' + instanceID + ']/PM8XX/AC/I_B');
      sysVars.push('[' + instanceID + ']/PM8XX/AC/I_C');
      sysVars.push('[' + instanceID + ']/PM8XX/AC/F');

      return sysVars;
    }

    function getPM32XXSysvars(instanceID) {
      var sysVars = [];
      sysVars.push('[' + instanceID + ']/PM32XX/LPHD/CFG_DEVICE_NAME');
      sysVars.push('[' + instanceID + ']/PM32XX/LPHD/CFG_DEVICE_INSTANCE');
      sysVars.push('[' + instanceID + ']/PM32XX/METER/CFG_ASSOCIATION');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/REAL_P_TOT');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/REAL_P_A');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/REAL_P_B');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/REAL_P_C');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/V_A');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/V_B');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/V_C');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/I_A');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/I_B');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/I_C');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/P_FACTOR');
      sysVars.push('[' + instanceID + ']/PM32XX/AC/F');

      return sysVars;
    }

    return service;
  }
]);
