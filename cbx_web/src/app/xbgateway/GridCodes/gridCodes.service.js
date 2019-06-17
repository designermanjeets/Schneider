"use strict";

//This service is used for retreive the energy chart data
angular.module('conext_gateway.setup').factory('gridCodesService', ["queryService", "$q", "$filter",
  "$interval",
  function(queryService, $q, $filter, $interval) {
    var sysVars = [
      '/XW/QV/CFG_ENABLE',
      '/XW/QV/CFG_CURVE',

      '/XW/LFRT/CFG_ENABLE',
      '/XW/LFRT/CFG_CURVE',

      '/XW/HFRT/CFG_ENABLE',
      '/XW/HFRT/CFG_CURVE',

      '/XW/PW/CFG_ENABLE',
      '/XW/PW/CFG_CURVE',

      // '/XW/QP/CFG_ENABLE',
      // '/XW/QP/CFG_X_MIN',
      // '/XW/QP/CFG_X_MAX',
      // '/XW/QP/CFG_Y_MIN',
      // '/XW/QP/CFG_Y_MAX',
      // '/XW/QP/CFG_CURVE',

      '/XW/GRID/CFG_PWR_RAMP_TIME',
      '/XW/GRID/CFG_PWR_RAMP_PRCNT',

      '/XW/LVRT/CFG_ENABLE',
      '/XW/LVRT/CFG_CURVE',

      '/XW/HVRT/CFG_ENABLE',
      '/XW/HVRT/CFG_CURVE',

      '/XW/PF/CFG_ENABLE',
      '/XW/PF/CFG_CURVE',

      '/XW/DEV/CFG_PROD_REG_CODE',

      '/XW/GRID/CFG_POWER_FACTOR',
      '/XW/GRID/CFG_POW_FACTOR_TARGET_EN_DIS'
    ];

    var service = {
      getCurveData: getCurveData,
      saveCurveData: saveCurveData,
      sequentiallySaveCurveData: sequentiallySaveCurveData
    };

    function saveCurveData(curveData, deviceId) {
      var sysVars = [];
      var sysVarObj = {};
      var curves = ['qv', 'lfrt', 'hfrt', 'lvrt', 'hvrt', 'pf', 'pw'];

      sysVarObj["[" + deviceId + "]/XW/DEV/CFG_PROD_REG_CODE"] = parseInt(curveData.region.value);
      sysVars.push(sysVarObj);

      sysVarObj = {};
      for (var curve in curves) {
        if (curves.hasOwnProperty(curve)) {
          sysVarObj = {};
          sysVarObj["[" + deviceId + "]/XW/" + curves[curve].toUpperCase() + "/CFG_ENABLE"] = curveData[curves[curve]].enabled;
          sysVars.push(sysVarObj);
          sysVarObj = {};
          sysVarObj["[" + deviceId + "]/XW/" + curves[curve].toUpperCase() + "/CFG_CURVE"] = curveDataToString(curveData[curves[curve]].data);
          sysVars.push(sysVarObj);
        }
      }


      sysVarObj = {};
      sysVarObj["[" + deviceId + "]/XW/GRID/CFG_PWR_RAMP_TIME"] = curveData.ss.data[1].x;
      sysVars.push(sysVarObj);

      sysVarObj = {};
      sysVarObj["[" + deviceId + "]/XW/GRID/CFG_PWR_RAMP_PRCNT"] = curveData.rr.slope.value;
      sysVars.push(sysVarObj);

      sysVarObj = {};
      sysVarObj["[" + deviceId + "]/XW/GRID/CFG_POWER_FACTOR"] = curveData.powerfactor.value * 100;
      sysVars.push(sysVarObj);

      sysVarObj = {};
      sysVarObj["[" + deviceId + "]/XW/GRID/CFG_POW_FACTOR_TARGET_EN_DIS"] = curveData.powerfactor.enabled;
      sysVars.push(sysVarObj);

      return queryService.setSysvars(sysVars);
    }

    function sequentiallySaveCurveData(curveData, deviceId) {
      var defered = $q.defer();
      var interval;
      var sysVars = [];
      var sysVarObj = {};


      sysVarObj["[" + deviceId + "]/XW/DEV/CFG_PROD_REG_CODE"] = parseInt(curveData.region.value);
      saveCurve(deviceId, [sysVarObj], curveData, ['region']).then(function() {
        sysVarObj = {};
        sysVarObj["[" + deviceId + "]/XW/GRID/CFG_PWR_RAMP_TIME"] = curveData.ss.data[1].x;
        sysVars.push(sysVarObj);

        sysVarObj = {};
        sysVarObj["[" + deviceId + "]/XW/GRID/CFG_PWR_RAMP_PRCNT"] = curveData.rr.slope.value;
        sysVars.push(sysVarObj);

        sysVarObj = {};
        sysVarObj["[" + deviceId + "]/XW/GRID/CFG_POWER_FACTOR"] = curveData.powerfactor.value * 100;
        sysVars.push(sysVarObj);

        sysVarObj = {};
        sysVarObj["[" + deviceId + "]/XW/GRID/CFG_POW_FACTOR_TARGET_EN_DIS"] = curveData.powerfactor.enabled;
        sysVars.push(sysVarObj);
        saveCurve(deviceId, sysVars, curveData, ['ss', 'rr', 'powerfactor']).then(function() {

          saveCurve(deviceId, setSysvars(deviceId, 'qv', curveData), curveData, ['qv']).then(function() {
            saveCurve(deviceId, setSysvars(deviceId, 'lfrt', curveData), curveData, ['lfrt']).then(function() {
              saveCurve(deviceId, setSysvars(deviceId, 'hfrt', curveData), curveData, ['hfrt']).then(function() {
                saveCurve(deviceId, setSysvars(deviceId, 'lvrt', curveData), curveData, ['lvrt']).then(function() {
                  saveCurve(deviceId, setSysvars(deviceId, 'hvrt', curveData), curveData, ['hvrt']).then(function() {
                    saveCurve(deviceId, setSysvars(deviceId, 'pf', curveData), curveData, ['pf']).then(function() {
                      saveCurve(deviceId, setSysvars(deviceId, 'pw', curveData), curveData, ['pw']).then(function() {
                        defered.resolve();
                      }, function(error) {
                        defered.reject(error);
                      });
                    }, function(error) {
                      defered.reject(error);
                    });
                  }, function(error) {
                    defered.reject(error);
                  });
                }, function(error) {
                  defered.reject(error);
                });
              }, function(error) {
                defered.reject(error);
              });
            }, function(error) {
              defered.reject(error);
            });
          }, function(error) {
            defered.reject(error);
          });
        }, function(error) {
          defered.reject(error);
        });
      }, function(error) {
        defered.reject(error);
      });

      return defered.promise;
    }

    function setSysvars(deviceId, curve, curveData) {
      var sysVars = [];
      var sysVarObj = {};
      sysVarObj["[" + deviceId + "]/XW/" + curve.toUpperCase() + "/CFG_ENABLE"] = curveData[curve].enabled;
      sysVars.push(sysVarObj);
      sysVarObj = {};
      sysVarObj["[" + deviceId + "]/XW/" + curve.toUpperCase() + "/CFG_CURVE"] = curveDataToString(curveData[curve].data);
      sysVars.push(sysVarObj);
      return sysVars;
    }

    function saveCurve(deviceId, sysVars, curveData, fieldNames) {
      var interval;
      var defered = $q.defer();
      queryService.setSysvars(sysVars).then(function() {
        if (interval) {
          $interval.cancel(interval);
        }
        interval = $interval(function() {
          checkIfWrittenToXW(deviceId, fieldNames, curveData).then(function(status) {
            if (status === 'failed' || status === 'saved') {
              $interval.cancel(interval);
              if(status === 'failed') {
                defered.reject();
              } else {
                defered.resolve();
              }
            }
          });
        }, 1500);
      }, function(error) {
        defered.reject(error);
      });
      return defered.promise;
    }

    function checkIfWrittenToXW(deviceId, fields, oldData) {
      var defered = $q.defer();
      var status = 'saved';

      getCurveData(deviceId).then(function(data) {

        for (var field in fields) {
          if (fields.hasOwnProperty(field)) {
            if (data[fields[field]].hasOwnProperty('quality')) {
              if (data[fields[field]].quality !== 'G') {
                if (data[fields[field]].quality === 'F') {
                  status = 'failed';
                } else if (status !== 'failed') {
                  status = 'pending';
                }
              }
            }

            if (data[fields[field]].hasOwnProperty('qualities')) {
              for (var index = 0; index < data[fields[field]].qualities.length; index++) {
                if (data[fields[field]].hasOwnProperty('quality')) {
                  if (data[fields[field]].qualities[index] !== 'G') {
                    if (data[fields[field]].qualities[index] === 'F') {
                      status = 'failed';
                    } else if (status !== 'failed') {
                      status = 'pending';
                    }
                  }
                }
              }
            }

            if (status === 'saved' && !isGCquality(data[fields[field]], oldData[fields[field]])) {
              status = 'failed';
            }
          }
        }
        defered.resolve(status);
      }, function(error) {
        defered.resolve('failed');
      });

      return defered.promise;
    }

    function isGCquality(current, old) {
      if (current.hasOwnProperty('value')) {
        if (current.value !== old.value) {
          return false;
        }
      }

      if (current.hasOwnProperty('data')) {
        if (!isCoordinatesEqual(current.data, old.data)) {
          return false;
        }
      }

      if (current.hasOwnProperty('enabled')) {
        if (current.enabled !== ((old.enabled) ? 1 : 0)) {
          return false;
        }
      }

      if (current.hasOwnProperty('slope')) {
        if (current.slope.value !== old.slope.value) {
          return false;
        }
      }
      return true;
    }

    function isCoordinatesEqual(currentData, oldData) {
      if (currentData.length !== oldData.length) {
        return false;
      }

      for (var index = 0; index < currentData.length; index++) {
        if (currentData[index].x.toFixed(2) !== oldData[index].x.toFixed(2) ||
          currentData[index].y.toFixed(2) !== oldData[index].y.toFixed(2)) {
          return false;
        }
      }

      return true;
    }

    function curveDataToString(data) {
      var sortedData = $filter('orderBy')(data, "x", false);
      var curveString = "";
      for (var index = 0; index < sortedData.length; index++) {
        if (sortedData[index].x !== null && sortedData[index].y !== null) {
          curveString += (parseInt((sortedData[index].x * 100).toFixed(0)) + "," + parseInt((sortedData[index].y * 100).toFixed(0)) + ";");
        }
      }
      return curveString.slice(0, -1);
    }

    function getCurveData(deviceId) {
      var defered = $q.defer();
      var tempSysvars = [];

      for (var sysVar in sysVars) {
        if (sysVars.hasOwnProperty(sysVar)) {
          tempSysvars.push('[' + deviceId + ']' + sysVars[sysVar]);
        }
      }

      queryService.getSysvars(tempSysvars).then(function(data) {
        var result = {
          'region': {
            "value": "" + data.XW_DEV_CFG_PROD_REG_CODE,
            "quality": data.META.XW_DEV_CFG_PROD_REG_CODE
          },
          'qv': {
            'enabled': data.XW_QV_CFG_ENABLE,
            'data': parseCurve(data.XW_QV_CFG_CURVE),
            "qualities": [
              data.META.XW_QV_CFG_ENABLE,
              data.META.XW_QV_CFG_CURVE
            ]
          },
          // 'qp': {
          //   'enabled': data.XW_QP_CFG_ENABLE,
          //   'xmin': data.XW_QP_CFG_X_MIN * 0.01,
          //   'xmax': data.XW_QP_CFG_X_MAX * 0.01,
          //   'ymin': data.XW_QP_CFG_Y_MIN * 0.01,
          //   'ymax': data.XW_QP_CFG_Y_MAX * 0.01,
          //   'data': parseCurve(data.XW_QP_CFG_CURVE)
          // },
          'pw': {
            'enabled': data.XW_PW_CFG_ENABLE,
            'data': parseCurve(data.XW_PW_CFG_CURVE),
            "qualities": [
              data.META.XW_PW_CFG_ENABLE,
              data.META.XW_PW_CFG_CURVE
            ]
          },
          'lfrt': {
            'enabled': data.XW_LFRT_CFG_ENABLE,
            'data': parseCurve(data.XW_LFRT_CFG_CURVE),
            "qualities": [
              data.META.XW_LFRT_CFG_ENABLE,
              data.META.XW_LFRT_CFG_CURVE
            ]
          },
          'hfrt': {
            'enabled': data.XW_HFRT_CFG_ENABLE,
            'data': parseCurve(data.XW_HFRT_CFG_CURVE),
            "qualities": [
              data.META.XW_HFRT_CFG_ENABLE,
              data.META.XW_HFRT_CFG_CURVE
            ]
          },
          'lvrt': {
            'enabled': data.XW_LVRT_CFG_ENABLE,
            'data': parseCurve(data.XW_LVRT_CFG_CURVE),
            "qualities": [
              data.META.XW_LVRT_CFG_ENABLE,
              data.META.XW_LVRT_CFG_CURVE
            ]
          },
          'hvrt': {
            'enabled': data.XW_HVRT_CFG_ENABLE,
            'data': parseCurve(data.XW_HVRT_CFG_CURVE),
            "qualities": [
              data.META.XW_HVRT_CFG_ENABLE,
              data.META.XW_HVRT_CFG_CURVE
            ]
          },
          'pf': {
            'enabled': data.XW_PF_CFG_ENABLE,
            'data': parseCurve(data.XW_PF_CFG_CURVE),
            "qualities": [
              data.META.XW_PF_CFG_ENABLE,
              data.META.XW_PF_CFG_CURVE
            ]
          },
          'ss': parseSoftStart(data.XW_GRID_CFG_PWR_RAMP_TIME, data.META.XW_GRID_CFG_PWR_RAMP_TIME),
          "rr": parseRampRate(data.XW_GRID_CFG_PWR_RAMP_PRCNT, data.META.XW_GRID_CFG_PWR_RAMP_PRCNT),
          "powerfactor": parsePowerFactor(data.XW_GRID_CFG_POWER_FACTOR / 100, data.XW_GRID_CFG_POW_FACTOR_TARGET_EN_DIS, [
            data.META.XW_GRID_CFG_POW_FACTOR_TARGET_EN_DIS,
            data.META.XW_GRID_CFG_POWER_FACTOR
          ])
        };
        defered.resolve(result);
      });
      return defered.promise;
    }

    function parsePowerFactor(pf, enabled, metas) {
      var result = {
        "enabled": enabled,
        "value": pf,
        "data": [{
          "x": 0,
          "y": 0
        }]
      };
      result.qualities = metas;
      var point = {};
      point.x = parseFloat(100 * Math.abs(pf).toFixed(2));
      point.y = parseFloat((Math.sqrt(Math.pow(100, 2) - Math.pow(point.x, 2)) * (Math.abs(pf) / pf)).toFixed(2)) * -1;
      result.data.push(point);

      return result;
    }

    function parseRampRate(value, meta) {
      var rr = {};
      rr.quality = meta;
      rr.slope = {
        'value': value
      };

      rr.data = [];
      rr.data.push({
        "x": 0,
        "y": 0
      });

      rr.data.push({
        "x": parseFloat((100 / value).toFixed(2)),
        "y": 100
      });

      return rr;
    }

    function parseSoftStart(seconds, meta) {
      var ss = {};
      ss.quality = meta;
      ss.data = [];
      ss.data.push({
        "x": 0,
        "y": 0
      });

      ss.data.push({
        "x": seconds,
        "y": 100
      });

      ss.slope = {
        'value': parseFloat((100 / seconds).toFixed(2))
      };

      return ss;
    }

    function parseCurve(curveData) {
      var points = curveData.split(';');
      var result = [];
      if (curveData !== 0) {
        for (var index = 0; index < points.length; index++) {
          var temp = points[index].split(',');
          result.push({
            'x': parseFloat((parseInt(temp[0]) * 0.01).toFixed(2)),
            'y': parseFloat((parseInt(temp[1]) * 0.01).toFixed(2))
          });
        }
      }
      return result;
    }

    return service;
  }
]);
