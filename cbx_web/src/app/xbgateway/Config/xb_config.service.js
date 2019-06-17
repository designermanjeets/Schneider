"use strict";

//This service is used for saving and retreiveing device configurations
angular.module('conext_gateway.xbgateway').factory('xbConfigService', ['queryService', '$log', '$http', 'xbConfigUtilityService',
  'xbdevdetailService', 'sysvarFormatterService', '$q', 'moment', 'AGS_device_config', 'BATTMON_device_config', 'CSW_device_config',
  'GT_device_config', 'HVMPPT_device_config', 'MPPT_device_config', 'SCP_device_config', 'SCP2_device_config', 'XW_device_config',
  'PM2XXX_device_config', 'CL25_device_config', 'IEM32XX_device_config', 'EM3500_device_config', 'PM32XX_device_config', 'CL36_device_config',
  'CL60_device_config', 'PM8XX_device_config',
  function(queryService, $log, $http, xbConfigUtilityService, xbdevdetailService, sysvarFormatterService, $q, moment, AGS_device_config,
    BATTMON_device_config, CSW_device_config, GT_device_config, HVMPPT_device_config, MPPT_device_config, SCP_device_config, SCP2_device_config,
    XW_device_config, PM2XXX_device_config, CL25_device_config, IEM32XX_device_config, EM3500_device_config, PM32XX_device_config, CL36_device_config,
    CL60_device_config, PM8XX_device_config) {

    var service = {
      getDeviceConfiguration: getDeviceConfiguration,
      saveFormConfiguration: saveFormConfiguration,
      getRefreshCount: getRefreshCount,
      getRefreshProgress: getRefreshProgress,
      refreshDeviceConfig: refreshDeviceConfig,
      getConfigData: getConfigData,
      setControl: setControl,
      getControl: getControl
    };

    //Function which removes the scaling and offset of the values and the saves
    //the values to the sysvars
    function setControl(key, value, template) {
      var descaledValue;
      switch (template.inputType) {
        case 'switch':
          descaledValue = xbConfigUtilityService.removeScaling(template, value ? 1 : 0);
          break;
        case 'dropdown':
          descaledValue = xbConfigUtilityService.removeScaling(template, parseInt(value));
          break;
        case 'timeofday':
          var mmt = moment(value);
          var midnight = mmt.clone().startOf('day');
          var minutesFromMidnight = mmt.diff(midnight, 'minutes');
          descaledValue = xbConfigUtilityService.removeScaling(template, minutesFromMidnight);
          break;
        default:
          descaledValue = xbConfigUtilityService.removeScaling(template, value);
      }
      var sysVarObj = {};
      sysVarObj[key] = descaledValue;
      return queryService.setSysvars([sysVarObj]);
    }

    //Function to get the control sysvar
    function getControl(key) {
      return queryService.getSysvars([key], {});
    }

    //This function is used to retreivce the config data for the specific device.
    //Once the data is retreived, it will apply the proper scaling and offset to
    //the variables
    function getConfigData(device, id, template) {
      return xbdevdetailService.getDevCfg(device, id, 'xbconfig-' + id).then(function(data) {
        var deviceType = Object.keys(template)[0];
        var sysVarMin;
        var sysVarMax;
        for (var formName in template[deviceType]) {
          if (template[deviceType].hasOwnProperty(formName)) {
            for (var formItem in template[deviceType][formName]) {
              if (template[deviceType][formName].hasOwnProperty(formItem)) {
                var templateObject = template[deviceType][formName][formItem];
                var sysVarName = sysvarFormatterService.formatSysvar(templateObject.name);

                switch (template[deviceType][formName][formItem].inputType) {
                  case 'textbox':
                    data[sysVarName] = xbConfigUtilityService.scaleValue(data[sysVarName], templateObject);
                    break;
                  case 'slider':
                    if (isNaN(templateObject.min)) {
                      sysVarMin = sysvarFormatterService.formatSysvar(templateObject.min);
                      data[sysVarMin] = xbConfigUtilityService.scaleValue(data[sysVarMin], templateObject);
                    }
                    if (isNaN(templateObject.max)) {
                      sysVarMax = sysvarFormatterService.formatSysvar(templateObject.max);
                      data[sysVarMax] = xbConfigUtilityService.scaleValue(data[sysVarMax], templateObject);
                    }
                    data[sysVarName] = xbConfigUtilityService.scaleValue(data[sysVarName], templateObject);
                    break;
                  case 'sliderdisable':
                    if (isNaN(templateObject.min)) {
                      sysVarMin = sysvarFormatterService.formatSysvar(templateObject.min);
                      data[sysVarMin] = xbConfigUtilityService.scaleValue(data[sysVarMin], templateObject);
                    }
                    if (isNaN(templateObject.max)) {
                      sysVarMax = sysvarFormatterService.formatSysvar(templateObject.max);
                      data[sysVarMax] = xbConfigUtilityService.scaleValue(data[sysVarMax], templateObject);
                    }
                    data[sysVarName] = xbConfigUtilityService.scaleValue(data[sysVarName], templateObject);

                    data[sysVarMin] = data[sysVarMin] - templateObject.sliderStep;

                    if (data[sysVarName] === 0) {
                      data[sysVarName] = data[sysVarMin];
                    }
                    break;
                  case 'dropdown':
                    data[sysVarName] = "" + xbConfigUtilityService.scaleValue(data[sysVarName], templateObject);
                    break;
                  case 'timeofday':
                    data[sysVarName] = xbConfigUtilityService.scaleValue(data[sysVarName], templateObject);
                    data[sysVarName] = moment().clone().startOf('day').add(data[sysVarName], 'minutes').toDate();
                    break;
                  default:

                }
              }
            }
          }
        }
        return data;
      });
    }

    //Function for retreive the json config for form information
    function getDeviceConfiguration(deviceType) {
      var result;
      switch (deviceType) {
        case 'XW':
          result = XW_device_config;
          break;
        case 'GT':
          result = GT_device_config;
          break;
        case 'HVMPPT':
          result = HVMPPT_device_config;
          break;
        case 'MPPT':
          result = MPPT_device_config;
          break;
        case 'CSW':
          result = CSW_device_config;
          break;
        case 'AGS':
          result = AGS_device_config;
          break;
        case 'SCP':
          result = SCP_device_config;
          break;
        case 'SCP2':
          result = SCP2_device_config;
          break;
        case 'BATTMON':
          result = BATTMON_device_config;
          break;
        case 'PM2XXX':
          result = PM2XXX_device_config;
          break;
        case 'PM32XX':
          result = PM32XX_device_config;
          break;
        case 'CL25':
          result = CL25_device_config;
          break;
        case "CL36":
          result = CL36_device_config;
          break;
        case "CL60":
          result = CL60_device_config;
          break;
        case "PM8XX":
          result = PM8XX_device_config;
          break;
        case 'IEM32XX':
          result = IEM32XX_device_config;
          break;
        case 'EM3500':
          result = EM3500_device_config;
          break;
        default:
      }
      return $q.resolve(result);
    }

    //Save a specific section of the XW form control
    function saveFormConfiguration(template, items, deviceID, configData) {
      var sysVars = [];
      for (var key in template) {
        if (template.hasOwnProperty(key)) {
          var sysVar = {};
          var name;
          name = "[" + deviceID + "]" + template[key].name;
          var sysvarName = sysvarFormatterService.formatSysvar(template[key].name);
          if (items.hasOwnProperty(sysvarName)) {
            switch (template[key].inputType) {
              case 'switch':
                sysVar[name] = xbConfigUtilityService.removeScaling(template[key], items[sysvarName] ? 1 : 0);
                break;
              case 'dropdown':
                sysVar[name] = xbConfigUtilityService.removeScaling(template[key], parseInt(items[sysvarName]));
                break;
              case 'timeofday':
                var mmt = moment(items[sysvarName]);
                var midnight = mmt.clone().startOf('day');
                var minutesFromMidnight = mmt.diff(midnight, 'minutes');
                sysVar[name] = xbConfigUtilityService.removeScaling(template[key], minutesFromMidnight);
                break;
              case 'sliderdisable':
                var sysVarMin = template[key].min;
                if (isNaN(sysVarMin)) {
                  sysVarMin = configData[sysvarFormatterService.formatSysvar(template[key].min)] - template[key].scale;
                }

                if (sysVarMin === items[sysvarName]) {
                  items[sysvarName] = 0;
                }

                sysVar[name] = xbConfigUtilityService.removeScaling(template[key], items[sysvarName]);
                break;
              default:
                sysVar[name] = xbConfigUtilityService.removeScaling(template[key], items[sysvarName]);
            }

            sysVars.push(sysVar);
          }
        }
      }
      return queryService.setSysvars(sysVars);
    }

    //Function for retrieve the refresh count which is used to determine when the refresh
    //is complete
    function getRefreshCount(deviceID, deviceType) {
      var options = {};
      var queryID = deviceID + 'cfg_refresh_count';
      return queryService.getSysvars(['[' + deviceID + ']/' + deviceType + '/CFG/REFRESH_COUNT'], options);
    }

//    function getRefreshProgress(deviceID, deviceType) {
//      var defered = $q.defer();
//      var sysVars = [
//        '[' + deviceID + ']/' + deviceType + '/XB/PGNSTS',
//        '[' + deviceID + ']/' + deviceType + '/CFG/INITIALIZED'
//
//      ];
//
//      var result = {
//        'status': 'inprogress',
//        'progress': 0,
//        'pgnCount': 0,
//        'pgnCompleted': 0,
//        'pgnFailed': 0,
//        'initialized': 0
//      };
//
//      queryService.getSysvars(sysVars, {}).then(function(data) {
//        var pgnStatus = data[deviceType + "_XB_PGNSTS"].PGNSts;
//        for (var pgnIndex in pgnStatus) {
//          if (pgnStatus.hasOwnProperty(pgnIndex)) {
//            result.pgnCount++;
//            if(pgnStatus[pgnIndex].state === "Idle" && pgnStatus[pgnIndex].updatePending === 0) {
//              result.pgnCompleted++;
//              if(pgnStatus[pgnIndex].result === "Failed" && pgnStatus[pgnIndex].name !== "GvsCfg") {
//                result.pgnFailed++;
//              }
//            }
//          }
//        }
//
//        if(result.pgnCount === result.pgnCompleted && data[deviceType + '_CFG_INITIALIZED']  === 1) {
//          result.initialized = 1;
//          result.status = (result.pgnFailed !== 0) ? "failed": "complete";
//        } else {
//          result.progress = parseFloat((result.pgnCompleted / result.pgnCount * 100).toFixed(0));
//        }
//        defered.resolve(result);
//      }, function(error) {
//        result.status = 'failed';
//        defered.resolve(result);
//      });
//      return defered.promise;
//    }

    function getRefreshProgress(deviceID, deviceType) {
      var defered = $q.defer();
      var sysVars = [
        '[' + deviceID + ']/' + deviceType + '/DEV/INIT_PROGRESS',
        '[' + deviceID + ']/' + deviceType + '/CFG/INITIALIZED'

      ];

      var result = {
        'status': 'inprogress',
        'progress': 0,
        'initialized': 0
      };

      queryService.getSysvars(sysVars, {}).then(function(data) {
        result.progress = data[deviceType + "_DEV_INIT_PROGRESS"];
        if ( result.progress === 100 ) {
            result.status = "complete";
            result.initialized = 1;
        }

        defered.resolve(result);
      }, function(error) {
        result.status = 'failed';
        defered.resolve(result);
      });
      return defered.promise;
    }

    //This function triggers the refresh of the specified device
    function refreshDeviceConfig(deviceID, deviceType) {
      var sysvar = {};
      sysvar['[' + deviceID + ']/' + deviceType + '/CFG/REFRESH'] = 1;
      return queryService.setSysvars(sysvar);
    }

    return service;
  }
]);
