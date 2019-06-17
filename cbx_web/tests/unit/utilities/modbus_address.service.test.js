describe('modbusAddressService', function() {
  var modbusAddressService;
  var $log;

  setupTranslation('conext_gateway.utilities');
  beforeEach(angular.mock.module('conext_gateway.utilities'));

  beforeEach(module('conext_gateway.utilities', function($provide) {
    $provide.value('$log', console);
  }));

  beforeEach(inject(function(_modbusAddressService_, _$log_){
    modbusAddressService = _modbusAddressService_;
    $log = _$log_;
    spyOn($log, 'error').and.callThrough();
    spyOn($log, 'warn').and.callThrough();
    //spyOn($log, 'debug'); // suppress debug messages
  }));

  afterEach(function() {
    expect($log.error).not.toHaveBeenCalled();
    expect($log.warn).not.toHaveBeenCalled();
  });

  describe('compareAddresses', function() {
    var doTest = function(addrA, expected, addrB) {
      var testName = addrA + " " + expected + " " + addrB;
      it(testName, function() {
        var a = modbusAddressService.parseModbusAddress(addrA);
        var b = modbusAddressService.parseModbusAddress(addrB);

        var cmp = modbusAddressService.compareAddresses(a, b);

        expect($log.error).not.toHaveBeenCalled();
        switch(expected) {
          case '<':
            expect(cmp).toBeLessThan(0);
            break;

          case '>':
            expect(cmp).toBeGreaterThan(0);
            break;

          case '==':
            expect(cmp).toBe(0);
            break;

          default:
            expect(false).toBe(true);
            break;
        }
      });
    }

    // sort by address within the same bus
    doTest('A-1', '<', 'A-2');
    doTest('A-2', '>', 'A-1');

    // 1- and 2-digit modbus addresses
    doTest('A-5', '<', 'A-50');
    doTest('A-50', '>', 'A-5');

    // everything in bus A comes before bus B
    doTest('A-5', '<', 'B-1');
    doTest('B-1', '>', 'A-5');

    // equality tests
    doTest('A-5', '==', 'A-5');
    doTest('B-32', '==', 'B-32');
  });


  describe('extractModbusAddress', function() {
    function doTest(name, string, expected) {
      it(name, function() {
        var extracted = modbusAddressService.extractModbusAddress(string);
        expect(extracted).toEqual(expected);
      });
    }

    doTest('One digit address', 'ConextCL(A-5)', {
      bus: 'A',
      address: 5,
    });
    doTest('Three digit address', 'ConextCL(B-123)', {
      bus: 'B',
      address: 123,
    });
    doTest("Don't grab 4 digits", ' B-1234 ', {
      bus: 'B',
      address: 123,
    });
    doTest("If bus is not A or B, abort", 'ConextCL(R-123)', null);
  });
});
