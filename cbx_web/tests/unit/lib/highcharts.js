"use strict";

// Mock the Highcharts calls we use
function HighchartsMock() {
  var noop = function() {};
  function HighchartsGettable() {
    this.remove = noop;
    this.setData = noop;
    this.update = noop;
  }

  this.get = function(seriesId) {
    return new HighchartsGettable();
  }
  this.addAxis = noop;
  this.addSeries = noop;
  this.exportChart = noop;
  this.redraw = noop;
  this.reflow = noop;
  this.zoom = noop;
  this.zoomOut = noop;


  this.series = [];
  this.yAxis  = [];
  this.xAxis  = [new HighchartsGettable()];
}
