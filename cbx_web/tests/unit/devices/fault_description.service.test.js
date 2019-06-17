describe('Test fault description service', function () {
  var faultDescriptionService;
  var $log;

  beforeEach(angular.mock.module('conext_gateway.devices'));

  beforeEach(module('conext_gateway.devices', function($provide) {
    $provide.value('$log', console);
  }));

  beforeEach(inject(function(_faultDescriptionService_, _$log_){
    faultDescriptionService = _faultDescriptionService_;
    $log = _$log_;
    spyOn($log, 'error');
  }));

  describe('deviceTypeToKeyPrefix', function() {
    it('should handle mixed-case device name', function() {
      var keyPrefix = faultDescriptionService._deviceTypeToKeyPrefix('ConextCL');
      expect(keyPrefix).toEqual('faults_conextcl_short.');
      expect($log.error).not.toHaveBeenCalled();
    })

    it('should handle all-caps device name', function() {
      var keyPrefix = faultDescriptionService._deviceTypeToKeyPrefix('CONEXTCL');
      expect(keyPrefix).toEqual('faults_conextcl_short.');
      expect($log.error).not.toHaveBeenCalled();
    })

    it('should handle whitespace before/after', function() {
      var keyPrefix = faultDescriptionService._deviceTypeToKeyPrefix(' ConextCL \t ');
      expect(keyPrefix).toEqual('faults_conextcl_short.');
      expect($log.error).not.toHaveBeenCalled();
    })

    it('should handle internal whitespace', function() {
      var keyPrefix = faultDescriptionService._deviceTypeToKeyPrefix('Conext CL');
      expect(keyPrefix).toEqual('faults_conextcl_short.');
      expect($log.error).not.toHaveBeenCalled();
    })
  });

});
