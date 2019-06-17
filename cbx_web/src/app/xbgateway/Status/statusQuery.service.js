"use strict";

angular.module('conext_gateway.xbgateway').factory('statusQueryService', [function() {
  var service = {
    getMPPTStatusSysvars: getMPPTStatusSysvars,
    getHVMPPTStatusSysvars: getHVMPPTStatusSysvars,
    getXWStatusSysvars: getXWStatusSysvars,
    getCSWStatusSysvars: getCSWStatusSysvars,
    getAGSStatusSysvars: getAGSStatusSysvars,
    getSCPStatusSysvars: getSCPStatusSysvars,
    getSCP2StatusSysvars: getSCP2StatusSysvars,
    getBATTMONStatusSysvars: getBATTMONStatusSysvars,
    getGTStatusSysvars: getGTStatusSysvars,
    getPM2XXXStatusSysvars: getPM2XXXStatusSysvars,
    getCL25StatusSysvars: getCL25StatusSysvars,
    getCL36StatusSysvars: getCL36StatusSysvars,
    getCL60StatusSysvars: getCL60StatusSysvars,
    getIEM32XXStatusSysvars: getIEM32XXStatusSysvars,
    getEM3500StatusSysvars: getEM3500StatusSysvars,
    getPM32XXStatusSysvars: getPM32XXStatusSysvars,
    getPM8XXStatusSysvars: getPM8XXStatusSysvars
  };

  function getMPPTStatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/MPPT/MB/CFG_ADDRESS');
    sysVars.push('[' + instanceID + ']/MPPT/DEV/ACTIVE');
    sysVars.push('[' + instanceID + ']/MPPT/DEV/STATE');
    sysVars.push('[' + instanceID + ']/MPPT/CHG/EN_STS');
    sysVars.push('[' + instanceID + ']/MPPT/DEV/STATE');
    sysVars.push('[' + instanceID + ']/MPPT/CHG/STS');
    sysVars.push('[' + instanceID + ']/MPPT/FLT/ACTIVE');
    sysVars.push('[' + instanceID + ']/MPPT/WRN/ACTIVE');
    sysVars.push('[' + instanceID + ']/MPPT/CHG/MODE');

    sysVars.push('[' + instanceID + ']/MPPT/DC_IN/V');
    sysVars.push('[' + instanceID + ']/MPPT/DC_IN/I');
    sysVars.push('[' + instanceID + ']/MPPT/DC_IN/P');

    sysVars.push('[' + instanceID + ']/MPPT/ASSOC/CFG_DC_OUTPUT');
    sysVars.push('[' + instanceID + ']/MPPT/DC_OUT/V');
    sysVars.push('[' + instanceID + ']/MPPT/DC_OUT/I');
    sysVars.push('[' + instanceID + ']/MPPT/DC_OUT/P');
    sysVars.push('[' + instanceID + ']/MPPT/BATT/T');

    sysVars.push('[' + instanceID + ']/MPPT/AUX/OUTSTS');
    sysVars.push('[' + instanceID + ']/MPPT/AUX/ONREASON');
    sysVars.push('[' + instanceID + ']/MPPT/AUX/OFFREASON');
    sysVars.push('[' + instanceID + ']/MPPT/AUX/V');
    sysVars.push('[' + instanceID + ']/MPPT/CFG/ERROR_COUNT');
    return sysVars;
  }

  function getHVMPPTStatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/HVMPPT/MB/CFG_ADDRESS');
    sysVars.push('[' + instanceID + ']/HVMPPT/DEV/ACTIVE');
    sysVars.push('[' + instanceID + ']/HVMPPT/DEV/STATE');
    sysVars.push('[' + instanceID + ']/HVMPPT/CHG/EN_STS');
    sysVars.push('[' + instanceID + ']/HVMPPT/DEV/STATE');
    sysVars.push('[' + instanceID + ']/HVMPPT/CHG/STS');
    sysVars.push('[' + instanceID + ']/HVMPPT/FLT/ACTIVE');
    sysVars.push('[' + instanceID + ']/HVMPPT/WRN/ACTIVE');
    sysVars.push('[' + instanceID + ']/HVMPPT/CHG/MODE');

    sysVars.push('[' + instanceID + ']/HVMPPT/DC_IN/V');
    sysVars.push('[' + instanceID + ']/HVMPPT/DC_IN/I');
    sysVars.push('[' + instanceID + ']/HVMPPT/DC_IN/P');

    sysVars.push('[' + instanceID + ']/HVMPPT/ASSOC/CFG_DC_OUTPUT');
    sysVars.push('[' + instanceID + ']/HVMPPT/DC_OUT/V');
    sysVars.push('[' + instanceID + ']/HVMPPT/DC_OUT/I');
    sysVars.push('[' + instanceID + ']/HVMPPT/DC_OUT/P');
    sysVars.push('[' + instanceID + ']/HVMPPT/BATT/T');
    sysVars.push('[' + instanceID + ']/HVMPPT/AUX/OUTSTS');
    sysVars.push('[' + instanceID + ']/HVMPPT/AUX/ONREASON');
    sysVars.push('[' + instanceID + ']/HVMPPT/AUX/OFFREASON');
    sysVars.push('[' + instanceID + ']/HVMPPT/CFG/ERROR_COUNT');
    return sysVars;
  }

  function getXWStatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/XW/DEV/CFG_MBADDRESS');
    sysVars.push('[' + instanceID + ']/XW/DEV/ACTIVE');
    sysVars.push('[' + instanceID + ']/XW/INV/EN');
    sysVars.push('[' + instanceID + ']/XW/CHG/EN');
    sysVars.push('[' + instanceID + ']/XW/AC1/SELL_EN');
    sysVars.push('[' + instanceID + ']/XW/DEV/STATE');
    sysVars.push('[' + instanceID + ']/XW/INV/STS');
    sysVars.push('[' + instanceID + ']/XW/CHG/STS');
    sysVars.push('[' + instanceID + ']/XW/FLT/ACTIVE');
    sysVars.push('[' + instanceID + ']/XW/WRN/ACTIVE');

    sysVars.push('[' + instanceID + ']/XW/ASSOC/CFG_DC_INPUT_OUTPUT');
    sysVars.push('[' + instanceID + ']/XW/DC/V');
    sysVars.push('[' + instanceID + ']/XW/DC/I');
    sysVars.push('[' + instanceID + ']/XW/DC/P');

    sysVars.push('[' + instanceID + ']/XW/BATT/T');
    sysVars.push('[' + instanceID + ']/XW/CHG/MODE');

    sysVars.push('[' + instanceID + ']/XW/ASSOC/CFG_AC_INPUT_OUTPUT');
    sysVars.push('[' + instanceID + ']/XW/AC1_IN/P_NET');
    sysVars.push('[' + instanceID + ']/XW/AC1_IN/V_LN1');
    sysVars.push('[' + instanceID + ']/XW/AC1/I_LN1');
    sysVars.push('[' + instanceID + ']/XW/AC1_IN/V_LN2');
    sysVars.push('[' + instanceID + ']/XW/AC1/I_LN2');
    sysVars.push('[' + instanceID + ']/XW/AC1_IN/VQUAL');
    sysVars.push('[' + instanceID + ']/XW/AC1_IN/FQUAL');
    sysVars.push('[' + instanceID + ']/XW/AC1_IN/TQUAL');

    sysVars.push('[' + instanceID + ']/XW/ASSOC/CFG_AC_INPUT');
    sysVars.push('[' + instanceID + ']/XW/AC2/V');
    sysVars.push('[' + instanceID + ']/XW/AC2/V_LN1');
    sysVars.push('[' + instanceID + ']/XW/AC2/V_LN2');
    sysVars.push('[' + instanceID + ']/XW/AC2/F');
    sysVars.push('[' + instanceID + ']/XW/AC2/P');
    sysVars.push('[' + instanceID + ']/XW/AC2/I_LN1');
    sysVars.push('[' + instanceID + ']/XW/AC2/I_LN2');
    sysVars.push('[' + instanceID + ']/XW/AC2/VQUAL');
    sysVars.push('[' + instanceID + ']/XW/AC2/FQUAL');
    sysVars.push('[' + instanceID + ']/XW/AC2/TQUAL');

    sysVars.push('[' + instanceID + ']/XW/ASSOC/CFG_AC_OUTPUT');
    sysVars.push('[' + instanceID + ']/XW/LOAD/F');
    sysVars.push('[' + instanceID + ']/XW/LOAD/P');
    sysVars.push('[' + instanceID + ']/XW/LOAD/V_LN1');
    sysVars.push('[' + instanceID + ']/XW/LOAD/I_LN1');
    sysVars.push('[' + instanceID + ']/XW/LOAD/V_LN2');
    sysVars.push('[' + instanceID + ']/XW/LOAD/I_LN2');

    return sysVars;
  }

  function getCSWStatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/CSW/MB/CFG_ADDRESS');
    sysVars.push('[' + instanceID + ']/CSW/DEV/ACTIVE');
    sysVars.push('[' + instanceID + ']/CSW/INV/EN');
    sysVars.push('[' + instanceID + ']/CSW/CHG/EN');
    sysVars.push('[' + instanceID + ']/CSW/DEV/STATE');
    sysVars.push('[' + instanceID + ']/CSW/INV/STS');
    sysVars.push('[' + instanceID + ']/CSW/CHG/STS');
    sysVars.push('[' + instanceID + ']/CSW/FLT/ACTIVE');
    sysVars.push('[' + instanceID + ']/CSW/WRN/ACTIVE');

    sysVars.push('[' + instanceID + ']/CSW/ASSOC/CFG_DC_INPUT_OUTPUT');
    sysVars.push('[' + instanceID + ']/CSW/DC/V');
    sysVars.push('[' + instanceID + ']/CSW/DC/I');
    sysVars.push('[' + instanceID + ']/CSW/DC/P');
    sysVars.push('[' + instanceID + ']/CSW/INV/IDC');
    sysVars.push('[' + instanceID + ']/CSW/CHG/IDC');
    sysVars.push('[' + instanceID + ']/CSW/INV/PDC');
    sysVars.push('[' + instanceID + ']/CSW/CHG/PDC');
    sysVars.push('[' + instanceID + ']/CSW/BATT/T');
    sysVars.push('[' + instanceID + ']/CSW/CHG/MODE');

    sysVars.push('[' + instanceID + ']/CSW/ASSOC/CFG_AC_INPUT');
    sysVars.push('[' + instanceID + ']/CSW/AC1/V');
    sysVars.push('[' + instanceID + ']/CSW/AC1/F');
    sysVars.push('[' + instanceID + ']/CSW/AC1/I');
    sysVars.push('[' + instanceID + ']/CSW/AC1/P');
    sysVars.push('[' + instanceID + ']/CSW/AC1/S');
    sysVars.push('[' + instanceID + ']/CSW/AC1/I_NET');
    sysVars.push('[' + instanceID + ']/CSW/AC1/P_NET');
    sysVars.push('[' + instanceID + ']/CSW/AC1/V_LN1');
    sysVars.push('[' + instanceID + ']/CSW/AC1/I_LN1');
    sysVars.push('[' + instanceID + ']/CSW/AC1/V_LN2');
    sysVars.push('[' + instanceID + ']/CSW/AC1/I_LN2');
    sysVars.push('[' + instanceID + ']/CSW/AC1/VQUAL');
    sysVars.push('[' + instanceID + ']/CSW/AC1/FQUAL');
    sysVars.push('[' + instanceID + ']/CSW/AC1/TQUAL');

    sysVars.push('[' + instanceID + ']/CSW/ASSOC/CFG_AC_OUTPUT');
    sysVars.push('[' + instanceID + ']/CSW/LOAD/V');
    sysVars.push('[' + instanceID + ']/CSW/LOAD/I');
    sysVars.push('[' + instanceID + ']/CSW/LOAD/F');
    sysVars.push('[' + instanceID + ']/CSW/LOAD/P');
    sysVars.push('[' + instanceID + ']/CSW/LOAD/P_NET');
    sysVars.push('[' + instanceID + ']/CSW/LOAD/S');
    sysVars.push('[' + instanceID + ']/CSW/CFG/ERROR_COUNT');
    return sysVars;
  }

  function getAGSStatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/AGS/DEV/CFG_MBADDRESS');
    sysVars.push('[' + instanceID + ']/AGS/DEV/ACTIVE');
    sysVars.push('[' + instanceID + ']/AGS/GEN/STATE');
    sysVars.push('[' + instanceID + ']/AGS/GEN/ON_REASON');
    sysVars.push('[' + instanceID + ']/AGS/GEN/OFF_REASON');
    sysVars.push('[' + instanceID + ']/AGS/FLT/ACTIVE');
    sysVars.push('[' + instanceID + ']/AGS/WRN/ACTIVE');
    sysVars.push('[' + instanceID + ']/AGS/ASSOC/CFG_AC_OUTPUT');
    sysVars.push('[' + instanceID + ']/AGS/ASSOC/CFG_AC_INPUT_0');
    sysVars.push('[' + instanceID + ']/AGS/ASSOC/CFG_AC_INPUT_1');
    sysVars.push('[' + instanceID + ']/AGS/ASSOC/CFG_DC_INPUT');
    sysVars.push('[' + instanceID + ']/AGS/CFG/ERROR_COUNT');
    return sysVars;
  }

  function getSCPStatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/SCP/DEV/CFG_MBADDR');
    sysVars.push('[' + instanceID + ']/SCP/DEV/ACTIVE');
    sysVars.push('[' + instanceID + ']/SCP/DEV/STATE');
    sysVars.push('[' + instanceID + ']/SCP/FLT/ACTIVE');
    sysVars.push('[' + instanceID + ']/SCP/WRN/ACTIVE');
    sysVars.push('[' + instanceID + ']/SCP/CFG/ERROR_COUNT');
    return sysVars;
  }

  function getSCP2StatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/SCP2/DEV/CFG_MBADDR');
    sysVars.push('[' + instanceID + ']/SCP2/DEV/ACTIVE');
    sysVars.push('[' + instanceID + ']/SCP2/DEV/STATE');
    sysVars.push('[' + instanceID + ']/SCP2/FLT/ACTIVE');
    sysVars.push('[' + instanceID + ']/SCP2/WRN/ACTIVE');
    sysVars.push('[' + instanceID + ']/SCP2/CFG/ERROR_COUNT');
    return sysVars;
  }

  function getBATTMONStatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/BATTMON/MB/CFG_ADDRESS');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/DC_SRC_ID');
    sysVars.push('[' + instanceID + ']/BATTMON/ASSOC/CFG_DC_INPUT_OUTPUT');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/V');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/I');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/TEMP');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/SOC');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/V_MIDP1');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/V_MIDP2');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/CAPACITY_REMAIN');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/CAPACITY_REMOVED');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/BTS_PRESENT');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/TIME_TO_DISCHARGE');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/AVG_DISCHARGE');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/AVG_DISCHARGE_PERCENT');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/DEEPEST_DISCHARGE');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/DEEPEST_DISCHARGE_PERCENT');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/HIST_CAPACITY_REMOVED');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/HIST_CAPACITY_RETURNED');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/NUM_CHG_CYCLES');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/NUM_SYNCHRONIZATION');
    sysVars.push('[' + instanceID + ']/BATTMON/BATT/NUM_DISCHARGES');
    return sysVars;
  }

  function getGTStatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/GT/MB/CFG_ADDRESS');
    sysVars.push('[' + instanceID + ']/GT/DEV/ACTIVE');
    sysVars.push('[' + instanceID + ']/GT/INV/EN');
    sysVars.push('[' + instanceID + ']/GT/DEV/STATE');
    sysVars.push('[' + instanceID + ']/GT/INV/STS');
    sysVars.push('[' + instanceID + ']/GT/FLT/ACTIVE');
    sysVars.push('[' + instanceID + ']/GT/FLT/COUNT');

    sysVars.push('[' + instanceID + ']/GT/ASSOC/CFG_DC_INPUT');
    sysVars.push('[' + instanceID + ']/GT/DC/V');
    sysVars.push('[' + instanceID + ']/GT/DC/I');
    sysVars.push('[' + instanceID + ']/GT/DC/P');

    sysVars.push('[' + instanceID + ']/GT/ASSOC/CFG_AC_OUTPUT');
    sysVars.push('[' + instanceID + ']/GT/AC1/V');
    sysVars.push('[' + instanceID + ']/GT/AC1/I');
    sysVars.push('[' + instanceID + ']/GT/AC1/F');
    sysVars.push('[' + instanceID + ']/GT/AC1/P');
    sysVars.push('[' + instanceID + ']/GT/CFG/ERROR_COUNT');
    return sysVars;
  }

  function getPM2XXXStatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/REAL_E_IN');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/REAL_E_OUT');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/I_A');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/I_B');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/I_C');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/PHASE_A_B_VOLTAGE');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/PHASE_B_C_VOLTAGE');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/PHASE_C_A_VOLTAGE');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/V_A');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/V_B');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/V_C');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/REAL_P_A');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/REAL_P_B');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/REAL_P_C');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/REAL_P_TOT');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/REACTIVE_P');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/APPARENT_P');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/P_FACTOR');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/F');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/V_AVG');
    sysVars.push('[' + instanceID + ']/PM2XXX/AC/I_AVG');
    sysVars.push('[' + instanceID + ']/PM2XXX/METER/CFG_ASSOCIATION');
    return sysVars;
  }

  function getPM32XXStatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/PM32XX/AC/REAL_E_IN');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/REAL_E_OUT');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/I_A');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/I_B');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/I_C');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/PHASE_A_B_VOLTAGE');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/PHASE_B_C_VOLTAGE');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/PHASE_C_A_VOLTAGE');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/V_A');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/V_B');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/V_C');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/REAL_P_A');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/REAL_P_B');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/REAL_P_C');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/REAL_P_TOT');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/REACTIVE_P_TOT');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/APPARENT_P_TOT');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/P_FACTOR');
    sysVars.push('[' + instanceID + ']/PM32XX/AC/F');
    sysVars.push('[' + instanceID + ']/PM32XX/METER/CFG_ASSOCIATION');
    return sysVars;
  }

  function getPM8XXStatusSysvars(instanceID) {
    var sysVars = [];
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
    sysVars.push('[' + instanceID + ']/PM8XX/AC/ENERGY_REAL_IN');
    sysVars.push('[' + instanceID + ']/PM8XX/AC/ENERGY_REAL_OUT');
    sysVars.push('[' + instanceID + ']/PM8XX/AC/ENERGY_REAL_TOT');
    return sysVars;
  }

  function getCL25StatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/CL25/AC/OPERATING_HOURS');
    sysVars.push('[' + instanceID + ']/CL25/ASSOC/CFG_AC_OUTPUT');
    sysVars.push('[' + instanceID + ']/CL25/AC/I_AC_TOTAL');
    sysVars.push('[' + instanceID + ']/CL25/AC/V_A');
    sysVars.push('[' + instanceID + ']/CL25/AC/V_B');
    sysVars.push('[' + instanceID + ']/CL25/AC/V_C');
    sysVars.push('[' + instanceID + ']/CL25/AC/REAL_P');
    sysVars.push('[' + instanceID + ']/CL25/AC/F');
    sysVars.push('[' + instanceID + ']/CL25/AC/T');
    sysVars.push('[' + instanceID + ']/CL25/PV1/I');
    sysVars.push('[' + instanceID + ']/CL25/PV1/V');
    sysVars.push('[' + instanceID + ']/CL25/PV1/P');
    sysVars.push('[' + instanceID + ']/CL25/PV2/I');
    sysVars.push('[' + instanceID + ']/CL25/PV2/V');
    sysVars.push('[' + instanceID + ']/CL25/PV2/P');
    sysVars.push('[' + instanceID + ']/CL25/AC/CFG_USR_P_LIMIT');

    return sysVars;
  }

  function getCL36StatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/CL36/AC/OPERATING_HOURS');
    sysVars.push('[' + instanceID + ']/CL36/ASSOC/CFG_AC_OUTPUT');
    sysVars.push('[' + instanceID + ']/CL36/AC/F');
    sysVars.push('[' + instanceID + ']/CL36/AC/T');
    sysVars.push('[' + instanceID + ']/CL36/AC/ENERGY_TODAY');
    sysVars.push('[' + instanceID + ']/CL36/AC/ENERGY_TOTAL');
    sysVars.push('[' + instanceID + ']/CL36/AC/REAL_P');
    sysVars.push('[' + instanceID + ']/CL36/AC/APPARENT_P');
    sysVars.push('[' + instanceID + ']/CL36/AC/REACTIVE_P');
    sysVars.push('[' + instanceID + ']/CL36/AC/POWER_FACTOR');
    sysVars.push('[' + instanceID + ']/CL36/AC/REAL_P');
    sysVars.push('[' + instanceID + ']/CL36/AC/V_AN');
    sysVars.push('[' + instanceID + ']/CL36/AC/V_BN');
    sysVars.push('[' + instanceID + ']/CL36/AC/V_CN');
    sysVars.push('[' + instanceID + ']/CL36/AC/I_A');
    sysVars.push('[' + instanceID + ']/CL36/AC/I_B');
    sysVars.push('[' + instanceID + ']/CL36/AC/I_C');
    sysVars.push('[' + instanceID + ']/CL36/PV/PV_PWR');
    sysVars.push('[' + instanceID + ']/CL36/PV/PV1_V');
    sysVars.push('[' + instanceID + ']/CL36/PV/PV1_I');
    sysVars.push('[' + instanceID + ']/CL36/PV/PV2_V');
    sysVars.push('[' + instanceID + ']/CL36/PV/PV2_I');
    sysVars.push('[' + instanceID + ']/CL36/PV/PV3_V');
    sysVars.push('[' + instanceID + ']/CL36/PV/PV3_I');

    return sysVars;
  }

  function getCL60StatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/CL60/AC/OPERATING_HOURS');
    sysVars.push('[' + instanceID + ']/CL60/ASSOC/CFG_AC_OUTPUT');
    sysVars.push('[' + instanceID + ']/CL60/PV/PV_PWR');
    sysVars.push('[' + instanceID + ']/CL60/PV/PV1_V');
    sysVars.push('[' + instanceID + ']/CL60/PV/PV1_I');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_1');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_2');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_3');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_4');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_5');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_6');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_7');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_8');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_9');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_10');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_11');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_12');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_13');
    sysVars.push('[' + instanceID + ']/CL60/PV/I_DC_14');
    sysVars.push('[' + instanceID + ']/CL60/AC/REAL_P');
    sysVars.push('[' + instanceID + ']/CL60/AC/APPARENT_P');
    sysVars.push('[' + instanceID + ']/CL60/AC/REACTIVE_P');
    sysVars.push('[' + instanceID + ']/CL60/AC/POWER_FACTOR');
    sysVars.push('[' + instanceID + ']/CL60/AC/V_AN');
    sysVars.push('[' + instanceID + ']/CL60/AC/V_BN');
    sysVars.push('[' + instanceID + ']/CL60/AC/V_CN');
    sysVars.push('[' + instanceID + ']/CL60/AC/I_A');
    sysVars.push('[' + instanceID + ']/CL60/AC/I_B');
    sysVars.push('[' + instanceID + ']/CL60/AC/I_C');
    sysVars.push('[' + instanceID + ']/CL60/AC/F');
    sysVars.push('[' + instanceID + ']/CL60/AC/ENERGY_TOTAL');

    return sysVars;
  }

  function getIEM32XXStatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_P_A');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_P_B');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_P_C');

    sysVars.push('[' + instanceID + ']/IEM32XX/AC/V_A');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/V_B');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/V_C');

    sysVars.push('[' + instanceID + ']/IEM32XX/AC/I_A');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/I_B');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/I_C');

    sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_P_TOT');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/REACTIVE_P');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/APPARENT_P');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/P_FACTOR');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/F');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_E_IN');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_E_OUT');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_E_IMPORT_A');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_E_IMPORT_B');
    sysVars.push('[' + instanceID + ']/IEM32XX/AC/REAL_E_IMPORT_C');

    return sysVars;
  }

  function getEM3500StatusSysvars(instanceID) {
    var sysVars = [];
    sysVars.push('[' + instanceID + ']/EM3500/AC/E_REAL_NET');
    sysVars.push('[' + instanceID + ']/EM3500/AC/E_REAL_IMPORT');
    sysVars.push('[' + instanceID + ']/EM3500/AC/E_REAL_EXPORT');
    sysVars.push('[' + instanceID + ']/EM3500/AC/REAL_P_TOT');
    sysVars.push('[' + instanceID + ']/EM3500/AC/REACTIVE_P');
    sysVars.push('[' + instanceID + ']/EM3500/AC/APPARENT_P');
    sysVars.push('[' + instanceID + ']/EM3500/AC/TOT_P_FACTOR');
    sysVars.push('[' + instanceID + ']/EM3500/AC/F');
    sysVars.push('[' + instanceID + ']/EM3500/AC/REAL_E_IMPORT_A');
    sysVars.push('[' + instanceID + ']/EM3500/AC/REAL_E_IMPORT_B');
    sysVars.push('[' + instanceID + ']/EM3500/AC/REAL_E_IMPORT_C');
    sysVars.push('[' + instanceID + ']/EM3500/AC/REAL_P_A');
    sysVars.push('[' + instanceID + ']/EM3500/AC/REAL_P_B');
    sysVars.push('[' + instanceID + ']/EM3500/AC/REAL_P_C');
    sysVars.push('[' + instanceID + ']/EM3500/AC/REACTIVE_P_A');
    sysVars.push('[' + instanceID + ']/EM3500/AC/REACTIVE_P_B');
    sysVars.push('[' + instanceID + ']/EM3500/AC/REACTIVE_P_C');
    sysVars.push('[' + instanceID + ']/EM3500/AC/APPARENT_P_A');
    sysVars.push('[' + instanceID + ']/EM3500/AC/APPARENT_P_B');
    sysVars.push('[' + instanceID + ']/EM3500/AC/APPARENT_P_C');
    sysVars.push('[' + instanceID + ']/EM3500/AC/P_FACTOR_A');
    sysVars.push('[' + instanceID + ']/EM3500/AC/P_FACTOR_B');
    sysVars.push('[' + instanceID + ']/EM3500/AC/P_FACTOR_C');
    sysVars.push('[' + instanceID + ']/EM3500/AC/V_A');
    sysVars.push('[' + instanceID + ']/EM3500/AC/V_B');
    sysVars.push('[' + instanceID + ']/EM3500/AC/V_C');
    sysVars.push('[' + instanceID + ']/EM3500/AC/I_A');
    sysVars.push('[' + instanceID + ']/EM3500/AC/I_B');
    sysVars.push('[' + instanceID + ']/EM3500/AC/I_C');
    sysVars.push('[' + instanceID + ']/EM3500/AC/V_AVG');
    sysVars.push('[' + instanceID + ']/EM3500/AC/I_AVG');
    sysVars.push('[' + instanceID + ']/EM3500/METER/CFG_ASSOCIATION');

    return sysVars;
  }

  return service;
}]);
