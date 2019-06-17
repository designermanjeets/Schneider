"use strict";

angular.module('conext_gateway.utilities').factory('dateDataService',
  ['queryService',
  function (queryService) {

    return {
      getDateData: getDateData
    };

    //function to get the sysvars fo the date object
    function getDateData() {
      var query = [
        'TIME/LOCAL_ISO_STR',
        'TIMEZONE',
        'MBSYS/PLANT_INSTALLED/YEAR',
      ];
      return queryService.getSysvars(query);
    }

  }]
);
