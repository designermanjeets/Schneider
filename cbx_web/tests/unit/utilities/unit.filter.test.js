describe('Test unit filter', function () {

  var $filter;
  var kiloScaleFilter;
  beforeEach(angular.mock.module('conext_gateway.utilities'));

  beforeEach(inject(function (_$filter_, _kiloScaleFilter_) {
    $filter = _$filter_;
    kiloScaleFilter = _kiloScaleFilter_;
  }));

  describe('kiloScale', function() {
    it('Should use 0 decimal points for kW scale, by default', function() {
      var result = kiloScaleFilter(500);
      expect(result).toEqual('500');
    });
    it('Should use 2 decimal points for MW scale, by default', function() {
      var result = kiloScaleFilter(50.5 * 1000);
      expect(result).toEqual('50.50');
    });
    it('Should allow decimal points to be specified (kW scale)', function() {
      var result = kiloScaleFilter(500,
        1,  // decimal points for kilo scale
        2); // decimal points for mega & giga scales
      expect(result).toEqual('500.0');
    });
    it('Should allow decimal points to be specified (GW scale)', function() {
      var result = kiloScaleFilter(50.5 * 1000,
        1,  // decimal points for kilo scale
        3); // decimal points for mega & giga scales

      expect(result).toEqual('50.500');
    });
  });

  describe('unitFormatter', function() {
    it('Kilowatt should have units added on giga-watt scale', function () {
      var result;
      var value = 1000;

      result = $filter('unitFormatter')(value, 'G', true);
      expect(result).toEqual('1,000.0 kWh');
    });

    it('Kilowatt should have units added on mega-watt scale', function () {
      var result;
      var value = 8;

      result = $filter('unitFormatter')(value, 'M', true);
      expect(result).toEqual('8.0 kWh');
    });

    it('10 Kilowatts should not have units added and should be converted to MW on MW scale', function () {
      var result;
      var value = 10;

      result = $filter('unitFormatter')(value, 'M', true);
      expect(result).toEqual('0.01');
    });

    it('10000 Kilowatts should not have units added and should be converted to GW on GW scale', function () {
      var result;
      var value = 10000;

      result = $filter('unitFormatter')(value, 'G', true);
      expect(result).toEqual('0.01');
    });

    it('A value of 0 should not have units added', function () {
      var result;
      var value = 0;

      result = $filter('unitFormatter')(value, 'G', true);
      expect(result).toEqual(0);
    });

    it('.05 kilowatts should have units added on GW scale', function () {
      var result;
      var value = 0.05;

      result = $filter('unitFormatter')(value, 'G', true);
      expect(result).toEqual('0.1 kWh');
    });
  });
});
