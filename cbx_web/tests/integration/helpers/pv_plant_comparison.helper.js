var chart = require('../helpers/chart.helper.js');

var PVPlantComparison = {
  selectTimePeriod: function (timePeriod) {

    var chartControls = element.all(by.css('.chart-controls div'));
    if (timePeriod === 'day') {
      return chartControls.get(0).click();
    }
    else if (timePeriod === 'month') {
      return chartControls.get(1).click();
    }
    else if (timePeriod === 'year') {
      return chartControls.get(2).click();
    }
    else if (timePeriod === 'todate') {
      return chartControls.get(3).click();
    }
  },
  selectAllParameters: function() {
    var parameters = element.all(by.css('.parameter-selection__parameter input'));
    parameters.each(function(element, index) {
      element.click();
    });
  },
  getParameters: function() {
    var parameters = [];

    var deferred = protractor.promise.defer();
    element.all(by.css('.parameter-selection__parameter span[translate]')).each(function (element, index) {
      parameters.push(element.getText());
    }).then(function () {
      deferred.fulfill(protractor.promise.all(parameters));
    });
    return deferred.promise;

  },
  createChart: function() {
    var submitButton = element(by.css('.panel-controls__buttons input'));
    submitButton.click();
    browser.wait(element(by.css('chart-container')).isPresent());
  },
  getChart: function() {
    return chart;
  }
};

module.exports = PVPlantComparison;
