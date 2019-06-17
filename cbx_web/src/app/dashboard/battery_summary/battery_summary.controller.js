
"use strict";

angular.module('conext_gateway.dashboard').controller("batterySummaryController", ['$scope', 'batterySummaryService', 'timezoneService',
  "$timeout", "$filter", "chartdataService", "dateDataService", "moment", "settingStorageService", "scalingService",
  function($scope, batterySummaryService, timezoneService, $timeout, $filter, chartdataService, dateDataService, moment, settingStorageService, scalingService) {
    var colors = ["#42B4E6", "#3DCD58", "#E47F00", "#FFD100", "#DC0A0A", "#B10043"];
    var colorHelper = Chart.helpers.color;
    $scope.settings = settingStorageService.getBatterySummarySettings();

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
              label += ": " + tooltipItem.yLabel + units;
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
            labelString: $filter('translate')('dashboard.battery.volts') + '(V)',
            fontColor: colors[0]
          },
          gridLines: {
            display: true
          },
          ticks: {}
        }, {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
          scaleLabel: {
            display: true,
            labelString: $filter('translate')('dashboard.battery.current') + '(A)',
            fontColor: colors[1]
          },
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {}
        }, {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-2',
          scaleLabel: {
            display: true,
            labelString: $filter('translate')('dashboard.battery.temperature') + '(°C)',
            fontColor: colors[2]
          },
          gridLines: {
            drawOnChartArea: false,
          },
        }, {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-3',
          scaleLabel: {
            display: true,
            labelString: $filter('translate')('dashboard.battery.stateOfCharge') + '(%)',
            fontColor: colors[3]
          },
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            max: 100,
            min: 0
          }
        }],
      }
    };

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
        batterySummaryService.getBatterySummary("system", 0, dateData, $scope.dateTime).then(function(data) {
          $scope.chartData = data;
          $scope.changeBattery();
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
    $scope.changeBattery = function() {
      switch ($scope.settings.type) {
        case '1':
          processChartData($scope.chartData.labels, $scope.chartData.battery1);
          break;
        case '2':
          processChartData($scope.chartData.labels, $scope.chartData.battery2);
          break;
        case '3':
          processChartData($scope.chartData.labels, $scope.chartData.battery3);
          break;
        case '4':
          processChartData($scope.chartData.labels, $scope.chartData.battery4);
          break;
        case '5':
          processChartData($scope.chartData.labels, $scope.chartData.battery5);
          break;
        default:
      }
    }

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
      batterySummaryService.getBatterySummary("system", 0, dateData).then(function(data) {
        $scope.chartData = data;
        $scope.changeBattery();
      }, function(error) {
        $scope.dates.invalidDate = true;
      });
    }, function(error) {
      //TODO add error handling
    });

    $scope.getOpacColor = function(color) {
      return colorHelper(color).alpha(0.7).rgbString();
    };

    //function to process the data for the cahrt to render
    function processChartData(labels, data) {
      var chartObj = {
        labels: labels,
        datasets: []
      };

      for (var index = 0; index < data.chartlabels.length; index++) {
        chartObj.datasets.push({
          backgroundColor: colors[index],
          borderColor: colors[index],
          data: data.data[data.chartlabels[index]].data,
          fill: false,
          pointRadius: 0,
          yAxisID: "y-axis-" + index,
          hidden: false
        });
      }

      chartObj.datasets[0].label = $filter('translate')('dashboard.battery.volts');
      chartObj.datasets[1].label = $filter('translate')('dashboard.battery.current');
      chartObj.datasets[2].label = $filter('translate')('dashboard.battery.temperature');
      chartObj.datasets[3].label = $filter('translate')('dashboard.battery.stateOfCharge');

      scalingService.setSuggestedMinMax(data.data[data.chartlabels[0]].scale, 10);
      scalingService.setSuggestedMinMax(data.data[data.chartlabels[1]].scale, 10);
      scalingService.setSuggestedMinMax(data.data[data.chartlabels[2]].scale, 10);
      options.scales.yAxes[0].ticks = {
        suggestedMin: data.data[data.chartlabels[0]].scale.suggestedMin,
        suggestedMax: data.data[data.chartlabels[0]].scale.suggestedMax
      };

      options.scales.yAxes[1].ticks = {
        suggestedMin: data.data[data.chartlabels[1]].scale.suggestedMin,
        suggestedMax: data.data[data.chartlabels[1]].scale.suggestedMax
      };

      options.scales.yAxes[2].ticks = {
        suggestedMin: data.data[data.chartlabels[2]].scale.suggestedMin,
        suggestedMax: data.data[data.chartlabels[2]].scale.suggestedMax
      };

      options.zoom.rangeMin = {
        x: 0
      };

      options.zoom.rangeMax = {
        x: moment(labels[labels.length - 1]).diff(moment(labels[0]))
      };


      $scope.myChart = {
        type: 'line',
        'data': chartObj,
        'options': options,
        'title': $filter('translate')('dashboard.battery_summary'),
        'date': moment($scope.settings.date).format('MMMM DD, YYYY')
      };
      setColumns();
    }

    $scope.toggleHidden = function(datasetIndex) {
      if ($scope.myChart && $scope.myChart.data && $scope.myChart.data.datasets[datasetIndex]) {
        $scope.myChart.data.datasets[datasetIndex].hidden = !$scope.myChart.data.datasets[datasetIndex].hidden;
        $scope.myChart.options.scales.yAxes[datasetIndex].display = !$scope.myChart.options.scales.yAxes[datasetIndex].display;
      }
      $scope.updateChart();
    };

    function setColumns() {
      $scope.myChart.labels = [];
      $scope.myChart.labels.push($filter('translate')('dashboard.battery.volts') + '(V)');
      $scope.myChart.labels.push($filter('translate')('dashboard.battery.current') + '(A)');
      $scope.myChart.labels.push($filter('translate')('dashboard.battery.temperature') + '(°C)');
      $scope.myChart.labels.push($filter('translate')('dashboard.battery.stateOfCharge') + '(%)');
    }
  }
]);
