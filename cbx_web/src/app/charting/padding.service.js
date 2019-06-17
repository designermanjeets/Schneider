"use strict";

//This service is used to fill in the missing labels when there is gaps in the
//chart data
angular.module('conext_gateway.charting').factory('paddingService', ['moment',
  function(moment) {

    var service = {
      getEndingLabels: endingLabels,
      getMissingLabels: getMissingLabels,
      getMissingMinuteLabels: getMissingMinuteLabels
    };

    //Function to pad the end of the chart data
    function endingLabels(previousLabel) {
      var intervalType = getIntervalType(previousLabel);
      //2018 is not a valid data string so this conat mkaes the date valid
      if (intervalType === 'years') {
        previousLabel = previousLabel + "-01-01";
      }
      var previousDate = moment(previousLabel);
      var labels = [];
      var endingDate = getEndingDate(intervalType, previousLabel);

      previousDate = incrementDate(previousDate, intervalType);
      while (!previousDate.isSame(endingDate)) {
        labels.push(dateAsString(previousDate, intervalType));
        previousDate = incrementDate(previousDate, intervalType);
      }

      return labels;
    }

    //this function returns the ending date for the series of data
    function getEndingDate(intervalType, date) {
      var endingDate = moment(date);
      switch (intervalType) {
        case 'years':
          endingDate = endingDate.add(1, 'y');
          break;
        case 'months':
          endingDate = endingDate.add(1, 'y');
          endingDate.month(0);
          break;
        case 'days':
          endingDate = endingDate.add(1, 'M');
          endingDate.date(1);
          break;
        case 'hours':
          endingDate = endingDate.add(1, 'd');
          endingDate.hour(0);
          endingDate.minute(0);
          endingDate.second(0);
          break;
        default:
      }
      return endingDate;
    }

    //This function returns the first date object of the series
    function getStartingDate(intervalType, date) {
      var startingDate = moment(date);
      switch (intervalType) {
        case 'years':
          startingDate = startingDate.subtract(1, 'y');
          break;
        case 'months':
          startingDate.month(0);
          startingDate = startingDate.subtract(1, 'M');
          break;
        case 'days':
          startingDate.date(1);
          startingDate = startingDate.subtract(1, 'd');
          break;
        case 'hours':
          startingDate.hour(0);
          startingDate.minute(0);
          startingDate.second(0);
          startingDate = startingDate.subtract(1, 'h');
          break;
        case 'minutes':
          startingDate.hour(0);
          startingDate.minute(0);
          startingDate.second(0);
          startingDate = startingDate.subtract(1, 'm');
          break;
        default:
      }
      return startingDate;
    }

    //This function takes the previousdate and the currentDate and returns
    //the missing labels
    function getMissingLabels(previousLabel, currentLabel) {
      var previousDate;
      var intervalType = getIntervalType(currentLabel);
      if (intervalType === 'years') {
        if (previousLabel) {
          previousLabel = previousLabel + "-01-01";
        }
        currentLabel = currentLabel + "-01-01";
      }
      var currentDate = moment(currentLabel);
      var labels = [];

      if (previousLabel) {
        previousDate = moment(previousLabel);
      } else {
        previousDate = getStartingDate(intervalType, currentLabel);
      }

      previousDate = incrementDate(previousDate, intervalType);
      while (!previousDate.isSame(currentDate)) {
        labels.push(dateAsString(previousDate, intervalType));
        previousDate = incrementDate(previousDate, intervalType);
      }

      return labels;
    }

    //This function is used to pad the empty dates at the begining of there
    //data and in the middle for minute data graphs such as battery summary
    //and batery comparision
    function getMissingMinuteLabels(previousLabel, currentLabel) {
      var previousDate;
      var intervalType = 'minutes';
      var currentDate = moment(currentLabel);
      var labels = [];

      if (previousLabel) {
        previousDate = moment(previousLabel);
      } else {
        previousDate = getStartingDate(intervalType, currentLabel);
      }

      previousDate = incrementDate(previousDate, intervalType);
      while (!previousDate.isSame(currentDate)) {
        labels.push(dateAsString(previousDate, intervalType));
        previousDate = incrementDate(previousDate, intervalType);
      }

      return labels;
    }

    //formats the date object to match the same format as the chart data csv
    function dateAsString(date, intervalType) {
      var stringDate = '';
      switch (intervalType) {
        case 'years':
          stringDate = date.format("YYYY");
          break;
        case 'months':
          stringDate = date.format("YYYY-MM");
          break;
        case 'days':
          stringDate = date.format("YYYY-MM-DD");
          break;
        case 'hours':
          stringDate = date.format("YYYY-MM-DD HH:mm:ss");
          break;
        case 'minutes':
          stringDate = date.format("YYYY-MM-DD HH:mm:ss");
          break;
        default:
      }
      return stringDate;
    }

    //Function used to increment the date by one interval
    function incrementDate(date, intervalType) {
      var newDate;
      switch (intervalType) {
        case 'years':
          newDate = date.add(1, 'y');
          break;
        case 'months':
          newDate = date.add(1, 'M');
          break;
        case 'days':
          newDate = date.add(1, 'd');
          break;
        case 'hours':
          newDate = date.add(1, 'h');
          break;
        case 'minutes':
          newDate = date.add(1, 'm');
          break;
        default:
      }
      return newDate;
    }

    //Function used to determine what type of interval the cahrt data represents
    // examples 2018, 2018-01, 2018-01-01, 2018-01-01 12:15:12
    function getIntervalType(previousDate) {
      var intervalType = 'years';
      var dashes = previousDate.split('-');
      if (dashes.length === 2) {
        intervalType = 'months';
      } else if (dashes.length === 3) {
        intervalType = 'days';
        if (previousDate.split(':').length > 1) {
          intervalType = 'hours';
        }
      }
      return intervalType;
    }

    return service;
  }
]);
