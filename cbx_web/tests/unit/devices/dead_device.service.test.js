describe('Test device name parser', function () {
  var deadDeviceService;
  var $log;
  var UNKNOWN_DEVICE_ID = "--";

  beforeEach(angular.mock.module('conext_gateway.devices'));

  beforeEach(module('conext_gateway.devices', function($provide) {
    $provide.value('$log', console);
  }));

  beforeEach(inject(function(_deadDeviceService_, _$log_){
    deadDeviceService = _deadDeviceService_;
    $log = _$log_;
    spyOn($log, 'error');
  }));

  describe('getBusFromDeviceId', function() {
    it('Should parse bus 1', function() {
      var bus = deadDeviceService._getBusFromDeviceId("BUS1_PVMET200_11");
      expect(bus).toBe(1);
      expect($log.error).not.toHaveBeenCalled();
    });

    it('Should parse bus 2', function() {
      var bus = deadDeviceService._getBusFromDeviceId("BUS2_PVMET200_11");
      expect(bus).toBe(2);
      expect($log.error).not.toHaveBeenCalled();
    });

    it('Should not accept bus 0', function() {
      var bus = deadDeviceService._getBusFromDeviceId("BUS0_PVMET200_11");
      expect(bus).toBe(null);
      expect($log.error).toHaveBeenCalled();
    });

    it('Should not accept bus 3', function() {
      var bus = deadDeviceService._getBusFromDeviceId("BUS3_PVMET200_11");
      expect(bus).toBe(null);
      expect($log.error).toHaveBeenCalled();
    });

    it('Should not accept a two-digit bus', function() {
      var bus = deadDeviceService._getBusFromDeviceId("BUS01_PVMET200_11");
      expect(bus).toBe(null);
      expect($log.error).toHaveBeenCalled();
    });

    it('Should not cause an error for unknown device', function() {
      var bus = deadDeviceService._getBusFromDeviceId(UNKNOWN_DEVICE_ID);
      expect(bus).toBe(null);
      expect($log.error).not.toHaveBeenCalled();
    });
  });

  describe('getAddressFromDeviceId', function() {
    it('Should parse 1-digit address', function() {
      var address = deadDeviceService._getAddressFromDeviceId("BUS1_PVMET200_1");
      expect(address).toBe(1);
      expect($log.error).not.toHaveBeenCalled();
    });

    it('Should parse 3-digit address', function() {
      var address = deadDeviceService._getAddressFromDeviceId("BUS1_PVMET200_100");
      expect(address).toBe(100);
      expect($log.error).not.toHaveBeenCalled();
    });

    it('Should parse max valid address', function() {
      var address = deadDeviceService._getAddressFromDeviceId("BUS1_PVMET200_247");
      expect(address).toBe(247);
      expect($log.error).not.toHaveBeenCalled();
    });

    it('Should not parse addresses that are too small', function() {
      var address = deadDeviceService._getAddressFromDeviceId("BUS1_PVMET200_0");
      expect(address).toBe(null);
      expect($log.error).toHaveBeenCalled();
    });

    it('Should not parse addresses that are too large', function() {
      var address = deadDeviceService._getAddressFromDeviceId("BUS1_PVMET200_248");
      expect(address).toBe(null);
      expect($log.error).toHaveBeenCalled();
    });

    it('Should not cause an error for unknown device', function() {
      var bus = deadDeviceService._getAddressFromDeviceId(UNKNOWN_DEVICE_ID);
      expect(bus).toBe(null);
      expect($log.error).not.toHaveBeenCalled();
    });
  });
});
