"use strict";

//This service is used for retreive the energy chart data
angular.module('conext_gateway.dashboard').factory('energyService', ['queryService', '$q',
  function(queryService, $q) {

    var service = {
      getEnergyData: getEnergyData
    };

    var sysVars = [
      '/SYS/PV_TOTAL/ENERGY_DAY',
      '/SYS/LOAD/ENERGY_DAY',
      '/SYS/GRID_IN/ENERGY_DAY',
      '/SYS/GRID_OUT/ENERGY_DAY',
      '/SYS/GEN/ENERGY_DAY',
      '/SYS/BATT_INV/ENERGY_DAY',
      '/SYS/BATT_CHG/ENERGY_DAY',

      '/SYS/PV_TOTAL/ENERGY_WEEK',
      '/SYS/LOAD/ENERGY_WEEK',
      '/SYS/GRID_IN/ENERGY_WEEK',
      '/SYS/GRID_OUT/ENERGY_WEEK',
      '/SYS/GEN/ENERGY_WEEK',
      '/SYS/BATT_INV/ENERGY_WEEK',
      '/SYS/BATT_CHG/ENERGY_WEEK',


      '/SYS/PV_TOTAL/ENERGY_MONTH',
      '/SYS/LOAD/ENERGY_MONTH',
      '/SYS/GRID_IN/ENERGY_MONTH',
      '/SYS/GRID_OUT/ENERGY_MONTH',
      '/SYS/GEN/ENERGY_MONTH',
      '/SYS/BATT_INV/ENERGY_MONTH',
      '/SYS/BATT_CHG/ENERGY_MONTH',


      '/SYS/PV_TOTAL/ENERGY_YEAR',
      '/SYS/LOAD/ENERGY_YEAR',
      '/SYS/GRID_IN/ENERGY_YEAR',
      '/SYS/GRID_OUT/ENERGY_YEAR',
      '/SYS/GEN/ENERGY_YEAR',
      '/SYS/BATT_INV/ENERGY_YEAR',
      '/SYS/BATT_CHG/ENERGY_YEAR',

      '/SYS/PV_TOTAL/ENERGY_LIFETIME',
      '/SYS/LOAD/ENERGY_LIFETIME',
      '/SYS/GRID_IN/ENERGY_LIFETIME',
      '/SYS/GRID_OUT/ENERGY_LIFETIME',
      '/SYS/GEN/ENERGY_LIFETIME',
      '/SYS/BATT_INV/ENERGY_LIFETIME',
      '/SYS/BATT_CHG/ENERGY_LIFETIME'


    ];

    //function to retreive all the energy data
    function getEnergyData(dateInfo) {
      var defered = $q.defer();
      queryService.getSysvars(sysVars).then(function(data) {
        defered.resolve(data);
      }, function(error) {
        defered.reject();
      });
      return defered.promise;
    }

    return service;
  }
]);
