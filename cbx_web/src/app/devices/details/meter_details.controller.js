"use strict";

angular.module('conext_gateway.devices').controller("MeterDetailsController",
  ["$scope", "$stateParams", "deviceNameParserService", "meterDetailsService",
  "moment", "$log", "$interval", "formSuccessMessageService", "deleteDeviceService",
  function ($scope, $stateParams, deviceNameParserService, meterDetailsService,
    moment, $log, $interval, formSuccessMessageService, deleteDeviceService) {
    $scope.forms = {};
    $scope.successMessage = {};
    var requestPending = false;
    var meterId = $stateParams.meterId;
    // var sensorInfo = deviceNameParserService.parseDeviceName(meterName);
    getMeterDetails();
    $scope.settings = {
      meterType: null,
      meterModel: 2,
      setupComplete: false,
    };

    var interval = $interval(function () {
      if (!requestPending) {
        requestPending = true;
        refreshMeterDetails();
      }
    }, 60000);
    // Map from the IDs used by the API to the
    // user-visible names to show in the UI.
    //
    // TODO: These IDs are from the Linux API,
    // they might have changed.
    $scope.meterTypes = [
      {
        // Not yet set. Needs to be null, not 0, for built-in
        // form validation to work
        id: null,
        name: "Select",
      },
      {
        id: "PV-Generation",
        name: "PV generation",
      },
      {
        id: "Export-Meter",
        name: "Export meters",
      },
      {
        id: "Consumption-Meter",
        name: "Consumption meter",
      },
      {
        id: "Other-Meter",
        name: "Other meter",
      },
    ];


    $scope.apply = function () {
      $scope.forms.meterSettings.meterType.$setValidity('tooManyGeneration', true);
      $scope.forms.meterSettings.meterType.$setValidity('tooManyExport', true);

      if ($scope.forms.meterSettings.$valid) {
        meterDetailsService.setMeterType(meterId, $scope.settings.meterType).then(function (data) {
          formSuccessMessageService.show($scope, "meterSettings");
          $scope.$parent.refreshDevices();
          setSetupComplete();
        },
        function (error) {
          $log.error(error);
          if ($scope.settings.meterType === "PV-Generation") {
            $scope.forms.meterSettings.meterType.$setValidity('tooManyGeneration', false);
          } else if ($scope.settings.meterType === "Export-Meter") {
            $scope.forms.meterSettings.meterType.$setValidity('tooManyExport', false);
          }
        });
      }
    };

    $scope.reset = function () {

      meterDetailsService.getMeterDetails(meterId).then(function (data) {
        $scope.settings.meterType = (data.TYPE === "" || data.TYPE === "Meter" || data.TYPE === undefined) ? null : data.TYPE;
        $scope.forms.meterSettings.$rollbackViewValue();
        $scope.forms.meterSettings.$setPristine();
        $scope.forms.meterSettings.meterType.$setValidity('tooManyGeneration', true);
        $scope.forms.meterSettings.meterType.$setValidity('tooManyExport', true);
      });
    };

    function setSetupComplete() {
      $scope.settings.setupComplete = $scope.settings.meterType !== null;
    }

    function refreshMeterDetails() {
      return meterDetailsService.getMeterDetails(meterId).then(function (data) {
        var meterData = data.tag;
        meterData.LAST_POLL_TS = data.sysvar.LAST_POLL_TS;
        meterData.isDead = data.sysvar.isDead;

        if (meterData.MODEL.indexOf('PM2') > -1) {
          refreshPM2000MeterDetails(meterData);
        } else {
          refreshGenericMeterDetails(meterData);
        }
        requestPending = false;
      },
      function (error) {
        $log.error(error);
        requestPending = false;
      });
    }

    function refreshGenericMeterDetails(data) {

        var meterDetails = data;
        var currentTime = new Date();

        $scope.device = {
          MODEL: meterDetails.MODEL,
          SERIAL_NUM: meterDetails.SERIAL,
          NAME: $stateParams.meterName,
          FIRMWARE_ID: meterDetails.FIRMWARE_ID,
          updateTime: moment(currentTime).format('YYYY/MM/DD h:mm:ss a'),
          commError: data.isDead,
          lastUpdated: moment(meterDetails.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
        };



        $scope.details = {
          ENERGY_REAL_NET: meterDetails.ENERGY_REAL_NET,
          ENERGY_REAL_1_4: meterDetails.ENERGY_REAL_1_4,
          ENERGY_REAL_2_3: meterDetails.ENERGY_REAL_2_3,
          NET_REACTIVE_LIFETIME: (meterDetails.ENERGY_REACT_Q1 + meterDetails.ENERGY_REACT_Q2) - (meterDetails.ENERGY_REACT_Q3 + meterDetails.ENERGY_REACT_Q4),
          IMPORTED_REACTIVE_LIFETIME: meterDetails.ENERGY_REACT_Q1 + meterDetails.ENERGY_REACT_Q2,
          EXPORTED_REACTIVE_LIFETIME: meterDetails.ENERGY_REACT_Q3 + meterDetails.ENERGY_REACT_Q4,
          NET_APPARENT_LIFETIME: meterDetails.ENERGY_APP_NET,
          IMPORTED_APPARENT_LIFETIME: meterDetails.ENERGY_APP_1_4,
          EXPORTED_APPARENT_LIFETIME: meterDetails.ENERGY_APP_2_3,
          NET_REAL_POWER: meterDetails.POWER_REAL_INST_P,
          NET_REACTIVE_POWER: meterDetails.POWER_REACT_INST_Q,
          NET_APPARENT_POWER: meterDetails.POWER_APP_INST_S,
          POWER_FACTOR: meterDetails.POWER_FACTOR,
          FREQUENCY: meterDetails.FREQUENCY,
          MODEL: meterDetails.MODEL,
          CURRENT_PHASE_A: meterDetails.CURRENT_PHASE_A,
          CURRENT_PHASE_B: meterDetails.CURRENT_PHASE_B,
          CURRENT_PHASE_C: meterDetails.CURRENT_PHASE_C,
          VOLT_PHASE_A_N: meterDetails.VOLT_PHASE_A_N,
          VOLT_PHASE_B_N: meterDetails.VOLT_PHASE_B_N,
          VOLT_PHASE_C_N: meterDetails.VOLT_PHASE_C_N,
          VOLT_PHASE_A_B: meterDetails.VOLT_PHASE_A_B,
          VOLT_PHASE_B_C: meterDetails.VOLT_PHASE_B_C,
          VOLT_PHASE_C_A: meterDetails.VOLT_PHASE_C_A,
          POWER_FCTOR_PHASE_A: meterDetails.POWER_FACTOR_PHASE_A,
          POWER_FCTOR_PHASE_B: meterDetails.POWER_FACTOR_PHASE_B,
          POWER_FCTOR_PHASE_C: meterDetails.POWER_FACTOR_PHASE_C,
          updateTime: moment(currentTime).format('YYYY/MM/DD h:mm:ss a')
        };


        $scope.parameters = {
          // TODO: This value gets passed through the threePhaseLoss filter.
          // Make sure that filter is correct with respect to the values returned
          // from the API.
          SEC_RATIO_CT: meterDetails.SEC_RATIO_SEC_CT,
          RATIO_PRIM_CT: meterDetails.RATIO_PRIM_CT,
          THREE_PHASE_LOSS: meterDetails.THREE_PHASE_LOSS,
          RATIO_PT: meterDetails.RATIO_PT,
          VOLT_SYSTEM: meterDetails.VOLT_SYSTEM
        };
        $scope.deviceInfo = {
          bus: meterId.split("_")[0],
          address: meterId.split("_").pop(),
          refresh: function () {
            $scope.$parent.refreshDevices();
          },
          type: "meters",
          name: $stateParams.meterName,
          lastUpdated: moment(meterDetails.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
        }

    }

    function getMeterDetails() {
      requestPending = true;
      meterDetailsService.getMeterDetails(meterId).then(function (data) {
        var meterData = data.tag;
        meterData.LAST_POLL_TS = data.sysvar.LAST_POLL_TS;
        meterData.isDead = data.sysvar.isDead;

        if (meterData.MODEL.indexOf('PM2') > -1) {
          processPM2000MeterDetails(meterData);
        } else {
          processGenericMeterDetails(meterData);
        }
        requestPending = false;
      },
      function (error) {
        $log.error(error);
        requestPending = false;
      });
    }

    function processGenericMeterDetails(data) {
        var meterDetails = data;
        var currentTime = new Date();

        $scope.device = {
          MODEL: meterDetails.MODEL,
          SERIAL_NUM: meterDetails.SERIAL,
          NAME: $stateParams.meterName,
          FIRMWARE_ID: meterDetails.FIRMWARE_ID,
          updateTime: moment(currentTime).format('YYYY/MM/DD h:mm:ss a'),
          commError: data.isDead,
          lastUpdated: moment(meterDetails.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
        };

        $scope.settings.meterType = (meterDetails.TYPE === "" || meterDetails.TYPE === "Meter" || meterDetails.TYPE === undefined) ? null : meterDetails.TYPE;

        $scope.details = {
          ENERGY_REAL_NET: meterDetails.ENERGY_REAL_NET,
          ENERGY_REAL_1_4: meterDetails.ENERGY_REAL_1_4,
          ENERGY_REAL_2_3: meterDetails.ENERGY_REAL_2_3,
          NET_REACTIVE_LIFETIME: (meterDetails.ENERGY_REACT_Q1 + meterDetails.ENERGY_REACT_Q2) - (meterDetails.ENERGY_REACT_Q3 + meterDetails.ENERGY_REACT_Q4),
          IMPORTED_REACTIVE_LIFETIME: meterDetails.ENERGY_REACT_Q1 + meterDetails.ENERGY_REACT_Q2,
          EXPORTED_REACTIVE_LIFETIME: meterDetails.ENERGY_REACT_Q3 + meterDetails.ENERGY_REACT_Q4,
          NET_APPARENT_LIFETIME: meterDetails.ENERGY_APP_NET,
          IMPORTED_APPARENT_LIFETIME: meterDetails.ENERGY_APP_1_4,
          EXPORTED_APPARENT_LIFETIME: meterDetails.ENERGY_APP_2_3,
          NET_REAL_POWER: meterDetails.POWER_REAL_INST_P,
          NET_REACTIVE_POWER: meterDetails.POWER_REACT_INST_Q,
          NET_APPARENT_POWER: meterDetails.POWER_APP_INST_S,
          POWER_FACTOR: meterDetails.POWER_FACTOR,
          FREQUENCY: meterDetails.FREQUENCY,
          MODEL: meterDetails.MODEL,
          CURRENT_PHASE_A: meterDetails.CURRENT_PHASE_A,
          CURRENT_PHASE_B: meterDetails.CURRENT_PHASE_B,
          CURRENT_PHASE_C: meterDetails.CURRENT_PHASE_C,
          VOLT_PHASE_A_N: meterDetails.VOLT_PHASE_A_N,
          VOLT_PHASE_B_N: meterDetails.VOLT_PHASE_B_N,
          VOLT_PHASE_C_N: meterDetails.VOLT_PHASE_C_N,
          VOLT_PHASE_A_B: meterDetails.VOLT_PHASE_A_B,
          VOLT_PHASE_B_C: meterDetails.VOLT_PHASE_B_C,
          VOLT_PHASE_C_A: meterDetails.VOLT_PHASE_C_A,
          POWER_FCTOR_PHASE_A: meterDetails.POWER_FACTOR_PHASE_A,
          POWER_FCTOR_PHASE_B: meterDetails.POWER_FACTOR_PHASE_B,
          POWER_FCTOR_PHASE_C: meterDetails.POWER_FACTOR_PHASE_C,
          updateTime: moment(currentTime).format('YYYY/MM/DD h:mm:ss a')
        };


        $scope.parameters = {
          // TODO: This value gets passed through the threePhaseLoss filter.
          // Make sure that filter is correct with respect to the values returned
          // from the API.
          SEC_RATIO_CT: meterDetails.SEC_RATIO_SEC_CT,
          RATIO_PRIM_CT: meterDetails.RATIO_PRIM_CT,
          THREE_PHASE_LOSS: meterDetails.THREE_PHASE_LOSS,
          RATIO_PT: meterDetails.RATIO_PT,
          VOLT_SYSTEM: meterDetails.VOLT_SYSTEM
        };
        setSetupComplete();
        $scope.deviceInfo = {
          bus: meterId.split("_")[0],
          address: meterId.split("_").pop(),
          refresh: function () {
            $scope.$parent.refreshDevices();
          },
          type: "meters",
          name: $stateParams.meterName,
          lastUpdated: moment(meterDetails.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
        }
    }

    var dereg = $scope.$on("$destroy", function () {
      if (interval) {
        $interval.cancel(interval);
        requestPending = false;
        dereg();
      }
    });

    function refreshPM2000MeterDetails(data) {
      $scope.meterDetails = data;
      var currentTime = new Date();

      $scope.device = {
        MODEL: data.MODEL,
        NAME: $stateParams.meterName,
        updateTime: moment(currentTime).format('YYYY/MM/DD h:mm:ss a'),
        commError: data.isDead,
        lastUpdated: moment(data.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
      };

      setSetupComplete();
      $scope.deviceInfo = {
        bus: meterId.split("_")[0],
        address: meterId.split("_").pop(),
        refresh: function () {
          $scope.$parent.refreshDevices();
        },
        type: "meters",
        name: $stateParams.meterName,
        lastUpdated: moment($scope.meterDetails.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
      }
    }

    function processPM2000MeterDetails(data) {
        $scope.meterDetails = data;
        var currentTime = new Date();

        $scope.device = {
          MODEL: data.MODEL,
          NAME: $stateParams.meterName,
          updateTime: moment(currentTime).format('YYYY/MM/DD h:mm:ss a'),
          commError: data.isDead,
          lastUpdated: moment(data.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
        };

        $scope.settings.meterType = ($scope.meterDetails.TYPE === "" || $scope.meterDetails.TYPE === "Meter" || $scope.meterDetails.TYPE === undefined) ? null : $scope.meterDetails.TYPE;
        setSetupComplete();
        $scope.deviceInfo = {
          bus: meterId.split("_")[0],
          address: meterId.split("_").pop(),
          refresh: function () {
            $scope.$parent.refreshDevices();
          },
          type: "meters",
          name: $stateParams.meterName,
          lastUpdated: moment($scope.meterDetails.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
        }
    }

  }
  ]);
