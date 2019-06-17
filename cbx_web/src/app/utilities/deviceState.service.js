"use strict";

angular.module('conext_gateway.utilities').factory('deviceStateSevice', [
  function() {

    return {
      getState: getState,
      getDeviceState: getDeviceState
    };

    //function to get the sysvars fo the date object
    function getState(device) {
      if (device.isActive === "false") {
        return 'xanbus.xbdevlist.offline';
      } else if (device.attributes.interface === "xanbus" && device.isUpgrading === "true") {
        return 'xanbus.xbdevlist.upgrading_firmware';
      } else if (device.attributes.interface === "xanbus" && device.attributes.inBootloader === "1") {
        return 'xanbus.xbdevlist.boot_loader';
      } else if (device.attributes.interface === "xanbus" && device.attributes.opMode !== "Operating") {
        return 'xanbus.xbdevlist.standby';
      }

      return "Online";
    }

    function getDeviceState(data) {
      if (data.hasOwnProperty('ZREG_ISONLINE')) {
        return data.ZREG_ISONLINE === 0 ? 'xanbus.xbdevlist.offline' : "Online";
      }

      if (data.DEV_ACTIVE !== 1) {
        return 'xanbus.xbdevlist.offline';
      } else if (data.hasOwnProperty('XB_FW_PROG_START') && data.XB_FW_PROG_START !== 0) {
        return 'xanbus.xbdevlist.upgrading_firmware';
      } else if (data.hasOwnProperty('DEV_BOOTLOADER') && data.DEV_BOOTLOADER === 1) {
        return 'xanbus.xbdevlist.boot_loader';
      } else if (data.hasOwnProperty('DEV_CFG_OPMODE') && data.DEV_CFG_OPMODE === 2) {
        return 'xanbus.xbdevlist.standby';
      }

      return "Online";
    }

  }
]);
