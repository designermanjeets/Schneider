
var Chart = {
  getXaxisLabels: function () {
    var labels = [];
    var deferred = protractor.promise.defer();
    element.all(by.css('.highcharts-axis-labels.highcharts-xaxis-labels tspan')).each(function (element, index) {
      labels.push(element.getText());
    }).then(function() {
      deferred.fulfill(protractor.promise.all(labels));
    });
    return deferred.promise;
  },
  getYaxisLabels: function() {
    var labels = [];
    var deferred = protractor.promise.defer();
    element.all(by.css('.highcharts-yaxis-title')).each(function (element, index) {
      labels.push(element.getText());
    }).then(function () {
      deferred.fulfill(protractor.promise.all(labels));
    });
    return deferred.promise;
  },
  getLegend: function() {
    
    var legend = [];
    var deferred = protractor.promise.defer();
    element.all(by.css('.highcharts-legend tspan')).each(function (element, index) {
      legend.push(element.getText());
    }).then(function () {
      deferred.fulfill(protractor.promise.all(legend));
    });
    return deferred.promise;
  }

};

module.exports = Chart;
