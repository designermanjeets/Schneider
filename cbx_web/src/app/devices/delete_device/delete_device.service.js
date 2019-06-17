"use strict";

angular.module('conext_gateway.devices').factory('deleteDeviceService', [
  'csbQuery', '$uibModal',
  function (csbQuery, $uibModal) {

    var service = {
      deleteDevice: deleteDevice,
      startDeletion: startDeletion
    };
    return service;

    function startDeletion(deviceInfo) {
      $uibModal.open({
        templateUrl: 'app/devices/delete_device/delete_device_modal.html',
        controller: 'DeleteDeviceModalController',
        resolve: {
          deviceInfo: deviceInfo
        },
        backdrop: 'static',
        keyboard: false
      });
    }

    function deleteDevice(bus, address) {
      var queryObject = {};
      var ordering = [];

      queryObject["/BUS" + bus + "/REMOVE_DEV/ADDR"] = address;
      queryObject["/BUS" + bus + "/REMOVE_DEV/APPLY"] = 1;

      ordering.push("/BUS" + bus + "/REMOVE_DEV/ADDR");
      ordering.push("/BUS" + bus + "/REMOVE_DEV/APPLY");

      return csbQuery.setFromObject(queryObject, false, ordering);
    }
  }
]);
