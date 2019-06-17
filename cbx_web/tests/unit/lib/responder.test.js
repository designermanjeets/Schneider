describe("HttpResponder mocks", function () {
  var $http;

  // No particular reason to use the conext_gateway.performance module. Any module would do.
  setupTranslation('conext_gateway.performance');
  beforeEach(angular.mock.module('conext_gateway.performance'));
  initResponders();

  beforeEach(inject(function($injector) {
    $http = $injector.get('$http');
  }));

  describe("SysvarQueryResponder", function() {
    var sysvarResponder;

    it("Pass in sysvars via respondToSysvarQuery", function() {
      sysvarResponder = new SysvarQueryResponder();
      sysvarResponder.respondToSysvarQuery([
        {name: 'TIMEZONE', value: 'America/Chicago'}
      ]);

      $http.post('/vars', 'name=TIMEZONE').then(function(response) {
        expect(response.data.count).toEqual(1);
        expect(response.data.values).toEqual([
          {name: 'TIMEZONE', value: 'America/Chicago', quality: 'G'}
        ])
      });
      HttpResponder.flush();
    });

    it("Pass in sysvars via addSysvars", function() {
      sysvarResponder = new SysvarQueryResponder();
      sysvarResponder.addSysvars([
        {name: 'TIMEZONE', value: 'America/Chicago'}
      ]);
      sysvarResponder.respondToSysvarQuery();

      $http.post('/vars', 'name=TIMEZONE').then(function(response) {
        expect(response.data.count).toEqual(1);
        expect(response.data.values).toEqual([
          {name: 'TIMEZONE', value: 'America/Chicago', quality: 'G'}
        ])
      });
      HttpResponder.flush();
    });

    it("addSysvars removes duplicates", function() {
      sysvarResponder = new SysvarQueryResponder();
      sysvarResponder.addSysvars([
        {name: 'TIMEZONE', value: 'America/Chicago'}, // should be overwritten
        {name: 'HMI.TEMPERATURE.UNIT', value: 'C'},   // should not be overwritten
      ]);
      sysvarResponder.addSysvars([
        {name: 'TIMEZONE', value: 'Asia/Jakarta'},
      ]);
      sysvarResponder.respondToSysvarQuery();

      $http.post('/vars', 'name=TIMEZONE').then(function(response) {
        expect(response.data.count).toEqual(2);
        expect(response.data.values).toEqual(jasmine.arrayContaining([
          {name: 'TIMEZONE', value: 'Asia/Jakarta', quality: 'G'},
          {name: 'HMI.TEMPERATURE.UNIT', value: 'C', quality: 'G'},
        ]));
      });
      HttpResponder.flush();
    });

    it("addSysvars changes response for subsequent calls", function() {
      sysvarResponder = new SysvarQueryResponder();
      sysvarResponder.addSysvars([
        {name: 'TIMEZONE', value: 'America/Chicago'}, // should be overwritten
        {name: 'HMI.TEMPERATURE.UNIT', value: 'C'},   // should not be overwritten
      ]);
      sysvarResponder.respondToSysvarQuery();

      $http.post('/vars', 'name=TIMEZONE').then(function(response) {
        expect(response.data.count).toEqual(2);
        expect(response.data.values).toEqual(jasmine.arrayContaining([
          {name: 'TIMEZONE', value: 'America/Chicago', quality: 'G'},
          {name: 'HMI.TEMPERATURE.UNIT', value: 'C', quality: 'G'},
        ]));
      });
      HttpResponder.flush();

      sysvarResponder.addSysvars([
        {name: 'TIMEZONE', value: 'Asia/Jakarta'},
      ]);
      $http.post('/vars', 'name=TIMEZONE').then(function(response) {
        expect(response.data.count).toEqual(2);
        expect(response.data.values).toEqual(jasmine.arrayContaining([
          {name: 'TIMEZONE', value: 'Asia/Jakarta', quality: 'G'},  // changed
          {name: 'HMI.TEMPERATURE.UNIT', value: 'C', quality: 'G'}, // didn't change
        ]));
      });
      HttpResponder.flush();
    });

  });
});
