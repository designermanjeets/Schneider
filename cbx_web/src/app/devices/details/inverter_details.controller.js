"use strict";

angular.module('conext_gateway.devices').controller("InverterDetailsController", [
  "$scope", "$stateParams", "deviceNameParserService", "inverterDetailsService", "faultDescriptionService",
  "moment", "$log", "$interval", "temperatureService", "$filter",
  function ($scope, $stateParams, deviceNameParserService, inverterDetailsService, faultDescriptionService, moment, $log, $interval, temperatureService, $filter) {

    var inverterId = $stateParams.inverterId;
    var requestPending = false;
    if (inverterId.indexOf("CL60") > -1) {
      $scope.inverterType = "CL60";
      getCL60Details();
    } else {
      $scope.inverterType = "CL25";
      getCL25Details();
    }


    var interval = $interval(function () {
      if (!requestPending) {
        requestPending = true;
        if (inverterId.indexOf("CL60") > -1) {
          getCL60Details();
        } else {
          getCL25Details();
        }
      }
    }, 60000);

    function getCL60Details() {
      inverterDetailsService.getInverterDetails(inverterId).then(function (data) {
        $scope.device = {
          name: $stateParams.inverterName,
          commError: data.isDead,
          HMI_TEMPERATURE_UNIT: data.HMI_TEMPERATURE_UNIT
        };

        $scope.inverterDetails = data;
        $scope.inverterDetails.TEMP_INTERNAL = temperatureService.convert(data.HMI_TEMPERATURE_UNIT, data.TEMP_INTERNAL);
        $scope.inverterDetails.productName = $stateParams.inverterName;

        var key = 'events.error_code.CL60' + '.' + data.FAULT_CODE + '.short_desc';
        $scope.inverterDetails.FAULT_DESCRIPTION = $filter('translate')(key);


        $scope.settings = {
          inverterModel: 1,
        };

        $scope.deviceInfo = {
          bus: inverterId.split("_")[0],
          address: inverterId.split("_").pop(),
          refresh: function () {
            $scope.$parent.refreshDevices();
          },
          type: "inverters",
          name: $stateParams.inverterName,
          lastUpdated: moment(data.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
        }
        requestPending = false;
      },
      function (error) {
        $log.error(error);

        requestPending = false;
      });
    }
    function getCL25Details() {
      inverterDetailsService.getInverterDetails(inverterId).then(function (data) {
        var inverterDetails = data.tag;
        var currentTime = new Date();

        inverterDetails.LAST_POLL_TS = data.LAST_POLL_TS;
        inverterDetails.HMI_TEMPERATURE_UNIT = data.HMI_TEMPERATURE_UNIT;

        $scope.device = {
          productName: $stateParams.inverterName,
          //ratedPower: inverterDetails.CFG_POWER_RATED_APPARENT,
          name: $stateParams.inverterName,
          //ratedPower: 0xFFFF,
          productDesignation: inverterDetails.PRODUCT_MODEL,
          serialNumber: inverterDetails.C_SERNUM,
          processorAVersion: inverterDetails.SOFTWARE_VER_PROCESSOR_A,
          processorBVersion: inverterDetails.SOFTWARE_VER_PROCESSOR_B,
          processorCVersion: inverterDetails.SOFTWARE_VER_PROCESSOR_C,
          provessorABuild: inverterDetails.BUILD_PROCESSOR_A,
          provessorBBuild: inverterDetails.BUILD_PROCESSOR_B,
          provessorCBuild: inverterDetails.BUILD_PROCESSOR_C,
          ipAddress: inverterDetails.IP_ADDRESS,
          updateTime: moment(currentTime).format('YYYY/MM/DD h:mm:ss a'),
          //updateTime: "2016/03/02 17:06:41",
          lastUpdated: moment(inverterDetails.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a'),
          // This still needs to be set, even though the items in the
          // $scope.details array will be null when it's true. There are
          // places where the UI queries this value directly.
          commError: data.isDead,
        };

        $scope.details = {
          // todo: add most of this

          // todo: If $scope.device.commError is true, then
          // these values should be null (or undefined). That way,
          // the replaceNull filter will work.
          realPower: inverterDetails.POWER_REAL_PHASE_A + inverterDetails.POWER_REAL_PHASE_B + inverterDetails.POWER_REAL_PHASE_C,
          reactivePower: inverterDetails.POWER_REACTIVE,
          apparentPower: inverterDetails.POWER_APPARENT_1,
          acEnergyToday: inverterDetails.ENERGY_TODAY,
          acEnergyLifetime: inverterDetails.ENERGY_AC_LIFE,
          operatingHoursLifetime: inverterDetails.OPERATING_HOURS,
          phaseACurrent: inverterDetails.CURRENT_PHASE_A,
          phaseBCurrent: inverterDetails.CURRENT_PHASE_B,
          phaseCCurrent: inverterDetails.CURRENT_PHASE_C,
          voltageAB: inverterDetails.INV_VOLT_A_B,
          voltageBC: inverterDetails.INV_VOLT_B_C,
          voltageCA: inverterDetails.INV_VOLT_C_A,
          voltageAN: inverterDetails.VOLT_PHASE_A_N,
          voltageBN: inverterDetails.VOLT_PHASE_B_N,
          voltageCN: inverterDetails.VOLT_PHASE_C_N,
          acFrequency: inverterDetails.FREQ_GRID,
          VOLT_PV1: inverterDetails.VOLT_PV1,
          CURRENT_PV1: inverterDetails.CURRENT_PV1,
          POWER_PV1: inverterDetails.POWER_PV1,
          VOLT_PV2: inverterDetails.VOLT_PV2,
          CURRENT_PV2: inverterDetails.CURRENT_PV2,
          POWER_PV2: inverterDetails.POWER_PV2,
          HMI_TEMPERATURE_UNIT: inverterDetails.HMI_TEMPERATURE_UNIT,
          TEMP_CONTROL_BOARD: temperatureService.convert(inverterDetails.HMI_TEMPERATURE_UNIT, inverterDetails.TEMP_CONTROL_BOARD),
          TEMP_BOOST_1_2: temperatureService.convert(inverterDetails.HMI_TEMPERATURE_UNIT, inverterDetails.TEMP_BOOST_1_2),
          TEMP_BOOST_3_4: temperatureService.convert(inverterDetails.HMI_TEMPERATURE_UNIT, inverterDetails.TEMP_BOOST_3_4),
          OPERATIONAL_MODE_STATE: inverterDetails.OPERATIONAL_MODE_STATE,
          updateTime: moment(currentTime).format('YYYY/MM/DD h:mm:ss a'),
          ALARMS: inverterDetails.FAULT_CODE,
        };

        faultDescriptionService
          .faultDescription($scope.device.productName, $scope.details.ALARMS)
          .then(function (faultDescription) {
            $scope.details.FAULT_DESCRIPTION = faultDescription;
          })

        $scope.settings = {
          inverterModel: 1,
        };

        $scope.deviceInfo = {
          bus: inverterId.split("_")[0],
          address: inverterId.split("_").pop(),
          refresh: function () {
            $scope.$parent.refreshDevices();
          },
          type: "inverters",
          name: $stateParams.inverterName,
          lastUpdated: moment(inverterDetails.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
        }
        requestPending = false;
      },
      function (error) {
        $log.error(error);

        requestPending = false;
      });
    }
    var dereg = $scope.$on("$destroy", function () {
      if (interval) {
        $interval.cancel(interval);
        requestPending = false;
        dereg();
      }
    });

  }
]);
