describe('Test unit formatter service', function () {

  var unitFormatterService;
  beforeEach(angular.mock.module('conext_gateway.utilities'));

  beforeEach(inject(function (_unitFormatterService_) {
    unitFormatterService = _unitFormatterService_;
  }));

  it('Unit should be Giga', function () {

    var columns = ['ACEnergyLifetime'];

    var rows = [
      {
        name: "inverter",
        ACEnergyLifetime: 10000001
      },
      {
        name: "inverter",
        ACEnergyLifetime: 0
      },
      {
        name: "inverter",
        ACEnergyLifetime: undefined
      },
      {
        name: "inverter",
        ACEnergyLifetime: 10001
      }
    ];

    var result = unitFormatterService.findGreatestUnit(columns, rows);
    expect(result['ACEnergyLifetime']).toEqual('G');
  });

  it('Unit should be Mega', function () {

    var columns = ['ACEnergyLifetime'];

    var rows = [
      {
        name: "inverter",
        ACEnergyLifetime: 10000000
      },
      {
        name: "inverter",
        ACEnergyLifetime: 0
      },
      {
        name: "inverter",
        ACEnergyLifetime: undefined
      },
      {
        name: "inverter",
        ACEnergyLifetime: 100
      }
    ];

    var result = unitFormatterService.findGreatestUnit(columns, rows);
    expect(result['ACEnergyLifetime']).toEqual('M');
  });

  it('Unit should be Kilo', function () {

    var columns = ['ACEnergyLifetime'];

    var rows = [
      {
        name: "inverter",
        ACEnergyLifetime: 100
      },
      {
        name: "inverter",
        ACEnergyLifetime: 0
      },
      {
        name: "inverter",
        ACEnergyLifetime: undefined
      },
      {
        name: "inverter",
        ACEnergyLifetime: 10000
      }
    ];

    var result = unitFormatterService.findGreatestUnit(columns, rows);
    expect(result['ACEnergyLifetime']).toEqual('k');
  });

  it('Should get unit for multiple columns', function () {

    var columns = ['ACEnergyLifetime', 'RealPower', 'ACEnergyToday'];

    var rows = [
      {
        name: "inverter",
        ACEnergyLifetime: 100,
        RealPower: 10001
      },
      {
        name: "inverter",
        ACEnergyLifetime: 0,
        RealPower: undefined
      },
      {
        name: "inverter",
        ACEnergyLifetime: undefined,
        RealPower: 1000
      },
      {
        name: "inverter",
        ACEnergyLifetime: 10000,
        RealPower: null
      }
    ];

    var result = unitFormatterService.findGreatestUnit(columns, rows);
    expect(result['ACEnergyLifetime']).toEqual('k');
    expect(result['ACEnergyToday']).toEqual('k');
    expect(result['RealPower']).toEqual('M');
  });

});
