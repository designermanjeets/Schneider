describe('configurationController', function () {
  var $rootScope;
  var $scope;
  var $controller;
  var $log;
  var $interval;
  var $timeout;
  var responder;
  var configurationController;
  var csbQuery;
  var queryService;

  setupTranslation('conext_gateway.setup');
  beforeEach(angular.mock.module('conext_gateway.setup'));

  beforeEach(module('conext_gateway.setup', function($provide) {
    $provide.value('$log', console);
  }));

  beforeEach(inject(function($injector){
    var $q = $injector.get('$q');
    $interval = $injector.get('$interval');
    $timeout  = $injector.get('$timeout');

    // Use spies to avoid HTTP requests that we don't care about for these tests
    var gatewayConfigurationServiceProvider = $injector.get('gatewayConfigurationServiceProvider');
    spyOn(gatewayConfigurationServiceProvider, 'getConfigurationData').and.returnValue(
      $q.resolve({
        install_package: {},
        plant_setup: {},
        units: {},
        modbus_settings: {},
        quick_settings: {},
      }));
    var timezoneService = $injector.get('timezoneService');
    spyOn(timezoneService, 'getTimezoneList').and.returnValue(
      $q.resolve([]));

    queryService = $injector.get('queryService');
    spyOn( queryService, 'setSysvars').and.returnValue(
        $q.resolve(
            null // we never check the return value, so it doesn't matter
        ));

    csbQuery = $injector.get('csbQuery');
    spyOn(csbQuery, 'setFromObject').and.returnValue(
      $q.resolve(
        null // we never check the return value, so it doesn't matter
    ));

    $log = $injector.get('$log');
    spyOn($log, 'error').and.callThrough();
    spyOn($log, 'warn').and.callThrough();
    spyOn($log, 'debug'); // suppress debug messages

    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $scope = $rootScope.$new();
    configurationController = $controller('configurationController', {
      '$scope': $scope,
    });
    // Finish off the promises from initializing the controller
    $rootScope.$digest();
  }));

  afterEach(function() {
    expect($log.error).not.toHaveBeenCalled();
    expect($log.warn).not.toHaveBeenCalled();
  });

  initResponders();

  // Test various paths through the state machine
  describe("Firmware file upload", function() {
    var item;
    beforeEach(function() {
      item = {
        file: {
          name: 'foo.epkg',
        },
      };

      responder = new SysvarQueryResponder();
      responder.respondToSysvarQuery();
    });

    function startFirmwareUpload() {
      // State is uploading until processing finishes
      $scope.updateFirmware.uploader.onBeforeUploadItem(item);
      $scope.updateFirmware.uploader.onProgressItem(item, 0);
      expect($scope.updateFirmware.state).toBe('uploading');

      // When uploading finishes, state should remain as uploading until the sysvar query
      $scope.updateFirmware.uploader.onProgressItem(item, 100);
      expect($scope.updateFirmware.state).toBe('uploading');

      // Next state: Extracting
      responder.addSysvars([
        {name: '/SCB/UPLOAD/PROGRESS', value: 'eExtracting'},
      ]);
      $interval.flush(5000);
      HttpResponder.flush();
      expect(queryService.setSysvars).toHaveBeenCalledWith(jasmine.objectContaining({
        '/SCB/UPLOAD/PROGRESS': 'eNotStarted',
      }), jasmine.objectContaining({ 'apply' : false }));
      expect($scope.updateFirmware.state).toBe('processing');
      expect($scope.updateFirmware.processing_message).toBe("Extracting package content");

      // Next state: Verifying
      responder.addSysvars([
        {name: '/SCB/UPLOAD/PROGRESS', value: 'eVerifyingPackage'},
      ]);
      $interval.flush(5000);
      HttpResponder.flush();
      expect($scope.updateFirmware.state).toBe('processing');
      expect($scope.updateFirmware.processing_message).toBe("Validating Package");
    }

    var conditions = [
      // In most browsers, the POST request finishes normally after the file
      // upload completes.
      {
        name: 'POST request finishes',
        isErrorCondition: false,
        check: 'processing',
        finishUpload: function() {
          // End of upload triggered by the POST request finishing
          $scope.updateFirmware.uploader.onSuccessItem(item);
          // No interval flush needed here, because we're not waiting on an interval
          HttpResponder.flush();
          $rootScope.$digest();
        }
      },

      // In some browsers, the POST request never finishes after the upload
      // completes. It just hangs forever. See CSBQNX-656.
      {
        name: 'POST request does not finish',
        isErrorCondition: false,
        check: 'needs-reboot',
        finishUpload: function() {
          $interval.flush(5000);
          HttpResponder.flush();
          $rootScope.$digest();
        }
      },

      // Test the onErrorItem handler
      {
        name: 'POST request causes an error',
        isErrorCondition: true,
        check: 'error',
        finishUpload: function() {
          // Simulate POST request returning an error
          $scope.updateFirmware.uploader.onErrorItem(item);
          // No interval flush needed here, because we're not waiting on an interval
          HttpResponder.flush();
          $rootScope.$digest();
        },
      },
    ];

    conditions.forEach(function(condition) {
      describe(condition.name, function() {

        if (condition.isErrorCondition === false) {
          it("Should handle a normal upload", function() {
            startFirmwareUpload();

            responder.addSysvars([
              {name: '/SCB/UPLOAD/PROGRESS', value: 'eDone'},
            ]);

            condition.finishUpload();

            expect($scope.updateFirmware.state).toBe(condition.check);
          });
        }
        else {
          it("Should handle an upload where PROGRESS = eDone, but POST request fails anyways", function() {
            startFirmwareUpload();

            responder.addSysvars([
              {name: '/SCB/UPLOAD/PROGRESS', value: 'eDone'},
            ]);

            condition.finishUpload();

            expect($scope.updateFirmware.state).toBe(condition.check);
            expect($scope.updateFirmware.errorMessage).toBe('Package upload failed');
          });
        }

        it("Should handle extraction failed", function() {
          startFirmwareUpload();

          responder.addSysvars([
            {name: '/SCB/UPLOAD/PROGRESS', value: 'eExtractionFailed'},
          ]);

          condition.finishUpload();

          expect($scope.updateFirmware.state).toBe('error');
          expect($scope.updateFirmware.errorMessage).toBe("Failed to extract package");
        });
      });
    });
  });
});
