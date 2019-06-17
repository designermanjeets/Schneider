
"use strict";

angular.module('conext_gateway.dashboard').controller("batteryComparisonController", ['$scope', 'batteryComparisonService', 'timezoneService',
  "$timeout", "$filter", "chartdataService", "dateDataService", "moment", "settingStorageService", "scalingService",
  function($scope, batteryComparisonService, timezoneService, $timeout, $filter, chartdataService, dateDataService, moment, settingStorageService, scalingService) {
    var colors = ["#42B4E6", "#3DCD58", "#E47F00", "#FFD100", "#DC0A0A", "#B10043" ];

    var colorHelper = Chart.helpers.color;

    //Options used to customize chartjs chart
    var options = {
      zoom: {
        enabled: true,
        mode: 'x',
        drag: {
          borderColor: 'grey',
          borderWidth: 1,
          backgroundColor: colorHelper('grey').alpha(0.5).rgbString()
        }
      },
      responsive: true,
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        enabled: true,
        callbacks: {
          label: function(tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || '';
            var units;
            switch (tooltipItem.datasetIndex) {
              case 0:
                units = "V";
                break;
              case 1:
                units = "A";
                break;
              case 2:
                units = "°C";
                break;
              case 3:
                units = "%";
                break;
              default:
            }

            if (label) {
              label += ": " + tooltipItem.yLabel + getUnits();
            }
            return label;
          }
        }
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          type: "time",
          time: {
            unit: 'hour',
            unitStepSize: 1,
            tooltipFormat: "YYYY MMM D h:mm a",
            displayFormats: {
              hour: 'h:mm A'
            }
          },
          gridLines: {
            display: true
          }
        }],
        yAxes: [{
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-0',
          scaleLabel: {
            display: true,
            labelString: $filter('translate')('dashboard.battery.volts') + "(V)",
            fontColor: colors[0]
          },
          gridLines: {
            display: true
          },
          ticks: {
          }
        }],
      }
    };

    $scope.getOpacColor = function(color) {
      return colorHelper(color).alpha(0.7).rgbString();
    }

    $scope.settings = settingStorageService.getBatteryComparisonSettings();

    //obect used to store value from calender and set its parameters
    $scope.dates = {
      isOpen: false,
      minDate: '',
      maxDate: '',
      invalidDate: false
    };

    //watch for when a new date is selected and then refresh the chart
    $scope.$watch('settings.date', function(newValue, oldValue) {
      if (newValue && oldValue && newValue.getTime() !== oldValue.getTime()) {
        $scope.dates.invalidDate = false;
        var dateData = chartdataService.createDateData(newValue, "minutes");
        if ($scope.myChart) {
          $scope.myChart = null;
        }
        batteryComparisonService.getBatteryComparisonData("system", 0, dateData, $scope.dateTime).then(function(data) {
          $scope.chartData = data;
          $scope.changeDataType();
        }, function(error) {
          $scope.dates.invalidDate = true;
        });
      }
    });

    //function to open calender when button is pushed
    $scope.openCalender = function() {
      $scope.dates.isOpen = true;
    };

    //function called whea different battery is selected
    $scope.changeDataType = function() {
      switch ($scope.settings.type) {
        case '1':
          processChartData($scope.chartData.labels, $scope.chartData.volts, 1);
          break;
        case '2':
          processChartData($scope.chartData.labels, $scope.chartData.current, 2);
          break;
        case '3':
          processChartData($scope.chartData.labels, $scope.chartData.temperature, 3);
          break;
        case '4':
          processChartData($scope.chartData.labels, $scope.chartData.stateOfCharge, 4);
          break;
        default:
      }
    };

    //Function to get the date information for conext gateway
    dateDataService.getDateData().then(function(data) {
      var dateParameters = timezoneService.getDateParameters(data);
      if (!$scope.settings.date) {
        $scope.settings.date = dateParameters.date;
      }
      $scope.dates.minDate = dateParameters.minDate;
      $scope.dates.maxDate = dateParameters.maxDate;

      var dateData = chartdataService.createDateData($scope.settings.date, "minutes");
      if ($scope.myChart) {
        $scope.myChart = null;
      }
      batteryComparisonService.getBatteryComparisonData("system", 0, dateData).then(function(data) {
        $scope.chartData = data;
        $scope.changeDataType();
      }, function(error) {
        $scope.dates.invalidDate = true;
      });
    }, function(error) {
      //TODO add error handling
    });

    //function to process the data for the cahrt to render
    function processChartData(labels, data, type) {
      var chartObj = {
        labels: labels,
        datasets: []
      };

      var scale = {
        min: null,
        max: null
      };

      for (var index = 0; index < 5; index++) {
        chartObj.datasets.push({
          backgroundColor: colors[index],
          borderColor: colors[index],
          data: data.data['battery' + (index + 1)].data,
          fill: false,
          label: $filter('translate')('dashboard.battery_title') + " " + (index + 1),
          pointRadius: 0,
          hidden: false
        });
        scalingService.setMin(scale, data.data['battery' + (index + 1)].scale.min);
        scalingService.setMax(scale, data.data['battery' + (index + 1)].scale.max);
      }
      if (type !== 4) {
        scalingService.setSuggestedMinMax(scale, 10);
        options.scales.yAxes[0].ticks = {
          suggestedMin: scale.suggestedMin,
          suggestedMax: scale.suggestedMax
        };
      } else {
        options.scales.yAxes[0].ticks = {
          suggestedMin: 0,
          suggestedMax: 100
        };
      }


      options.zoom.rangeMin = {
        x: 0
      };

      options.zoom.rangeMax = {
        x: moment(labels[labels.length - 1]).diff(moment(labels[0]))
      };

      processYaxisLabel();
      $scope.myChart = {
        type: 'line',
        'data': chartObj,
        'options': options,
        'title': $filter('translate')('dashboard.battery_comparison'),
        'date': moment($scope.settings.date).format('MMMM DD, YYYY')
      };
      setColumns();
    }

    function setColumns() {
      $scope.myChart.labels = [];
        $scope.myChart.labels.push($filter('translate')('dashboard.battery.battery1') + '(' + getUnits() + ')');
        $scope.myChart.labels.push($filter('translate')('dashboard.battery.battery2') + '(' + getUnits() + ')');
        $scope.myChart.labels.push($filter('translate')('dashboard.battery.battery3') + '(' + getUnits() + ')');
        $scope.myChart.labels.push($filter('translate')('dashboard.battery.battery4') + '(' + getUnits() + ')');
        $scope.myChart.labels.push($filter('translate')('dashboard.battery.battery5') + '(' + getUnits() + ')');
    }

    function getUnits() {
      switch ($scope.settings.type) {
        case "1":
          return "V";
          break;
        case "2":
          return "A";
          break;
        case "3":
          return "°C";
          break;
        case "4":
          return "%";
          break;
        default:
      }
    }

    function processYaxisLabel() {
      switch ($scope.settings.type) {
        case "1":
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('dashboard.battery.volts') + "(V)";
          break;
        case "2":
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('dashboard.battery.current') + "(A)";
          break;
        case "3":
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('dashboard.battery.temperature') + "(°C)";
          break;
        case "4":
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('dashboard.battery.stateOfCharge') + "(%)";
          break;
        default:

      }
    }

    $scope.toggleHidden = function(datasetIndex) {
      if ($scope.myChart && $scope.myChart.data && $scope.myChart.data.datasets[datasetIndex]) {
        $scope.myChart.data.datasets[datasetIndex].hidden = !$scope.myChart.data.datasets[datasetIndex].hidden;
      }
      $scope.updateChart();
    };
  }
]);
