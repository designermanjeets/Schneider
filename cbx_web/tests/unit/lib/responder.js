"use strict";
var HttpResponder;
var SysvarQueryResponder;
var SysvarSetResponder;
var DeviceOverviewQueryResponder;
var DataLogResponder;
var AlarmsResponder;
var initResponders;

(function() {
  var $httpBackend;
  var TIME_LOCAL_FORMAT;

  // initResponders:
  // Call this before using any of the responder classes.
  //
  // You need to be careful about when you call initResponders:
  // * Call from INSIDE a describe() block
  //   - The top-level describe() block in a file is OK
  // * Call from OUTSIDE a beforeEach() or an it() block
  // * Call AFTER all beforeEach(module(...)) blocks
  //   - This rule only applies to beforeEach() with a module() call
  //     inside.
  //
  // Also, calling initResponders changes the way you should
  // use promises in your tests.
  //
  // Without initResponders:
  // * Your test function should accept a callback
  // * Call $rootScope.$digest() at the end of your test.
  //
  // Example:
  // it('sample test', function(done) {
  //   myPromise().then(function(data) {
  //     // Test results of the function
  //   }).catch(function(error) {
  //     // Do any checking on the error condition
  //   }).finally(function() {
  //     // Callback lets Jasmine know that we're done
  //     done();
  //   });
  //   // You have to call this, otherwise the promise won't run
  //   $rootScope.$digest();
  // });
  //
  // With initResponders:
  // * Test should NOT accept a callback
  // * DO NOT call $rootScope.$digest()
  //   - HttpResponder.flush() achieves the same result
  //
  // Example:
  // initResponders();
  // it('sample test', function() {
  //   myPromise().then(function(data) {
  //     // Test results of the function
  //   }).catch(function(error) {
  //     // Do any checking on the error condition
  //   })
  //   // No need for a finally block
  //
  //   // Calling .flush() replaces $rootScope.$digest()
  //   HttpResponder.flush();
  // })

  initResponders = function() {
    beforeEach(inject(function($injector) {
      $httpBackend      = $injector.get('$httpBackend');
      TIME_LOCAL_FORMAT = $injector.get('TIME_LOCAL_FORMAT');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  }

  HttpResponder = function() {
  }
  HttpResponder.prototype.respondToQuery = function(path, query, values) {
    var self = this;

    return $httpBackend.when('POST',
      path,
      query, // data
      undefined, // headers
      undefined)
      .respond(200, values);
  }
  // Class method, because $httpBackend only needs to be flushed once per test,
  // even if you instantiate multiple HttpResponder instances.
  HttpResponder.flush = function() {
    $httpBackend.flush();
  }

  // Respond to queries for sysvars
  SysvarQueryResponder = function(options) {
    var self = this;
    HttpResponder.call(self);
    self.sysvars = [];


    if (!angular.isDefined(options) || angular.isString(options)) {
      // Old calling style, only argument is type
      //
      var type = options;
      options = {
        'type': angular.isDefined(type) ? type : 'name',
      }
    }

    // New calling style: Pass in an object of options.
    self.options = angular.merge({
      type: 'name',
      url: '/vars',
    }, options);
  }
  // inherit from HttpResponder
  SysvarQueryResponder.prototype = Object.create(HttpResponder.prototype);
  SysvarQueryResponder.prototype.constructor = SysvarQueryResponder;

  // Add sysvars to respond with. If a sysvar had been added previously,
  // update the existing item. Otherwise, add a new item.
  //
  // Use this in a beforeEach block to set default values for all tests,
  // before finishing by setting the final sysvars in respondToSysvarQuery().
  SysvarQueryResponder.prototype.addSysvars = function(sysvarList) {
    var self = this;

    sysvarList.forEach(function(newSysvar) {
      var isDuplicate = false;
      self.sysvars.forEach(function(oldSysvar) {
        if (oldSysvar.name === newSysvar.name) {
          angular.merge(oldSysvar, newSysvar);
          isDuplicate = true;
        }
      });

      if (!isDuplicate) {
        self.sysvars.push(newSysvar);
      }
    });
  }

  SysvarQueryResponder.prototype.respondToSysvarQuery = function(sysvarList) {
    var self = this;

    if (angular.isDefined(sysvarList)) {
      self.addSysvars(sysvarList);
    }

    // Build response in a function, so it can be changed for subsequent calls
    var makeResponse = function() {
      self.sysvars.forEach(function(value) {
        // add quality flag (if missing) to name/value pairs
        if (value.hasOwnProperty('name') &&
          value.hasOwnProperty('value') &&
          !value.hasOwnProperty('quality')) {
          value.quality = 'G';
        }
      })

      var response = {
        values : self.sysvars,
        count  : self.sysvars.length,
      };

      return [200, response];
    }

    var isDataForThisQuery = function(dataString) {
      // $httpBackend calls this function to find out if it should use this data
      // to respond to a query.

      // name query example: name=TIME.LOCAL_ISO_STR,TIMEZONE,MBSYS.PLANT_INSTALLED.YEAR
      // tag query example: tag=Meter:DeviceInfo,Meter:Setting,Sensor:DeviceInfo

      // Make a list of the parameters to the query.
      // Go from: 'name=X,Y,X&tag=A,B,C'
      //      to: ['name', 'tag']
      var queryParameters = dataString
        .split('&')
        .map(function(queryPart) { return queryPart.split('=')[0] })
        .sort();

      switch(self.options.type) {
        case 'match':
          return angular.equals(queryParameters, ['match']);
        case 'match+tag':
          return angular.equals(queryParameters, ['match', 'tag']);
        case 'name':
          return angular.equals(queryParameters, ['name']);
        case 'tag':
          return angular.equals(queryParameters, ['tag']);
        default:
          console.error("isDataForThisQuery: Unkonwn type: " + self.type);
          return false;
      }
    }

    return $httpBackend.when('POST',
      self.options.url,
      isDataForThisQuery, // data
      undefined, // headers
      undefined)
      .respond(makeResponse);
  }

// Respond to set requests sysvars
  SysvarSetResponder = function(options) {
    var self = this;
    HttpResponder.call(self);
    self.sysvars = [];

    self.options = angular.merge({
      url: '/setparams',
      // apply:
      // - true:   Expect to call /apply. Respond with HTTP code 200.
      // - false:  Do not expect to call /apply
      // - number: Expect to call apply. Use number as HTTP response code.
      apply: true,
      onPost: angular.noop,

      // format:
      // - json:        Data is string-encoded JSON
      // - querystring: e.g., NAME1=VALUE1&NAME2=VALUE2
      format: 'json',
    }, options);
  }
  // inherit from HttpResponder
  SysvarSetResponder.prototype = Object.create(HttpResponder.prototype);
  SysvarSetResponder.prototype.constructor = SysvarSetResponder;

  SysvarSetResponder.prototype.isDataForThisQuery = function(dataString, values) {
    var self = this;

    var hasSeenSysvar = {};
    values.forEach(function(value) {
      hasSeenSysvar[value.name] = false;
    })

    if (self.options.format === 'json') {
      var data = angular.fromJson(dataString);
      self.options.onPost(data);

      data.values.forEach(function(sysvar) {
        hasSeenSysvar[sysvar.name] = true;
      })
    }
    else if (self.options.format === 'querystring') {
      self.options.onPost(dataString);

      var pairs = dataString.split('&');
      pairs.forEach(function(pair) {
        var sysvarName = pair.split('=')[0];
        hasSeenSysvar[sysvarName] =  true;
      });
    }
    else {
      throw new Error("Unknown format: " + self.format);
    }

    var seenAllSysvars = true;
    var sawExtraSysvar = false;
    values.forEach(function(value) {
      seenAllSysvars = seenAllSysvars && hasSeenSysvar[value.name];
      sawExtraSysvar = sawExtraSysvar || !hasSeenSysvar.hasOwnProperty(value.name);
    });

    return seenAllSysvars && !sawExtraSysvar;
  }

  SysvarSetResponder.prototype.respondToSysvarSet = function(values) {
    if (typeof values === 'undefined') {
      values = [];
    }

    var self = this;
    values.forEach(function(value) {
      // add result flag (if missing)
      if (!value.hasOwnProperty('result')) {
        value.result = 0;
      }
    });

    var response = {
      values: values,
      count: values.length,
    };

    var queryResponder = self.respondToQuery(
      self.options.url,
      function(dataString) {
        return self.isDataForThisQuery(dataString, values);
      },
      response
      );

    // Need to do this expect after self.respondToQuery,
    // because order of calls to .expect matters
    if (self.options.apply) {
      var applyStatus = angular.isNumber(self.options.apply) ?
        self.options.apply : 200;

      $httpBackend.expect('POST',
        '/apply',
        undefined, // data
        undefined, // headers
        undefined
        ).respond(applyStatus, {
          description: 'Success',
          status: applyStatus,
        });
    }

    return queryResponder;
  }


  // Respond to getDeviceOverviewItems
  DeviceOverviewQueryResponder = function() {
    var self = this;
    HttpResponder.call(self);
  }
  // inherit from HttpResponder
  DeviceOverviewQueryResponder.prototype = Object.create(HttpResponder.prototype);
  DeviceOverviewQueryResponder.prototype.constructor = DeviceOverviewQueryResponder;
  DeviceOverviewQueryResponder.prototype.respondToInverterQuery = function(values) {
    var self = this;

    // Allow the response to this query to change on subsequent calls
    if (!angular.isDefined(self.response)) {
      self.response = self.respondToQuery(
        '/SB/getDeviceOverviewItems',
        'deviceType=Inverter',
        values);
    }
    else {
      self.response.respond(200, values);
    }

    return self.response;
  }
  DeviceOverviewQueryResponder.prototype.respondToMeterQuery = function(values) {
    var self = this;

    // The real device overview query returns E51C2 for the model
    // number and PME51C2 for the sysvar name. Ensure that we're using
    // the same nomenclature in our tests.
    values.forEach(function(value) {
      if (angular.isDefined(value.deviceSysvarName) &&
        /E51C2/.test(value.deviceSysvarName)) {

        expect(value.deviceSysvarName).toMatch(/_PME51C2_/);
      }

      if (angular.isDefined(value.ModelNumber) &&
        /E51C2/.test(value.ModelNumber)) {

        expect(value.ModelNumber).toMatch(/^E51C2/);
      }
    });

    return self.respondToQuery(
      '/SB/getDeviceOverviewItems',
      'deviceType=Meter',
      values);
  }
  DeviceOverviewQueryResponder.prototype.respondToSensorQuery = function(values) {
    var self = this;
    return self.respondToQuery(
      '/SB/getDeviceOverviewItems',
      "deviceType=Sensor",
      values);
  };

  // Respond to datalog
  DataLogResponder = function() {
    var self = this;
    HttpResponder.call(self);
  }
  // inherit from HttpResponder
  DataLogResponder.prototype = Object.create(HttpResponder.prototype);
  DataLogResponder.prototype.constructor = DataLogResponder;

  DataLogResponder.prototype.respondToDataLogQuery =
    function(deviceId, response, timezone) {

    var self = this;

    // The data log query uses PME51C2 as the device ID, so be
    // sure that that's what we're using in our unit tests.
    // This is in contrast with the getDeviceOverviewItems query,
    // which returns E51C2.
    if (/E51C2/.test(deviceId)) {
      expect(deviceId).toMatch(/^PME51C2/);
    }

    // Convert response timestamps from strings to epoch seconds
    if (angular.isDefined(response.data) &&
      response.data.length > 0 &&
      angular.isString(response.data[0][0])) {

      response.data.forEach(function(dataPoint) {
        var t = moment.tz(dataPoint[0], TIME_LOCAL_FORMAT, timezone);
        dataPoint[0] = t.unix();
      })
    }

    var isDataForThisQuery = function(dataString) {
      // $httpBackend calls this function to find out if it should use this data
      // to respond to a query.

      var device = 'device=' + deviceId;
      return dataString.indexOf(device) !== -1;
    }

    return self.respondToQuery(
      '/datalog',
      isDataForThisQuery,
      response
      );
  }

  // Respond to alarms query
  AlarmsResponder = function() {
    var self = this;
    HttpResponder.call(self);
  }
  // inherit from HttpResponder
  AlarmsResponder.prototype = Object.create(HttpResponder.prototype);
  AlarmsResponder.prototype.constructor = AlarmsResponder;

  AlarmsResponder.prototype.respondToAlarmsQuery = function(alarms) {
    var self = this;

    // Fill in missing fields for the alarms.
    //
    // Copy the alarms we were passed in to new objects, so we can
    // create the fields in the correct order for the CSV file.
    // (I couldn't figure out how to give CSV an ordered list of
    // fields when passing in objects.)
    var newAlarms = [];
    alarms.forEach(function(alarm) {
      var newAlarm = {};

      var fieldNames = [
        'DeviceID', 'DeviceType', 'Time', 'SET/CLEAR', 'Code', 'Type', 'Description',
      ];
      fieldNames.forEach(function(fieldName) {
        if (alarm.hasOwnProperty(fieldName)) {
          newAlarm[fieldName] = alarm[fieldName];
        }
        else {
          newAlarm[fieldName] = null;
        }
      });

      newAlarms.push(newAlarm)
    })

    var response = new CSV(newAlarms, {header:true}).encode();

    return self.respondToQuery(
      '/SB/getAlarmWarningInfo',
      undefined, // respond to any query to getAlarmWarningInfo
      response
      );

  }

})();
