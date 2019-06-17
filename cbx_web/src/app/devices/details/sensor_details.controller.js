"use strict";

angular.module('conext_gateway.devices').controller("SensorDetailsController",
  ["$scope", "$stateParams", "deviceNameParserService", "sensorDetailsService",
  "moment", "$log", "$interval", "formSuccessMessageService", "temperatureService",
  "$translate",
  function ($scope, $stateParams, deviceNameParserService, sensorDetailsService,
    moment, $log, $interval, formSuccessMessageService, temperatureService,
    $translate) {
    $scope.forms = {};
    $scope.successMessage = {};
    $scope.device = {};
    $scope.device.NAME = $stateParams.sensorName;
    var requestPending = false;
    var sensorId = $stateParams.sensorId;
    //var sensorInfo = deviceNameParserService.parseDeviceName($stateParams.sensorName);

    getSensorDetails();

    var interval = $interval(function () {
      if (!requestPending) {
        requestPending = true;
        refreshSensorDetails();
      }
    }, 60000);

    $scope.apply = function () {

      var isOneMeasurementTypeChecked = false;
      for (var measurementType in $scope.device.measurementTypes) {
        if ($scope.device.measurementTypes[measurementType] === true) {
          isOneMeasurementTypeChecked = true;
        }
      }
      $scope.forms.sensorSettings.$setValidity('choose-measurement-type', isOneMeasurementTypeChecked);
      $scope.forms.sensorSettings.$setValidity('request-failed', true);


      if ($scope.forms.sensorSettings.$valid) {
        sensorDetailsService.saveDeviceSettings(sensorId, $scope.device.measurementTypes).then(function () {
          formSuccessMessageService.show($scope, "sensorSettings");
          $scope.$parent.refreshDevices();
        },
        function (error) {
          $log.error(error);
          $scope.forms.sensorSettings.$setValidity('request-failed', false);
        });
      }
    };

    $scope.reset = function () {
      sensorDetailsService.getSensorDetails(sensorId).then(function(data) {
        $scope.forms.sensorSettings.$rollbackViewValue();
        $scope.forms.sensorSettings.$setPristine();
        $scope.forms.sensorSettings.$setValidity('choose-measurement-type', true);
        $scope.forms.sensorSettings.$setValidity('request-failed', true);
        $scope.device.measurementTypes = getMeasurementTypes(data.sysvar.SUBTYPE);
      });
    }

    function refreshSensorDetails() {
      requestPending = true;
      sensorDetailsService
        .getSensorDetails(sensorId)
        .then(function (data) {

          var sensorData = data.sysvar;

          var currentTime = new Date();
          var updateTime = moment(currentTime).format('YYYY/MM/DD h:mm:ss a')

          setDevice(sensorData, updateTime);
          setDetails(sensorData, updateTime);
          $scope.deviceInfo = {
            bus: sensorId.split("_")[0],
            address: sensorId.split("_").pop(),
            refresh: function () {
              $scope.$parent.refreshDevices();
            },
            type: "sensors",
            name: $stateParams.sensorName,
            lastUpdated: moment(data.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
          }
          requestPending = false;
        },
      function (error) {
        $log.error(error);
        requestPending = false;
      });
    }

    function getSensorDetails() {
      requestPending = true;
      sensorDetailsService.getSensorDetails(sensorId).then(function (data) {
        var sensorDetails = data.sysvar;
        $scope.IMTSOLAR = data.PRODUCT_NAME === 'IMTSOLAR';
        var currentTime = new Date();
        var updateTime = moment(currentTime).format('YYYY/MM/DD h:mm:ss a')

        $scope.device = {};
        setDevice(data, updateTime);

        // Only set these on initial load, not subsequent updates
        //
        // // Refers to one of the values in $scope.sensorTypes
        $scope.device.sensorType = 1;
        // Measurement types that this pysical device provides
        $scope.device.measurementTypes = getMeasurementTypes(sensorDetails.SUBTYPE);

        $scope.details = {};
        setDetails(data, updateTime);

        $scope.sensorTypes = [
          {
            id: 1,
            //name: "Multi-sensor box", -- name gets filled in later
          },
        ];
        function translateSensorTypes() {
          var stringIds = $scope.sensorTypes.map(function(model) {
            var id = (model.id === null) ? "select" : model.id;
            return "devices.details.sensor_types." + id;
          });
          $translate(stringIds).then(function(sensorTypeForStringId) {
            stringIds.forEach(function(stringId, idx) {
              var sensorType = sensorTypeForStringId[stringId];
              $scope.sensorTypes[idx].name = sensorType;
            });
          });
        }
        translateSensorTypes();

        // TODO: Looks like this is now unused
        $scope.sensorModels = [
          // id needs to be null for form validation to work
          {
            id: null,
            name: "Select",
            canBeIdentifiedAutomatically: false,
          },

          {
            id: "PVMET-200",
            name: "PVMet series (Rainwise, Inc.)",
            canBeIdentifiedAutomatically: true,
          },

          {
            id: "TAMB485",
            name: "Si-RS485 series (IMT Solar)",
            canBeIdentifiedAutomatically: false,
          },
        ];

        setModelCanBeIdentifiedAutomatically();
        $scope.$watch('device.sensorModel', setModelCanBeIdentifiedAutomatically);
        function setModelCanBeIdentifiedAutomatically() {
          $scope.sensorModels.forEach(function (model) {
            if (model.id === $scope.device.sensorModel) {
              $scope.device.modelCanBeIdentifiedAutomatically = model.canBeIdentifiedAutomatically;
            }
          });
        }
        $scope.deviceInfo = {
          bus: sensorId.split("_")[0],
          address: sensorId.split("_").pop(),
          refresh: function () {
            $scope.$parent.refreshDevices();
          },
          type: "sensors",
          name: $stateParams.sensorName,
          lastUpdated: moment(sensorDetails.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
        }
        requestPending = false;
      },
      function (error) {
        $log.error(error);
        requestPending = false;
      });
    }

    function setDevice(data, updateTime) {
      var updatedData = {
        MODEL: data.C_MODEL,
        SERIAL_NUM: data.C_SERNUM,
        NAME: $stateParams.sensorName,
        FIRMWARE_ID: data.C_VER,
        updateTime: updateTime,
        commError: data.isDead,
        sensorModel: null,
        lastUpdated: moment(data.LAST_POLL_TS).format('YYYY/MM/DD h:mm:ss a')
      };

      angular.extend($scope.device, updatedData);
    }

    function setDetails(data, updateTime) {
      $scope.details = {
        // TODO: When it comes to the device overview table, the back-end has
        // already mapped the correct sysvars to the values. It would be
        // better to re-use the values from that query.

        // Irradiance
        // The PVMET-200 has two physical irradiance sensors, so it has
        // two irradiance sysvars. The SIRS485 only has one physical irradiance
        // sensorr, so it has one sysvar. It's the user's responsibility to
        // configure the SIRS485 correctly to tell us if it's GH-I or POA.
        ghiIrradiance: getValue(data,
          ['E_IRRADIANCE_GLOBAL_HORIZONTAL_1', 'IRR']),
        poaIrradiance: getValue(data,
          ['E_IRRADIANCE_PLANE_OF_ARRAY_1', 'IRR']),

        windSpeed: getValue(data,
          ['E_BASEMET_WIND_SPEED', 'WIND_SPEED']),

        // pvmet200:
        // air_temp = ambient temperature
        // bom_temp = module

        // 485:
        // temp_ext = ambient
        // temp_cell = module

        ambientTemperature: getValue(data,
          ['E_BASEMET_AIR_TEMP', 'TEMP_EXT']),
        moduleTemperature: getValue(data,
          ['E_BOM_TEMP_1', 'TEMP_CELL']),
        temperatureUnits: data.HMI_TEMPERATURE_UNIT,

        // TODO: At some point, these will be returned from a query as part of the tag.
        // When that happens, assign them from the data object.
        operatingState: undefined,
        updateTime: updateTime,
      };

      $scope.details.ambientTemperature = temperatureService.convert(
        $scope.details.temperatureUnits,
        $scope.details.ambientTemperature
        );
      $scope.details.moduleTemperature = temperatureService.convert(
        $scope.details.temperatureUnits,
        $scope.details.moduleTemperature
        );

    }

    // The sysvars for the different sensor types are wildly different.
    // So iterate through all the possible sysvar names and find one
    // that this object has.
    function getValue(object, keyList) {
      for (var keyIdx = 0; keyIdx < keyList.length; keyIdx++) {
        var key = keyList[keyIdx];
        if (angular.isDefined(object[key])) {
          return object[key];
        }
      }

      // It's not an error for the object to not have any of the keys
      // in keyList. That's how the back end tells us that the
      // sensor can't provide this data.
      return undefined;
    }

    function getMeasurementTypes(data) {
      var result = {
        'ghi': false,
        'poa': false,
        'wind': false,
        'tamb': false,
        'tmod': false,
      }

      if (data !== undefined) {
        if (data.indexOf('POA-I-Sensor') !== -1) {
          result.poa = true;
        }
        if (data.indexOf('Tmod-Sensor') !== -1) {
          result.tmod = true;
        }
        if (data.indexOf('Tamb-Sensor') !== -1) {
          result.tamb = true;
        }
        if (data.indexOf('Wind-Sensor') !== -1) {
          result.wind = true;
        }
        if (data.indexOf('GH-I-Sensor') !== -1) {
          result.ghi = true;
        }
      }

      return result;
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
