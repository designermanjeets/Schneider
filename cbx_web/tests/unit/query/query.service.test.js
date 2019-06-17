describe("Query service", function() {
  var queryService;
  var $log;
  var $httpBackend;

  setupTranslation('conext_gateway.query');
  beforeEach(angular.mock.module('conext_gateway.query'));
  beforeEach(inject(function(_queryService_, _$log_, _$httpBackend_) {
    queryService = _queryService_;
    $log = _$log_;
    $httpBackend = _$httpBackend_;

    spyOn($log, 'debug'); // suppress messages
    spyOn($log, 'warn').and.callThrough();
    spyOn($log, 'error').and.callThrough();
  }));

  var expectLogErrorToBeCalled;
  beforeEach(function() {
    expectLogErrorToBeCalled = false;
  });
  afterEach(function() {
    expect($log.warn).not.toHaveBeenCalled();
    if (expectLogErrorToBeCalled) {
      expect($log.error).toHaveBeenCalled();
    }
    else {
      expect($log.error).not.toHaveBeenCalled();
    }
  })

  var getResponder, setResponder;
  initResponders();

  describe("getSysvars", function() {
    it("Should handle nested objects", function() {
      var queryVars = {
        modbus_settings: ['SCB.BUS1.BAUDRATE', 'SCB.BUS1.PARITY'],
        units: ['HMI.TEMPERATURE.UNIT'],
      };

      getResponder = new SysvarQueryResponder();
      getResponder.respondToSysvarQuery([
        {name: 'SCB.BUS1.BAUDRATE',      value: '9600', quality: 'G'},
        {name: 'SCB.BUS1.PARITY',        value: '0',    quality: 'IO'},
        {name: 'HMI.TEMPERATURE.UNIT',   value: 'C',    quality: 'Q'},
      ])

      queryService.getSysvars(queryVars).then(function(data) {
        expect(Object.keys(data.modbus_settings).length).toBe(2 + 1); // +1 for META
        expect(Object.keys(data.modbus_settings.META).length).toBe(2);

        expect(data.modbus_settings.SCB_BUS1_BAUDRATE).toBe('9600');
        expect(data.modbus_settings.META.SCB_BUS1_BAUDRATE).toBe('G');
        expect(data.modbus_settings.SCB_BUS1_PARITY).toBe('0');
        expect(data.modbus_settings.META.SCB_BUS1_PARITY).toBe('IO');

        expect(Object.keys(data.units).length).toBe(1 + 1); // +1 for META
        expect(Object.keys(data.units.META).length).toBe(1);
        expect(data.units.HMI_TEMPERATURE_UNIT).toBe('C');
        expect(data.units.META.HMI_TEMPERATURE_UNIT).toBe('Q');
      }).catch(function(error) {
        expect(error).not.toBeDefined();
        expect(false).toBe(true);
      });

      HttpResponder.flush();
    });

    it("Should handle a flat list of sysvars", function() {
      var sysvars = [
        'TIMEZONE', 'TIME.LOCAL_ISO_STR'
      ];
      getResponder = new SysvarQueryResponder();
      getResponder.respondToSysvarQuery([
        {name: 'TIMEZONE',           value: 'Asia/Jakarta', quality: 'G'},
        {name: 'TIME.LOCAL_ISO_STR', value: 'TIME',         quality: 'IO'},
      ]);

      queryService.getSysvars(sysvars).then(function(data) {
        expect(Object.keys(data).length).toBe(2 + 1); // +1 for META

        expect(data.TIMEZONE).toBe('Asia/Jakarta');
        expect(data.META.TIMEZONE).toBe('G');
        expect(data.TIME_LOCAL_ISO_STR).toBe('TIME');
        expect(data.META.TIME_LOCAL_ISO_STR).toBe('IO');
      }).catch(function(error) {
        expect(error).not.toBeDefined();
        expect(false).toBe(true);
      });
      HttpResponder.flush();
    });

    it("Should be able to do a non-authenticated query", function() {
      var sysvars = [
        'LOGIN.ATTEMPTS',
      ];
      getResponder = new SysvarQueryResponder({
        url: '/ns/get',
      });
      getResponder.respondToSysvarQuery([
        {name: 'LOGIN.ATTEMPTS',  value: '0', quality: 'G'},
      ]);

      queryService.getSysvars(sysvars, {
        authenticate: false,
      }).then(function(data) {
        expect(Object.keys(data).length).toBe(1 + 1); // +1 for META

        expect(data.LOGIN_ATTEMPTS).toBe('0');
        expect(data.META.LOGIN_ATTEMPTS).toBe('G');
      }).catch(function(error) {
        expect(error).not.toBeDefined();
        expect(false).toBe(true);
      });
      HttpResponder.flush();
    });

    describe("Error handling", function() {
      it("Should detect missing sysvars in a flat response", function() {
        expectLogErrorToBeCalled = true;
        var sysvars = [
          'TIMEZONE', 'TIME.LOCAL_ISO_STR'
        ];
        getResponder = new SysvarQueryResponder();
        getResponder.respondToSysvarQuery([
          {name: 'TIMEZONE',           value: 'Asia/Jakarta', quality: 'G'},
          // TIME.LOCAL_ISO_STR is missing
        ]);

        queryService.getSysvars(sysvars).then(function(data) {
          expect(false).toBe(true); // query should not succeed
        }).catch(function(error) {
          expect(error).toBeDefined();
        }).finally(function() {
          expect($log.error).toHaveBeenCalledWith("Missing sysvar: TIME.LOCAL_ISO_STR");
        });
        HttpResponder.flush();
      });

      it("Should detect missing sysvars in a nested response", function() {
        expectLogErrorToBeCalled = true;
        var sysvars = {
          time: [
            'TIMEZONE', 'TIME.LOCAL_ISO_STR'
          ],
        };
        getResponder = new SysvarQueryResponder();
        getResponder.respondToSysvarQuery([
          {name: 'TIMEZONE',           value: 'Asia/Jakarta', quality: 'G'},
          // TIME.LOCAL_ISO_STR is missing
        ]);

        queryService.getSysvars(sysvars).then(function(data) {
          expect(false).toBe(true); // query should not succeed
        }).catch(function(error) {
          expect(error).toBeDefined();
        }).finally(function() {
          expect($log.error).toHaveBeenCalledWith("Missing sysvar: TIME.LOCAL_ISO_STR");
        });
        HttpResponder.flush();
      });

      describe("Unit tests can disable detection of missing sysvars", function() {
        beforeEach(inject(function(_queryConfigService_) {
          var queryConfigService = _queryConfigService_;

          spyOn(queryConfigService, 'willCheckForMissingSysvars').and.returnValue(false);
        }));

        it("sysvars can be missing in a flat response", function() {
          var sysvars = [
            'TIMEZONE', 'TIME.LOCAL_ISO_STR'
          ];
          getResponder = new SysvarQueryResponder();
          getResponder.respondToSysvarQuery([
            {name: 'TIMEZONE',           value: 'Asia/Jakarta', quality: 'G'},
            // TIME.LOCAL_ISO_STR is missing
          ]);

          queryService.getSysvars(sysvars).then(function(data) {
            expect(data.TIMEZONE).toBeDefined();
            expect(data.TIME_LOCAL_ISO_STR).not.toBeDefined();

          }).catch(function(error) {
            expect(error).not.toBeDefined();
          });
          HttpResponder.flush();
        });

        it("Sysvars can be missing in a nested response", function() {
          var sysvars = {
            time: [
              'TIMEZONE', 'TIME.LOCAL_ISO_STR'
            ],
          };
          getResponder = new SysvarQueryResponder();
          getResponder.respondToSysvarQuery([
            {name: 'TIMEZONE',           value: 'Asia/Jakarta', quality: 'G'},
            // TIME.LOCAL_ISO_STR is missing
          ]);

          queryService.getSysvars(sysvars).then(function(data) {
            expect(data.time.TIMEZONE).toBeDefined();
            expect(data.time.TIME_LOCAL_ISO_STR).not.toBeDefined();
          }).catch(function(error) {
            expect(error).not.toBeDefined();
          });
          HttpResponder.flush();
        });
      });

      it("Should handle a response that contains no sysvars", function() {
        expectLogErrorToBeCalled = true;
        sysvars = [
          'TIMEZONE', 'TIME.LOCAL_ISO_STR'
        ];
        getResponder = new SysvarQueryResponder();
        getResponder.respondToSysvarQuery([
          // List is empty
        ]);

        queryService.getSysvars(sysvars).then(function(data) {
          expect(false).toBe(true); // query should not succeed
        }).catch(function(error) {
          expect(error).toBeDefined();
        }).finally(function() {
          // error message should compain about the first missing sysvar
          expect($log.error).toHaveBeenCalledWith("Missing sysvar: TIMEZONE");
        });
        HttpResponder.flush();
      });

      it("Should fail when passed an invalid option", function() {
        expectLogErrorToBeCalled = true;
        sysvars = [
          'TIMEZONE', 'TIME.LOCAL_ISO_STR'
        ];

        queryService.getSysvars(sysvars, {
          invalid: true,
        }).then(function() {
          expect(false).toBe(true); // should not happen
        }).finally(function() {
          expect($log.error).toHaveBeenCalled();
        });
      });
    });
  });

  describe("getMatchingSysvars", function() {
    it("Should return the contents of a tag", function() {
      getResponder = new SysvarQueryResponder({
        type: 'tag',
      });
      getResponder.respondToSysvarQuery([
        {name: 'LOGIN.ATTEMPTS',  value: '0', quality: 'G'},
      ]);

      queryService.getMatchingSysvars({tags: ['Dummy:Tag']}).then(function(data) {
        expect(Object.keys(data).length).toBe(1 + 1); // +1 for META

        expect(data.LOGIN_ATTEMPTS).toBe('0');
        expect(data.META.LOGIN_ATTEMPTS).toBe('G');
      }).catch(function(error) {
        expect(false).toBe(true);
      });
      HttpResponder.flush();
    });

    it("Should return the contents of a match", function() {
      getResponder = new SysvarQueryResponder({
        type: 'match',
      });
      getResponder.respondToSysvarQuery([
        {name: 'LOGIN.ATTEMPTS',  value: '0', quality: 'G'},
      ]);

      queryService.getMatchingSysvars({match: 'dummy'}).then(function(data) {
        expect(Object.keys(data).length).toBe(1 + 1); // +1 for META

        expect(data.LOGIN_ATTEMPTS).toBe('0');
        expect(data.META.LOGIN_ATTEMPTS).toBe('G');
      }).catch(function(error) {
        expect(false).toBe(true);
      });
      HttpResponder.flush();
    });

    it("Should return the contents of a match and a tag", function() {
      getResponder = new SysvarQueryResponder({
        type: 'match+tag',
      });
      getResponder.respondToSysvarQuery([
        {name: 'LOGIN.ATTEMPTS',  value: '0', quality: 'G'},
      ]);

      queryService.getMatchingSysvars({match: 'dummy', tags: ['foo']}).then(function(data) {
        expect(Object.keys(data).length).toBe(1 + 1); // +1 for META

        expect(data.LOGIN_ATTEMPTS).toBe('0');
        expect(data.META.LOGIN_ATTEMPTS).toBe('G');
      }).catch(function(error) {
        expect(false).toBe(true);
      });
      HttpResponder.flush();
    });


    it("Should fail when passed no criteria", function() {
      expectLogErrorToBeCalled = true;

      queryService.getMatchingSysvars({}).then(function(data) {
        // don't call this
        expect(false).toBe(true);
      });
    });
  });

  describe("getSysvarsByTags", function() {
    it("Should return the contents of a tag", function() {
      getResponder = new SysvarQueryResponder({
        type: 'tag',
      });
      getResponder.respondToSysvarQuery([
        {name: 'LOGIN.ATTEMPTS',  value: '0', quality: 'G'},
      ]);

      queryService.getSysvarsByTags(['Dummy:Tag']).then(function(data) {
        expect(Object.keys(data).length).toBe(1 + 1); // +1 for META

        expect(data.LOGIN_ATTEMPTS).toBe('0');
        expect(data.META.LOGIN_ATTEMPTS).toBe('G');
      }).catch(function(error) {
        expect(false).toBe(true);
      });
      HttpResponder.flush();
    });

    it("Should handle getting an empty list back", function() {
      getResponder = new SysvarQueryResponder({
        type: 'tag',
      });
      getResponder.respondToSysvarQuery([]);

      queryService.getSysvarsByTags(['Dummy:Tag']).then(function(data) {
        expect(data).toEqual({
          META: {},
        });
      }).catch(function(error) {
        expect(false).toBe(true);
      });
      HttpResponder.flush();
    });

    it("Should fail when passed an invalid option", function() {
      expectLogErrorToBeCalled = true;
      queryService.getSysvarsByTags(['Dummy:Tag'], {
        invalid: true,
      }).then(function() {
        expect(false).toBe(true); // should not happen
      }).finally(function() {
        expect($log.error).toHaveBeenCalled();
      });
    });

  });

  describe("setSysvars", function() {
    it("Should handle nested objects with queryVars", function() {
      var queryVars = {
        modbus_settings: ['SCB.BUS1.BAUDRATE', 'SCB.BUS1.PARITY'],
        units: ['HMI.TEMPERATURE.UNIT'],
      };
      var newValues = {
        // Use mangled sysvar names, because we have queryVars
        // available to un-mangle them.
        modbus_settings: {
          SCB_BUS1_BAUDRATE: 9600,
          SCB_BUS1_PARITY: 0,
        },
        units: {
          HMI_TEMPERATURE_UNIT: 'F',
        },
      };

      setResponder = new SysvarSetResponder();
      setResponder.respondToSysvarSet([
        {name: 'SCB.BUS1.BAUDRATE', result: 0},
        {name: 'SCB.BUS1.PARITY', result: 0},
        {name: 'HMI.TEMPERATURE.UNIT', result: 0},
      ]);

      queryService
        .setSysvars(newValues, {queryVars: queryVars})
        .then(function() {
          // Nothing to test here
        }).catch(function(error) {
          expect(error).not.toBeDefined();
          expect(false).toBe(true);
        });
      HttpResponder.flush();
    });

    it("Should handle nested objects without queryVars", function() {
      var newValues = {
        // Use non-mangled sysvar names, because without queryVars
        // we have no way to un-mangle them.
        modbus_settings: {
          'SCB.BUS1.BAUDRATE': 9600,
          'SCB.BUS1.PARITY': 0,
        },
        units: {
          'HMI.TEMPERATURE.UNIT': 'F',
        },
      };

      setResponder = new SysvarSetResponder();
      setResponder.respondToSysvarSet([
        {name: 'SCB.BUS1.BAUDRATE', result: 0},
        {name: 'SCB.BUS1.PARITY', result: 0},
        {name: 'HMI.TEMPERATURE.UNIT', result: 0},
      ]);

      queryService
        .setSysvars(newValues)
        .then(function() {
          // Nothing to test here
        }).catch(function(error) {
          expect(error).not.toBeDefined();
          expect(false).toBe(true);
        });
      HttpResponder.flush();
    });

    it("Should handle flat objects with flat queryVars", function() {
      var queryVars = {
        'SCB.BUS1.BAUDRATE': 9600,
        'SCB.BUS1.PARITY': 0,
      };
      var newValues = {
        // Use mangled sysvar names, because we have queryVars
        // available to un-mangle them.
        SCB_BUS1_BAUDRATE: 9600,
        SCB_BUS1_PARITY: 0,
      };

      setResponder = new SysvarSetResponder();
      setResponder.respondToSysvarSet([
        {name: 'SCB.BUS1.BAUDRATE', result: 0},
        {name: 'SCB.BUS1.PARITY', result: 0},
      ]);

      queryService
        .setSysvars(newValues, {queryVars: queryVars})
        .then(function() {
          // Nothing to test here
        }).catch(function(error) {
          expect(error).not.toBeDefined();
          expect(false).toBe(true);
        });
      HttpResponder.flush();
    });

    it("Should handle flat objects with nested queryVars", function() {
      // queryVars is nested, but newValues is not. This is something
      // we do in conext_gatewayConfigurationServiceProvider, so test to ensure
      // that it works.
      var queryVars = {
        modbus_settings: [
          'SCB.BUS1.BAUDRATE',
          'SCB.BUS1.PARITY',
        ]
      };
      var newValues = {
        // Use mangled sysvar names, because we have queryVars
        // available to un-mangle them.
        SCB_BUS1_BAUDRATE: 9600,
        SCB_BUS1_PARITY: 0,
      };

      setResponder = new SysvarSetResponder();
      setResponder.respondToSysvarSet([
        {name: 'SCB.BUS1.BAUDRATE', result: 0},
        {name: 'SCB.BUS1.PARITY', result: 0},
      ]);

      queryService
        .setSysvars(newValues, {queryVars: queryVars})
        .then(function() {
          // Nothing to test here
        }).catch(function(error) {
          expect(error).not.toBeDefined();
          expect(false).toBe(true);
        });
      HttpResponder.flush();
    });


    it("Should handle flat objects without queryVars", function() {
      var newValues = {
        // Use raw sysvar names, because queryVars isn't available
        'SCB.BUS1.BAUDRATE': 9600,
        'SCB.BUS1.PARITY': 0,
      };

      setResponder = new SysvarSetResponder();
      setResponder.respondToSysvarSet([
        {name: 'SCB.BUS1.BAUDRATE', result: 0},
        {name: 'SCB.BUS1.PARITY', result: 0},
      ]);

      queryService
        .setSysvars(newValues)
        .then(function() {
          // Nothing to test here
        }).catch(function(error) {
          expect(error).not.toBeDefined();
          expect(false).toBe(true);
        });
      HttpResponder.flush();
    });

    it("Should sort sysvars according to the order option", function() {
      var newValues = {
        // Use raw sysvar names, because queryVars isn't available
        'SCB.BUS1.BAUDRATE': 9600,
        'SCB.BUS1.PARITY': 0,
        'SCB.BUS1.PORTNUM': 2,
      };

      setResponder = new SysvarSetResponder({
        onPost: function(data) {
          expect(data.values).toEqual([
            // In the same order as in the order option
            {name: 'SCB.BUS1.PORTNUM', value: 2},
            {name: 'SCB.BUS1.PARITY', value: 0},
            {name: 'SCB.BUS1.BAUDRATE', value: 9600},
          ]);
        }
      });
      setResponder.respondToSysvarSet([
        {name: 'SCB.BUS1.BAUDRATE', result: 0},
        {name: 'SCB.BUS1.PARITY', result: 0},
        {name: 'SCB.BUS1.PORTNUM', result: 0},
      ]);

      queryService
        .setSysvars(newValues, {
          order: [
            'SCB.BUS1.PORTNUM',
            'SCB.BUS1.PARITY',
            'SCB.BUS1.BAUDRATE',
          ]
        })
        .then(function() {
          // Nothing to test here
        }).catch(function(error) {
          expect(error).not.toBeDefined();
          expect(false).toBe(true);
        });
      HttpResponder.flush();
    });

    it("Should sort sysvars alphabetically if order unspecified", function() {
      var newValues = {
        // Use raw sysvar names, because queryVars isn't available
        'SCB.BUS1.BAUDRATE': 9600,
        'SCB.BUS1.PARITY': 0,
        'SCB.BUS1.PORTNUM': 2,
      };

      setResponder = new SysvarSetResponder({
        onPost: function(data) {
          expect(data.values).toEqual([
            // In alphabetical order
            {name: 'SCB.BUS1.BAUDRATE', value: 9600},
            {name: 'SCB.BUS1.PARITY', value: 0},
            {name: 'SCB.BUS1.PORTNUM', value: 2},
          ]);
        }
      });
      setResponder.respondToSysvarSet([
        {name: 'SCB.BUS1.BAUDRATE', result: 0},
        {name: 'SCB.BUS1.PARITY', result: 0},
        {name: 'SCB.BUS1.PORTNUM', result: 0},
      ]);

      queryService
        .setSysvars(newValues).then(function() {
          // Nothing to test here
        }).catch(function(error) {
          expect(error).not.toBeDefined();
          expect(false).toBe(true);
        });
      HttpResponder.flush();
    });


    it("Should fail if queryVars is missing a sysvar", function() {
      expectLogErrorToBeCalled = true;
      var queryVars = {
        modbus_settings: ['SCB.BUS1.BAUDRATE'], // parity is missing
      };
      var newValues = {
        modbus_settings: {
          SCB_BUS1_BAUDRATE: 9600,
          SCB_BUS1_PARITY: 0,
        },
      };

      // No HTTP response needed, because it should abort before
      // it gets that far.

      queryService
        .setSysvars(newValues, {queryVars: queryVars})
        .then(function() {
          expect(false).toBe(true); // shouldn't get here
        }).catch(function(error) {
          expect(error).toBeDefined();
        }).finally(function() {
          expect($log.error).toHaveBeenCalledWith(
              "queryVars did not have an entry for: SCB_BUS1_PARITY");
        });
    });

    it("Should be able to suppress the call to apply", function() {
      var queryVars = {
        units: ['HMI.TEMPERATURE.UNIT'],
      };
      var newValues = {
        units: {
          HMI_TEMPERATURE_UNIT: 'F',
        },
      };

      setResponder = new SysvarSetResponder({
        apply: false, // Expect /apply NOT to be called
      });
      setResponder.respondToSysvarSet([
        {name: 'HMI.TEMPERATURE.UNIT', result: 0},
      ]);

      queryService
        .setSysvars(newValues, {queryVars: queryVars, apply: false})
        .then(function() {
          // Nothing to test here
        }).catch(function(error) {
          expect(error).not.toBeDefined();
          expect(false).toBe(true);
        });
      HttpResponder.flush();
    });

    it("Should be able to do a non-authenticated set", function() {
      var newValues = {
        'HMI.TEMPERATURE.UNIT': 'F',
      };
      setResponder = new SysvarSetResponder({
        url    : '/ns/set',
        format : 'querystring',
      });
      setResponder.respondToSysvarSet([
        {name: 'HMI.TEMPERATURE.UNIT', result: 0},
      ]);
      queryService
        .setSysvars(newValues, {authenticate: false})
        .then(function() {
          // Nothing to test here
        }).catch(function(error) {
          expect(error).not.toBeDefined();
          expect(false).toBe(true);
        });
      HttpResponder.flush();
    });

    it("Should be able to sort a non-authenticated set", function() {
      var newValues = {
        'HMI.TEMPERATURE.UNIT' : 'F',
        'HMI.WINDSPEED.UNIT'   : 'm/s',
        'HMI.IRRADIANCE.UNIT'  : 'W/m2',
      };
      setResponder = new SysvarSetResponder({
        url    : '/ns/set',
        format : 'querystring',
        onPost : function(data) {
          expect(data).toEqual(
            "HMI.WINDSPEED.UNIT=m/s&" +
            "HMI.TEMPERATURE.UNIT=F&" +
            "HMI.IRRADIANCE.UNIT=W/m2"
            )
        }
      });
      setResponder.respondToSysvarSet([
        {name: 'HMI.TEMPERATURE.UNIT', result: 0},
        {name: 'HMI.WINDSPEED.UNIT', result: 0},
        {name: 'HMI.IRRADIANCE.UNIT', result: 0},
      ]);
      var order = [
        'HMI.WINDSPEED.UNIT',
        'HMI.TEMPERATURE.UNIT',
        'HMI.IRRADIANCE.UNIT',
      ];
      queryService
        .setSysvars(newValues, {
          authenticate : false,
          order        : order,
        }).then(function() {
          true;
          // Nothing to test here
        }).catch(function(error) {
          expect(error).not.toBeDefined();
          expect(false).toBe(true);
        });
      HttpResponder.flush();
    });


    it("Should fail if the call to /apply fails", function() {
      expectLogErrorToBeCalled = true;
      var newValues = {
        'HMI.TEMPERATURE.UNIT': 'F',
      };

      setResponder = new SysvarSetResponder({
        apply: 500, // HTTP response code
      });
      setResponder.respondToSysvarSet([
        {name: 'HMI.TEMPERATURE.UNIT', result: 0},
      ]);

      queryService.setSysvars(newValues)
        .then(function() {
          expect(false).toBe(true); // shouldn't get here
        }).catch(function(error) {
          expect(error).toBeDefined();
        }).finally(function() {
          expect($log.error).toHaveBeenCalled();
        });
      HttpResponder.flush();
    });

    it("Should fail when passed an invalid option", function() {
      expectLogErrorToBeCalled = true;
      var newValues = {
        'HMI.TEMPERATURE.UNIT': 'F',
      };

      queryService.setSysvars(newValues, {
        invalid: true,
      }).then(function() {
        expect(false).toBe(true); // should not happen
      }).finally(function() {
        expect($log.error).toHaveBeenCalled();
      });
    });

    it("Should fail if given a mix of single- and multi-level sysvars", function() {
      expectLogErrorToBeCalled = true;
      var newValues = {
        // Don't mix single-level and multi-level sysvars
        'HMI.TEMPERATURE.UNIT': 'F',
        modbus_settings: {
          'SCB.BUS1.BAUDRATE': 9600,
          'SCB.BUS1.PARITY': 0,
        },
      };

      // No HTTP setup, because it should fail before getting that far

      queryService.setSysvars(newValues).then(function() {
        expect(false).toBe(true); // should not happen
      }).finally(function() {
        expect($log.error).toHaveBeenCalled();
      });
    });

    describe("Should fail if...", function() {
      var queryVars, newValues;
      beforeEach(function() {
        queryVars = {
          units: ['HMI.TEMPERATURE.UNIT'],
        };
        newValues = {
          units: {
            HMI_TEMPERATURE_UNIT: 'F',
          },
        };
        expectLogErrorToBeCalled = true;
      });

      [false, true].forEach(function(apply) {
        describe("Apply: " + apply, function() {
          it("Sysvar set has nonzero result", function() {
            setResponder = new SysvarSetResponder({
              apply: apply,
            });
            setResponder.respondToSysvarSet([
              {name: 'HMI.TEMPERATURE.UNIT', result: 1},
            ]);

            queryService
              .setSysvars(newValues, {queryVars: queryVars, apply: apply})
              .then(function() {
                // Should not succeed
                expect(false).toBe(true);
              }).catch(function(error) {
                expect(error).toBeDefined();
              });

            HttpResponder.flush();
          });
        });
      });
    });
  });

  describe("createRequestObject", function() {
    it("Should handle a single-level object", function() {
      var valuesToSet = {
        SCB_BUS1_BAUDRATE: 9600,
        SCB_BUS1_PARITY: 0,
      };
      var expected = {
        values: [
          {name: 'SCB_BUS1_BAUDRATE', value: 9600},
          {name: 'SCB_BUS1_PARITY',   value: 0},
        ]
      };

      var requestObject = queryService._createRequestObject(valuesToSet);
      expect(requestObject).toEqual(expected);
    });
    it("Should handle a two-level object", function() {
      // valuesToSet uses mangled names
      var valuesToSet = {
        modbus_settings: {
          SCB_BUS1_BAUDRATE: 9600,
          SCB_BUS1_PARITY: 0,
        },
        units: {
          HMI_TEMPERATURE_UNIT: 'C',
        }
      };
      var expected = {
        values: [
          {name: 'SCB_BUS1_BAUDRATE', value: 9600},
          {name: 'SCB_BUS1_PARITY',   value: 0},
          {name: 'HMI_TEMPERATURE_UNIT',   value: 'C'},
        ]
      };

      var requestObject = queryService._createRequestObject(valuesToSet);
      expect(requestObject).toEqual(expected);
    });
  });

  describe("sortRequestObject", function() {
    function makeRequestObject(sysvars) {
      return {
        values: sysvars,
      }
    }

    it("Should order sysvars (all sysvars are in the order array)", function() {
      var requestObject = makeRequestObject([
        {name: 'SCB.BUS1.BAUDRATE', value: 9600},
        {name: 'SCB.BUS1.PARITY',   value: 0},
        {name: 'SCB.BUS1.STOPBITS', value: 1},
      ]);
      var expected = makeRequestObject([
        {name: 'SCB.BUS1.PARITY',   value: 0},
        {name: 'SCB.BUS1.STOPBITS', value: 1},
        {name: 'SCB.BUS1.BAUDRATE', value: 9600},
      ]);
      var order = [
        'SCB.BUS1.PARITY',
        'SCB.BUS1.STOPBITS',
        'SCB.BUS1.BAUDRATE',
      ];
      queryService._sortRequestObject(requestObject, order);
      expect(requestObject).toEqual(expected);
    });

    it("Sysvars in order array should go at the end of the list, others sorted alphabetically", function() {
      var requestObject = makeRequestObject([
        {name: 'SCB.BUS1.PARITY',   value: 0},
        {name: 'SCB.BUS1.STOPBITS', value: 1},
        {name: 'SCB.BUS1.PORTNUM', value: 1},
        {name: 'SCB.BUS1.BAUDRATE', value: 9600},
      ]);
      var expected = makeRequestObject([
        // Items not in order array are sorted at start,
        // alphabetically by sysvar
        {name: 'SCB.BUS1.BAUDRATE', value: 9600},
        {name: 'SCB.BUS1.PORTNUM', value: 1},

        // Items in order array are sorted at the end
        {name: 'SCB.BUS1.PARITY',   value: 0},
        {name: 'SCB.BUS1.STOPBITS', value: 1},

      ]);
      var order = [
        'SCB.BUS1.PARITY',
        'SCB.BUS1.STOPBITS',
      ];
      queryService._sortRequestObject(requestObject, order);
      expect(requestObject).toEqual(expected);
    });

    it("If order array is empty, should sort alphabetically", function() {
      var requestObject = makeRequestObject([
        {name: 'SCB.BUS1.PARITY',   value: 0},
        {name: 'SCB.BUS1.STOPBITS', value: 1},
        {name: 'SCB.BUS1.PORTNUM', value: 1},
        {name: 'SCB.BUS1.BAUDRATE', value: 9600},
      ]);
      var expected = makeRequestObject([
        {name: 'SCB.BUS1.BAUDRATE', value: 9600},
        {name: 'SCB.BUS1.PARITY',   value: 0},
        {name: 'SCB.BUS1.PORTNUM', value: 1},
        {name: 'SCB.BUS1.STOPBITS', value: 1},
      ]);
      var order = [];
      queryService._sortRequestObject(requestObject, order);
      expect(requestObject).toEqual(expected);
    });
  });

  describe("sysvarSetHasError", function() {
    ['values', 'results'].forEach(function(propertyName) {
      describe("Property name: " + propertyName, function() {
        function makeResponse(values) {
          var data = {};
          data.count = angular.isDefined(values) ? values.length : 0;
          data[propertyName] = values;
          return {
            data: data,
          };
        }

        var requestObject;
        beforeEach(function() {
          requestObject = {
            values: [
              {name: 'SCB.BUS1.BAUDRATE', value: 9600},
              {name: 'SCB.BUS1.PARITY', value: 0},
            ]
          };
        });

        it("Result set to 0 => no error", function() {
          var response = makeResponse([
            {name: 'SCB.BUS1.BAUDRATE', result: 0},
            {name: 'SCB.BUS1.PARITY',   result: 0},
          ]);
          var hasError = queryService._sysvarSetHasError(response, requestObject);
          expect(hasError).toBe(false);
        });

        it("Result set to nonzero => has error", function() {
          var response = makeResponse([
            {name: 'SCB.BUS1.BAUDRATE', result: 0},
            {name: 'SCB.BUS1.PARITY',   result: 1},
          ]);
          var hasError = queryService._sysvarSetHasError(response, requestObject);
          expect(hasError).toBe(true);
        });

        it("Undefined values => has error", function() {
          expectLogErrorToBeCalled = true;
          var response = makeResponse(undefined);
          var hasError = queryService._sysvarSetHasError(response, requestObject);
          expect(hasError).toBe(true);
        });

        it("Response is missing a sysvar => has error", function() {
          expectLogErrorToBeCalled = true;
          var response = makeResponse([
            {name: 'SCB.BUS1.BAUDRATE', result: 0},
            // parity is missing
          ]);
          var hasError = queryService._sysvarSetHasError(response, requestObject);
          expect(hasError).toBe(true);
          expect($log.error).toHaveBeenCalledWith(
            jasmine.stringMatching('No response for: SCB.BUS1.PARITY'));
        });

        it("Response has extra sysvar => has error", function() {
          expectLogErrorToBeCalled = true;
          var response = makeResponse([
            {name: 'SCB.BUS1.BAUDRATE', result: 0},
            {name: 'SCB.BUS1.PARITY',   result: 0},
            // We didn't set TIMEZONE
            {name: 'TIMEZONE',          result: 0},
          ]);
          var hasError = queryService._sysvarSetHasError(response, requestObject);
          expect(hasError).toBe(true);
          expect($log.error).toHaveBeenCalledWith(
            jasmine.stringMatching('Unexpected response for: TIMEZONE'));
        });



      });
    });
  });

  describe("runScript", function() {
    it("Should return JSON data", function() {
      var url = "/script";
      var payload = {
        success: true
      };

      $httpBackend.expect('POST',
        url, "argument=value")
        .respond(200, angular.fromJson(payload));

      queryService.runScript(url, {
        argument: 'value',
      }).then(function(data) {
        expect(data).toEqual(payload);
      }).catch(function() {
        expect(false).toBe(true);
      });
      $httpBackend.flush();
    });

    it("Should handle receiving an empty object", function() {
      var url = "/script";
      var payload = {};

      $httpBackend.expect('POST',
        url, "argument=value")
        .respond(200, angular.fromJson(payload));

      queryService.runScript(url, {
        argument: 'value',
      }).then(function(data) {
        expect(data).toEqual(payload);
      }).catch(function() {
        expect(false).toBe(true);
      });
      $httpBackend.flush();
    });

    it("Should return plain text data", function() {
      var url = "/script";
      var payload = "The quick brown fox";

      $httpBackend.expect('POST',
        url, "argument=value")
        .respond(200, payload);

      queryService.runScript(url, {
        argument: 'value',
      }).then(function(data) {
        expect(data).toEqual(payload);
      }).catch(function() {
        expect(false).toBe(true);
      });
      $httpBackend.flush();
    });
    it("Should handle receiving an empty string", function() {
      var url = "/script";
      var payload = "";

      $httpBackend.expect('POST',
        url, "argument=value")
        .respond(200, payload);

      queryService.runScript(url, {
        argument: 'value',
      }).then(function(data) {
        expect(data).toEqual(payload);
      }).catch(function() {
        expect(false).toBe(true);
      });
      $httpBackend.flush();
    });
    it("Should handle a script with no options", function() {
      var url = "/script";
      var payload = "Success!";

      $httpBackend.expect('POST',
        url, " ") // expect a space character
        .respond(200, payload);

      queryService.runScript(url).then(function(data) {
        expect(data).toEqual(payload);
      }).catch(function() {
        expect(false).toBe(true);
      });
      $httpBackend.flush();
    });
    it("Should sort parameters by order specified", function() {
      var url = "/script";
      var payload = "Success!";

      $httpBackend.expect('POST',
        url, "who=first&what=second&idontknow=third")
        .respond(200, payload);

      var arguments = {
        // arguments needs to be in non-sorted order
        idontknow : 'third',
        what      : 'second',
        who       : 'first',
      }
      var options = {
        order: ['who', 'what', 'idontknow'],
      };

      expect(options.order.findIndex).toBeDefined();

      queryService.runScript(url, arguments, options).then(function(data) {
        expect(data).toEqual(payload);
      }).catch(function() {
        expect(false).toBe(true);
      });
      $httpBackend.flush();
    });

    it("Should sort parameters alphabetically by default", function() {
      var url = "/script";
      var payload = "Success!";

      $httpBackend.expect('POST',
        // sorted by argument name
        url, "idontknow=third&what=second&who=first")
        .respond(200, payload);

      var arguments = {
        // arguments needs to be in non-sorted order
        what      : 'second',
        idontknow : 'third',
        who       : 'first',
      }
      // Don't explicitly specify an order
      queryService.runScript(url, arguments).then(function(data) {
        expect(data).toEqual(payload);
      }).catch(function() {
        expect(false).toBe(true);
      });
      $httpBackend.flush();
    });


    it("Should accept a plain string as a parameter", function() {
      var url = "/script";
      var payload = "Success!";

      $httpBackend.expect('POST',
        url, "parameter")
        .respond(200, payload);

      queryService.runScript(url, "parameter").then(function(data) {
        expect(data).toEqual(payload);
      }).catch(function() {
        expect(false).toBe(true);
      });
      $httpBackend.flush();
    });
    it("Should raise an error if valuesToSet is invalid", function() {
      expectLogErrorToBeCalled = true;
      // array is not a legal argument to runScript
      var arguments = [1, 2, 3];
      queryService.runScript('/script', arguments).then(function() {
        expect(false).toBe(true); // shouldn't happen
      }).catch(function() {
        expect($log.error).toHaveBeenCalled();
      });
    });

  });

  describe("mangleSysvarName", function() {
    it("Should replace forward slashes with underscores", function() {
      var options = {};
      var result = queryService._mangleSysvarName("TIME/LOCAL/ISO_STR", options );
      expect(result).toBe("TIME_LOCAL_ISO_STR");
    });

    it("Should remove leading underscores", function() {
        var options = {};
        var result = queryService._mangleSysvarName("/SCB/LPHD/MODEL", options);
        expect(result).toBe("SCB_LPHD_MODEL");
    });

    it("Should replace mixed dots and slashes with underscores", function() {
        var options = {};
        var result = queryService._mangleSysvarName("/SCB/LPHD.MODEL", options );
        expect(result).toBe("SCB_LPHD_MODEL");
    });

    it("Should remove a device prefix", function() {
        var options = { 'prefix' : 'XW' };
        var result = queryService._mangleSysvarName("[20099]/XW/GEN1/V", options );
        expect(result).toBe("GEN1_V");
    });
  });
});
