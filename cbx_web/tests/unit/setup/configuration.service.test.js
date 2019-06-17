describe('gatewayConfigurationServiceProvider', function () {
  var $log;
  var gatewayConfigurationServiceProvider;

  setupTranslation('conext_gateway.setup');
  beforeEach(angular.mock.module('conext_gateway.setup'));

  beforeEach(module('conext_gateway.setup', function($provide) {
    $provide.value('$log', console);
  }));

  beforeEach(inject(function($injector){
    gatewayConfigurationServiceProvider = $injector.get('gatewayConfigurationServiceProvider');

    $log = $injector.get('$log');
    spyOn($log, 'error').and.callThrough();
    spyOn($log, 'warn').and.callThrough();
    spyOn($log, 'debug'); // suppress debug messages
  }));

  afterEach(function() {
    expect($log.error).not.toHaveBeenCalled();
    expect($log.warn).not.toHaveBeenCalled();
  });

  describe("isEPkgFilenameValid", function() {
    function doEPkgTest(filename, expected) {
      var isValid = gatewayConfigurationServiceProvider.isEPkgFilenameValid(filename);
      expect(isValid).toBe(expected);
    }

    it("Should allow .epkg", function() {
      doEPkgTest("foo.epkg", true);
    });

    it("Should allow .pkg", function() {
      doEPkgTest("foo.pkg", true );
    });
  });

  describe("isPkgFilenameValid", function() {
    function doPkgTest(filename, expected) {
        var isValid = gatewayConfigurationServiceProvider.isPkgFilenameValid(filename);
        expect(isValid).toBe(expected);
    }

    it("Should allow .pkg", function() {
      doPkgTest("foo.pkg", true );
    });

    it("Should not allow .epkg", function() {
      doPkgTest("foo.epkg", false );
    });
  });
});
