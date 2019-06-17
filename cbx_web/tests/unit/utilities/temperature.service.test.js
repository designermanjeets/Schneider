describe('Test temperature service', function () {
  var temperatureService;
  var $log;
  var NDASH;

  beforeEach(angular.mock.module('conext_gateway.utilities'));

  beforeEach(module('conext_gateway.utilities', function($provide) {
    $provide.value('$log', console);
  }));

  beforeEach(inject(function(_temperatureService_, _$log_, _NDASH_){
    temperatureService = _temperatureService_;
    $log = _$log_;
    spyOn($log, 'error');
    NDASH = _NDASH_;
  }));

  describe('convert', function() {
    describe('convert numbers', function() {
      it('0 (C -> C)', function() {
        var value = temperatureService.convert('C', 0);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(0);
      })

      it('0 (C -> F)', function() {
        var value = temperatureService.convert('F', 0);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(32);
      })

      it('100 (C -> C)', function() {
        var value = temperatureService.convert('C', 100);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(100);
      })
      it('100 (C -> F)', function() {
        var value = temperatureService.convert('F', 100);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(212);
      })

      it('-50 (C -> C)', function() {
        var value = temperatureService.convert('C', -50);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(-50);
      })
      it('-50 (C -> F)', function() {
        var value = temperatureService.convert('F', -50);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(-58);
      })

      it('12.5 (C -> C)', function() {
        var value = temperatureService.convert('C', 12.5);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(12.5);
      });
      it('12.5 (C -> F)', function() {
        var value = temperatureService.convert('F', 12.5);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(54.5);
      });

      it('-12.5 (C -> C)', function() {
        var value = temperatureService.convert('C', -12.5);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(-12.5);
      });
      it('-12.5 (C -> F)', function() {
        var value = temperatureService.convert('F', -12.5);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(9.5);
      });
    });

    describe("Convert numeric strings to numbers", function() {
      it('0 (C -> C)', function() {
        var value = temperatureService.convert('C', '0');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(0);
      })

      it('0 (C -> F)', function() {
        var value = temperatureService.convert('F', '0');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(32);
      })

      it('100 (C -> C)', function() {
        var value = temperatureService.convert('C', '100');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(100);
      })
      it('100 (C -> F)', function() {
        var value = temperatureService.convert('F', '100');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(212);
      })

      it('-50 (C -> C)', function() {
        var value = temperatureService.convert('C', '-50');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(-50);
      })
      it('-50 (C -> F)', function() {
        var value = temperatureService.convert('F', '-50');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(-58);
      })

      it('12.5 (C -> C)', function() {
        var value = temperatureService.convert('C', '12.5');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(12.5);
      });
      it('12.5 (C -> F)', function() {
        var value = temperatureService.convert('F', '12.5');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(54.5);
      });

      it('-12.5 (C -> C)', function() {
        var value = temperatureService.convert('C', '-12.5');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(-12.5);
      });
      it('-12.5 (C -> F)', function() {
        var value = temperatureService.convert('F', '-12.5');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBe(9.5);
      });

    });

    describe('pass things through unchanged', function() {
      it('undefined (C -> C)', function() {
        var value = temperatureService.convert('C', undefined);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).not.toBeDefined();
      });
      it('undefined (C -> F)', function() {
        var value = temperatureService.convert('F', undefined);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).not.toBeDefined();
      });
      it('null (C -> C)', function() {
        var value = temperatureService.convert('C', null);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBeNull();
      });
      it('null (C -> F)', function() {
        var value = temperatureService.convert('F', null);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toBeNull();
      });

      it('NaN (C -> F)', function() {
        var value = temperatureService.convert('C', NaN);
        expect($log.error).not.toHaveBeenCalled();
        expect(isNaN(value)).toEqual(true);
      });
      it('NaN (C -> F)', function() {
        var value = temperatureService.convert('F', NaN);
        expect($log.error).not.toHaveBeenCalled();
        expect(isNaN(value)).toEqual(true);
      });

      it('NDASH (C -> C)', function() {
        var value = temperatureService.convert('C', NDASH);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toEqual(NDASH);
      });
      it('NDASH (C -> F)', function() {
        var value = temperatureService.convert('F', NDASH);
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toEqual(NDASH);
      });
      it('dash-dash (C -> C)', function() {
        var value = temperatureService.convert('C', '--');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toEqual('--');
      });
      it('dash-dash (C -> F)', function() {
        var value = temperatureService.convert('F', '--');
        expect($log.error).not.toHaveBeenCalled();
        expect(value).toEqual('--');
      });
    })
  });
});
