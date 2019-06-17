"use strict";
//This is the controller for the Energy Summary page
angular.module('conext_gateway.dashboard').controller("energyController", ['$scope', '$timeout', 'energyService', '$interval', '$filter', "settingStorageService",
  function($scope, $timeout, energyService, $interval, $filter, settingStorageService) {
    var colors = ["#B10043", "#DC0A0A", "#9FA0A4", "#E47F00", "#42B4E6", "#00C35E", "#0f0f0f"];
    var requestPending = false;
    var interval;
    var colorHelper = Chart.helpers.color;
    $scope.settings = settingStorageService.getEnergySettings();

    //Options for the produce doughnut chart
    var produceOptions = {
      responsive: true,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Energy Produced"
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var currentValue = dataset.data[tooltipItem.index];
            return $filter('scaleValue')(currentValue) + " " + $filter('scaleUnit')('Wh', currentValue);
          }
        }
      }
    };

    //Options for the consume doughnut chart
    var consumeOptions = {
      responsive: true,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Energy Consumed"
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var currentValue = dataset.data[tooltipItem.index];
            return $filter('scaleValue')(currentValue) + " " + $filter('scaleUnit')('Wh', currentValue);
          }
        }
      }
    };

    var guOptions = {
      responsive: true,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Grid Utilization"
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var currentValue = dataset.data[tooltipItem.index];
            return $filter('scaleValue')(currentValue) + " " + $filter('scaleUnit')('Wh', currentValue);
          }
        }
      }
    };

    //Data needed to render the produce pie chart
    var producePieChartData = {
      labels: [
        $filter('translate')('dashboard.energy_summary.solar_produced'),
        $filter('translate')('dashboard.energy_summary.battery_produced'),
        $filter('translate')('dashboard.energy_summary.generator_produced')
      ],
      datasets: [{
        label: 'Consumed',
        backgroundColor: [
          colorHelper(colors[5]).alpha(0.9).rgbString(),
          colorHelper(colors[2]).alpha(0.9).rgbString(),
          colorHelper(colors[3]).alpha(0.9).rgbString()
        ],
        borderWidth: 1,
        data: []
      }]
    };

    //Data needed to render the consume pie chart
    var consumePieChartData = {
      labels: [
        $filter('translate')('dashboard.energy_summary.load_consumed'),
        $filter('translate')('dashboard.energy_summary.battery_consumed')
      ],
      datasets: [{
        label: 'Consumed',
        backgroundColor: [
          colorHelper(colors[1]).alpha(0.9).rgbString(),
          colorHelper(colors[6]).alpha(0.9).rgbString()
        ],
        borderWidth: 1,
        data: []
      }]
    };

    var guChartData = {
      labels: [
        $filter('translate')('dashboard.energy_summary.grid_produced'),
        $filter('translate')('dashboard.energy_summary.grid_consumed'),
      ],
      datasets: [{
        label: 'Consumed',
        backgroundColor: [
          colorHelper(colors[0]).alpha(0.9).rgbString(),
          colorHelper(colors[4]).alpha(0.9).rgbString()
        ],
        borderWidth: 1,
        data: []
      }]
    };

    refreshEnergyData();
    interval = $interval(function() {
      if (!requestPending) {
        refreshEnergyData();
      }
    }, 1000);

    //function for retreive the data needed to display the piecharts and
    //the energy widgets
    function refreshEnergyData() {
      requestPending = true;
      energyService.getEnergyData().then(function(data) {
        $scope.energyData = data;

        processDoughnutData(data, getInterval());
        requestPending = false;
      }, function(error) {
        requestPending = false;
      });
    }

    //Callback for when a new interval is selected
    $scope.changeInterval = function() {
      $scope.produceChart = null;
      $scope.consumeChart = null;
      processDoughnutData($scope.energyData, getInterval());
    };

    //Transform the enum value for the interval to a string value
    function getInterval() {
      var temp;
      switch ($scope.settings.interval) {
        case '1':
          temp = "DAY";
          break;
        case '2':
          temp = "WEEK";
          break;
        case '3':
          temp = "MONTH";
          break;
        case '4':
          temp = "YEAR";
          break;
        case '5':
          temp = "LIFETIME";
          break;
        default:
      }
      return temp;
    }

    //Prepare the pie chart data and pass it to chartjs library
    function processDoughnutData(data, intervalType) {
      producePieChartData.datasets[0].data = [];
      producePieChartData.datasets[0].data.push(data['SYS_PV_TOTAL_ENERGY_' + intervalType]);
      producePieChartData.datasets[0].data.push(data['SYS_BATT_INV_ENERGY_' + intervalType]);
      produceOptions.title.text = createChartTitle('Produced', producePieChartData.datasets[0].data);
      consumePieChartData.datasets[0].data = [];
      consumePieChartData.datasets[0].data.push(data['SYS_LOAD_ENERGY_' + intervalType]);
      consumePieChartData.datasets[0].data.push(data['SYS_BATT_CHG_ENERGY_' + intervalType]);
      consumePieChartData.datasets[0].data.push(data['SYS_GEN_ENERGY_' + intervalType]);
      consumeOptions.title.text = createChartTitle('Consumed', consumePieChartData.datasets[0].data);

      guChartData.datasets[0].data = [];
      guChartData.datasets[0].data.push(data['SYS_GRID_IN_ENERGY_' + intervalType]);
      guChartData.datasets[0].data.push(data['SYS_GRID_OUT_ENERGY_' + intervalType]);
      var difference = data['SYS_GRID_OUT_ENERGY_' + intervalType] - data['SYS_GRID_IN_ENERGY_' + intervalType];
      guOptions.title.text = 'Net Utilization: ' + $filter('scaleValue')(difference) + " " + $filter('scaleUnit')('Wh', difference);

      if (!$scope.produceChart) {
        $scope.produceChart = {
          'type': 'doughnut',
          'data': producePieChartData,
          'options': produceOptions
        };
      }

      if (!$scope.consumeChart) {
        $scope.consumeChart = {
          'type': 'doughnut',
          'data': consumePieChartData,
          'options': consumeOptions
        };
      }

      if (!$scope.guChart) {
        $scope.guChart = {
          'type': 'doughnut',
          'data': guChartData,
          'options': guOptions
        };
      }
    }

    //Function for create the title of the pie charts
    function createChartTitle(type, data) {
      var title = "Energy " + type;
      var total = 0;
      for (var index = 0; index < data.length; index++) {
        total += data[index];
      }
      return title + ": " + $filter('scaleValue')(total) + " " + $filter('scaleUnit')('Wh', total);
    }

    var dereg = $scope.$on("$destroy", function() {
      if (interval) {
        $interval.cancel(interval);
        requestPending = false;
        dereg();
      }
    });
  }
]);
