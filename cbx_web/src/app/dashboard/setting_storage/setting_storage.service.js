"use strict";

//This service is used for retreive the energy chart data
angular.module('conext_gateway.dashboard').factory('settingStorageService', [
  function() {
    var energyComparisonSettings = {
      interval: "1",
      chart_type: "bar",
      series1: "0",
      series2: "1",
      series3: "2",
      series4: "3",
      series1Date: null,
      series2Date: null,
    };

    var batteryComparisonSettings = {
      date: null,
      type: "1"
    };

    var batterySummarySettings = {
      date: null,
      type: "1"
    };

    var energySettings = {
      interval: "5"
    };

    var performanceSettings = {

    };

    var service = {
      getEnergyComparisonSettings: getEnergyComparisonSettings,
      getBatteryComparisonSettings: getBatteryComparisonSettings,
      getBatterySummarySettings: getBatterySummarySettings,
      getEnergySettings: getEnergySettings,
      getPerformanceSettings: getPerformanceSettings
    };

    function getPerformanceSettings(deviceId) {
      if(!performanceSettings[deviceId]) {
        performanceSettings[deviceId] = {
          type: "bar",
          interval: "1",
          date: null
        };
      }
      return performanceSettings[deviceId];
    }

    function getEnergyComparisonSettings() {
      return energyComparisonSettings;
    }

    function getBatteryComparisonSettings() {
      return batteryComparisonSettings;
    }

    function getBatterySummarySettings() {
      return batterySummarySettings;
    }

    function getEnergySettings() {
      return energySettings;
    }


    return service;
  }
]);
