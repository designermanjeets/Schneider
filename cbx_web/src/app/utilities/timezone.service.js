"use strict";

angular.module('conext_gateway.utilities').factory('timezoneService',
  ['$log', '$http', '$q', '$translate', 'moment', 'TIME_LOCAL_FORMAT',
  function ($log, $http, $q, $translate, moment, TIME_LOCAL_FORMAT) {
    return {
      getTimezoneList: getTimezoneList,
      getUtcOffsetString: getUtcOffsetString,
      getTimezoneOffsetString: getTimezoneOffsetString,
      browserDateObjToConextGatewayMoment: browserDateObjToConextGatewayMoment,
      translationKeyForTimezoneId: translationKeyForTimezoneId,
      getDateParameters: getDateParameters
    };

    // UTC offset: Positive values are east of UTC, negative values are west.
    function getUtcOffsetString(conext_gatewayTime, conext_gatewayTimezone) {
      var utcOffset = moment.tz(conext_gatewayTime, TIME_LOCAL_FORMAT, conext_gatewayTimezone).utcOffset();
      var d       = moment.duration(utcOffset, 'minutes');
      var hours   = Math.abs(d.hours()).toString();
      var minutes = Math.abs(d.minutes()).toString();

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      var sign = (utcOffset >= 0) ? "+" : "-";
      return sign + hours + minutes;
    }

    // timezone offset: Opposite of UTC offset.
    // Positive values are *west* of UTC, negative values are *east*.
    function getTimezoneOffsetString(conext_gatewayTime, conext_gatewayTimezone) {
      var utcOffsetString = getUtcOffsetString(conext_gatewayTime, conext_gatewayTimezone);
      if (utcOffsetString === "+0000") {
        // If UTC, keep the sign as-is
        return utcOffsetString;
      }

      // Switch the leading plus to minus and vice versa
      return utcOffsetString.replace(/^./, function(match) {
        switch (match) {
          case '+': return '-';
          case '-': return '+';
          default:
            $log.error("getTimezoneOffsetString: UTC string started with: " + match);
            return;
        }
      })
    }

    function getTimezoneList() {
      return $http.get('app/utilities/timezone.json')
        .then(function(data) {
          var timezoneIds = data.data.map(function(timezone) { return timezone.id; });
          var translationKeys = timezoneIds.map(translationKeyForTimezoneId);
          return $q.all({
            ids: timezoneIds,
            translationKeys: translationKeys,
            labels: $translate(translationKeys),
          });
        }).then(function(data) {
          var list = [];

          data.ids.forEach(function(id, idx) {
            var translationKey = data.translationKeys[idx];
            list.push({
              id: id,
              label: data.labels[translationKey],
            });
          });

          return list;
        }).catch(function(error) {
          $log.error(error);
          return $q.reject();
        })
    }

    function translationKeyForTimezoneId(timezoneId) {
      if (angular.isDefined(timezoneId)) {
        return "utilities.timezones." + timezoneId;
      }
      else {
        return undefined;
      }
    }

    function browserDateObjToConextGatewayMoment(dateObj, timezone) {
      var conext_gatewayTime = moment.tz({
        year: dateObj.getFullYear(),
        month: dateObj.getMonth(),
        date: dateObj.getDate(),
      }, timezone);

      return conext_gatewayTime;
    }

    function getDateParameters(sysvars) {

      var dateParameters = sysvars;
      var installedYear;
      // TODO: This should really get refactored out into a utility function
      if (dateParameters.MBSYS_PLANT_INSTALLED_YEAR === 0 || dateParameters.MBSYS_PLANT_INSTALLED_YEAR === null) {
        installedYear = 2000;
      }
      else {
        installedYear = dateParameters.MBSYS_PLANT_INSTALLED_YEAR;
      }

      // The date picker control wants min and max in the browser's time zone
      var minMoment = moment
        .tz(installedYear, 'YYYY', dateParameters.TIMEZONE)
        .startOf('year');
      var minDate = new Date(minMoment.year(), minMoment.month(), minMoment.date());

      // TODO: make a unit test where it's today in brower time and tomorrow in
      // conext_gateway time. Make sure maxDate is for tomorrow.
      var maxMoment = moment
        .tz(sysvars.TIME_LOCAL_ISO_STR, TIME_LOCAL_FORMAT, dateParameters.TIMEZONE);
      var maxDate = new Date(maxMoment.year(), maxMoment.month(), maxMoment.date());

      return {
        // initial value for the date
        date: maxDate,
        timezone: dateParameters.TIMEZONE,

        minDate: minDate,
        maxDate: maxDate,

        conext_gatewayTime: dateParameters.TIME_LOCAL_ISO_STR,

        // Return the unmodified installedYear, so that the
        // setInstalledYearMessage directive can know whether or not to show.
        installedYear: dateParameters.MBSYS_PLANT_INSTALLED_YEAR,
      };
    }
  }]
);
