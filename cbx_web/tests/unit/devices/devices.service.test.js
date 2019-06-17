"use strict";

describe('deviceService', function() {
  var deviceService;
  var $log;

  setupTranslation('conext_gateway.devices');
  beforeEach(angular.mock.module('conext_gateway.devices'));

  beforeEach(module('conext_gateway.devices', function($provide) {
    $provide.value('$log', console);
  }));

  beforeEach(inject(function(_deviceService_, _$log_){
    deviceService = _deviceService_;
    $log = _$log_;
    spyOn($log, 'error').and.callThrough();
    spyOn($log, 'debug'); // suppress debug messages
  }));

  initResponders();
  var deviceResponder, alarmsResponder;
  beforeEach(function() {
    deviceResponder = new DeviceOverviewQueryResponder();
    alarmsResponder = new AlarmsResponder();
  });

  afterEach(function() {
    expect($log.error).not.toHaveBeenCalled();
  });

  describe('getInverters', function() {
    beforeEach(function() {
      alarmsResponder.respondToAlarmsQuery([]); // no alarms
    });

    describe('software build number', function() {
      it('all 3 components are present', function() {
        deviceResponder.respondToInverterQuery([{
          ID: 'A-7', deviceSysvarName: 'BUS1_ConextCL_7',

          SoftwareBuildA: 'BN01',
          SoftwareBuildB: 'BN02',
          SoftwareBuildC: 'BN03',
        }]);
        deviceService.getInverters().then(function(inverters) {
          expect(inverters[0].SoftwareBuild).toBe('BN01,BN02,BN03');
        });
        HttpResponder.flush();
      });

      it('1 component is missing', function() {
        deviceResponder.respondToInverterQuery([{
          ID: 'A-7', deviceSysvarName: 'BUS1_ConextCL_7',

          SoftwareBuildA: 'BN01',
          SoftwareBuildB: '',
          SoftwareBuildC: 'BN03',
        }]);
        deviceService.getInverters().then(function(inverters) {
          // Result should have just one comma between part A and part C
          expect(inverters[0].SoftwareBuild).toBe('BN01,BN03');
        });
        HttpResponder.flush();
      });
      it('all components are missing', function() {
        deviceResponder.respondToInverterQuery([{
          ID: 'A-7', deviceSysvarName: 'BUS1_ConextCL_7',

          SoftwareBuildA: '',
          SoftwareBuildB: '',
          SoftwareBuildC: '',
        }]);
        deviceService.getInverters().then(function(inverters) {
          expect(inverters[0].SoftwareBuild).toBe('');
        });
        HttpResponder.flush();
      });
    });
  });

  describe('getSensors', function() {
    beforeEach(function() {
      alarmsResponder.respondToAlarmsQuery([]); // no alarms
    });

    describe('Temperature conversion', function() {
      it('Should convert Farenheit values', function() {
        deviceResponder.respondToSensorQuery([{
          ID: 'A-7', deviceSysvarName: 'BUS1_PVMET200_11',
          Unit: 'F',
          Value: '0', // Unit says F, but value is still in C
        }]);
        deviceService.getSensors().then(function(sensors) {
          expect(sensors.length).toBe(1);
          expect(sensors[0].Unit).toBe('°F'); // add the degree sign
          expect(sensors[0].Value).toBe(32);
        });
        HttpResponder.flush();
      });

      it('Should not convert Celsius values', function() {
        deviceResponder.respondToSensorQuery([{
          ID: 'A-7', deviceSysvarName: 'BUS1_PVMET200_11',
          Unit: 'C',
          Value: '0',
        }]);
        deviceService.getSensors().then(function(sensors) {
          expect(sensors.length).toBe(1);
          expect(sensors[0].Unit).toBe('°C'); // add the degree sign
          expect(sensors[0].Value).toBe(0); // unchanged
        });
        HttpResponder.flush();
      });
    });
  });

  describe('Alarms', function() {
    beforeEach(function() {
      // There's no particular reason for testing sensors, as opposed
      // to the other device types. One type is as good as another.
      deviceResponder.respondToSensorQuery([{
        ID: 'A-7', deviceSysvarName: 'BUS1_PVMET200_11',
      }])
    });

    it('Should set alarms & warnings to false when query is empty', function() {
      alarmsResponder.respondToAlarmsQuery([
      ]);
      deviceService.getSensors().then(function(sensors) {
        expect(sensors.length).toBe(1);
        expect(sensors[0].hasAlarms).toBe(false);
        expect(sensors[0].hasWarnings).toBe(false);
      })
      HttpResponder.flush();
    });

    it('Should set alarms to true when an Fault occurs', function() {
      alarmsResponder.respondToAlarmsQuery([
        // Fault means warning
        {DeviceID: 'BUS1_PVMET200_11', Type: 'Fault'},
      ]);
      deviceService.getSensors().then(function(sensors) {
        expect(sensors.length).toBe(1);
        expect(sensors[0].hasAlarms).toBe(true);
        expect(sensors[0].hasWarnings).toBe(false);
      })
      HttpResponder.flush();
    })

    it('Should set alarms to true when an error occurs', function () {
      alarmsResponder.respondToAlarmsQuery([
        // Fault means warning
        { DeviceID: 'BUS1_PVMET200_11', Type: 'Error' },
      ]);
      deviceService.getSensors().then(function (sensors) {
        expect(sensors.length).toBe(1);
        expect(sensors[0].hasAlarms).toBe(true);
        expect(sensors[0].hasWarnings).toBe(false);
      })
      HttpResponder.flush();
    })

    it('Should set warnings to true when a warning occurs', function() {
      alarmsResponder.respondToAlarmsQuery([
        // Fault means warning
        {DeviceID: 'BUS1_PVMET200_11', Type: 'Warning'},
      ]);
      deviceService.getSensors().then(function(sensors) {
        expect(sensors.length).toBe(1);
        expect(sensors[0].hasAlarms).toBe(false);
        expect(sensors[0].hasWarnings).toBe(true);
      })
      HttpResponder.flush();
    })

    it('Should set warnings to true and also Error when a warning and error occurs', function () {
      alarmsResponder.respondToAlarmsQuery([
        // Fault means warning
        { DeviceID: 'BUS1_PVMET200_11', Type: 'Warning' },
        { DeviceID: 'BUS1_PVMET200_11', Type: 'Error' },
      ]);
      deviceService.getSensors().then(function (sensors) {
        expect(sensors.length).toBe(1);
        expect(sensors[0].hasAlarms).toBe(true);
        expect(sensors[0].hasWarnings).toBe(true);
      })
      HttpResponder.flush();
    })
  });
});
