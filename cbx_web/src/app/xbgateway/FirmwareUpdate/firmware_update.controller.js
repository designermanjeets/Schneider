"use strict";

//This controller's purpose is to upgrade the firmware for a single device
angular.module('conext_gateway.xbgateway').controller("firmwareUpdateController", [
  "$scope", "FileUploader", "$stateParams", "firmwareUpdateService", "$interval", "$filter", "endsWith",
  function($scope, FileUploader, $stateParams, firmwareUpdateService, $interval, $filter, endsWith) {
    var interval;
    var requestPending = false;
    $scope.upgrade_info = {};
    $scope.deviceType = $stateParams.device;
    $scope.upgrade_all = false;

    //information regarding the firmware upgrade
    $scope.info = {
      filename: "",
      // states: '', ready, upgrading, error, success
      state: '',
      errorMessage: null,
      failedDevices: [],
      upgrade_pending: false
    }

    //File uploader for single firmware upgrade
    $scope.updateFirmware = {
      uploader: new FileUploader({
        url: '/upload',
        autoUpload: true,
        removeAfterUpload: true,
        queueLimit: 1,
        filters: [{
          name: 'firmware',
          fn: function(item) {
            return firmwareUpdateService.isValidFirmware(item.name, $scope.devinfo.LPHD_FGA);
          }
        }]
      })
    };

    //File upload for upgrade all device of the same family
    $scope.updateAllFirmware = {
      uploader: new FileUploader({
        url: '/upload',
        autoUpload: true,
        removeAfterUpload: true,
        queueLimit: 1,
        filters: [{
          name: 'firmware',
          fn: function(item) {
            return firmwareUpdateService.isValidFirmware(item.name, $scope.devinfo.LPHD_FGA);
          }
        }]
      })
    };

    checkIfUpgradeInProgess();

    //Checks to see if a firmware is in progress for the specific device being viewed.  IF the
    //firmware upgrade is in prgress then it is displayed
    function checkIfUpgradeInProgess() {
      $scope.info.filename = "";
      firmwareUpdateService.getDevInfo($stateParams.device, $stateParams.id).then(function(data) {
        fillMissingDevinfo(data);
        if (data.SCB_DEVICES_FW_PROG_START === 1) {
          $scope.info.upgrade_pending = true;
        }

        if (data.SCB_DEVICES_FW_PROG_STATUS === 'IN_PROGRESS') {
          if (isDeviceUpgrading(data.SCB_DEVICES_FW_PROG_DEV_INFO, $stateParams.id)) {
            $scope.info.filename = data[$stateParams.device + "_XB_FW_PROG_FILE_NAME"];
          }
          $scope.info.upgrade_pending = true;
          pollUpgradeStatus();
        } else if (data.SCB_DEVICES_FW_PROG_START !== 1) {
          $scope.info.state = 'ready';
          $scope.info.upgrade_pending = false;
        }
      });
    }

    //Check if the current device is the one being upgraded or pending to be upgraded
    function isDeviceUpgrading(devices, deviceId) {
      var found = false;
      var index = 0;
      for (index = 0; index < devices['1'].length; index++) {
        if (devices['1'][index].UID === deviceId) {
          found = true;
        }
      }
      for (index = 0; index < devices['2'].length; index++) {
        if (devices['2'][index].UID === deviceId) {
          found = true;
        }
      }
      return found;
    }

    function fillMissingDevinfo(devinfo) {
      if (!devinfo.SCB_DEVICES_FW_PROG_DEV_INFO['1']) {
        devinfo.SCB_DEVICES_FW_PROG_DEV_INFO['1'] = [];
      }
      if (!devinfo.SCB_DEVICES_FW_PROG_DEV_INFO['2']) {
        devinfo.SCB_DEVICES_FW_PROG_DEV_INFO['2'] = [];
      }
    }

    //Callback for when adding the file fails,  the reason for this is the file filename
    //is not a valid format
    $scope.updateFirmware.uploader.onWhenAddingFileFailed = function(item, filter, options) {
      $scope.info.filename = item.name;
      $scope.info.state = 'error';
      $scope.info.errorMessage = $filter('translate')("xanbus.firmware_update.invalid_firmware");
    };

    $scope.updateAllFirmware.uploader.onWhenAddingFileFailed = $scope.updateFirmware.uploader.onWhenAddingFileFailed;

    //Callback before the file is uploaded to the server.  Upgrade progress is set
    //to zero incase an old value is present
    $scope.updateFirmware.uploader.onBeforeUploadItem = function(item) {
      $scope.info.failedDevices = [];
      $scope.info.filename = item.file.name;
      $scope.info.state = 'upgrading';
      $scope.info.errorMessage = null;
      if ($scope.upgrade_info.SCB_DEVICES_FW_PROG_PERCENT) {
        $scope.upgrade_info.SCB_DEVICES_FW_PROG_PERCENT = 0;
      }
    };

    $scope.updateAllFirmware.uploader.onBeforeUploadItem = $scope.updateFirmware.uploader.onBeforeUploadItem;

    //Callback for when the file is uploaded to the server.  If the file is uploaded,
    //the firmware name is set for the device and the upgrade is started.  Once started,
    //the progress of the upgrade is polled
    $scope.updateFirmware.uploader.onSuccessItem = function(item, response, status, headers) {
      firmwareUpdateService.setPendingPath($stateParams.device, $stateParams.id, item.file.name).then(function() {
        firmwareUpdateService.startFirmwareUpdate($stateParams.device, $stateParams.id).then(function() {
            $scope.info.upgrade_pending = true;
            pollUpgradeStatus();
          },
          function(error) {
            $scope.info.state = 'error';
            $scope.info.errorMessage = $filter('translate')("xanbus.firmware_update.failed_to_start");
          });
      }, function(error) {
        $scope.info.state = 'error';
        $scope.info.errorMessage = $filter('translate')("xanbus.firmware_update.upload_failed");
      });
    };

    //Callback for when the file is uploaded to the server.  attempts to set the pending flag and filename sysvar for
    //all the devices in the same family and then starts the upgrade process
    $scope.updateAllFirmware.uploader.onSuccessItem = function(item, response, status, headers) {
      firmwareUpdateService.setPendingPaths($stateParams.device, item.file.name).then(function() {
        firmwareUpdateService.startFirmwareUpdate($stateParams.device, $stateParams.id).then(function() {
            $scope.info.upgrade_pending = true;
            pollUpgradeStatus();
          },
          function(error) {
            $scope.info.state = 'error';
            $scope.info.errorMessage = $filter('translate')("xanbus.firmware_update.failed_to_start");
          });
      }, function(error) {
        //make a list of all the devices which failed do to invalid firmware version
        $scope.info.failedDevices = [];
        for (var index = 0; index < error.data.values.length; index++) {
          if (endsWith(error.data.values[index].name, "FW_PROG_FILE_NAME") && error.data.values[index].result === 2) {
            var values = error.data.values[index].name.split("/");
            $scope.info.failedDevices.push(values[0].substring(1, values[0].length - 1));
          }
        }
        //remove the pending flag on the devices which failed to set the filename
        firmwareUpdateService.resetPending($stateParams.device, $scope.info.failedDevices).then(function() {
          firmwareUpdateService.startFirmwareUpdate($stateParams.device, $stateParams.id).then(function() {
              $scope.info.upgrade_pending = true;
              pollUpgradeStatus();
            },
            function(error) {
              $scope.info.state = 'error';
              $scope.info.errorMessage = $filter('translate')("xanbus.firmware_update.upload_failed");
            });
        })
      });
    }

    //Callback for when the firmware fails to be uploaded to the server
    $scope.updateFirmware.uploader.onErrorItem = function(item, response, status, headers) {
      $scope.info.state = 'error';
      $scope.info.errorMessage = $filter('translate')("xanbus.firmware_update.upload_failed");
    }

    $scope.updateAllFirmware.uploader.onErrorItem = $scope.updateFirmware.uploader.onErrorItem;

    //Callback for the progress of the firmware upload to the server.  This is ignored
    //in the code because it generally happens quickly and the true progress is represented
    //by the progress from conext_gateway to device
    $scope.updateFirmware.uploader.onProgressItem = function(item, progress) {
      if (progress === 100 && $scope.info.state !== 'upgrading') {
        $scope.info.state = 'upgrading';
      }
    }

    $scope.updateAllFirmware.uploader.onProgressItem = $scope.updateFirmware.uploader.onProgressItem;

    //This function is used to poll the progress of the firmware upgrade from conext_gateway to
    //device and update the UI with the percent.  On completion,  an success or error
    //message will be set
    function pollUpgradeStatus() {
      interval = $interval(function() {
        if (!requestPending) {
          requestPending = true;
          firmwareUpdateService.getProgress($stateParams.device, $stateParams.id).then(function(data) {
              fillMissingDevinfo(data);
              $scope.upgrade_info = data;
              $scope.info.state = 'upgrading';
              if ((data.SCB_DEVICES_FW_PROG_DEV_INFO["1"].length + data.SCB_DEVICES_FW_PROG_DEV_INFO["2"].length) === 1 && $scope.info.failedDevices.length === 0) {
                //Upgradeing on single device
                if (data.SCB_DEVICES_FW_PROG_STATUS !== 'IN_PROGRESS' && data.SCB_DEVICES_FW_PROG_START === 0) {
                  if (data.SCB_DEVICES_FW_PROG_STATUS === 'SUCCESS') {
                    $scope.info.state = 'success';
                    $scope.info.errorMessage = $filter('translate')("xanbus.firmware_update.upgrade_success");
                    $scope.info.upgrade_pending = false;
                  } else {
                    $scope.info.state = 'error';
                    $scope.info.errorMessage = $filter('translate')("xanbus.firmware_update.upgrade_failed");
                    $scope.info.upgrade_pending = false;
                  }
                  $interval.cancel(interval);
                }
              } else {
                //upgrading multiple devices
                if (data.SCB_DEVICES_FW_PROG_STATUS !== 'IN_PROGRESS' && data.SCB_DEVICES_FW_PROG_START === 0) {
                  if (data.SCB_DEVICES_FW_PROG_STATUS === 'SUCCESS') {
                    $scope.info.state = 'success';
                    $scope.info.errorMessage = $filter('translate')("xanbus.firmware_update.upgrade_success");
                    $scope.info.upgrade_pending = false;
                  } else {
                    $scope.info.state = 'error';
                    $scope.info.errorMessage = $filter('translate')("xanbus.firmware_update.upgrade_failed");
                    $scope.info.upgrade_pending = false;
                  }
                  $interval.cancel(interval);
                }
              }
              requestPending = false;
            },
            function(error) {
              $scope.info.state = 'error';
              $scope.info.errorMessage = $filter('translate')("xanbus.firmware_update.upgrade_failed");
              $scope.info.upgrade_pending = false;
              requestPending = false;
              $interval.cancel(interval);
            });
        }
      }, 1000);
    }

    var dereg = $scope.$on("$destroy", function() {
      if (interval) {
        $interval.cancel(interval);
        requestPending = false;
        dereg();
      }
    });

  }
]);
