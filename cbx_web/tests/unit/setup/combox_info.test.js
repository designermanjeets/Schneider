describe('conext_gateway info controller', function () {
  var $q;
  var $scope;
  var $controller;
  var deferred;
  var infoMock;
  var gatewayInfoService;
  var timeToFillCalculatorService;
  var provide;
  var timeToFillMonths = 0;

  setupTranslation('conext_gateway.setup');

  describe('Test SDCARD_USED, SDCARD_SIZE and estimated time to fill', function() {
    beforeEach(function () {

      module('conext_gateway.setup');
      infoMock = readJSON('tests/unit/setup/info.mock.json');

      inject(function (_$rootScope_, _$controller_, _$q_, _gatewayInfoService_) {
        $q = _$q_;
        deferred = $q.defer();
        $scope = _$rootScope_.$new();
        gatewayInfoService = _gatewayInfoService_;
        spyOn(gatewayInfoService, 'getGatewayInfo').and.returnValue(deferred.promise);
        $controller = _$controller_('gatewayInfoController', {
          'gatewayInfoService': gatewayInfoService, '$scope': $scope
        });
      });

    });


    it('Scope should be defined', function () {
      expect($scope).toBeDefined();
    });

    it('Scope.info should be set', function () {
      deferred.resolve(infoMock);
      $scope.$apply();
      expect($scope.info).toBeDefined();
      expect($scope.info.HOSTNAME).toEqual('csb');
    });

    it('SDCARD_SIZE, SDCARD_USED and estimatedTimeToFill should be hyphen when SDCARD is not present', function () {
      infoMock.SDCARD_PRESENT = 0;
      deferred.resolve(infoMock);
      $scope.$apply();

      expect($scope.info.SDCARD_SIZE).toEqual("\u2013");
      expect($scope.info.SDCARD_USED).toEqual("\u2013");
      expect($scope.info.estimatedTimeToFill).toEqual("\u2013");

      infoMock.SDCARD_PRESENT = 1;
      infoMock.DATALOGGER_OPSTATE = 2;
      deferred.resolve(infoMock);
      $scope.$apply();

      expect($scope.info.SDCARD_SIZE).toEqual("\u2013");
      expect($scope.info.SDCARD_USED).toEqual("\u2013");
      expect($scope.info.estimatedTimeToFill).toEqual("\u2013");
    });

    it('EstimatedTimeToFill should be a hyphen when datalogger state is \"No SD CARD\" or \"Logging Disabled\"', function () {
      infoMock.SDCARD_PRESENT = 1;
      infoMock.DATALOGGER_PARAMETER_COUNT = 1;
      infoMock.DATALOGGER_LOGGING_INTERVA = 900;
      infoMock.DATALOGGER_OPSTATE = 2;

      deferred.resolve(infoMock);
      $scope.$apply();

      expect($scope.info.estimatedTimeToFill).toEqual("\u2013");

      infoMock.DATALOGGER_OPSTATE = 5;
      expect($scope.info.estimatedTimeToFill).toEqual("\u2013");
    });

    it('Logging status should be \"Logging stopped\" if SD Card is full and estimatedTimeToFill should be \"No Free Space on SD Card\"', function () {
      infoMock.SDCARD_SIZE = 256;
      infoMock.SDCARD_USED = 256;
      infoMock.DATALOGGER_PARAMETER_COUNT = 1;
      infoMock.DATALOGGER_LOGGING_INTERVA = 900;
      infoMock.DATALOGGER_OPSTATE = 3;

      deferred.resolve(infoMock);
      $scope.$apply();

      expect($scope.info.loggingStatus).toEqual("Logging stopped");
      expect($scope.info.estimatedTimeToFill).toEqual("No Free Space on SD Card");
    });
  });


  describe('Mocking Estimated Time to fill months', function () {

    beforeEach(function () {

      module('conext_gateway.setup', function ($provide) {
        provide = $provide;
      });

      infoMock = readJSON('tests/unit/setup/info.mock.json');

      inject(function (_$rootScope_, _$controller_, _$q_, _gatewayInfoService_, _timeToFillCalculatorService_) {
        $q = _$q_;
        deferred = $q.defer();
        $scope = _$rootScope_.$new();
        gatewayInfoService = _gatewayInfoService_;
        timeToFillCalculatorService = _timeToFillCalculatorService_;
        spyOn(gatewayInfoService, 'getGatewayInfo').and.returnValue(deferred.promise);
        spyOn(timeToFillCalculatorService, 'getTimeToFillInMonths').and.callFake(function () {
          return timeToFillMonths;
        });
        provide.value('timeToFillCalculatorService', timeToFillCalculatorService);
        $controller = _$controller_('gatewayInfoController', {
          'gatewayInfoService': gatewayInfoService, '$scope': $scope
        });
      });

    });

    it('Should display \"Less than one month\" for time to fill ', function () {
      timeToFillMonths = Math.round(.9);
      infoMock.SDCARD_SIZE = 256;
      infoMock.SDCARD_USED = 0;
      infoMock.DATALOGGER_PARAMETER_COUNT = 1;
      infoMock.DATALOGGER_LOGGING_INTERVA = 900;
      infoMock.DATALOGGER_OPSTATE = 3;

      deferred.resolve(infoMock);
      $scope.$apply();

      expect($scope.info.estimatedTimeToFill).toEqual("Less than one month");

    });

    it('Should display \"2 Months\" for time to fill', function () {
      timeToFillMonths = Math.round(2.2);
      infoMock.SDCARD_SIZE = 256;
      infoMock.SDCARD_USED = 0;
      infoMock.DATALOGGER_PARAMETER_COUNT = 1;
      infoMock.DATALOGGER_LOGGING_INTERVA = 900;
      infoMock.DATALOGGER_OPSTATE = 3;

      deferred.resolve(infoMock);
      $scope.$apply();

      expect($scope.info.estimatedTimeToFill).toEqual("2 months");

    });


    it('Should display \"1 years and 10 months\" for time to fill', function () {
      timeToFillMonths = Math.round(22.3);
      infoMock.SDCARD_SIZE = 256;
      infoMock.SDCARD_USED = 0;
      infoMock.DATALOGGER_PARAMETER_COUNT = 1;
      infoMock.DATALOGGER_LOGGING_INTERVA = 900;
      infoMock.DATALOGGER_OPSTATE = 3;

      deferred.resolve(infoMock);
      $scope.$apply();

      expect($scope.info.estimatedTimeToFill).toEqual("1 years and 10 months");

    });

    it('Should display \"more than 10 years\" for time to fill', function () {
      timeToFillMonths = Math.round(120);
      infoMock.SDCARD_SIZE = 256;
      infoMock.SDCARD_USED = 0;
      infoMock.DATALOGGER_PARAMETER_COUNT = 1;
      infoMock.DATALOGGER_LOGGING_INTERVA = 900;
      infoMock.DATALOGGER_OPSTATE = 3;

      deferred.resolve(infoMock);
      $scope.$apply();

      expect($scope.info.estimatedTimeToFill).toEqual("More than 10 years");

    });

  });



});
