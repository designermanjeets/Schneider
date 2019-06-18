"use strict";

angular.module('conext_gateway.setup').controller("configurationController", ["$scope", "$log", "FileUploader", "formSuccessMessageService",
  "gatewayConfigurationServiceProvider", "rebootService", "dateTimeService",
  "timezoneService", "moment", "TIME_LOCAL_FORMAT", "$timeout",
  "MAX_AC_CAPACITY_KW", "MAX_SNTP_SERVER_NAME_LEN", "$q", "$interval",
  "$filter", "$translate", "sntpTestService", "$uibModal",
  function($scope, $log, FileUploader, formSuccessMessageService,
    gatewayConfigurationServiceProvider, rebootService, dateTimeService,
    timezoneService, moment, TIME_LOCAL_FORMAT, $timeout,
    MAX_AC_CAPACITY_KW, MAX_SNTP_SERVER_NAME_LEN, $q, $interval,
    $filter, $translate, sntpTestService, $uibModal) {

    var requestPending = false;
    var interval;
    var interval_import;

    $q.all({
      configData: gatewayConfigurationServiceProvider.getConfigurationData(),
      timezones: timezoneService.getTimezoneList()
    }).then(function(values) {
      initUpdateFirmware(values.configData);
      initPlantSetup(values.configData);
      initUnits(values.configData);
      initModbus(values.configData);
      initQuickSetup(values.configData, values.timezones);
    });

    $scope.errorMessage = {};
    $scope.forms = {};
    $scope.successMessage = {};
    $scope.status = {
      processingQuickSetup: false
    }
    $scope.MAX_AC_CAPACITY_KW = MAX_AC_CAPACITY_KW;
    $scope.MAX_SNTP_SERVER_NAME_LEN = MAX_SNTP_SERVER_NAME_LEN;

    /////////////////////////////////////////////////////////////////////////////
    //
    // File upload
    function initUpdateFirmware(data) {
      $scope.updateFirmware.SW_VER = data.install_package.SW_VER;
      $scope.updateFirmware.SW_BUILD_NUMBER = data.install_package.SW_BUILD_NUMBER;
      $scope.updateFirmware.REMOTEUPGRADE_ENABLE = data.install_package.REMOTEUPGRADE_ENABLE;
      $scope.updateFirmware.REMOTEUPGRADE_DISCLAIMER = data.install_package.REMOTEUPGRADE_DISCLAIMER;
      $scope.updateFirmware.SCB_SSI_ALLOWPKG = data.install_package.SCB_SSI_ALLOWPKG;
    }

    $scope.applyAutomaticUpdate = function() {
      if ($scope.errorMessage.plantSetup) {
        delete $scope.errorMessage.plantSetup;
      }

      saveIfValid('updateFirmware', {
        REMOTEUPGRADE_ENABLE: $scope.updateFirmware.REMOTEUPGRADE_ENABLE
      });
    }

    $scope.resetAutomaticUpdate = function() {
      reset('updateFirmware');
    }

    $scope.updateFirmware = {
      uploader: new FileUploader({
        url: '/upload',
        autoUpload: true,
        removeAfterUpload: true,
        queueLimit: 1,
        filters: [{
          name: 'firmware',
          fn: function(item) {
            if ($scope.updateFirmware.SCB_SSI_ALLOWPKG) {
              return gatewayConfigurationServiceProvider.isPkgFilenameValid(item.name) || gatewayConfigurationServiceProvider.isEPkgFilenameValid(item.name);
            } else {
              return gatewayConfigurationServiceProvider.isEPkgFilenameValid(item.name);
            }
          }
        }]
      }),

      // states: ready, uploading, processing, needs-reboot, error
      state: 'ready',
      filename: null,
      errorMessage: null,

      cancelUpload: cancelFirmwareUpload,
    };

    $scope.configImport = {
      uploader: new FileUploader({
        url: '/upload',
        autoUpload: true,
        removeAfterUpload: true,
        queueLimit: 1,
        filters: [{
          name: 'firmware',
          fn: function(item) {
            if (item.name.length < 16) {
              return false;
            }
            var containsName = item.name.indexOf("usersettings") > -1;
            var hasExtension = item.name.substring(item.name.length - 4, item.name.length) === ".zip";
            return containsName && hasExtension;
          }
        }]
      }),

      // states: ready, uploading, processing, needs-reboot, error
      state: 'ready',
      filename: null,
      errorMessage: null,

      cancelUpload: cancelConfigUpload,
    };

    $scope.updateFirmware.uploader.onWhenAddingFileFailed = function(item, filter, options) {
      $scope.updateFirmware.state = 'error';
      $scope.updateFirmware.errorMessage = $filter('translate')("setup.configuration.invalid_file");
    }

    $scope.configImport.uploader.onWhenAddingFileFailed = function(item, filter, options) {
      $scope.configImport.filename = item.name;
      $scope.configImport.state = 'error';
      $scope.configImport.errorMessage = $filter('translate')("setup.configuration.invalid_import_file");
    }

    $scope.updateFirmware.uploader.onBeforeUploadItem = function(item) {
      $scope.updateFirmware.filename = item.file.name;
      $scope.updateFirmware.state = 'uploading';
      $scope.updateFirmware.errorMessage = null;
    }

    $scope.configImport.uploader.onBeforeUploadItem = function(item) {
      $scope.configImport.filename = item.file.name;
      item.file.name = "usersettings.zip";
      $scope.configImport.errorMessage = null;
      $scope.configImport.state = 'processing';
    }

    $scope.updateFirmware.uploader.onSuccessItem = function(item, response, status, headers) {
      // The /upload API may return 200 OK even if the upload failed. So we still have to
      // check for errors, even though this is the success handler.
      checkFirmwareUpdateFinishedState().then(function(data) {
        if (data.status === 'error') {
          $scope.updateFirmware.state = 'error';
          $scope.updateFirmware.errorMessage = $filter('translate')(data.message);
          // see commends in onProgressItem
          if (interval) {
            $interval.cancel(interval);
            interval = null;
            requestPending = false;
          }
        }
      });
    };

    $scope.configImport.uploader.onSuccessItem = function(item, response, status, headers) {
      if (interval_import) {
        $interval.cancel(interval_import);
        interval_import = null;
        requestPending = false;
      }

      checkConfigImportUpdateFinishedState().then(function(data) {
        if (data.status === 'error') {
          $scope.configImport.state = 'error';
          $scope.configImport.errorMessage = $filter('translate')(data.message);
        } else {
          $scope.configImport.state = 'needs-reboot';
        }
      });
    }

    $scope.updateFirmware.uploader.onCancelItem = function(item, response, status, headers) {
      if (interval) {
        $interval.cancel(interval);
        interval = null;
        requestPending = false;
      }
      $scope.updateFirmware.state = 'ready';
    }

    $scope.configImport.uploader.onCancelItem = function(item, response, status, headers) {
      $scope.configImport.state = 'ready';
    }

    $scope.updateFirmware.uploader.onErrorItem = function(item, response, status, headers) {
      if (interval) {
        $interval.cancel(interval);
        interval = null;
        requestPending = false;
      }
      $scope.updateFirmware.state = 'error';

      checkFirmwareUpdateFinishedState().then(function(result) {
        if (result.status === 'error') {
          $scope.updateFirmware.errorMessage = $filter('translate')(result.message);
        } else {
          $scope.updateFirmware.errorMessage = $filter('translate')("setup.configuration.upload_failed");
        }
      }, function() {
        $scope.updateFirmware.errorMessage = $filter('translate')("setup.configuration.upload_failed");
      });
    }

    $scope.configImport.uploader.onErrorItem = function(item, response, status, headers) {
      $timeout(function() {
        $scope.configImport.state = 'error';
        $scope.configImport.errorMessage = $filter('translate')("setup.configuration.import_failed");
      }, 1000);
    }

    $scope.updateFirmware.uploader.onProgressItem = function(item, progress) {
      // Lighttpd causes a long delay between 100% progress and the success event.
      // The processing step gives the user reassurance that we're not hung.
      if (progress === 100 && $scope.updateFirmware.state !== 'processing') {

        gatewayConfigurationServiceProvider.resetUploadState().then(function() {
          checkFirmwareUpdateState().then(function() {
            $scope.updateFirmware.state = 'processing';
            if (!interval) {
              interval = $interval(function() {
                if (!requestPending) {
                  checkFirmwareUpdateState();
                }
              }, 5000);
            }
          }, function() {
            $scope.updateFirmware.state = 'processing';
          });
        });


      }
    }

    function checkIfUpdateIsInProgress() {
      gatewayConfigurationServiceProvider.getUploadState().then(function(data) {
        if (data.SCB_FIRMWARE_UPLOAD_PROGRESS === 'eNotStarted') {
          $scope.updateFirmware.state = "ready";
        } else {
          checkFirmwareUpdateState().then(function() {
            $scope.updateFirmware.state = 'processing';
            if (!interval) {
              interval = $interval(function() {
                if (!requestPending) {
                  checkFirmwareUpdateState();
                }
              }, 5000);
            }
          }, function() {
            $scope.updateFirmware.state = 'processing';
          });
        }
      });
    }


    /*========================================================================*/
    //fn  checkFirmwareUpdateState
    /*!

    Check the firmware update processing state

    @return  message - Firmware update state messages

    */
    /*
        REVISION HISTORY:

        Version: 1.01  Date: 19-Jan-2018   By: Eddie Leung
          - Changed SysVar name
        */
    /*========================================================================*/
    function checkFirmwareUpdateState() {

      requestPending = true;
      var message = '';
      return gatewayConfigurationServiceProvider.getUploadState().then(function(data) {
          if (data.SCB_FIRMWARE_UPLOAD_PROGRESS === 'eExtracting') {
            message = "setup.configuration.extracting";
          } else if (data.SCB_FIRMWARE_UPLOAD_PROGRESS === 'eCopying') {
            message = "setup.configuration.copying";
          } else if (data.SCB_FIRMWARE_UPLOAD_PROGRESS === 'eVerifyingPackage') {
            message = "setup.configuration.validating";
          } else if (data.SCB_FIRMWARE_UPLOAD_PROGRESS === 'eDone') {
            if (interval) {
              $interval.cancel(interval);
              interval = null;
              requestPending = false;
            }
            $scope.updateFirmware.state = 'needs-reboot';
            message = 'setup.configuration.upload_successful';
          } else if (data.SCB_FIRMWARE_UPLOAD_PROGRESS === 'eExtractionFailed') {
            if (interval) {
              $interval.cancel(interval);
              interval = null;
              requestPending = false;
            }
            message = "setup.configuration.extracting_failed";
            $scope.updateFirmware.state = "error";
          } else {
            message = "setup.configuration.processing";
          }

          var toSet = $scope.updateFirmware.state === "error" ? 'errorMessage' : 'processing_message';
          $scope.updateFirmware[toSet] = $filter('translate')(message);

          requestPending = false;
          return message;
        },
        function(error) {
          $scope.updateFirmware.processing_message = $filter('translate')("setup.configuration.processing");
          requestPending = false;
          return $scope.updateFirmware.processing_message;
        });
    }

    /*========================================================================*/
    //fn  checkFirmwareUpdateFinishedState
    /*!

    Check the firmware update processing state

    @return  result - Success/Error status and an error message.

    */
    /*
        REVISION HISTORY:

        Version: 1.01  Date: 17-Jan-2018   By: Eddie Leung
          - Changed SysVar name
        */
    /*========================================================================*/
    function checkFirmwareUpdateFinishedState() {
      var result = {
        status: 'success',
        message: ''
      };

      return gatewayConfigurationServiceProvider.getUploadState().then(function(data) {
          if (data.SCB_FIRMWARE_UPLOAD_PROGRESS === 'eExtractionFailed') {
            result.message = "setup.configuration.extracting_failed";
            result.status = "error";
          } else if (data.SCB_FIRMWARE_UPLOAD_PROGRESS === 'eDone') {
            result.message = "setup.configuration.upload_successful";
          } else if (data.SCB_FIRMWARE_UPLOAD_PROGRESS === 'eCopying') {
            result.message = "setup.configuration.copying";
          } else if (data.SCB_FIRMWARE_UPLOAD_PROGRESS === 'eVerifyingPackage') {
            result.message = "setup.configuration.validating";
          } else if (data.SCB_FIRMWARE_UPLOAD_PROGRESS === 'eExtracting') {
            result.message = "setup.configuration.extracting";
          } else {
            result.message = "setup.configuration.upload_failed";
            result.status = "error";
          }
          return result;
        },
        function(error) {
          result.status = "error";
          result.message = "setup.configuration.upload_failed";
          return result;
        });
    }

    /*========================================================================*/
    //fn  checkConfigImportUpdateFinishedState
    /*!

    Check the firmware update processing state

    @return  result - Success/Error status and an error message.

    */
    /*
        REVISION HISTORY:

        Version: 1.01  Date: 17-Jan-2018   By: Eddie Leung
          - Changed SysVar name
        */
    /*========================================================================*/
    function checkConfigImportUpdateFinishedState() {
      var result = {
        status: 'success',
        message: ''
      };

      return gatewayConfigurationServiceProvider.getConfigImportUploadState().then(function(data) {
          if (data.SCB_SETTINGS_UPLOAD_PROGRESS === 'eBadMD5') {
            result.message = "setup.configuration.import_failed";
            result.status = "error";
          } else if (data.SCB_SETTINGS_UPLOAD_PROGRESS === 'eExtractionFailed') {
            result.message = "setup.configuration.import_failed";
            result.status = "error";
          } else if (data.SCB_SETTINGS_UPLOAD_PROGRESS === 'eDecryptionFailed') {
            result.message = "setup.configuration.import_failed";
            result.status = "error";
          } else if (data.SCB_SETTINGS_UPLOAD_PROGRESS === 'eCopyFailed') {
            result.message = "setup.configuration.import_failed";
            result.status = "error";
          } else if (data.SCB_SETTINGS_UPLOAD_PROGRESS === 'eDone') {
            result.message = "setup.configuration.upload_successful";
          } else {
            result.message = "setup.configuration.import_failed";
            result.status = "error";
          }
          return result;
        },
        function(error) {
          result.status = "error";
          result.message = "setup.configuration.import_failed";
          return result;
        });

    }


    var dereg = $scope.$on('$destroy', function() {
      if (interval) {
        $interval.cancel(interval);
        interval = null;
        requestPending = false;
      }

      if (interval_import) {
        $interval.cancel(interval_import);
        interval_import = null;
        requestPending = false;
      }

      dereg();
    });

    function cancelFirmwareUpload() {
      if (interval) {
        $interval.cancel(interval);
        interval = null;
        requestPending = false;
      }
      $scope.updateFirmware.uploader.cancelAll();
    }

    function cancelConfigUpload() {
      $scope.configImport.uploader.cancelAll();
    }

    /////////////////////////////////////////////////////////////////////////////
    //
    // Reboot

    $scope.reboot = {
      reboot: rebootService.reboot,
      resetConfiguration: rebootService.resetConfiguration,
      resetToFactory: rebootService.resetToFactory,
      shutdown: rebootService.shutdown
    };

    /////////////////////////////////////////////////////////////////////////////
    //
    // Quick setup

    function initQuickSetup(data, timezones) {
      $scope.quick_setup = {
        isCalendarOpen: false,
        timezoneList: timezones,
        errorMessage: null,
        timeSource: parseInt(data.quick_settings.SNTP_ON) !== 0 ? "sntpNetwork" : "device",
        // Louise says TIMEZONE sysvar will always have a valid value
        timezone: data.quick_settings.TIMEZONE,
        sntpServerName: data.quick_settings.SNTP_SERVER_NAME,
        dateTime: moment(data.quick_settings.TIME_LOCAL_ISO_STR, TIME_LOCAL_FORMAT).toDate(),
      };

      var translationKeys = [
        'performance.date-picker.buttons.today',
        'performance.date-picker.buttons.now',
        'performance.date-picker.buttons.date',
        'performance.date-picker.buttons.time',
        'performance.date-picker.buttons.done',
      ];
      $translate(translationKeys).then(function(stringForKey) {
        $scope.quick_setup.text = {
          today: stringForKey['performance.date-picker.buttons.today'],
          now: stringForKey['performance.date-picker.buttons.now'],
          date: stringForKey['performance.date-picker.buttons.date'],
          time: stringForKey['performance.date-picker.buttons.time'],
          close: stringForKey['performance.date-picker.buttons.done'],
        }
      }).catch(function(error) {
        $log.error("Could not load translations");
        $log.error(error);
      });
    }

    $scope.openCalendar = function() {
      $scope.quick_setup.isCalendarOpen = true;
    };

    $scope.applyQuickSetup = function() {
      if ($scope.errorMessage.quickSetup) {
        delete $scope.errorMessage.quickSetup;
      }
      if ($scope.forms.quickSetup.$valid) {
        $scope.status.processingQuickSetup = true;
        dateTimeService
          .setTimeConfig($scope.quick_setup)
          .then(function() {
              if ($scope.quick_setup.timeSource === 'device') {
                $scope.status.processingQuickSetup = false;
                $scope.forms.quickSetup.$setPristine();
                formSuccessMessageService.show($scope, 'quickSetup');
                $timeout(function() {
                  $scope.$emit('layout.updateClock');
                }, 1000);
              } else {
                sntpTestService.testSNTP($scope, function(status) {
                  if (status === 'Success') {
                    $scope.status.processingQuickSetup = false;
                    $scope.forms.quickSetup.$setPristine();
                    formSuccessMessageService.show($scope, 'quickSetup');
                    $timeout(function() {
                      $scope.$emit('layout.updateClock');
                    }, 1000);
                  } else {
                    $scope.status.processingQuickSetup = false;
                    $scope.errorMessage.quickSetup = $filter('translate')('setup.configuration.sntp_failed');
                  }
                });
              }
            },
            function() {
              $scope.status.processingQuickSetup = false;
              $scope.errorMessage.quickSetup = $filter('translate')('setup.configuration.sntp_failed');
            });
      }
    }

    $scope.removeQuickSetupFormMessage = function() {
      $scope.successMessage.quickSetup = false;
    }

    $scope.resetQuickSetup = function() {
      if ($scope.errorMessage.quickSetup) {
        delete $scope.errorMessage.quickSetup;
      }
      $q.all({
        configData: gatewayConfigurationServiceProvider.getConfigurationData(),
        timezones: timezoneService.getTimezoneList()
      }).then(function(values) {
        initQuickSetup(values.configData, values.timezones);
        $scope.forms['quickSetup'].$rollbackViewValue();
        $scope.forms['quickSetup'].$setPristine();
      });

    };


    /////////////////////////////////////////////////////////////////////////////
    //
    // Plant setup
    function initPlantSetup(data) {
      $scope.plantSetup = {
        inverterType: data.plant_setup.MBSYS_INSTALLED_INVERTER_TYPE,
        // back end uses 0 to mean not set; we use null
        acCapacity: (data.plant_setup.MBSYS_INSTALLED_AC_CAPACITY !== 0) ? data.plant_setup.MBSYS_INSTALLED_AC_CAPACITY : null,
        installedYear: (data.plant_setup.MBSYS_PLANT_INSTALLED_YEAR !== 0) ? data.plant_setup.MBSYS_PLANT_INSTALLED_YEAR : null,
        friendly_name: data.plant_setup.FRIENDLYNAME,
        inverterTypes: ['Inverter-CL'],
        currentYear: new Date().getFullYear(),
      };
    }

    $scope.applyPlantSetup = function() {
      // all validation is handled by the html
      if ($scope.errorMessage.plantSetup) {
        delete $scope.errorMessage.plantSetup;
      }

      saveIfValid('plantSetup', {
        MBSYS_INSTALLED_INVERTER_TYPE: $scope.plantSetup.inverterType,
        MBSYS_INSTALLED_AC_CAPACITY: $scope.plantSetup.acCapacity,
        MBSYS_PLANT_INSTALLED_YEAR: $scope.plantSetup.installedYear,
        FRIENDLYNAME: $scope.plantSetup.friendly_name
      }).then(function() {
        $scope.$emit('layout.updateClock');
      })
    }

    $scope.resetPlantSetup = function() {
      reset('plantSetup');
    }

    /////////////////////////////////////////////////////////////////////////////
    //
    // Units
    function initUnits(data) {
      $scope.units = {
        irradiance: data.units.HMI_IRRADIANCE_UNIT,
        temperature: data.units.HMI_TEMPERATURE_UNIT,
        wind: data.units.HMI_WINDSPEED_UNIT,
      }
    }

    $scope.applyUnits = function() {
      // as long as only control is a select box, this form cannot be invalid
      if ($scope.errorMessage.units) {
        delete $scope.errorMessage.units;
      }

      saveIfValid('units', {
        HMI_IRRADIANCE_UNIT: $scope.units.irradiance,
        HMI_TEMPERATURE_UNIT: $scope.units.temperature,
        HMI_WINDSPEED_UNIT: $scope.units.wind,
      }).then(function() {
        $scope.$emit('layout.updateClock');
      });
    }

    $scope.resetUnits = function() {
      reset('units');
    }

    /////////////////////////////////////////////////////////////////////////////
    //
    // Modbus
    function initModbus(data) {
      $scope.modbus = {
        portA: {
          baudRate: data.modbus_settings.SCB_BUS1_BAUDRATE,
          parity: data.modbus_settings.SCB_BUS1_PARITY.toLowerCase(),
          stopBits: data.modbus_settings.SCB_BUS1_STOPBITS
        },
        portB: {
          baudRate: data.modbus_settings.SCB_BUS2_BAUDRATE,
          parity: data.modbus_settings.SCB_BUS2_PARITY.toLowerCase(),
          stopBits: data.modbus_settings.SCB_BUS2_STOPBITS
        },
        baudRates: [9600, 19200, 38400, 57600, 115200],
        parities: ["none", "even", "odd"],
        availableStopBits: [1, 2],

      }
    }

    $scope.applyModbus = function() {
      if ($scope.errorMessage.modbus) {
        delete $scope.errorMessage.modbus;
      }
      saveIfValid('modbus', {
        _SCB_BUS1_BAUDRATE: $scope.modbus.portA.baudRate,
        _SCB_BUS1_PARITY: $scope.modbus.portA.parity,
        _SCB_BUS1_STOPBITS: $scope.modbus.portA.stopBits,
        _SCB_BUS1_APPLY: 1,
        _SCB_BUS2_BAUDRATE: $scope.modbus.portB.baudRate,
        _SCB_BUS2_PARITY: $scope.modbus.portB.parity,
        _SCB_BUS2_STOPBITS: $scope.modbus.portB.stopBits,
        _SCB_BUS2_APPLY: 1
      });
    }

    $scope.resetModbus = function() {
      reset('modbus');
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // Save (and success message)
    function saveIfValid(formName, data) {
      if ($scope.errorMessage[formName]) {
        delete $scope.errorMessage[formName];
      }
      if ($scope.forms[formName].$valid) {
        return gatewayConfigurationServiceProvider
          .saveConfigurationTab(data)
          .then(function() {
              $scope.forms[formName].$setPristine();
              formSuccessMessageService.show($scope, formName);
            },
            function() {
              $scope.errorMessage[formName] = $filter('translate')('setup.configuration.save_failed');
            });
      } else {
        $q.reject("");
      }

    }

    // Reset one panel back to default values.
    function reset(formName) {
      if ($scope.errorMessage[formName]) {
        delete $scope.errorMessage[formName];
      }
      var initFunction = {
        plantSetup: initPlantSetup,
        units: initUnits,
        modbus: initModbus,
        updateFirmware: initUpdateFirmware,
      }[formName];
      if (!angular.isDefined(initFunction)) {
        $log.error("Unknown form " + formName);
        initFunction = angular.noop;
      }

      // Need to re-get saved data, because the data
      // in the scope might be bad. This happens when you
      // submit invalid data, then click cancel.
      gatewayConfigurationServiceProvider
        .getConfigurationData()
        .then(function(data) {
          initFunction(data);
          $scope.forms[formName].$rollbackViewValue();
          $scope.forms[formName].$setPristine();
        });
    }


  }
]);
