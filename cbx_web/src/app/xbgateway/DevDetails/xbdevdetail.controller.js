
"use strict";

angular.module('conext_gateway.xbgateway').controller("xbdevdetailController", [
  "$rootScope", "$scope", "$state", "$stateParams", "$filter", "$location", "moment", "TIME_LOCAL_FORMAT",
   "xbdevdetailService", "$interval", "$log", "firmwareVersionFormatter", "deviceStateSevice", "deleteDeviceService",
  function($rootScope, $scope, $state, $stateParams, $filter, $location, moment, TIME_LOCAL_FORMAT, xbdevdetailService,
     $interval, $log, firmwareVersionFormatter, deviceStateSevice, deleteDeviceService) {
    $scope.loadComplete = false;
    $scope.device = $stateParams.device;
    $scope.id = $stateParams.id;
    $scope.Math = Math;
    $scope.deviceInfo = {
      attributes: {
        alarms: '0',
        warnings: '0'
      }
    };

    $scope.deleteDevice = function() {
      deleteDeviceService.startDeletion({
        'bus': $scope.devinfo.DEVICE_BUSID,
        'address': $scope.devinfo.DEVICE_ADDRESS,
        'name': $scope.devinfo.LPHD_CFG_DEVICE_NAME + " " + $scope.devinfo.LPHD_CFG_DEVICE_INSTANCE
      });
    };

    $scope.displayPerformance = function() {
      return $scope.device === 'XW' || $scope.device === 'CSW' ||
      $scope.device === 'MPPT' || $scope.device === 'HVMPPT' ||
      $scope.device === 'GT' || $scope.device === 'CL25' ||
      $scope.device === 'CL36' || $scope.device === 'CL60';
    };

    /* determine the PGN indicator based on the PGN status result:
     * Failed -> 'danger'
     * Not Started -> 'warning'
     * OK -> nothing
     * other -> 'active' */
    $scope.pgnStatusClass = function(result) {
      if (result === 'Failed') {
        return 'danger';
      } else if (result === 'Not Started') {
        return 'warning';
      } else if (result === 'OK') {
        return '';
      } else {
        return 'active';
      }
    };

    var requestPending = false;

    /* get the first device detail data */
    getDevDetail(true, $scope.device, $scope.id);

    /* interval function to get the device detail every 10 seconds */
    var interval = $interval(function() {
      if (!requestPending) {
        requestPending = true;
        getDevDetail(false, $scope.device, $scope.id);
      }
    }, 10000);

    $scope.getDevDetail = function(device, id) {
      getDevDetail(device, id);
    }

    /* get the device detail including:
     * - the fault and warning log
     * - the firmware version string
     * - the device data using its name and instance identifier
     */
    function getDevDetail(firstTime, device, id) {
      xbdevdetailService.getDevInfo(device, id).then(function(data) {
          delete data["META"];
          $scope.state = deviceStateSevice.getDeviceState(data);
          $scope.deviceInfo = {
            attributes: {
              alarms: '' + (data.hasOwnProperty("FLT_ACTIVE") ? data.FLT_ACTIVE : '0'),
              warnings: '' + (data.hasOwnProperty("WRN_ACTIVE") ? data.WRN_ACTIVE : "0")
            }
          };

          if (data.hasOwnProperty('ZREG_ISONLINE')) {
            data.DEV_ACTIVE = data.ZREG_ISONLINE;
          }

          if(data.FLT_LOG === undefined) {
            data.FLT_LOG = [];
          }
          if(data.WRN_LOG === undefined) {
            data.WRN_LOG = [];
          }

          data.FLT_LOG.map(function(el) {
            el.type = 'Fault';
            return el;
          });

          data.WRN_LOG.map(function(el) {
            el.type = 'Warn';
            return el;
          });

          data.EVT_LOG = data.FLT_LOG.concat(data.WRN_LOG);

          data.EVT_LOG.sort(function(a, b) {
            return b.timestamp - a.timestamp;
          });

          data.FWB = firmwareVersionFormatter.formatVersion(data.LFWB_VERSION) + 'bn' + data.LFWB_BUILDNUMBER;

          $scope.devinfo = data;

          $scope.loadComplete = true;
          requestPending = false;
        },
        function(error) {
          $log.error(error);
          $log.error("failed to refresh data");
          requestPending = false;
        });
    }

    /* convert a timestamp in milliseconds into a local time string */
    $scope.time = function(timestamp) {
      if (timestamp === 4294967295) {
        return $filter('translate')('xanbus.timestamp.unavailable');
      }

      var timestr = moment.tz(timestamp * 1000, $rootScope.TIMEZONE).format(TIME_LOCAL_FORMAT + " ZZ");

      return timestr;
    };

    $scope.isXanBus = function() {
      return $scope.devinfo && $scope.devinfo.hasOwnProperty('XB_ADDR');
    };

    $scope.isGridCodesPresent = function() {
        return ($scope.device === 'XW' &&
          $scope.devinfo &&
          $scope.devinfo.PF_CFG_CURVE !== '0' &&
          $scope.devinfo.QV_CFG_CURVE !== '0' &&
          $scope.devinfo.LFRT_CFG_CURVE !== '0' &&
          $scope.devinfo.HFRT_CFG_CURVE !== '0' &&
          $scope.devinfo.LVRT_CFG_CURVE !== '0' &&
          $scope.devinfo.HVRT_CFG_CURVE !== '0' &&
          $scope.devinfo.DEV_ACTIVE);
    };

    /* delete the interval timer when we exit the page */
    var dereg = $scope.$on("$destroy", function() {
      if (interval) {
        $interval.cancel(interval);
        requestPending = false;
        dereg();
      }
    });
  }
]);
