"use strict";

angular.module('conext_gateway.charting').factory('chartdataService', ["$http", "$q", "moment",
  function($http, $q, moment) {
    var service = {
      getChartData: getChartData,
      createDateData: createDateData,
      isDisplayable: isDisplayable
    };

    //function for building a query for chart data and returns the data from the query
    function getChartData(device, deviceId, dateData) {

      var queryString = "chartdata/" + device + "/" + deviceId;

      switch (dateData.type) {
        case "years":
          queryString += "/years/";
          break;
        case "months":
          queryString += "/years/" + dateData.year + "/months/";
          break;
        case "days":
          queryString += "/years/" + dateData.year + "/months/" + dateData.month + "/days/";
          break;
        case "minutes":
          queryString += "/years/" + dateData.year + "/months/" + dateData.month + "/days/" + dateData.day + "/minutes";
          break;
        case "hours":
          queryString += "/years/" + dateData.year + "/months/" + dateData.month + "/days/" + dateData.day + "/hours";
          break;
        default:

      }

      return $http.get(queryString).then(function(data) {
        return data.data;
      }, function(error) {
        return $q.reject(error);
      });
    }

    //function which returns on object which is passed to the getChartData function
    function createDateData(date, type) {
      var dateData = {
        type: type
      };

      if (type === "months") {
        dateData.year = date.getFullYear();
      } else if (type === "days") {
        dateData.year = date.getFullYear();
        dateData.month = date.getMonth() + 1;
      } else if (type === "minutes" || type === "hours") {
        dateData.year = date.getFullYear();
        dateData.month = date.getMonth() + 1;
        dateData.day = date.getDate();
      }
      return dateData;
    }

    function isDisplayable(currentDate, lineDate, type) {
      currentDate = moment(currentDate);
      var lineItemDate;
      switch (type) {
        case "years":
          if (currentDate.year() < lineDate) {
            return false;
          }
          break;
        case "hours":
          lineItemDate = moment(lineDate);
          if (currentDate.isSame(lineDate, 'day') &&
            currentDate.isBefore(lineDate)
          ) {
            return false;
          }
          break;
        case "minutes":
          lineItemDate = moment(lineDate);
          if (currentDate.isSame(lineDate, 'day') &&
            currentDate.isBefore(lineDate)
          ) {
            return false;
          }
          break;
        default:
      }
      return true;
    }

    return service;
  }
]);
