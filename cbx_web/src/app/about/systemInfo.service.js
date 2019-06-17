"use strict";

angular.module('conext_gateway.setup').factory('systemInfoService', ['queryService', 'saveAs', "xbConfigService", '$filter',
  'xbConfigUtilityService', 'moment',
  'AGS_device_config', 'BATTMON_device_config', 'CSW_device_config', 'GT_device_config', 'HVMPPT_device_config',
  'MPPT_device_config', 'SCP_device_config', 'SCP2_device_config', 'XW_device_config', 'PM2XXX_device_config',
  'CL25_device_config', 'IEM32XX_device_config', 'EM3500_device_config',
  function(queryService, saveAs, xbConfigService, $filter, xbConfigUtilityService, moment, AGS_device_config, BATTMON_device_config, CSW_device_config,
    GT_device_config, HVMPPT_device_config, MPPT_device_config, SCP_device_config, SCP2_device_config,
    XW_device_config, PM2XXX_device_config, CL25_device_config, IEM32XX_device_config, EM3500_device_config) {

    var service = {
      getSystemInfo: getSystemInfo
    };

    function getSystemInfo() {
      var match = {
        tags: ['cfg:']
      };
      var options = {};
      return queryService.getMatchingSysvars(match, {
        'keepDeviceId': true
      }).then(function(data) {
        var blob = new Blob([JSON.stringify(parseQueryResult(data))], {
          type: "text"
        });

        var DISABLE_AUTO_BOM = true;
        saveAs(blob, "device_configs.json", DISABLE_AUTO_BOM);
      });
    }

    function parseQueryResult(data) {
      var result = {};
      removeInvalidData(data);

      for (var sysvar in data) {
        if (data.hasOwnProperty(sysvar)) {
          var temp = sysvar.split('_');

          if (!isNaN(temp[0])) {
            if (result[temp[0]] === undefined) {
              result[temp[0]] = {
                "type": temp[1]
              };
            }
          }
        }
      }

      for (var id in result) {
        result[id].groups = parseDeviceConfig(id, result[id].type, data);
      }
      return result;
    }



    function parseDeviceConfig(id, type, data) {
      var template = getDeviceConfiguration(type);
      var result = {};
      var enumRef;
      var tabname;
      var deviceType = Object.keys(template)[0];
      for (var formName in template[deviceType]) {
        if (template[deviceType].hasOwnProperty(formName)) {
          var items = [];
          for (var formItem in template[deviceType][formName]) {
            if (template[deviceType][formName].hasOwnProperty(formItem)) {

              var item = {};
              var templateObject = template[deviceType][formName][formItem];
              var sysVarName = id + templateObject.name.split('/').join('_');

              if (data.hasOwnProperty(sysVarName)) {
                item.name = $filter('translate')(templateObject.nameRef);

                if (templateObject.hasOwnProperty('units')) {
                  item.units = templateObject.units;
                }

                switch (template[deviceType][formName][formItem].inputType) {
                  case 'textbox':
                    item.value = xbConfigUtilityService.scaleValue(data[sysVarName], templateObject);
                    break;
                  case 'slider':
                    item.value = xbConfigUtilityService.scaleValue(data[sysVarName], templateObject);
                    break;
                  case 'sliderdisable':
                    item.value = xbConfigUtilityService.scaleValue(data[sysVarName], templateObject);
                    if(item.value === 0) {
                      item.value = "Disabled";
                    }
                    break;
                  case 'switch':
                    item.value = xbConfigUtilityService.scaleValue(data[sysVarName], templateObject);
                    enumRef = $filter('translate')(templateObject.enumRef);
                    var options = xbConfigUtilityService.splitEnums(enumRef);
                    for (var optionIndex = 0; optionIndex < options.length; optionIndex++) {
                      if (options[optionIndex].key === '' + item.value) {
                        item.value = options[optionIndex].value;
                      }
                    }
                    break;
                  case 'dropdown':
                    data[sysVarName] = "" + xbConfigUtilityService.scaleValue(data[sysVarName], templateObject);
                    enumRef = $filter('translate')(templateObject.enumRef);
                    item.value = xbConfigUtilityService.findEnumValue(enumRef, data[sysVarName]);
                    break;
                  case 'timeofday':
                    data[sysVarName] = xbConfigUtilityService.scaleValue(data[sysVarName], templateObject);
                    item.value = moment().clone().startOf('day').add(data[sysVarName], 'minutes').toDate();
                    break;
                  default:
                }

                items.push(item);
              }
            }
          }
          tabname = $filter('translate')(deviceType + '_' + formName);
          result[tabname] = items;
        }
      }
      return result;
    }

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
        case 'CL25':
          result = CL25_device_config;
          break;
        case 'IEM32XX':
          result = IEM32XX_device_config;
          break;
        case 'EM3500':
          result = EM3500_device_config;
          break;
        default:
      }
      return result;
    }

    function removeInvalidData(data) {
      delete data.SYS_LSYS_MULTI_CLUSTER_MODE;
      delete data.SYS_UTC_POSIX;
      delete data.SYS_ZONE_ENUM;
      delete data.META;
    }

    return service;
  }
]);
