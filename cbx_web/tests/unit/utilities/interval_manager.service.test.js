describe('Test Interval Manager', function() {
  var intervalManagerService;
  var $scope;
  var $interval;
  var connectionLost;
  setupTranslation('conext_gateway.utilities');

  beforeEach(angular.mock.module('conext_gateway.utilities'));
  beforeEach(inject(function (_$rootScope_, _intervalManagerService_, _$interval_, _connectionCheckService_) {
    intervalManagerService = _intervalManagerService_;
    $scope = _$rootScope_.$new();
    $interval = _$interval_;
    connectionLost = false;
    var connectionCheckService = _connectionCheckService_;
    spyOn(connectionCheckService, 'isConnectionLost').and.callFake(function () { return connectionLost });
  }));

  it('Register single interval', function() {
    var intervals;
    intervalManagerService.register(function () {
    }, 'testFunction', $scope);
    intervals = intervalManagerService.getIntervals();

    expect(intervals.length()).toBe(1);
  });

  it('Register multiple intervals', function () {
    var intervals;
    intervalManagerService.register(function () {
    }, 'testFunction1', $scope);
    intervalManagerService.register(function () {
    }, 'testFunction2', $scope);
    intervalManagerService.register(function () {
    }, 'testFunction3', $scope);

    intervals = intervalManagerService.getIntervals();

    expect(intervals.length()).toBe(3);
  });

  it('Register the same interval twice', function () {
    var intervals;
    intervalManagerService.register(function () {
    }, 'testFunction', $scope);
    intervalManagerService.register(function () {
    }, 'testFunction', $scope);

    intervals = intervalManagerService.getIntervals();

    expect(intervals.length()).toBe(1);
  });

  it('Register and de-register interval', function () {
    var intervals;
    intervalManagerService.register(function () {
    }, 'testFunction', $scope);
    intervalManagerService.deRegister('testFunction');

    intervals = intervalManagerService.getIntervals();

    expect(intervals.length()).toBe(0);
  });

  it('De-register interval that is not registered', function () {
    var intervals;

    intervalManagerService.deRegister('testFunction');

    intervals = intervalManagerService.getIntervals();

    expect(intervals.length()).toBe(0);
  });

  it('Check if timer is running when an interval is registered', function () {
    var intervals;

    expect(intervalManagerService.isRunning()).toBe(false);

    intervalManagerService.register(function () {
    }, 'testFunction', $scope);

    intervals = intervalManagerService.getIntervals();
    expect(intervalManagerService.isRunning()).toBe(true);
    expect(intervals.length()).toBe(1);
  });

  it('Check if timer stops when the only interval registered is deregistered', function () {
    var intervals;

    expect(intervalManagerService.isRunning()).toBe(false);

    intervalManagerService.register(function () {
    }, 'testFunction', $scope);

    intervals = intervalManagerService.getIntervals();
    expect(intervalManagerService.isRunning()).toBe(true);
    expect(intervals.length()).toBe(1);

    intervalManagerService.deRegister('testFunction');
    expect(intervals.length()).toBe(0);
    expect(intervalManagerService.isRunning()).toBe(false);

  });

  it('Interval should be de-registered when scope is destroyed', function () {
    var intervals;

    expect(intervalManagerService.isRunning()).toBe(false);

    intervalManagerService.register(function () {
    }, 'testFunction', $scope);

    intervals = intervalManagerService.getIntervals();
    expect(intervals.length()).toBe(1);

    $scope.$destroy();

    expect(intervals.length()).toBe(0);
    expect(intervalManagerService.isRunning()).toBe(false);

  });

  it('Ensure that interval callback is called', function (done) {
    intervalManagerService.register(function () {
      done();
    }, 'testFunction', $scope);
    $interval.flush(65000);
  });

  it('Register 2 intervals and check if callbacks are made', function (done) {
    var callback1 = false;
    var callback2 = false;

    intervalManagerService.register(function () {
      if (callback2) {
        done();
      }
      callback1 = true;
    }, 'testFunction1', $scope);
    intervalManagerService.register(function () {
      if (callback1) {
        done();
      }
      callback2 = true;
    }, 'testFunction2', $scope);

    $interval.flush(65000);
  });

  it('Interval callback should not be called when connection is lost', function () {
    var called = false;
    connectionLost = true;
    intervalManagerService.register(function () {
      called = true;
    }, 'testFunction', $scope);
    $interval.flush(65000);
    expect(called).toBe(false);
  });

  it('Interval should be called when connection comes back', function (done) {

    connectionLost = true;
    intervalManagerService.register(function () {
      done();
    }, 'testFunction', $scope);
    $interval.flush(65000);
    connectionLost = false;
    $interval.flush(65000);
  });

});
