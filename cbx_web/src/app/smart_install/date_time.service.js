"use strict";

// Service that's used for the SmartInstall plant setup screen
// and the quick setup pane of the setup screen
angular.module('conext_gateway.smart_install').factory('dateTimeService',
  ['$log', '$q', 'csbQuery', 'smartInstallService', 'timezoneService', 'moment',
  'MAX_AC_CAPACITY_KW', 'TIME_LOCAL_FORMAT',
  function($log, $q, csbQuery, smartInstallService, timezoneService, moment,
    MAX_AC_CAPACITY_KW, TIME_LOCAL_FORMAT) {

    return {
      getTimeConfig: getTimeConfig,
      setTimeConfig: setTimeConfig,
    };

    function getTimeConfig() {
      return $q.all({
        timezoneList: timezoneService.getTimezoneList(),
        config: csbQuery
          .getObj("SNTP/ON,TIMEZONE,TIME/LOCAL_ISO_STR,SNTP.SERVER_NAME,MBSYS/INSTALLED_AC.CAPACITY,MBSYS/PLANT_INSTALLED.YEAR"),
      }).then(function(data) {
        return {
          plant_setup: {
            timeSource: parseInt(data.config.SNTP_ON) !== 0 ? "sntpNetwork" : "device",
            // Louise says TIMEZONE sysvar will always have a valid value
            timezone: data.config.TIMEZONE,
            sntpServerName: data.config.SNTP_SERVER_NAME,
            dateTime: moment(data.config.TIME_LOCAL_ISO_STR, TIME_LOCAL_FORMAT).toDate(),

            // Not a time config, but better to grab it here than make a whole other
            // query just for it.
            acCapacity: data.config.MBSYS_INSTALLED_AC_CAPACITY.toFixed(1),
            installedYear: data.config.MBSYS_PLANT_INSTALLED_YEAR
          },

          timezoneList: data.timezoneList,

        };
      }).catch(function(error) {
        $log.error(error);
      });
    }

    function setTimeConfig(config) {
      var requestObject = {};
      var ordering = [];

      requestObject["TIMEZONE"] = config.timezone;
      ordering.push("TIMEZONE");

      if (config.timeSource === "device") {
        var dateTimeString = formatDateTimeForSet(config.dateTime);

        // The sysvar for setting the time is different than
        // the sysvar for getting the time.
        requestObject["TIME/LOCAL_STR"] = dateTimeString;
        // SNTP.ON needs to come after TIME.LOCAL_STR
        // requestObject["SNTP/ON"] = 0;
        requestObject["SNTP/APPLY"] = 1;

        ordering.push("TIME/LOCAL_STR");
        // ordering.push("SNTP/ON");
        ordering.push("SNTP/APPLY");
      }
      else if (config.timeSource === "sntpNetwork") {
        requestObject["SNTP/SERVER_NAME"] = config.sntpServerName;
        requestObject["SNTP/ON"] = 1;
        requestObject["SNTP/APPLY"] = 1;

        ordering.push("SNTP/SERVER_NAME");
        ordering.push("SNTP/ON");
        ordering.push("SNTP/APPLY");
      }
      else {
        $log.error("Unknown time source: " + config.timeSource);
        return $q.reject("Unknown time source: " + config.timeSource);
      }

      if (config.acCapacity) {
        requestObject["MBSYS/INSTALLED_AC/CAPACITY"] = config.acCapacity;
        ordering.push("MBSYS/INSTALLED_AC/CAPACITY");
      }

      if (config.installedYear) {
        requestObject["MBSYS/PLANT_INSTALLED.YEAR"] = config.installedYear;
        ordering.push("MBSYS/PLANT_INSTALLED.YEAR");
      }

      return csbQuery.setFromObject(requestObject, true, ordering);
    }

    function formatDateTimeForSet(time) {
      //var FORMAT_FOR_GET = TIME_LOCAL_FORMAT;
      var FORMAT_FOR_SET = "YYYYMMDDHHmm.ss";

      return moment(time).format(FORMAT_FOR_SET);
    }
  }
])
