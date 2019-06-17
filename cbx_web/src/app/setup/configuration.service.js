"use strict";

angular.module('conext_gateway.setup').factory('gatewayConfigurationServiceProvider', [
  'csbQuery', 'queryFormatterService', '$q', '$log', 'queryService',
  function (csbQuery, queryFormatterService, $q, $log, queryService ) {

    var queryVars = {
      quick_settings: ['TIMEZONE', 'SNTP/ON', 'TIME/LOCAL_ISO_STR', 'SNTP/SERVER_NAME', 'SNTP/SERVER_NAME'],
      modbus_settings: ['/SCB/BUS1/BAUDRATE', '/SCB/BUS1/PARITY', '/SCB/BUS1/STOPBITS', '/SCB/BUS1/APPLY', '/SCB/BUS2/BAUDRATE', '/SCB/BUS2/PARITY', '/SCB/BUS2/STOPBITS', '/SCB/BUS2/APPLY'],
      units: ['HMI/IRRADIANCE/UNIT', 'HMI/TEMPERATURE/UNIT', 'HMI/WINDSPEED/UNIT'],
      plant_setup: ['MBSYS/INSTALLED_AC/CAPACITY', 'MBSYS/PLANT_INSTALLED/YEAR', 'MBSYS/INSTALLED_INVERTER/TYPE', 'FRIENDLYNAME'],
      install_package: ['SW_VER', 'SW_BUILD_NUMBER', 'REMOTEUPGRADE/ENABLE', 'REMOTEUPGRADE/DISCLAIMER', '/SCB/SSI/ALLOWPKG'],
    };

    var service = {
      getConfigurationData: getConfigurationData,
      saveConfigurationTab: saveConfigurationTab,
      saveQuickSettings: saveQuickSettings,
      getUploadState: getUploadState,
      getConfigImportUploadState: getConfigImportUploadState,
      isPkgFilenameValid: isPkgFilenameValid,
      isEPkgFilenameValid: isEPkgFilenameValid,
      resetUploadState: resetUploadState,
    };

    return service;

    /*========================================================================*/
    //fn  getUploadState
    /*!

    Get the SysVar value for firmware upload progress status

    @return  state - firmware upload progress status

    *//*
    REVISION HISTORY:

    Version: 1.01  Date: 17-Jan-2018   By: Eddie Leung
      - Changed SysVar name
    */
    /*========================================================================*/
    function getUploadState() {
        return queryService.getSysvars(['/SCB/FIRMWARE/UPLOAD/PROGRESS']);
    }

    /*========================================================================*/
    //fn  getConfigImportUploadState
    /*!

    Get the SysVar value for configuration upload progress status

    @return  state - configuraton upload progress status

    *//*
    REVISION HISTORY:

    Version: 1.01  Date: 17-Jan-2018   By: Eddie Leung
      - Changed SysVar name
    */
    /*========================================================================*/
    function getConfigImportUploadState() {
      return csbQuery.getObj("/SCB/SETTINGS/UPLOAD/PROGRESS");
    }

    /*========================================================================*/
    //fn  resetUploadState
    /*!

    Reset the firmware upload state

    @return  result - Success or failure

    *//*
    REVISION HISTORY:

    Version: 1.01  Date: 18-Jan-2018   By: Eddie Leung
      - Changed SysVar name
    */
    /*========================================================================*/
    function resetUploadState() {

        return queryService.setSysvars( { '/SCB/FIRMWARE/UPLOAD/PROGRESS' : 'eNotStarted' },
                                        { 'apply' : false } );
    }

    function getConfigurationData() {
        return queryService.getSysvars( queryVars ).then(function( data ) {
            return data;
        },
        function(error) {
            $log.error(error);
        });
    }

    function saveConfigurationTab(data) {
      var result = queryFormatterService.createSetQuery(data, queryVars);
      return csbQuery.setFromObject(result, true);
    }

    // TODO: This function appears to be unused
    function saveQuickSettings(data) {
      var requestObject = {};
      var ordering = [];

      requestObject["TIMEZONE"] = data.TIMEZONE;
      ordering.push("TIMEZONE");
      if (data.SNTP_ON === 1) {
        requestObject["SNTP/SERVER_NAME"] = data.SNTP_SERVER_NAME;
        ordering.push("SNTP/SERVER_NAME");
      } else {
        requestObject["TIME/LOCAL_ISO_STR"] = data.TIME_LOCAL_ISO_STR;
        ordering.push("TIME/LOCAL_ISO_STR");
      }
      return csbQuery.setFromObject(requestObject, true, ordering);
    }

    // Check the name of the firmware file being uploaded
    function isEPkgFilenameValid(filename) {
      // Firmware files may end with these suffixes
      var suffixes = [ /\.epkg$/ ];
      var isValid = false;

      suffixes.forEach(function(suffix) {
        isValid = isValid || suffix.test(filename);
      });

      // Check for valid characters in file name
      var regex = /^[a-zA-Z0-9-\._]+$/;

      if (isValid)
      {
        isValid = regex.test(filename);
      }

      return isValid;
    }

    // Check the name of the firmware file being uploaded
    function isPkgFilenameValid(filename) {
      // Firmware files may end with these suffixes
      var suffixes = [ /\.pkg$/ ];
      var isValid = false;

      suffixes.forEach(function(suffix) {
        isValid = isValid || suffix.test(filename);
      });

      // Check for valid characters in file name
      var regex = /^[a-zA-Z0-9-\._]+$/;

      if (isValid)
      {
        isValid = regex.test(filename);
      }

      return isValid;
    }
  }
]);
