
"use strict";

angular.module('conext_gateway.utilities').factory('paginationService', ['$filter', '$translate', '$log', '$q', 'csvService', 'moment', '$rootScope', 'TIME_LOCAL_FORMAT',
  function($filter, $translate, $log, $q, csvService, moment, $rootScope, TIME_LOCAL_FORMAT) {
    var paginationService = function() {
      var itemsPerPage = 25;
      var items;
      var filteredItems;
      var filter;
      var sort_column = 'timestamp';
      var sort_ascending = false;
      var currentPageNumber = 1;

      var service = {
        addItems: addItems,
        saveCsv: saveCsv,

        changePage: changePage,
        setItemsPerPage: setItemsPerPage,
        applyFilter: applyFilter,
        getLength: getLength,
        getItemsPerPage: getItemsPerPage,
        sortItems: sortItems,
        getStrings: getStrings,
      };

      // filename:
      //   Name to give the downloaded file
      //
      // headerTranslationKeys:
      //   List of translation keys to use as the header row in the CSV
      function saveCsv(filename, headerTranslationKeys) {
        $translate(headerTranslationKeys).then(function(stringForKey) {
          var headers = headerTranslationKeys.map(function(translationKey) {
            return stringForKey[translationKey];
          });
          var sortedItems = filteredItems;
          var output = [];
          angular.forEach(sortedItems, function(value, key) {
            var temp = [];
            temp[0] = value.event_type;
            if (value.timestamp === 4294967295) {
              temp[1] = $filter('translate')('xanbus.timestamp.unavailable');
            } else {
              temp[1] = moment.tz(value.timestamp * 1000, $rootScope.TIMEZONE).format(TIME_LOCAL_FORMAT + " ZZ");
            }
            temp[2] = value.device_type;
            temp[3] = value.device_id;
            temp[4] = value.id;
            temp[5] = value.name;
            temp[6] = value.description;
            output.push(temp);
          });
          csvService.saveCsv(filename, output, {
            header: headers,
          });
        });
      }

      function getItemsPerPage() {
        return itemsPerPage;
      }

      function getLength() {
        return filteredItems.length;
      }

      function applyFilter(newFilter) {
        filter = newFilter;
        if (filter === "All") {
          filteredItems = items;
        } else {
          filteredItems = $filter('filter')(items, {
            "deviceType": filter
          });
        }
      }

      function sortItems(column, ascending) {
        sort_column = column;
        sort_ascending = ascending;
        filteredItems = $filter('orderBy')(items, [sort_column], !sort_ascending, (sort_column === 'timestamp') ? dateComparator : null);
        return changePage(currentPageNumber);
      }

      function dateComparator(v1, v2) {

        if (items[v1.index].timestamp === 4294967295 || items[v2.index].timestamp === 4294967295) {
          return (items[v1.index].timestamp === items[v2.index].timestamp) ? 0 : ((items[v1.index].timestamp === 4294967295) ? -1 : 1);
        } else {
          return (items[v1.index].timestamp === items[v2.index].timestamp) ? 0 : ((items[v1.index].timestamp > items[v2.index].timestamp) ? 1 : -1);
        }
      }

      function addItems(values) {
        items = values;
        filteredItems = $filter('orderBy')(items, [sort_column], !sort_ascending, (sort_column === 'timestamp') ? dateComparator : null);
      }

      function changePage(pageNumber) {
        currentPageNumber = pageNumber;
        var lowerBounds = (pageNumber - 1) * itemsPerPage;
        var upperBounds = lowerBounds + itemsPerPage;
        return filteredItems.slice(lowerBounds, upperBounds);
      }

      function setItemsPerPage(numberOfItems) {
        itemsPerPage = numberOfItems;
      }

      function getStrings() {
        var translationKeys = [
          'events.pagination.previous',
          'events.pagination.next',
          'events.pagination.first',
          'events.pagination.last',
        ];
        return $translate(translationKeys).then(function(stringForKey) {
          return {
            previous: stringForKey['events.pagination.previous'],
            next: stringForKey['events.pagination.next'],
            first: stringForKey['events.pagination.first'],
            last: stringForKey['events.pagination.last'],
          };
        }).catch(function(error) {
          $log.error("Could not do translation");
          $log.error(error);
          return $q.reject(error);
        });
      }

      return service;
    };
    return paginationService;
  }
]);
