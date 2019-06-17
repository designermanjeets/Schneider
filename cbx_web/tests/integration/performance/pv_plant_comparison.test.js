describe('PV Plant Comparison', function () {
  var loginHelper = require('../helpers/login.helper.js');
  var navigationHelper = require('../helpers/navigation.helper.js');
  var pvPlantComparisonHelper = require('../helpers/pv_plant_comparison.helper.js');
  var dataLogger = require('../helpers/datalog.helper.js');
  var response = require('../mocks/datalogger_response1.json');
  var chart; var request = 'device=PVMET200-121A&type=log&fields=POA Irradiance&start=1462752000&end=1462838399';

  it('Timer Period Selector', function () {
    dataLogger.mock(request, response);
    loginHelper.go();
    loginHelper.login("Admin1234");   
    navigationHelper.navigate('detection');
    navigationHelper.navigate('pv_plant_comparison');
    
    pvPlantComparisonHelper.selectTimePeriod('day');
    browser.controlFlow().execute(function () {
      pvPlantComparisonHelper.getParameters().then(function (data) {
        console.log(data);
      });
    });
    pvPlantComparisonHelper.selectAllParameters();
    pvPlantComparisonHelper.createChart();

    browser.controlFlow().execute(function () {
      chart = pvPlantComparisonHelper.getChart();
      chart.getXaxisLabels().then(function (data) {
        console.log(data);
      });
    });

    browser.controlFlow().execute(function () {
      chart.getYaxisLabels().then(function (data) {
        console.log(data);
      });
    });

    browser.controlFlow().execute(function () {
      chart.getLegend().then(function (data) {
        console.log(data);
      });
    });

  });


});
