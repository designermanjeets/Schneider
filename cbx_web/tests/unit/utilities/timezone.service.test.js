describe('Test timezone service', function () {
  var timezoneService;
  var $log;
  var $httpBackend;

  setupTranslation('conext_gateway.utilities');

  beforeEach(angular.mock.module('conext_gateway.utilities'));

  beforeEach(module('conext_gateway.utilities', function($provide) {
    $provide.value('$log', console);
  }));

  beforeEach(inject(function(_timezoneService_, _$log_, _$httpBackend_){
    timezoneService = _timezoneService_;
    $log = _$log_;
    spyOn($log, 'error').and.callThrough();
    spyOn($log, 'warn').and.callThrough();
    $httpBackend = _$httpBackend_
  }));

  afterEach(function() {
    expect($log.error).not.toHaveBeenCalled();
    expect($log.warn).not.toHaveBeenCalled();
  });

  var zones = readJSON('www/hmi/app/utilities/timezone.json');
  it('Test setup OK', function() {
    // Ensure we read something in
    expect(zones.length).toBeGreaterThan(1);
    expect(moment).toBeDefined();
  })

  it('All the time zones should be valid', function() {
    zones.forEach(function(zone) {
      var zoneId = zone.id;
      var zone = moment.tz.zone(zoneId);
      expect(zone).not.toBeNull();
    })
  })

  it('All the time zones should have a translatable label in the string table', function(done) {
    $httpBackend.when('GET', 'app/utilities/timezone.json').respond(zones);

    var testZones = function(zoneList) {
      expect(zoneList.length).toEqual(zones.length);
      zoneList.forEach(function(zone) {
        var tzId = zone.id;
        var label = zone.label;
        var stringId = timezoneService.translationKeyForTimezoneId(tzId);

        // Ensure that we got a label. If a label is missing, then the translation
        // will return stringId. It will also write to $log.warn.
        expect(label).toBeDefined();
        expect(label).not.toEqual(stringId);
      });
    }

    var failTest = function(error) {
      expect(error).toBeUndefined();
    }

    timezoneService.getTimezoneList()
      .then(testZones)
      .catch(failTest)
      .finally(done);
    $httpBackend.flush();

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  })

  describe('utcOffsetString and timezoneOffsetString', function() {
    var STANDARD_TIME_DATE = "2016/12/25 23:14:15";
    var DAYLIGHT_SAVINGS_DATE = "2016/07/01 14:20:18";
    it('UTC', function() {
      var utcOffset      = timezoneService.getUtcOffsetString(STANDARD_TIME_DATE, "UTC");
      var timezoneOffset = timezoneService.getTimezoneOffsetString(STANDARD_TIME_DATE, "UTC");
      expect(utcOffset).toBe("+0000");
      expect(timezoneOffset).toBe("+0000");
    })

    it('America/Los_Angeles (standard time)', function() {
      var utcOffset      = timezoneService.getUtcOffsetString(STANDARD_TIME_DATE, "America/Los_Angeles");
      var timezoneOffset = timezoneService.getTimezoneOffsetString(STANDARD_TIME_DATE, "America/Los_Angeles");
      expect(utcOffset).toBe("-0800");
      expect(timezoneOffset).toBe("+0800");
    })

    it('America/Los_Angeles (daylight savings time)', function() {
      var utcOffset      = timezoneService.getUtcOffsetString(DAYLIGHT_SAVINGS_DATE, "America/Los_Angeles");
      var timezoneOffset = timezoneService.getTimezoneOffsetString(DAYLIGHT_SAVINGS_DATE, "America/Los_Angeles");
      expect(utcOffset).toBe("-0700");
      expect(timezoneOffset).toBe("+0700");
    })

    // Kamchatka is both east of UTC and has a two-digit hour
    it('Asia/Kamchatka', function() {
      var utcOffset      = timezoneService.getUtcOffsetString(STANDARD_TIME_DATE, "Asia/Kamchatka");
      var timezoneOffset = timezoneService.getTimezoneOffsetString(STANDARD_TIME_DATE, "Asia/Kamchatka");
      expect(utcOffset).toBe("+1200");
      expect(timezoneOffset).toBe("-1200");
    })

    it('Canada/Newfoundland', function() {
      var utcOffset      = timezoneService.getUtcOffsetString(STANDARD_TIME_DATE, "Canada/Newfoundland");
      var timezoneOffset = timezoneService.getTimezoneOffsetString(STANDARD_TIME_DATE, "Canada/Newfoundland");
      expect(utcOffset).toBe("-0330");
      expect(timezoneOffset).toBe("+0330");
    })
  })
});
