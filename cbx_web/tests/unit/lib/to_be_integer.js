"use strict";

var customMatchers = {
  toBeInteger: function (util, customEqualityTesters) {
    return {
      compare: function (actual) {
        var result = {};
        result.pass = typeof actual === 'number' && isFinite(actual) && Math.floor(actual) === actual;
        if (result.pass) {
          // message for use with expect(...).not.toBeInteger()
          result.message = "Expected " + actual + " to not be an integer";
        }
        else {
          result.message = "Expected " + actual + " to be an integer";
        }

        return result;
      }
    }
  },
}

beforeEach(function () {
  jasmine.addMatchers(customMatchers);
});

describe("Custom matcher: toBeInteger()", function () {
  it("text string", function () {
    expect("hello").not.toBeInteger();
  })
  it("numeric string", function () {
    expect("0").not.toBeInteger();
  })
  it("zero", function () {
    expect(0).toBeInteger();
  })
  it("positive integer", function () {
    expect(42).toBeInteger();
  })
  it("negative integer", function () {
    expect(-42).toBeInteger();
  })
  it("positive float", function () {
    expect(42.5).not.toBeInteger();
  })
  it("negative float", function () {
    expect(-42.5).not.toBeInteger();
  })
  it("epsilon", function () {
    expect(Number.EPSILON).not.toBeInteger();
  })
  it("+Infinity", function () {
    expect(Infinity).not.toBeInteger();
  })
  it("NaN", function () {
    expect(NaN).not.toBeInteger();
  })
});
