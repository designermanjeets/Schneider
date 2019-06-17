
"use strict";

angular.module('conext_gateway.events').controller("activeController", [
  "$scope", "faultWarningService", '$filter', '$rootScope', 'moment', 'TIME_LOCAL_FORMAT', 'paginationService',
  function($scope, faultWarningService, $filter, $rootScope, moment, TIME_LOCAL_FORMAT, paginationService) {
    var pagination = new paginationService();
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    pagination.setItemsPerPage(10);
    $scope.itemsPerPage = pagination.getItemsPerPage();
    pagination.getStrings().then(function(strings) {
      $scope.strings = strings;
    });
    $scope.sorting = {
      "event_type": {
        'active': false,
        "ascending": false,
        "class": 'glyphicon-triangle-bottom'
      },
      "timestamp": {
        'active': true,
        "ascending": false,
        "class": 'glyphicon-triangle-bottom'
      },
      "device_type": {
        'active': false,
        "ascending": false,
        "class": 'glyphicon-triangle-bottom'
      },
      "device_id": {
        'active': false,
        "ascending": false,
        "class": 'glyphicon-triangle-bottom'
      },
      "id": {
        'active': false,
        "ascending": false,
        "class": 'glyphicon-triangle-bottom'
      },
      "name": {
        'active': false,
        "ascending": false,
        "class": 'glyphicon-triangle-bottom'
      },
      "description": {
        'active': false,
        "ascending": false,
        "class": 'glyphicon-triangle-bottom'
      }
    };


    $scope.sortItems = function(column) {
      if ($scope.sorting[column].active) {
        $scope.sorting[column].ascending = !$scope.sorting[column].ascending;
        $scope.info = {
          'EVT_LOG': pagination.sortItems(column, $scope.sorting[column].ascending)
        };
        $scope.sorting[column].class = getClass(column);
      } else {
        for (var item in $scope.sorting) {
          if ($scope.sorting.hasOwnProperty(item)) {
            $scope.sorting[item].active = false;
            $scope.sorting[item].ascending = false;
            $scope.sorting[item].class = 'glyphicon-triangle-bottom';
          }
        }
        $scope.sorting[column].active = true;
        $scope.info = {
          'EVT_LOG': pagination.sortItems(column, $scope.sorting[column].ascending)
        };
      }
    };

    function getClass(column) {
      return $scope.sorting[column].ascending ? 'glyphicon-triangle-top' : 'glyphicon-triangle-bottom';
    }

    $scope.pageChanged = function() {
      $scope.info = {
        'EVT_LOG': pagination.changePage($scope.currentPage)
      };
    };

    $scope.time = function(timestamp) {
      if (timestamp === 4294967295) {
        return $filter('translate')('xanbus.timestamp.unavailable');
      }

      var timestr = moment.tz(timestamp * 1000, $rootScope.TIMEZONE).format(TIME_LOCAL_FORMAT + " ZZ");

      return timestr;
    };

    $scope.getCSV = function() {
      var filename = "active.csv";
      pagination.saveCsv(filename, [
        'xanbus.evtlog.event_type',
        'xanbus.evtlog.timestamp',
        'xanbus.evtlog.device_type',
        'xanbus.evtlog.device_id',
        'xanbus.evtlog.id',
        'xanbus.evtlog.name',
        'xanbus.evtlog.description'
      ]);
    };

    faultWarningService.getActiveFaults().then(function(data) {
      var events = [];
      for (var field in data) {
        var info = field.split('_');
        if (data.hasOwnProperty(field) && field !== 'META') {
          for (var index = 0; index < data[field].length; index++) {
            data[field][index].device_id = info[0];
            data[field][index].device_type = info[1];
            data[field][index].event_type = (info[2] === "FLT") ? "Fault" : "Warning";
            events.push(data[field][index]);
          }
        }
      }
      pagination.addItems(events);
      $scope.totalItems = pagination.getLength();
      $scope.info = {
        'EVT_LOG': pagination.changePage(1)
      };
    });
  }
]);
