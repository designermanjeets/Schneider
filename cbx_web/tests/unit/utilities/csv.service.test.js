"use strict";

describe('csvService', function() {
  var csvService;
  var $log;

  beforeEach(angular.mock.module('conext_gateway.utilities'));

  beforeEach(module('conext_gateway.utilities', function($provide) {
    $provide.value('$log', console);
  }));

  beforeEach(inject(function(_csvService_, _$log_){
    csvService = _csvService_;
    $log = _$log_;
    spyOn($log, 'error').and.callThrough();
    spyOn($log, 'debug'); // suppress debug messages
  }));

  afterEach(function() {
    expect($log.error).not.toHaveBeenCalled();
  });

  describe("getCsvString", function() {
    describe("Null values should become the empty string", function() {
      // The CSV service handles null/undefined values differently
      // if they occur on the first line vs if they handle on subsequent
      // lines.
      it("Null values on first line", function() {
        var data = [
          ["bananna", null, null],
          ["fruit", "foo", "bar"],
        ];
        var csvStr = csvService._getCsvString(data);
        var expected = [
          '"bananna","",""',
          '"fruit","foo","bar"',
        ];

        expect(csvStr).toEqual(expected.join("\r\n"));
      })

      it("Null values on subsequent line", function() {
        var data = [
          ["fruit", "foo", "bar"],
          ["bananna", null, null],
        ];
        var csvStr = csvService._getCsvString(data);
        var expected = [
          '"fruit","foo","bar"',
          '"bananna","",""',
        ];

        expect(csvStr).toEqual(expected.join("\r\n"));
      })

      it("Replace undefined values", function() {
        var data = [
          ["bananna", undefined, undefined],
          ["fruit", undefined, "bar"],
        ];
        var csvStr = csvService._getCsvString(data);
        var expected = [
          '"bananna","",""',
          '"fruit","","bar"',
        ];

        expect(csvStr).toEqual(expected.join("\r\n"));
      })
    });
  });
});
