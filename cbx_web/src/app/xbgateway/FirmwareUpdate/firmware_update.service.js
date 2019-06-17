"use strict";

//This service is used for saving and retreiveing device configurations
angular.module('conext_gateway.xbgateway').factory('firmwareUpdateService', ['queryService', '$log', '$http', 'startsWith',
  function(queryService, $log, $http, startsWith) {

    var service = {
      setPendingPath: setPendingPath,
      setPendingPaths: setPendingPaths,
      startFirmwareUpdate: startFirmwareUpdate,
      getProgress: getProgress,
      isValidFirmware: isValidFirmware,
      getDevInfo: getDevInfo,
      resetPending: resetPending
    }

    //This function sets the pending flag for the device and also sets
    //the filename of the firmware which has been uploaded
    function setPendingPath(deviceType, deviceID, filename) {
      var sysVars = [];
      var sysVar = {};
      sysVar["[" + deviceID + "]/" + deviceType + "/XB/FW_PROG_REQUEST"] = 1;
      sysVars.push(sysVar);

      return queryService.setSysvars(sysVars);
    }

    //Resets the pending flags of the devices to 0
    function resetPending(deviceType, deviceIDs) {
      var sysVars = []
      for (var index = 0; index < deviceIDs.length; index++) {
        var sysVar = {};
        sysVar["[" + deviceIDs[index] + "]/" + deviceType + "/XB/FW_PROG_REQUEST"] = 0;
        sysVars.push(sysVar);
      }
      return queryService.setSysvars(sysVars);
    }

    //Set the pending flag and filename for multiple devices
    function setPendingPaths(deviceType, filename) {
      var sysVars = []
      var sysVar = {};
      return getDevicesByType(deviceType).then(function(deviceIDs) {
        for (var index = 0; index < deviceIDs.length; index++) {
          sysVar["[" + deviceIDs[index] + "]/" + deviceType + "/XB/FW_PROG_REQUEST"] = 1;
        }
        sysVars.push(sysVar);
        return queryService.setSysvars(sysVars);
      });
    }

    //Get all devices of a specific type
    function getDevicesByType(deviceType) {
      var sysVars = ["DEVLIST"];
      var deviceIDs = [];
      return queryService.getSysvars(sysVars).then(function(data) {
        for (var index = 0; index < data.DEVLIST.length; index++) {
          if (data.DEVLIST[index].name === deviceType && data.DEVLIST[index].isActive === "true") {
            deviceIDs.push(data.DEVLIST[index].instance);
          }
        }
        return deviceIDs;
      });
    }

    //This function is used to start the firmware upgrade process
    //on the conext_gateway
    function startFirmwareUpdate(deviceType, deviceID) {
      var sysVars = [];
      var sysVar = {};
      sysVar["/SCB/DEVICES/FW_PROG_START"] = 1;
      sysVars.push(sysVar);

      return queryService.setSysvars(sysVars);
    }

    //This function is used to retreice the progress of the firmware
    //upgrade
    function getProgress(deviceType, deviceID) {
      var sysVars = [];
      sysVars.push("/SCB/DEVICES/FW_PROG_START");
      sysVars.push("/SCB/DEVICES/FW_PROG_PERCENT");
      sysVars.push("/SCB/DEVICES/FW_PROG_STATUS");
      sysVars.push("/SCB/DEVICES/FW_PROG_DEV_INFO");
      return queryService.getSysvars(sysVars);
    }

    //This function gets the current dev info which is used to detemine if the
    //device is in the process of being updated
    function getDevInfo(deviceType, deviceID) {
      return queryService.getSysvars(["/SCB/DEVICES/FW_PROG_START", "/SCB/DEVICES/FW_PROG_DEV_INFO", "/SCB/DEVICES/FW_PROG_STATUS", "[" + deviceID + "]/" + deviceType + "/XB/FW_PROG_FILE_NAME"]);
    }

    //This function check to see if the firmware is valid based on its
    //name.  Firmware filename must end with the proper suffix, must contain valid
    //characters and start with the FGA of the device
    function isValidFirmware(filename, fga) {
      // Firmware files may end with these suffixes
      var suffixes = [/\.xf1$/, /\.xf0$/];
      var isValid = false;

      suffixes.forEach(function(suffix) {
        isValid = isValid || suffix.test(filename);
      });

      // Check for valid characters in file name
      var regex = /^[a-zA-Z0-9-\._]+$/;

      if (isValid) {
        isValid = regex.test(filename);
      }

      if (isValid) {
        isValid = startsWith(filename, fga);
      }

      return isValid;
    }

    return service;
  }
]);
