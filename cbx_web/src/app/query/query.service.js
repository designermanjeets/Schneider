
"use strict";

angular.module('conext_gateway.query').factory('queryService', [
  '$http', '$rootScope', '$log', '$q', 'queryConfigService', '$window', 'redirectService', 'otkService',
  function($http, $rootScope, $log, $q, queryConfigService, $window, redirectService, otkService) {
    return {
      getSysvars: getSysvars,
      getSysvarsByTags: getSysvarsByTags,
      getSysvarsByInstance: getSysvarsByInstance,
      setSysvars: setSysvars,
      runScript: runScript,
      getMatchingSysvars: getMatchingSysvars,
      runSavedQuery: runSavedQuery,

      _createRequestObject: createRequestObject,
      _sysvarSetHasError: sysvarSetHasError,
      _sortRequestObject: sortRequestObject,
      _mangleSysvarName: mangleSysvarName,
    };

    ///////////////////////////////////////////////////////////////////////////
    //
    // getSysvars
    //
    // Query a set of sysvars from the device.
    //
    // queryVars can be in flat or nested form:
    //
    // Flat form:
    //   queryService.getSysvars(['TIMEZONE', 'TIME.LOCAL.ISO_STR'])
    //   Returns: {
    //     TIMEZONE: "...",
    //     TIME_LOCAL_ISO_STR: "...",
    //     META: {
    //       TIMEZONE: "...",
    //       TIME_LOCAL_ISO_STR: "...",
    //     }
    //   }
    //
    // Nested form:
    //   queryService.getSysvars({
    //     modbus_settings: ['SCB.BUS1.BAUDRATE', 'SCB.BUS1.PARITY'],
    //     units: ['HMI.TEMPERATURE.UNIT'],
    //   });
    //   Returns: {
    //     modbus_settings: {
    //       SCB_BUS1_BAUDRATE: "...",
    //       SDB_BUS1_PARITY: "...",
    //       META: {...},
    //     },
    //     units: {
    //       HMI_TEMPERATURE_UNIT: "...",
    //       META: {...},
    //     }
    //   }
    //
    // META contains the quality bits for the sysvars.
    //
    // Note that dots in sysvar names are converted to underscores.

    function getSysvars(queryVars, options) {
      var nameList;
      var formatter;

      options = mergeOptions({
        // authenticate: If true, use an API that requires a session cookie.
        //               If false, use an API that doesn't.
        keepDeviceId: false,
        authenticate: true,
        cloudCheck: false,
      }, options);
      if (options === null) {
        return $q.reject();
      }
      var url = options.authenticate ? '/vars' : '/ns/get';

      if (angular.isArray(queryVars)) {
        nameList = queryVars;
        formatter = sysvarResponseToFlatObject;
      } else if (angular.isObject(queryVars)) {
        nameList = nestedObjectToSysvarList(queryVars);
        formatter = sysvarResponseToNestedObject;
      } else {
        $log.error("getSysvars: queryVars had unsupported type: " + typeof queryVars);
        return $q.reject();
      }
      nameList = "name=" + nameList.join(",");

      return request(url, nameList).then(function(data) {
        try {
          var formatted = formatter(data, queryVars, options);
          return $q.resolve(formatted);
        } catch (ex) {
          if (ex.message === "missing sysvar") {
            $log.error("Missing sysvar: " + ex.sysvar);
            return $q.reject(ex.message);
          }
          throw ex;
        }
      }, function(error) {
        if (error.status === 401) {
          redirectService.redirectToLogin();
        }
        $log.error("getSysvars failed: " + error);
        return $q.reject(error);
      });
    }





    function mangleSysvarName(sysvarNameRaw, options) {
      var name = sysvarNameRaw;

      if (options !== undefined && options.hasOwnProperty('prefix')) {
        var prefix = "/" + options.prefix + "/";

        // remove device name
        name = name.replace(prefix, '');
      }

      // replace dots and slashes with an underscore
      name = name.replace(/[\.\/]/g, '_');

      if (options !== undefined && options.hasOwnProperty('keepDeviceId') && options.keepDeviceId) {
        name = name.replace(/^\[|\]/g, '');
      } else {
        // remove device instance identifier
        name = name.replace(/^\[[0-9]+\]/g, '');
      }

      // remove leading underscore
      return name.replace(/^_/g, '');
    }

    // Input:
    //  { alpha: ['A', 'B', 'C'], beta: ['X', 'Y', 'Z']}
    // Output:
    //  "name=A,B,C,X,Y,Z"
    function nestedObjectToSysvarList(queryVars) {
      var result = [];
      angular.forEach(queryVars, function(value) {
        result = result.concat(value);
      });
      return result;
    }

    function sysvarResponseToNestedObject(data, queryVars, options) {
      var response = {};

      angular.forEach(queryVars, function(sysvarList, sectionName) {
        var subresponse = sysvarResponseToFlatObject(data, sysvarList, options);
        response[sectionName] = subresponse;
      });
      return response;
    }

    function sysvarResponseToFlatObject(data, sysvarList, options) {
      var response = {};
      response.META = {};
      angular.forEach(sysvarList, function(sysvarNameRaw) {
        var sysvarNameMangled = mangleSysvarName(sysvarNameRaw, options);
        var sysvarInfo = lookupSysvar(data, sysvarNameRaw);
        if (sysvarInfo === null) {
          if (queryConfigService.willCheckForMissingSysvars()) {
            var ex = new Error("missing sysvar");
            ex.sysvar = sysvarNameRaw;
            throw ex;
          }
          // else, silently fail
        } else {
          response[sysvarNameMangled] = sysvarInfo.value;
          response.META[sysvarNameMangled] = sysvarInfo.quality;
        }
      });

      if (options.cloudCheck) {
        var sysvarInfo = lookupSysvar(data, "CLOUD");
        if (sysvarInfo !== null) {
          response["CLOUD"] = sysvarInfo.value;
          response.META["CLOUD"] = sysvarInfo.quality;
        }
      }

      return response;
    }

    function lookupSysvar(data, sysvarNameRaw) {
      var result = null;
      angular.forEach(data.values, function(sysvar) {
        if (sysvar.name === sysvarNameRaw) {
          result = {
            value: sysvar.value,
            quality: sysvar.quality,
          };
        }
      });
      return result;
    }

    function request(url, urlParams) {
      $log.debug("url: " + url);
      if (typeof(urlParams) === 'undefined') {
        urlParams = " ";
      }
      /* Call the http get function */
      return safeApply(function() {
        return $http.post(url, urlParams, {
            headers: {
              'otk': otkService.getOTK()
            }
          })
          .then(function(response) {
            if (response.data !== undefined && response.data.OTK !== undefined) {
              otkService.setOTK(response.data.OTK);
            }
            $rootScope.$emit('addQueryVars', response.data);

            /* Check the response data */
            if (angular.isObject(response.data)) {
              /* Return data */
              return response.data;
            } else {
              /* Data is invalid, return failure */
              $log.debug("Data is not an object");
              return $q.reject(response);
            }
          }, function(response) {
            if (response.status === 401) {
              redirectService.redirectToLogin();
            }
            /* Unable to get data */
            $log.error(angular.fromJson(response));
            return $q.reject(response);
          }).catch(function(error) {
            $log.error("error");
            return $q.reject(error);
          });
      });
    }

    // Handle the case where these functions are being called
    // from inside jQuery functions that don't know about the
    // Angular digest cycle. This is a kludge, because we
    // didn't have the time to port all the old jQuery code
    // to proper Angular code.
    //
    // TODO: Write tests for safeApply
    function safeApply(fn) {
      // eslint-disable-next-line angular/no-private-call
      var phase = $rootScope.$$phase;
      if (phase === '$apply' || phase === '$digest') {
        if (fn && angular.isFunction(fn)) {
          return fn();
        }
      } else {
        return $rootScope.$apply(fn);
      }
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // getSysvarsByTags
    //
    // Return the sysvars contained in one or more tags
    //
    // tagList: A list of tag names.
    // Example: ['Tag1', 'Tag2', 'Tag3']
    function getSysvarsByTags(tagList, options) {
      // Currently, no options available
      options = mergeOptions({}, options);
      if (options === null) {
        return $q.reject();
      }

      // Unlike getSysvars, the argument must be a flat array
      if (!angular.isArray(tagList)) {
        $log.error("getSysvarsByTags: tagList must be an array");
        return $q.reject();
      }

      var tagListStr = "tag=" + tagList.join(",");
      return request('/vars', tagListStr).then(function(data) {
        // Make a list of all the sysvars we got back from the tag,
        // for use by sysvarResponseToFlatObject.
        var sysvarList = data.values.map(function(sysvar) {
          return sysvar.name;
        });
        // Don't need a try block around this call. It only throws
        // if a variable is missing from the response data, but
        // we made sysvarList from the response data so that will
        // never happen.
        var formatted = sysvarResponseToFlatObject(data, sysvarList, options);
        return $q.resolve(formatted);
      }, function(error) {
        if (error.status === 401) {
          redirectService.redirectToLogin();
        }
        $log.error("getSysvarsByTag failed: " + error);
        return $q.reject(error);
      });
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // getMatchingSysvars
    //
    // Return the sysvars contained in one or more tags and/or a match
    //
    // matchCriteria.tags: A list of tag names.
    // Example: { tags: ['Tag1', 'Tag2', 'Tag3'] }
    // matchCriteria.match: A list of tag names.
    // Example: { match: 'match1' }
    // matchCriteria.instance: A device instance identifier
    // Example: { instance: 20099 }
    // matchCriteria.id: A match identifier
    // Example: { id: 'sometag' }

    function getMatchingSysvars(matchCriteria, options) {
      // Currently, no options available
      options = mergeOptions({
        prefix: "",
        keepDeviceId: false,
        lang: ""
      }, options);
      if (options === null) {
        return $q.reject();
      }

      var queryStrings = [];
      if (angular.isDefined(matchCriteria.tags)) {
        if (!angular.isArray(matchCriteria.tags)) {
          $log.error("getMatchingSysvars: tags must be in the form of an array");
          return $q.reject();
        }

        queryStrings.push("tag=" + matchCriteria.tags.join(","));
      }

      if (angular.isDefined(matchCriteria.regex)) {
        if (!angular.isString(matchCriteria.regex)) {
          $log.error("getMatchingSysvars: regex must be in the form of an string");
          return $q.reject();
        }

        queryStrings.push("regex=" + matchCriteria.regex);
      }

      if (angular.isDefined(matchCriteria.match)) {
        if (!angular.isString(matchCriteria.match)) {
          $log.error("getMatchingSysvars: match must be in the form of a string");
          return $q.reject();
        }

        queryStrings.push("match=" + matchCriteria.match);
      }

      if (angular.isDefined(matchCriteria.inst)) {
        queryStrings.push("inst=" + matchCriteria.inst);
      }

      if (angular.isDefined(matchCriteria.id)) {
        if (!angular.isString(matchCriteria.id)) {
          $log.error("getMatchingSysvars: id must be in the form of a string");
          return $q.reject();
        }

        queryStrings.push("id=" + matchCriteria.id);
      }

      if (queryStrings.length === 0) {
        $log.error("getMatchingSysvars: No match criteria specified");
        return $q.reject();
      }

      if (options.lang !== "") {
        queryStrings.push("lang=" + options.lang);
      }

      var unifiedQueryString = queryStrings.join('&');
      return request('/vars', unifiedQueryString).then(function(data) {
        // Make a list of all the sysvars we got back from the tag,
        // for use by sysvarResponseToFlatObject.
        var sysvarList = data.values.map(function(sysvar) {
          return sysvar.name;
        });
        // Don't need a try block around this call. It only throws
        // if a variable is missing from the response data, but
        // we made sysvarList from the response data so that will
        // never happen.
        var formatted = sysvarResponseToFlatObject(data, sysvarList, options);
        return $q.resolve(formatted);
      }, function(error) {
        if (error.status === 401) {
          redirectService.redirectToLogin();
        }
        $log.error("getSysvarsByTag failed: " + error);
        return $q.reject(error);
      });
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // runSavedQuery
    //
    // Return the sysvars associated with the saved query
    //
    //  Example
    //
    //   var options = {};
    //   options.prefix = 'xw';
    //   return queryService.runSavedQuery( 'xw20099sts', options )
    //
    function runSavedQuery(queryID, options) {
      // Currently, no options available
      options = mergeOptions({
        prefix: ""
      }, options);
      if (options === null) {
        return $q.reject();
      }

      if (!angular.isString(queryID)) {
        $log.error("runSavedQuery: query ID must be in the format of a string");
        return $q.reject();
      }

      var queryString = 'id=' + queryID;

      return request('/vars', queryString).then(function(data) {
        // Make a list of all the sysvars we got back from the query,
        // for use by sysvarResponseToFlatObject.
        var sysvarList = data.values.map(function(sysvar) {
          return sysvar.name;
        });
        // Don't need a try block around this call. It only throws
        // if a variable is missing from the response data, but
        // we made sysvarList from the response data so that will
        // never happen.
        var formatted = sysvarResponseToFlatObject(data, sysvarList, options);
        return $q.resolve(formatted);
      }, function(error) {
        if (error.status === 401) {
          redirectService.redirectToLogin();
        }
        $log.error("runSavedQuery failed: " + error);
        return $q.reject(error);
      });
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // getSysvarsByInstance
    //
    // Return the sysvars with the specified instance identifier
    //
    // instanceID: system variable instance identiifer
    // Example:
    function getSysvarsByInstance(instanceID, options) {
      // prefix : pull prefix off sysvar names when making object members
      options = mergeOptions({
        'prefix': "",
        'lang': ""
      }, options);
      if (options === null) {
        return $q.reject();
      }

      var instStr = "inst=" + instanceID.toString();

      if (options.lang !== "") {
        instStr += ("&lang=" + options.lang);
      }

      return request('/vars', instStr).then(function(data) {
        // Make a list of all the sysvars we got back from the tag,
        // for use by sysvarResponseToFlatObject.
        var sysvarList = data.values.map(function(sysvar) {
          return sysvar.name;
        });

        var formatted = sysvarResponseToFlatObject(data, sysvarList, options);
        return $q.resolve(formatted);
      }, function(error) {
        if (error.status === 401) {
          redirectService.redirectToLogin();
        }
        $log.error("getSysvarsByInstance failed: " + error);
        return $q.reject(error);
      });
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // setSysvars

    function setSysvars(valuesToSet, options) {
      options = mergeOptions({
        // apply: Whether or not to follow the set with a call to apply
        apply: true,

        // authenticate: Same as in getSysvars()
        authenticate: true,

        // order: Specify the order for some of the sysvars
        // Ordering rules:
        // * You don't need to specify the order of every sysvar,
        //   just the ones where order matters.
        // * Sysvars that are not specified in the order array
        //   come before ones that are.
        // * Sysvars that are not specified in the order array
        //   are sorted alphabetically. This means that if no
        //   order is specified, all sysvars are alphabetically
        //   sorted[1].
        // * The order array uses the un-mangled (dot notation)
        //   sysvar names. E.g., 'SCB.BUS1.PARITY', not
        //   SCB_BUS1_PARITY.
        //
        // [1] Sorting sysvars ensures they'll always be set
        // in the same order across all browsers. As opposed to
        // setting them in the order they were read from the
        // object keys, which is an undefined order.
        order: [],

        // queryVars: Use this when valuesToSet is an object that
        // was returned by getSysvars(). Set queryVars to the
        // argument passed to getSysvars().
        //
        // This is used to convert the underscores in sysvar names
        // back to dots. e.g., "ETH0_TCPIP_DHCP_GWAY" in valuesToSet
        // is mapped back to the sysvar "ETH0.TCPIP.DHCP_GWAY"
        queryVars: false,
      }, options);
      if (options === null) {
        return $q.reject();
      }
      var url = options.authenticate ? '/setparams' : '/ns/set';

      var requestObject;
      try {
        requestObject = createRequestObject(valuesToSet, options);
        if (options.queryVars) {
          unmangleSysvarNames(requestObject, options.queryVars, options);
        }
        // Always sort the sysvars, even if caller didn't specify
        // ordering. This ensures that every sysvar set happens
        // in a defined order across all browsers.
        sortRequestObject(requestObject, options.order);
      } catch (ex) {
        if (ex.isQueryServiceError) {
          $log.error(ex.message);
          return $q.reject(ex);
        }
        throw ex;
      }

      if (options.apply) {
        requestObject.values.push({
          "name": "/SCB/CFG/APPLY",
          "value": 1
        });
      }

      var postData;
      if (url === '/ns/set') {
        // /ns/set uses query string data
        postData = makeQueryString(requestObject);
      } else {
        // /setparams uses JSON-formatted data
        postData = requestObject;
      }


      var post = $http.post(url, postData, {
        headers: {
          'otk': otkService.getOTK()
        }
      });

      return post.then(function(setResponse) {
        if (setResponse.data !== undefined && setResponse.data.OTK !== undefined) {
          otkService.setOTK(setResponse.data.OTK);
        }
        $rootScope.$emit('addQueryVars', setResponse.data);
        if (sysvarSetHasError(setResponse, requestObject)) {
          return $q.reject(setResponse);
        }
        return $q.resolve(setResponse);
      }, function(error) {
        if (error.status === 401) {
          redirectService.redirectToLogin();
        }
        return $q.reject(error);
      }).catch(function(error) {
        $log.error(error);
        return $q.reject(error);
      });
    }

    function createRequestObject(data, queryVars, ordering, options) {
      var requestObject = {
        values: []
      };

      var objectType = null;
      var error;
      angular.forEach(data, function(value, name) {
        if (angular.isObject(value)) {
          // This is a two-level object
          if (objectType === null) {
            objectType = "two-level";
          } else if (objectType !== "two-level") {
            error = new Error(
              "valuesToSet contains a mix of single-level and nested values");
            error.isQueryServiceError = true;
            throw error;
          }

          angular.forEach(value, function(sysvarValue, sysvarNameMangled) {
            requestObject.values.push({
              name: sysvarNameMangled,
              value: sysvarValue,
            })
          });
        } else {
          // Single-level object
          if (objectType === null) {
            objectType = "single-level";
          } else if (objectType !== "single-level") {
            error = new Error(
              "valuesToSet contains a mix of single-level and nested values");
            error.isQueryServiceError = true;
            throw error;
          }


          requestObject.values.push({
            name: name, // sysvar name is mangled
            value: value,
          });
        }
      });
      return requestObject;
    }

    function unmangleSysvarNames(data, queryVars, options) {
      var rawNameForMangledName = {};
      angular.forEach(queryVars, function(value, name) {
        if (angular.isArray(value)) {
          // this is a two-level object
          angular.forEach(value, function(sysvarNameRaw, idx) {
            var sysvarNameMangled = mangleSysvarName(sysvarNameRaw, options);
            rawNameForMangledName[sysvarNameMangled] = sysvarNameRaw;
          });
        } else {
          // Single-level object
          var sysvarNameRaw = name;
          var sysvarNameMangled = mangleSysvarName(sysvarNameRaw, options);
          rawNameForMangledName[sysvarNameMangled] = sysvarNameRaw;
        }
      });

      data.values.forEach(function(value) {
        var sysvarNameMangled = value.name;
        var sysvarNameRaw = rawNameForMangledName[sysvarNameMangled];

        if (!angular.isDefined(sysvarNameRaw)) {
          var error = new Error(
            "queryVars did not have an entry for: " + sysvarNameMangled);
          error.isQueryServiceError = true;
          throw error;
        }

        value.name = sysvarNameRaw;
      });
    }

    function sortRequestObject(requestObject, order) {
      var findSysvar = function(sysvar) {
        return function(currSysvarName) {
          return sysvar.name === currSysvarName;
        }
      }

      var compareSysvars = function(sysvarA, sysvarB) {
        var orderA = order.findIndex(findSysvar(sysvarA));
        var orderB = order.findIndex(findSysvar(sysvarB));

        var hasOrderA = orderA !== -1;
        var hasOrderB = orderB !== -1;

        if (hasOrderA && hasOrderB) {
          // Both sysvars are in the order array,
          // sort by position in that array.
          return orderA - orderB;
        } else if (hasOrderA && !hasOrderB) {
          // Only one sysvar is in order array.
          // Sysvars in the array are sorted after ones
          // that are not.
          return +1;
        } else if (!hasOrderA && hasOrderB) {
          return -1;
        } else {
          // Neither sysvar is in order array. Fall back to
          // sorting alphabetically by sysvar name.
          return sysvarA.name.localeCompare(sysvarB.name);
        }
      }

      requestObject.values.sort(compareSysvars);
    }

    function sysvarSetHasError(response, requestObject) {
      var hasError = false;
      var data = response.data;

      if (!data) {
        return true;
      }

      var resultsList;
      if (angular.isArray(data.values)) {
        // Calls to /setparams give results in data.values
        resultsList = data.values;
      } else if (angular.isArray(data.results)) {
        // Calls to /ns/set give results in data.results
        resultsList = data.results;
      } else {
        $log.error("sysvarSetHasError: Response has unknown format.");
        return true;
      }

      var hasResultForSysvar = {};
      requestObject.values.forEach(function(sysvar) {
        var sysvarNameRaw = sysvar.name;
        hasResultForSysvar[sysvarNameRaw] = false;
      })

      angular.forEach(resultsList, function(value, key) {
        if (value.result === undefined || value.result !== 0) {
          hasError = true;
        }

        var sysvarNameRaw = value.name;
        if (!hasResultForSysvar.hasOwnProperty(sysvarNameRaw)) {
          // We didn't ask for this sysvar to be set
          hasError = true;
          $log.error("sysvarSetHasError: Unexpected response for: " + sysvarNameRaw);
        }
        hasResultForSysvar[sysvarNameRaw] = true;
      });

      angular.forEach(hasResultForSysvar, function(hasResult, sysvarNameRaw) {
        if (hasResult === false) {
          $log.error("sysvarSetHasError: No response for: " + sysvarNameRaw);
          hasError = true;
        }
      });

      return hasError;
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // runScript
    //
    // Execute an artbitrary script
    //
    // path: Path of the script to execute
    // valuesToSet: Object with key/value pairs to pass as arguments
    //
    function runScript(path, valuesToSet, options) {
      options = mergeOptions({
        // order: Same as in setSysvars
        order: [],
      }, options);
      if (options === null) {
        return $q.reject();
      }

      if (!angular.isDefined(valuesToSet)) {
        // The old csbQuery module called many of the scripts
        // with an argument of a single space. I'm not sure
        // why they did that, but follow their lead.
        valuesToSet = " ";
      }

      var queryString;
      if (angular.isObject(valuesToSet) && !angular.isArray(valuesToSet)) {
        var requestObject = createRequestObject(valuesToSet);
        sortRequestObject(requestObject, options.order);
        queryString = makeQueryString(requestObject);
      } else if (angular.isString(valuesToSet)) {
        queryString = valuesToSet;
      } else {
        $log.error("runScript: Type of valuesToSet cannot be: " +
          typeof valuesToSet);
        return $q.reject();
      }

      return safeApply(function() {
        return $http.post(path, queryString, {
          headers: {
            'otk': otkService.getOTK()
          }
        }).then(function(httpResponse) {
          if (httpResponse.data !== undefined && httpResponse.data.OTK !== undefined) {
            otkService.setOTK(httpResponse.data.OTK);
          }
          $rootScope.$emit('addQueryVars', httpResponse.data);
          // If data is JSON, Angular will handle converting to an object
          // for us. No need to do anything here.
          return $q.resolve(httpResponse.data);
        });
      });
    }

    function makeQueryString(requestObject) {
      var nameValuePairs = requestObject.values.map(function(item) {
        return item.name + "=" + item.value;
      });
      return nameValuePairs.join("&");
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Utility functions
    function mergeOptions(defaults, options) {
      var hasError = false;
      angular.forEach(options, function(value, name) {
        if (!defaults.hasOwnProperty(name)) {
          $log.error("Unsupported option: " + name);
          hasError = true;
        }
      });

      if (hasError) {
        return null;
      }
      return angular.merge(defaults, options);
    }
  }
])
