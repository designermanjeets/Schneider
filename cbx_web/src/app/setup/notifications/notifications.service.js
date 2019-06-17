"use strict";

angular.module('conext_gateway.setup').factory('notificationsService', ["$q", "$http",
  function ($q, $http) {
    var service = {
      saveEmails: saveEmails,
      saveNotificationSetup: saveNotificationSetup,
      getEmails: getEmails,
      getNotificationSetup: getNotificationSetup,
      getInverterCodes: getInverterCodes,
      getMeterCodes: getMeterCodes,
      getSystemCodes: getSystemCodes
    }
    return service;

    function saveEmails() {
      return $q.resolve();
    }

    function saveNotificationSetup() {
      return $q.resolve();
    }

    function getEmails() {
      return $q.resolve({
        address1: "",
        address2: "",
        address3: "",
        address4: "",
        address5: ""
      });
    }

    function getNotificationSetup() {
      return $q.resolve({
        inverter_codes: "",
        inverter_occurances: "",
        meter_codes: "",
        meter_occurances: "",
        system_codes: "",
        system_occurances: ""
      });
    }

    function getInverterCodes() {
      return $http.get("/app/setup/notifications/inverter_codes.json");
    }

    function getMeterCodes() {
      return $http.get("/app/setup/notifications/inverter_codes.json");
    }

    function getSystemCodes() {
      return $http.get("/app/setup/notifications/inverter_codes.json");
    }
  }
]);
