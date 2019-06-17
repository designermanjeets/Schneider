
"use strict";

//This controller is used to retreive the energy comparison data and display it in the graph
angular.module('conext_gateway.dashboard').controller("energyComparisonController", ['$scope', 'timezoneService',
  "chartdataService", "energyComparisonService", "$q", "moment", "$filter", "dateDataService", "settingStorageService",
  function($scope, timezoneService, chartdataService, energyComparisonService, $q, moment, $filter, dateDataService, settingStorageService) {
    var colors = ["#42B4E6", "#3DCD58", "#E47F00", "#FFD100"];
    var colorHelper = Chart.helpers.color;
    var series1and2Data = {};
    var series3and4Data = {};

    //Options for chartjs
    var options = {
      responsive: true,
      legend: {
        display: false,
        lineWidth: 1.5,
      },
      title: {
        display: true,
        position: 'bottom',
        text: ''
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        enabled: true,
        callbacks: {
          label: function(tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || '';

            if (label) {
              label += ": " + $filter('scaleValue')(tooltipItem.yLabel) + $filter('scaleUnit')('Wh', tooltipItem.yLabel);
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
          type: 'category',
          ticks: {
            autoSkip: false,
            //function for formating the x axis labels
            callback: function(value, index, values) {
              var result;
              switch ($scope.settings.interval) {
                case "1":
                  result = moment(value).format('h:mm A');
                  break;
                case "2":
                  result = moment(value).format('D');
                  break;
                case "3":
                  result = moment(value).format('MMM');
                  break;
                case "4":
                  result = moment(value + "-01-01").format('YYYY');
                  break;
                default:
              }
              return result;
            }
          },
          gridLines: {
            display: true
          }
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            autoSkip: false,
            //function for formating the x axis labels
            callback: function(value, index, values) {
              return $filter('scaleValue')(value) + $filter('scaleUnit')('', value);
            },
            beginAtZero: true
          },
          display: true,
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: $filter('translate')('dashboard.energy_axis', {
              units: 'Wh'
            })
          },
          gridLines: {
            display: true
          }
        }],
      }
    };

    $scope.settings = settingStorageService.getEnergyComparisonSettings();

    //information need by ui-calender
    $scope.dates = {
      format: 'yyyy/MM/dd',
      mode: 'day',
      isSeries1Open: false,
      isSeries2Open: false,
      minDate: '',
      maxDate: '',
      invalidSeries1Date: false,
      invalidSeries2Date: false,
    };

    $scope.openSeries1Calender = function() {
      $scope.dates.isSeries1Open = true;
    };

    $scope.openSeries2Calender = function() {
      $scope.dates.isSeries2Open = true;
    };

    //retreive the Date data
    dateDataService.getDateData().then(function(data) {
      var dateParameters = timezoneService.getDateParameters(data);
      $scope.changeInterval(true);
      if (!$scope.settings.series1Date) {
        $scope.settings.series1Date = dateParameters.date;
      }
      if (!$scope.settings.series2Date) {
        $scope.settings.series2Date = dateParameters.date;
      }
      $scope.dates.minDate = dateParameters.minDate;
      $scope.dates.maxDate = dateParameters.maxDate;
      refreshSeries().then(function() {
        processChartData();
      }, function(error) {
        //TODO handle error
      });
    }, function(error) {
      //TODO add error handling
    });

    //function for when the interval is change by the user
    $scope.changeInterval = function(no_refresh) {
      switch ($scope.settings.interval) {
        case '1':
          $scope.dates.mode = 'day';
          $scope.dates.format = 'yyyy/MM/dd';
          break;
        case '2':
          $scope.dates.mode = 'month';
          $scope.dates.format = 'yyyy/MM';
          break;
        case '3':
          $scope.dates.mode = 'year';
          $scope.dates.format = 'yyyy';
          break;
        case '4':
          $scope.dates.mode = 'year';
          $scope.dates.format = 'yyyy';
          break;
        default:

      }
      if (!no_refresh) {
        refreshSeries().then(function() {
          processChartData();
        }, function(error) {
          //TODO handle error
        });
      }
    };

    //function which refreshes the series 1 data when the date is changed
    $scope.$watch('settings.series1Date', function(newValue, oldValue) {
      if (newValue && oldValue && newValue.getTime() !== oldValue.getTime()) {
        refreshSeries(1).then(function() {
          processChartData();
        }, function(error) {
          //TODO handle error
        });
      }
    });

    $scope.$watch('settings.interval', function(newValue, oldValue) {
      if (newValue && oldValue && newValue !== oldValue) {
        $scope.changeInterval();
      }
    });

    //function which refreshes the series 2 data when the date is change
    $scope.$watch('settings.series2Date', function(newValue, oldValue) {
      if (newValue && oldValue && newValue.getTime() !== oldValue.getTime()) {
        refreshSeries(2).then(function() {
          processChartData();
        }, function(error) {
          //TODO handle error
        });
      }
    });

    //function to process the chart data when a new series type is selected
    $scope.changeSeries = function() {
      processChartData();
    };

    $scope.changeType = function() {
      processChartData();
    };

    //function for refreshing the series data, input type is the series identifier and if
    //none is proved it will refresh both
    function refreshSeries(series) {
      var dateData = {};
      var defered = $q.defer();
      var series1RequestCompleted = false;
      var series2RequestCompleted = false;

      switch (series) {
        case 1:
          dateData.series1 = chartdataService.createDateData($scope.settings.series1Date, getType($scope.settings.interval));
          $scope.dates.invalidSeries1Date = false;
          energyComparisonService.getSeriesData(dateData.series1, $scope.dateTime).then(function(data) {
            series1and2Data = data;
            if (!data) {
              $scope.dates.invalidSeries1Date = true;
            }
            defered.resolve();
          });
          break;
        case 2:
          dateData.series2 = chartdataService.createDateData($scope.settings.series2Date, getType($scope.settings.interval));
          $scope.dates.invalidSeries2Date = false;
          energyComparisonService.getSeriesData(dateData.series2, $scope.dateTime).then(function(data) {
            series3and4Data = data;
            if (!data) {
              $scope.dates.invalidSeries2Date = true;
            }
            defered.resolve();
          });
          break;
        default:
          dateData.series1 = chartdataService.createDateData($scope.settings.series1Date, getType($scope.settings.interval));
          dateData.series2 = chartdataService.createDateData($scope.settings.series2Date, getType($scope.settings.interval));
          $scope.dates.invalidSeries1Date = false;
          $scope.dates.invalidSeries2Date = false;
          $q.all({
            series1: energyComparisonService.getSeriesData(dateData.series1, $scope.dateTime),
            series2: energyComparisonService.getSeriesData(dateData.series2, $scope.dateTime),
          }).then(function(data) {
            series1and2Data = data.series1;
            series3and4Data = data.series2;

            if (!series1and2Data) {
              $scope.dates.invalidSeries1Date = true;
            }

            if (!series3and4Data) {
              $scope.dates.invalidSeries2Date = true;
            }

            defered.resolve();
          });
      }


      return defered.promise;
    }

    //convert enum value to string
    function getType(enumValue) {
      switch (enumValue) {
        case "1":
          return "hours";
          break;
        case "2":
          return "days";
          break;
        case "3":
          return "months";
          break;
        case "4":
          return "years";
          break;
        default:
      }
    }

    //function used to refresh the data to the chartjs grpah
    function processChartData() {

      var dateLabels = [];
      if (series1and2Data) {
        dateLabels = series1and2Data.labels;
      } else if (series3and4Data) {
        dateLabels = series3and4Data.labels;
      }

      var chartObj = {
        labels: dateLabels,
        datasets: []
      };

      if (series1and2Data) {
        if ($scope.settings.series1 !== "-1") {
          chartObj.datasets.push({
            backgroundColor: colorHelper(colors[0]).alpha(0.7).rgbString(),
            borderColor: colors[0],
            data: series1and2Data.data[parseInt($scope.settings.series1)],
            label: "" + valueToTitle($scope.settings.series1),
            fill: false,
            hidden: false,
          });
        }

        if ($scope.settings.series2 !== "-1") {
          chartObj.datasets.push({
            backgroundColor: colorHelper(colors[1]).alpha(0.7).rgbString(),
            borderColor: colors[1],
            data: series1and2Data.data[parseInt($scope.settings.series2)],
            label: "" + valueToTitle($scope.settings.series2),
            fill: false,
            hidden: false,
          });
        }
      }

      if (series3and4Data) {
        if ($scope.settings.series3 !== "-1") {
          chartObj.datasets.push({
            backgroundColor: colorHelper(colors[2]).alpha(0.7).rgbString(),
            borderColor: colors[2],
            data: series3and4Data.data[parseInt($scope.settings.series3)],
            label: "" + valueToTitle($scope.settings.series3),
            fill: false,
            hidden: false,
          });
        }

        if ($scope.settings.series4 !== "-1") {
          chartObj.datasets.push({
            backgroundColor: colorHelper(colors[3]).alpha(0.7).rgbString(),
            borderColor: colors[3],
            data: series3and4Data.data[parseInt($scope.settings.series4)],
            label: "" + valueToTitle($scope.settings.series4),
            fill: false,
            hidden: false,
          });
        }
      }

      options.title.text = getTitle();
      $scope.myChart = {
        type: $scope.settings.chart_type,
        'data': chartObj,
        'options': options,
        'title': $filter('translate')('dashboard.energy_comparison'),
        'date': getTitle()
      };
      setColumns();
    }

    function getTitle() {
      var title_format = "";
      var title = "";
      switch ($scope.settings.interval) {
        case "1":
          title_format = "MMMM D YYYY";
          break;
        case "2":
          title_format = "MMMM YYYY";
          break;
        case "3":
          title_format = "YYYY";
          break;
        default:
      }

      if ($scope.settings.interval !== "4") {
        title = moment($scope.settings.series1Date).format(title_format) + " vs " + moment($scope.settings.series2Date).format(title_format);
      }
      return title;
    }

    $scope.toggleHidden = function(datasetIndex) {
      var index = datasetIndex;

      if (datasetIndex > 0 && $scope.settings.series1 === '-1') {
        index--;
      }

      if (datasetIndex > 1 && $scope.settings.series2 === '-1') {
        index--;
      }

      if (datasetIndex > 2 && $scope.settings.series3 === '-1') {
        index--;
      }

      if ($scope.myChart && $scope.myChart.data && $scope.myChart.data.datasets[index]) {
        $scope.myChart.data.datasets[index].hidden = !$scope.myChart.data.datasets[index].hidden;
      }
      $scope.updateChart();
    };

    $scope.isHidden = function(datasetIndex) {
      var index = datasetIndex;
      var isHidden = true;
      if (datasetIndex > 0 && $scope.settings.series1 === '-1') {
        index--;
      }

      if (datasetIndex > 1 && $scope.settings.series2 === '-1') {
        index--;
      }

      if (datasetIndex > 2 && $scope.settings.series3 === '-1') {
        index--;
      }

      if ($scope.myChart && $scope.myChart.data && $scope.myChart.data.datasets[index]) {
        isHidden = $scope.myChart.data.datasets[index].hidden;
      }
      return isHidden;
    };

    $scope.valueToTitle = function(value) {
      return valueToTitle(value);
    };

    function setColumns() {
      $scope.myChart.labels = [];
      $scope.myChart.labels.push(valueToTitle($scope.settings.series1) + '(Wh)');
      $scope.myChart.labels.push(valueToTitle($scope.settings.series2) + '(Wh)');
      $scope.myChart.labels.push(valueToTitle($scope.settings.series3) + '(Wh)');
      $scope.myChart.labels.push(valueToTitle($scope.settings.series4) + '(Wh)');
    }

    //function used to get the translated title based on the enum value
    function valueToTitle(value) {
      var title = '';
      switch (value) {
        case '0':
          title = $filter('translate')('dashboard.grid_output');
          break;
        case '1':
          title = $filter('translate')('dashboard.grid_input');
          break;
        case '2':
          title = $filter('translate')('dashboard.generator_input');
          break;
        case '3':
          title = $filter('translate')('dashboard.load_output');
          break;
        case '4':
          title = $filter('translate')('dashboard.pv_input');
          break;
        case '5':
          title = $filter('translate')('dashboard.system_dc_out');
          break;
        case '6':
          title = $filter('translate')('dashboard.system_dc_in');
          break;
        case '7':
          title = $filter('translate')('dashboard.pv_ac_output');
          break;
        default:
      }

      return title;
    }

  }
]);
