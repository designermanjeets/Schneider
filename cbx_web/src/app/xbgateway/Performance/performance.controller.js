"use strict";
//This is the controller for the graphs on the performance tabs
angular.module('conext_gateway.xbgateway').controller("performanceController", [
  "$scope", "performanceService", "$stateParams", "chartdataService", "dateDataService", "timezoneService", "$filter", "moment", "settingStorageService",
  function($scope, performanceService, $stateParams, chartdataService, dateDataService, timezoneService, $filter, moment, settingStorageService) {
    var colors = ["#42B4E6", "#3DCD58", "#E47F00", "#FFD100", "#DC0A0A", "#B10043", "#000000", "#626469"];
    $scope.device = $stateParams.device;
    $scope.settings = settingStorageService.getPerformanceSettings($stateParams.id);

    //obect used to store value from calender and set its parameters
    $scope.dates = {
      isOpen: false,
      minDate: '',
      maxDate: '',
      invalidDate: false,
      format: 'yyyy/MM/dd',
      mode: 'day',
    };

    var options = {
      responsive: true,
      legend: {
        display: false,
        lineWidth: 1.5,
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

            if (label) {
              label += ": " + $filter('scaleValue')(tooltipItem.yLabel) + $filter('scaleUnit')('Wh', tooltipItem.yLabel);
            }
            return label;
          },
          title: function(tooltipItemArray, data) {
            var format = "";
            var filler = "";
            switch ($scope.settings.interval) {
              case "1":
                format = "YYYY MMM D h:mm a";
                break;
              case "2":
                format = "YYYY MMM D";
                break;
              case "3":
                format = "YYYY MMM";
                break;
              case "4":
                format = "YYYY";
                filler = "-01-01";
                break;
              default:
            }

            return moment(data.labels[tooltipItemArray[0].index] + filler).format(format);
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
              if (value >= 1e3) {
                return value / 1e3 + "k";
              } else if (value >= 1e6) {
                return value / 1e6 + "M";
              } else if (value >= 1e9) {
                return value / 1e9 + "M";
              }
              return value;
            },
            beginAtZero: true
          },
          display: true,
          position: 'left',
          scaleLabel: {
            display: true,
          },
          gridLines: {
            display: true
          }
        }],
      }
    };

    //Watch for when the a new date is selected and then refresh the charts data
    $scope.$watch('settings.date', function(newValue, oldValue) {
      if (newValue && oldValue && newValue !== oldValue) {
        getChartData();
      }
    });

    //function for when the chart type is changed which then updates the chart
    $scope.changeType = function() {
      $scope.myChart = {
        type: $scope.settings.type,
        'data': $scope.myChart.data,
        'options': options,
        'title': $scope.device + ' [' + $scope.devinfo.LPHD_CFG_DEVICE_NAME + ' ' + $scope.devinfo.LPHD_CFG_DEVICE_INSTANCE + ']',
        'date': getDateTitle()
      };
    }

    function getDateTitle() {
      var dateTitle;
      switch ($scope.settings.interval) {
        case '1':
          dateTitle = moment($scope.settings.date).format('MMMM DD, YYYY');
          break;
        case '2':
          dateTitle = moment($scope.settings.date).format('MMMM, YYYY');
          break;
        case '3':
          dateTitle = moment($scope.settings.date).format('YYYY');
          break;
        case '4':
          dateTitle = 'Lifetime';
          break;
        default:
      }
      return dateTitle;
    }

    //Function for when the interval is changed.  These settings are
    //used to format the xAxis of the chart and also clamp the calender
    $scope.changeInterval = function() {
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
      getChartData();
    };

    $scope.$watch('settings.interval', function(newValue, oldValue) {
      if (newValue && oldValue && newValue !== oldValue) {
        $scope.changeInterval();
      }
    });

    //Function to open the calender
    $scope.openCalender = function() {
      $scope.dates.isOpen = true;
    };

    //Function to get the date data
    dateDataService.getDateData().then(function(data) {
      var dateParameters = timezoneService.getDateParameters(data);
      if (!$scope.settings.date) {
        $scope.settings.date = dateParameters.date;
      }
      $scope.dates.minDate = dateParameters.minDate;
      $scope.dates.maxDate = dateParameters.maxDate;
      $scope.changeInterval();
    }, function(error) {
      $scope.dates.invalidDate = true;
    });

    //Fucntion to retreive the chart data and format it for chartjs
    function getChartData() {
      var dateData = chartdataService.createDateData($scope.settings.date, getType($scope.settings.interval));
      performanceService.getPerformanceData($stateParams.device, $stateParams.id, dateData).then(function(data) {
        $scope.dates.invalidDate = false;
        var chartObj = {
          labels: data.labels,
          datasets: []
        };

        for (var index = 0; index < data.chartlabels.length; index++) {
          chartObj.datasets.push({
            backgroundColor: colors[index],
            borderColor: colors[index],
            data: data[data.chartlabels[index]],
            label: $filter('translate')(data.chartlabels[index]),
            fill: false,
            hidden: false
          });
        }
        options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('dashboard.energy_axis', {
          units: "Wh"
        });

        $scope.myChart = {
          type: $scope.settings.type,
          'data': chartObj,
          'options': options,
          'title': $scope.device + ' [' + (($scope.devinfo) ? $scope.devinfo.LPHD_CFG_DEVICE_NAME + ' ' + $scope.devinfo.LPHD_CFG_DEVICE_INSTANCE : '') + ']',
          'date': getDateTitle()
        };
        setColumns();
      }, function(error) {
        $scope.dates.invalidDate = true;
      });
    }

    //convert enum value to string
    function getType(enumValue) {
      switch (enumValue) {
        case "1":
          return "hours";
        case "2":
          return "days";
        case "3":
          return "months";
        case "4":
          return "years";
        default:
      }
    }

    function setColumns() {
      $scope.myChart.labels = [];
      for(var index in $scope.myChart.data.datasets) {
        if($scope.myChart.data.datasets.hasOwnProperty(index)) {
          $scope.myChart.labels.push($scope.myChart.data.datasets[index].label + '(Wh)');
        }
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
