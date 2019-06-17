"use strict";

/* TODO: This mess is me trying to return an error when the argument isn't a valid time */
/*
var compareUnixTimestamp = function(actualTimeUnix, expectedTimeStr, timezone) {
  var result = {};
  var actualTime = moment.tz(actualTimeUnix * 1000, timezone)
  if (!actualTime.isValid()) {
    return "Time is not a valid Unix timestamp: " + actualTimeUnix;
  }

  var actualTimeStr = actualTime.format("YYYY/MM/DD HH:mm:ss");
  return expectedTimeStr === actualTimeStr;
}

var matchers = {
  toBeUnixTimestamp: function(util, customEqualityTesters) {
    return {
      compare: function(actualTimeUnix, expectedTimeStr, timezone) {
        var result = compareUnixTimestamp(actualTimeUnix, expectedTimeStr, timezone);
        if (typeof result === 'string') {
          // error message
          return {
            pass: false,
            message: result,
          };
        }
        else {
          return {
            pass: result,
            message: '',
          }
        }
      },

      negativeCompare: function(actualTimeUnix, expectedTimeStr, timezone) {
        var result = compareUnixTimestamp(actualTimeUnix, expectedTimeStr, timezone);
        if (typeof result !== 'string') {
          // error message
          return {
            pass: false,
            message: result,
          };
        }
        else {
          return {
            pass: result,
            message: '',
          }
        }
      }

    }
  }


};
*/
var matchers = {
  toBeUnixTimestamp: function(util, customEqualityTesters) {
    return {
      compare: function(actualTimeUnix, expectedTimeStr, timezone) {
        var result = {};
        var actualTime = moment.tz(actualTimeUnix * 1000, timezone)

        var actualTimeStr = actualTime.format("YYYY/MM/DD HH:mm:ss");

        result.pass = expectedTimeStr === actualTimeStr;
        if (result.pass) {
          // message for use with expect(...).not
          result.message = "Expected " + actualTimeStr + " to not equal " + expectedTimeStr;
        }
        else {
          result.message = "Expected " + actualTimeStr + " to equal " + expectedTimeStr;
        }

        return result;
      }
    }
  }
}


beforeEach(function() {
  jasmine.addMatchers(matchers);
})

describe("Custom matcher: toBeUnixTimestamp()", function() {
  it("Times equal", function() {
    var time = moment.tz("2015/05/05 10:10:10", "YYYY/MM/DD HH:mm:ss", 'America/Los_Angeles').unix();
    expect(time).toBeUnixTimestamp("2015/05/05 10:10:10", "America/Los_Angeles")
  })

  it("Times don't equal", function() {
    var time = moment.tz("2015/05/05 10:10:10", "YYYY/MM/DD HH:mm:ss", 'America/Los_Angeles').unix();
    expect(time).not.toBeUnixTimestamp("2016/05/05 10:10:10", "America/Los_Angeles")
  })
})
