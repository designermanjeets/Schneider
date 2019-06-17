"use strict";

angular.module('conext_gateway.setup').controller("gridCodesController", ["$scope", "$filter", "$stateParams", "gridCodesService", "dateDataService", "moment",
  "timezoneService", "saveAs", "FileUploader", "gridCodesRegionService", "$timeout", "$interval", '$q', 'pcPDFGeneratorService', '$uibModal',
  function($scope, $filter, $stateParams, gridCodesService, dateDataService, moment, timezoneService, saveAs, FileUploader, gridCodesRegionService,
    $timeout, $interval, $q, pcPDFGeneratorService, $uibModal) {
    var deviceId = $stateParams.id;
    var interval;
    var requestPending = false;
    $scope.curve = "qv";
    $scope.info = {};
    $scope.password = "";
    $scope.disableAll = false;
    $scope.verified = {
      "state": false,
      "message": "",
    };

    $scope.exportPDF = function() {
      $scope.disableAll = true;
      var modalInstance = $uibModal.open({
        templateUrl: 'app/xbgateway/GridCodes/additionalinfo_modal.html',
        controller: 'AdditionalInfoModalController',
        backdrop: 'static',
        keyboard: false
      });

      modalInstance.result.then(
        // On success
        function(additionalInfo) {
          $timeout(function() {
            gridCodesService.getCurveData(deviceId).then(function(data) {
              pcPDFGeneratorService.exportPDF($scope.devinfo.LPHD_SERIALNUM, $scope.date, data, additionalInfo, $scope.devinfo.FWB);
              $scope.disableAll = false;
            }, function() {
              $scope.disableAll = false;
            });
          }, 500);
        },
        // On error
        function(error) {
          $scope.disableAll = false;
        }
      );

    };

    $scope.passwordChange = function() {
      $scope.verified.message = "";
    };

    $scope.slopeChanged = function() {
      $scope.info[$scope.selectedCurves[0]].data[1].x = parseFloat(($scope.info[$scope.selectedCurves[0]].data[1].y / $scope.info[$scope.selectedCurves[0]].slope.value).toFixed(2));
      processChart();
    };

    $scope.pfChanged = function() {
      $scope.info.powerfactor.data = [{
        "x": 0,
        "y": 0
      }];
      var pf = $scope.info.powerfactor.value;
      var point = {};
      point.x = 100 * Math.abs(pf);
      point.y = parseFloat((Math.sqrt(Math.pow(100, 2) - Math.pow(point.x, 2)) * (Math.abs(pf) / pf)).toFixed(2)) * -1;
      $scope.info.powerfactor.data.push(point);
      if (isValidatePf(pf)) {
        processChart();
      }
    };

    function isValidatePf(pf) {
      $scope.info.powerfactor.invalid = !inRange(pf, 0.85, 0.99) &&
        !inRange(pf, -0.99, -0.85) &&
        !inRange(pf, 1, 1);

      return !$scope.info.powerfactor.invalid;
    }

    function inRange(value, lowerBound, upperBound) {
      return value >= lowerBound && value <= upperBound;
    }

    $scope.getPFType = function() {
      var pfType = "";
      if ($scope.info[$scope.selectedCurves[0]].value === 1) {
        pfType = $filter('translate')('xanbus.grid_codes.unity');
      } else {
        pfType = ($scope.info[$scope.selectedCurves[0]].value > 0) ? $filter('translate')('xanbus.grid_codes.leading') : $filter('translate')('xanbus.grid_codes.lagging');
      }
      return pfType;
    };

    $scope.getTitle = function(curvename) {
      var title = "";
      if (curvename !== undefined) {
        title = $filter('translate')('xanbus.grid_codes.' + curvename);
      }
      return title;
    };

    $scope.getPFInfo = function(event) {
      $timeout(function() {
        event.target.previousElementSibling.focus();
      }, 100);
    };

    $scope.getRRInfo = function(event) {
      var message = "";
      message += $filter('translate')('xanbus.grid_codes.info_limits', {
        "axis": $filter('translate')('xanbus.grid_codes.slope'),
        "min": $scope.info.rr.slope.min,
        "max": $scope.info.rr.slope.max
      });
      $scope.rrInfo = message;
      $timeout(function() {
        event.target.previousElementSibling.focus();
      }, 100);
    };

    $scope.getInfo = function(event, coordinate) {
      var message = "";
      message += $filter('translate')('xanbus.grid_codes.info_limits', {
        "axis": "X",
        "min": coordinate.xmin,
        "max": coordinate.xmax
      });
      message += $filter('translate')('xanbus.grid_codes.info_limits', {
        "axis": "Y",
        "min": coordinate.ymin,
        "max": coordinate.ymax
      });

      for (var index = 0; index < coordinate.conditions.length; index++) {
        var condition = coordinate.conditions[index];
        var axis = condition.charAt(0);
        var comparitor = (condition.charAt(1) === '>') ? $filter('translate')('xanbus.grid_codes.gt') : $filter('translate')('xanbus.grid_codes.lt');
        var pointIndex = parseInt(condition.substr(2));
        // {{axis}} must be {{condition}} than Point {{pointNumber}}
        message += $filter('translate')('xanbus.grid_codes.info_condition', {
          "axis": axis.toUpperCase(),
          "condition": comparitor,
          "pointNumber": pointIndex + 1
        });
      }
      $scope.pointInfo = message;
      $timeout(function() {
        event.target.previousElementSibling.focus();
      }, 100);

    };

    $scope.submit = function() {
      if ($scope.password === "XWproGridCodes") {
        $scope.verified.state = true;
      } else {
        $scope.verified.message = $filter('translate')('xanbus.grid_codes.incorrect_password');
      }
    };

    function copySlope(curve) {
      $scope.info[curve].slope.value = parseFloat(($scope.info[curve].data[1].y / $scope.info[curve].data[1].x).toFixed(2));
    }

    $scope.regionChange = function() {
      $scope.disableAll = true;
      var selection = $scope.info.region.value;
      switch (selection) {
        case '1':
          copyGridCodes(gridCodesRegionService.getCaliforniaCodes());
          $scope.pfChanged();
          copySlope('ss');
          copySlope('rr');
          break;
        case '2':
          copyGridCodes(gridCodesRegionService.getPrepaCodes());
          $scope.pfChanged();
          copySlope('ss');
          copySlope('rr');
          break;
        case '4':
          copyGridCodes(gridCodesRegionService.getIEEECodes());
          $scope.pfChanged();
          copySlope('ss');
          copySlope('rr');
          break;
        case '255':
          for (var code in $scope.info) {
            if ($scope.info.hasOwnProperty(code) && $scope.info[code].hasOwnProperty('data')) {
              for (var point in $scope.info[code].data) {
                if ($scope.info[code].data.hasOwnProperty(point)) {
                  $scope.info[code].data[point].xmax = undefined;
                  $scope.info[code].data[point].xmin = undefined;
                  $scope.info[code].data[point].ymax = undefined;
                  $scope.info[code].data[point].ymin = undefined;
                  if ($scope.info[code].data[point].hasOwnProperty("xInvalid")) {
                    delete $scope.info[code].data[point].xInvalid;
                  }
                  if ($scope.info[code].data[point].hasOwnProperty("yInvalid")) {
                    delete $scope.info[code].data[point].yInvalid;
                  }
                  if ($scope.info[code].data[point].hasOwnProperty("yCor")) {
                    delete $scope.info[code].data[point].yCor;
                  }
                  if ($scope.info[code].data[point].hasOwnProperty("xCor")) {
                    delete $scope.info[code].data[point].xCor;
                  }
                  if ($scope.info[code].data[point].hasOwnProperty("conditions")) {
                    delete $scope.info[code].data[point].conditions;
                  }
                }
              }
            }
          }
          break;
        default:
      }
      $scope.info.region.value = selection;
      $scope.message = {
        "content": "xanbus.grid_codes.unsaved_changes",
        "class": "gc_edited"
      };
      processChart();
      $scope.disableAll = false;
    };

    function copyMinMax(codes) {
      var code_titles = ['qv', 'lfrt', 'hfrt', 'lvrt', 'hvrt', 'pf', 'ss', 'rr', 'pw'];

      for (var title in code_titles) {
        if (code_titles.hasOwnProperty(title)) {
          if (!$scope.info.hasOwnProperty(code_titles[title])) {
            $scope.info[code_titles[title]] = {};
          }

          if (code_titles[title] === 'rr') {
            $scope.info[code_titles[title]].slope.max = codes[code_titles[title]].slope.max;
            $scope.info[code_titles[title]].slope.min = codes[code_titles[title]].slope.min;
          }

          for (var point in codes[code_titles[title]].data) {
            if (codes[code_titles[title]].data.hasOwnProperty(point) && $scope.info[code_titles[title]].data.hasOwnProperty(point)) {
              if (codes[code_titles[title]].data[point].hasOwnProperty('xmax')) {
                $scope.info[code_titles[title]].data[point].xmax = codes[code_titles[title]].data[point].xmax;
              }
              if (codes[code_titles[title]].data[point].hasOwnProperty('xmin')) {
                $scope.info[code_titles[title]].data[point].xmin = codes[code_titles[title]].data[point].xmin;
              }
              if (codes[code_titles[title]].data[point].hasOwnProperty('ymax')) {
                $scope.info[code_titles[title]].data[point].ymax = codes[code_titles[title]].data[point].ymax;
              }
              if (codes[code_titles[title]].data[point].hasOwnProperty('ymin')) {
                $scope.info[code_titles[title]].data[point].ymin = codes[code_titles[title]].data[point].ymin;
              }
              if (codes[code_titles[title]].data[point].hasOwnProperty('xCor')) {
                $scope.info[code_titles[title]].data[point].xCor = codes[code_titles[title]].data[point].xCor;
              }
              if (codes[code_titles[title]].data[point].hasOwnProperty('yCor')) {
                $scope.info[code_titles[title]].data[point].yCor = codes[code_titles[title]].data[point].yCor;
              }
              if (codes[code_titles[title]].data[point].hasOwnProperty('conditions')) {
                $scope.info[code_titles[title]].data[point].conditions = codes[code_titles[title]].data[point].conditions;
              }
            }
          }
        }
      }
    }

    function copyGridCodes(codes) {
      var code_titles = ['qv', 'lfrt', 'hfrt', 'lvrt', 'hvrt', 'pf', 'ss', 'rr', "powerfactor", 'pw'];

      $scope.info.region = {
        'value': codes.region.value
      };

      for (var title in code_titles) {
        if (code_titles.hasOwnProperty(title)) {
          if (!$scope.info.hasOwnProperty(code_titles[title])) {
            $scope.info[code_titles[title]] = {};
          }

          if (codes[code_titles[title]].hasOwnProperty('enabled')) {
            $scope.info[code_titles[title]].enabled = codes[code_titles[title]].enabled;
          }

          if (codes[code_titles[title]].slope !== undefined) {
            $scope.info[code_titles[title]].slope = codes[code_titles[title]].slope;
          }

          if (codes[code_titles[title]].value !== undefined) {
            $scope.info[code_titles[title]].value = codes[code_titles[title]].value;
          }

          $scope.info[code_titles[title]].data = [];
          for (var point in codes[code_titles[title]].data) {
            if (codes[code_titles[title]].data.hasOwnProperty(point)) {
              var newPoint = {};
              newPoint.x = codes[code_titles[title]].data[point].x;
              newPoint.y = codes[code_titles[title]].data[point].y;
              if (codes[code_titles[title]].data[point].xmax !== undefined) {
                newPoint.xmax = codes[code_titles[title]].data[point].xmax;
              }
              if (codes[code_titles[title]].data[point].xmin !== undefined) {
                newPoint.xmin = codes[code_titles[title]].data[point].xmin;
              }
              if (codes[code_titles[title]].data[point].ymax !== undefined) {
                newPoint.ymax = codes[code_titles[title]].data[point].ymax;
              }
              if (codes[code_titles[title]].data[point].ymin !== undefined) {
                newPoint.ymin = codes[code_titles[title]].data[point].ymin;
              }
              if (codes[code_titles[title]].data[point].xCor !== undefined) {
                newPoint.xCor = codes[code_titles[title]].data[point].xCor;
              }
              if (codes[code_titles[title]].data[point].yCor !== undefined) {
                newPoint.yCor = codes[code_titles[title]].data[point].yCor;
              }
              if (codes[code_titles[title]].data[point].conditions !== undefined) {
                newPoint.conditions = codes[code_titles[title]].data[point].conditions;
              }
              $scope.info[code_titles[title]].data.push(newPoint);
            }
          }
        }
      }
    }

    dateDataService.getDateData().then(function(data) {
      var dateParameters = timezoneService.getDateParameters(data);
      if (!$scope.date) {
        $scope.date = dateParameters.date;
      }
    });

    var options = {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false,
        lineWidth: 1.5,
      },
      title: {
        display: false,
        position: 'bottom',
        text: ''
      },
      tooltips: {
        mode: 'point',
        intersect: false,
        enabled: true,
        callbacks: {
          label: function(tooltipItem, data) {
            return "Point " + (tooltipItem.index + 1) + ": " + tooltipItem.yLabel;
          },
          labelColor: function(tooltipItem, chart) {
            return (tooltipItem.datasetIndex === 0) ? {
              borderColor: '#70E07C',
              backgroundColor: "#3DCD58"
            } : {
              borderColor: "#71cbf4",
              backgroundColor: "#42B4E6"
            };
          }
        }
      },
      hover: {
        mode: 'point',
        intersect: false
      },
      scales: {
        xAxes: [{
          type: 'linear',
          gridLines: {
            display: true
          },
          scaleLabel: {
            display: true,
            labelString: "",
          },
          ticks: {
            beginAtZero: false
          }
        }],
        yAxes: [{
          type: 'linear',
          display: true,
          position: 'left',
          gridLines: {
            display: true
          },
          scaleLabel: {
            display: true,
            labelString: "",
          },
          ticks: {
            beginAtZero: true
          }
        }],
      }
    };

    $scope.addLine = function(data) {
      if (data.length !== 20) {
        data.push({
          'x': null,
          'y': null
        });
      }
    };

    $scope.coordinatesChanged = function(coordinate, index, curveIndex) {
      $scope.message = {
        "content": "xanbus.grid_codes.unsaved_changes",
        "class": "gc_edited"
      };

      if ($scope.info.region.value !== '255') {
        changeCorrelatedPoints(index, curveIndex);
        validateCurve($scope.info[$scope.selectedCurves[curveIndex]].data);
      }

      if ($scope.selectedCurves[curveIndex] === 'ss' || $scope.selectedCurves[curveIndex] === 'rr') {
        $scope.info[$scope.selectedCurves[curveIndex]].slope.value = parseFloat((coordinate.y / coordinate.x).toFixed(2));
      }

      if (coordinate.x !== null && coordinate.y !== null) {
        processChart();
      }
    };

    function validateCurve(points) {
      var isInvalid = false;
      for (var index = 0; index < points.length; index++) {
        var point = points[index];
        point.xInvalid = false;
        point.yInvalid = false;
        point.xInvalid = point.x === undefined || point.x < point.xmin || point.x > point.xmax;
        point.yInvalid = point.y === undefined || point.y < point.ymin || point.y > point.ymax;
        if (point.hasOwnProperty('conditions') && !point.xInvalid && !point.xInvalid) {
          checkConditions(point, points);
        }
        isInvalid = isInvalid || point.xInvalid || point.yInvalid;
      }
      return isInvalid;
    }

    function checkConditions(point, points) {
      if (point !== undefined) {
        for (var conditionIndex = 0; conditionIndex < point.conditions.length; conditionIndex++) {
          var condition = point.conditions[conditionIndex];
          var axis = condition.charAt(0);
          var comparitor = condition.charAt(1);
          var pointIndex = parseInt(condition.substr(2));
          if (points[pointIndex] !== undefined) {
            point[axis + "Invalid"] = point[axis + "Invalid"] || ((comparitor === '>') ? point[axis] <= points[pointIndex][axis] : point[axis] >= points[pointIndex][axis]);
          }
        }
      }
    }

    function changeCorrelatedPoints(index, curveIndex) {
      var points = $scope.info[$scope.selectedCurves[curveIndex]].data;
      var xCorIndex = points[index].xCor;
      var yCorIndex = points[index].yCor;
      var pointIndex;

      if (xCorIndex !== undefined) {
        if (angular.isArray(xCorIndex)) {
          for (pointIndex = 0; pointIndex < xCorIndex.length; pointIndex++) {
            if (points[xCorIndex[pointIndex]].x !== points[index].x) {
              points[xCorIndex[pointIndex]].x = points[index].x;
            }
          }
        } else if (points[index].x !== points[xCorIndex].x) {
          points[xCorIndex].x = points[index].x;
        }
      }

      if (yCorIndex !== undefined) {
        if (angular.isArray(yCorIndex)) {
          for (pointIndex = 0; pointIndex < yCorIndex.length; pointIndex++) {
            if (points[yCorIndex[pointIndex]].y !== points[index].y) {
              points[yCorIndex[pointIndex]].y = points[index].y;
            }
          }
        } else if (points[index].y !== points[yCorIndex].y) {
          points[yCorIndex].y = points[index].y;
        }
      }
    }

    $scope.settingsChanged = function(setValue) {
      if($scope.disableAll) {
        return;
      }

      if ($scope.curve === "powerfactor" && setValue) {
        $scope.info.qv.enabled = !$scope.info.powerfactor.enabled;
      } else if ($scope.curve === 'qv' && setValue) {
        $scope.info.powerfactor.enabled = !$scope.info.qv.enabled;
      } else if ($scope.curve === 'vrt' || $scope.curve === 'frt') {
        $scope.info.lfrt.enabled = setValue;
        $scope.info.hfrt.enabled = setValue;
        $scope.info.lvrt.enabled = setValue;
        $scope.info.hvrt.enabled = setValue;
      }

      $scope.message = {
        "content": "xanbus.grid_codes.unsaved_changes",
        "class": "gc_edited"
      };
    };

    $scope.sequentiallySaveCurve = function() {
      $scope.disableAll = true;
      if ($scope.info.region.value === '255' || areGridCodesValid()) {
        $scope.message = {
          "content": "xanbus.grid_codes.pending_changes",
          "class": "gc_warning"
        };
        gridCodesService.sequentiallySaveCurveData($scope.info, deviceId).then(function() {
          $scope.message = {
            "content": "xanbus.grid_codes.changes_saved",
            "class": "gc_success"
          };
          $scope.disableAll = false;
        }, function(error) {
          $scope.message = {
            "content": "xanbus.grid_codes.save_failed",
            "class": "gc_error"
          };
          $scope.disableAll = false;
        });
      } else {
        $scope.message = {
          "content": "xanbus.grid_codes.invalid_settings",
          "class": "gc_error"
        };
        $scope.disableAll = false;
      }
    };

    $scope.saveCurve = function() {
      $scope.disableAll = true;
      if ($scope.info.region.value === '255' || areGridCodesValid()) {
        $scope.message = {
          "content": "xanbus.grid_codes.pending_changes",
          "class": "gc_warning"
        };
        gridCodesService.saveCurveData($scope.info, deviceId).then(function() {
          if (interval) {
            $interval.cancel(interval);
            requestPending = false;
          }

          interval = $interval(function() {
            if (!requestPending) {
              requestPending = true;
              checkIfWrittenToXW().then(function(result) {
                if (result === 'failed') {
                  $scope.message = {
                    "content": "xanbus.grid_codes.save_failed",
                    "class": "gc_error"
                  };
                  $scope.disableAll = false;
                  $interval.cancel(interval);
                } else if (result === 'saved') {
                  $interval.cancel(interval);
                  $scope.message = {
                    "content": "xanbus.grid_codes.changes_saved",
                    "class": "gc_success"
                  };
                  $scope.disableAll = false;
                }
                requestPending = false;
              });
            }
          }, 1500);

        }, function(error) {
          $scope.message = {
            "content": "xanbus.grid_codes.save_failed",
            "class": "gc_error"
          };
          $scope.disableAll = false;
        });
      } else {
        $scope.message = {
          "content": "xanbus.grid_codes.invalid_settings",
          "class": "gc_error"
        };
        $scope.disableAll = false;
      }
    };

    function checkIfWrittenToXW() {
      var defered = $q.defer();
      var status = 'saved';

      gridCodesService.getCurveData(deviceId).then(function(data) {
        for (var field in data) {
          if (data.hasOwnProperty(field)) {
            if (data[field].hasOwnProperty('quality')) {
              if (data[field].quality !== 'G') {
                if (data[field].quality === 'F') {
                  status = 'failed';
                } else if (status !== 'failed') {
                  status = 'pending';
                }
              }
            }
          }

          if (data[field].hasOwnProperty('qualities')) {
            for (var index = 0; index < data[field].qualities.length; index++) {
              if (data[field].hasOwnProperty('quality')) {
                if (data[field].qualities[index] !== 'G') {
                  if (data[field].qualities[index] === 'F') {
                    status = 'failed';
                  } else if (status !== 'failed') {
                    status = 'pending';
                  }
                }
              }
            }
          }
        }
        if (status === 'saved' && !isGCquality(data, $scope.info)) {
          status = 'failed';
        }
        defered.resolve(status);
      }, function(error) {
        defered.resolve('failed');
      });

      return defered.promise;
    }

    function isGCquality(current, old) {
      for (var field in current) {
        if (current.hasOwnProperty(field)) {

          if (current[field].hasOwnProperty('value')) {
            if (current[field].value !== old[field].value) {
              return false;
            }
          }

          if (current[field].hasOwnProperty('data')) {
            if (!isCoordinatesEqual(current[field].data, old[field].data)) {
              return false;
            }
          }

          if (current[field].hasOwnProperty('enabled')) {
            if (current[field].enabled !== ((old[field].enabled) ? 1 : 0)) {
              return false;
            }
          }

          if (current[field].hasOwnProperty('slope')) {
            if (current[field].slope.value !== old[field].slope.value) {
              return false;
            }
          }
        }
      }
      return true;
    }

    function isCoordinatesEqual(currentData, oldData) {
      if (currentData.length !== oldData.length) {
        return false;
      }

      for (var index = 0; index < currentData.length; index++) {
        if (currentData[index].x.toFixed(2) !== oldData[index].x.toFixed(2) ||
          currentData[index].y.toFixed(2) !== oldData[index].y.toFixed(2)) {
          return false;
        }
      }

      return true;
    }

    function areGridCodesValid() {
      var response = true;
      for (var gridCode in $scope.info) {
        if ($scope.info.hasOwnProperty(gridCode)) {
          if (gridCode === "powerfactor") {
            response = isValidatePf($scope.info[gridCode].value) && response;
          } else if (gridCode === 'rr') {
            response = Number.isInteger($scope.info[gridCode].slope.value) &&
              $scope.info[gridCode].slope.value !== undefined &&
              $scope.info[gridCode].slope.value >= $scope.info[gridCode].slope.min &&
              $scope.info[gridCode].slope.value <= $scope.info[gridCode].slope.max && response;
          } else if (gridCode === 'ss') {
            response = Number.isInteger($scope.info[gridCode].data[1].x) &&
              $scope.info[gridCode].data[1].x !== undefined &&
              $scope.info[gridCode].data[1].x >= $scope.info[gridCode].data[1].xmin &&
              $scope.info[gridCode].data[1].x <= $scope.info[gridCode].data[1].xmax && response;
          } else if ($scope.info[gridCode].data !== undefined) {
            response = !validateCurve($scope.info[gridCode].data) && response;
          }
        }
      }
      return response;
    }

    $scope.curveChange = function() {
      processChart();
    };

    $scope.getMin = function(index, curve, cord) {
      if ($scope.info[$scope.selectedCurves[curve]].data.length >= index + 2 &&
        $scope.info[$scope.selectedCurves[curve]].data[index][cord + 'min'] <
        $scope.info[$scope.selectedCurves[curve]].data[index + 1][cord]) {
        return $scope.info[$scope.selectedCurves[curve]].data[index + 1][cord];
      } else {
        return $scope.info[$scope.selectedCurves[curve]].data[index][cord + 'min'];
      }
    };

    function getData() {
      $scope.disableAll = true;
      gridCodesService.getCurveData(deviceId).then(function(data) {

        copyGridCodes(data);
        switch (data.region.value) {
          case '1':
            copyMinMax(gridCodesRegionService.getCaliforniaCodes());
            break;
          case '4':
            copyMinMax(gridCodesRegionService.getIEEECodes());
            break;
          case '2':
            copyMinMax(gridCodesRegionService.getPrepaCodes());
            break;
          default:
        }
        processChart();
        $scope.disableAll = false;
      }, function() {
        $scope.disableAll = false;
      });
    }

    function processChart() {
      $scope.selectedCurves = [];
      var chartObj = {
        datasets: []
      };
      var sortedData;
      switch ($scope.curve) {
        case "qv":
          $scope.selectedCurves.push("qv");
          sortedData = $filter('orderBy')($scope.info.qv.data, "x", false);
          sortedData = filterNulls(sortedData);
          options.scales.xAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.qv-x');
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.qv-y');
          chartObj.datasets.push({
            backgroundColor: "#70E07C",
            borderColor: "#3DCD58",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            data: sortedData,
            label: "",
            fill: false,
            hidden: false,
            pointRadius: 5,
            lineTension: 0
          });
          break;
        case "pw":
          $scope.selectedCurves.push("pw");
          sortedData = $filter('orderBy')($scope.info.pw.data, "x", false);
          sortedData = filterNulls(sortedData);
          options.scales.xAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.pw-x');
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.pw-y');
          chartObj.datasets.push({
            backgroundColor: "#70E07C",
            borderColor: "#3DCD58",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            data: sortedData,
            label: "",
            fill: false,
            hidden: false,
            pointRadius: 5,
            lineTension: 0
          });
          break;
        case "vrt":
          $scope.selectedCurves.push("hvrt");
          $scope.selectedCurves.push("lvrt");
          sortedData = $filter('orderBy')($scope.info.hvrt.data, "x", false);
          sortedData = filterNulls(sortedData);
          options.scales.xAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.vrt-x');
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.vrt-y');
          chartObj.datasets.push({
            backgroundColor: "#70E07C",
            borderColor: "#3DCD58",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            data: sortedData,
            label: "",
            fill: false,
            hidden: false,
            pointRadius: 5,
            lineTension: 0
          });
          sortedData = $filter('orderBy')($scope.info.lvrt.data, "x", false);
          sortedData = filterNulls(sortedData);
          chartObj.datasets.push({
            backgroundColor: "#71cbf4",
            borderColor: "#42B4E6",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            data: sortedData,
            label: "",
            fill: false,
            hidden: false,
            pointRadius: 5,
            lineTension: 0
          });
          break;
        case "frt":
          $scope.selectedCurves.push("hfrt");
          $scope.selectedCurves.push("lfrt");
          sortedData = $filter('orderBy')($scope.info.hfrt.data, "x", false);
          sortedData = filterNulls(sortedData);
          options.scales.xAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.frt-x');
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.frt-y');
          chartObj.datasets.push({
            backgroundColor: "#70E07C",
            borderColor: "#3DCD58",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            data: sortedData,
            label: "",
            fill: false,
            hidden: false,
            pointRadius: 5,
            lineTension: 0
          });
          sortedData = $filter('orderBy')($scope.info.lfrt.data, "x", false);
          sortedData = filterNulls(sortedData);
          chartObj.datasets.push({
            backgroundColor: "#71cbf4",
            borderColor: "#42B4E6",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            data: sortedData,
            label: "",
            fill: false,
            hidden: false,
            pointRadius: 5,
            lineTension: 0
          });
          break;
        case "pf":
          $scope.selectedCurves.push("pf");
          sortedData = $filter('orderBy')($scope.info.pf.data, "x", false);
          sortedData = filterNulls(sortedData);
          options.scales.xAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.pf-x');
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.pf-y');
          chartObj.datasets.push({
            backgroundColor: "#70E07C",
            borderColor: "#3DCD58",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            data: sortedData,
            label: "",
            fill: false,
            hidden: false,
            pointRadius: 5,
            lineTension: 0
          });
          break;
        case "ss":
          $scope.selectedCurves.push("ss");
          sortedData = $filter('orderBy')($scope.info.ss.data, "x", false);
          sortedData = filterNulls(sortedData);
          options.scales.xAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.ss-x');
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.ss-y');
          chartObj.datasets.push({
            backgroundColor: "#70E07C",
            borderColor: "#3DCD58",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            data: sortedData,
            label: "",
            fill: false,
            hidden: false,
            pointRadius: 5,
            lineTension: 0
          });
          break;
        case "rr":
          $scope.selectedCurves.push("rr");
          sortedData = $filter('orderBy')($scope.info.rr.data, "x", false);
          sortedData = filterNulls(sortedData);
          options.scales.xAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.rr-x');
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.rr-y');
          chartObj.datasets.push({
            backgroundColor: "#70E07C",
            borderColor: "#3DCD58",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            data: sortedData,
            label: "",
            fill: false,
            hidden: false,
            pointRadius: 5,
            lineTension: 0
          });
          break;
        case "powerfactor":
          $scope.selectedCurves.push("powerfactor");
          options.scales.xAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.powerfactor-x');
          options.scales.yAxes[0].scaleLabel.labelString = $filter('translate')('xanbus.grid_codes.powerfactor-y');
          chartObj.datasets.push({
            backgroundColor: "#70E07C",
            borderColor: "#3DCD58",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            data: $scope.info.powerfactor.data,
            label: "",
            fill: true,
            hidden: false,
            pointRadius: 5,
            lineTension: 0
          });

          chartObj.datasets.push({
            backgroundColor: "#626469",
            borderColor: "#626469",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            borderDash: [5, 5],
            data: [{
                "x": 0,
                "y": $scope.info.powerfactor.data[1].y
              },
              {
                "x": $scope.info.powerfactor.data[1].x,
                "y": $scope.info.powerfactor.data[1].y
              },
            ],
            label: "",
            fill: false,
            hidden: false,
            lineTension: 0,
            borderWidth: 0.5,
            pointRadius: [5, 0],
            pointHitRadius: [5, 0]
          });

          chartObj.datasets.push({
            backgroundColor: "#626469",
            borderColor: "#626469",
            pointBackgroundColor: "#CBCBCB",
            pointBorderColor: "#626469",
            borderDash: [5, 5],
            data: [{
                "x": $scope.info.powerfactor.data[1].x,
                "y": 0
              },
              {
                "x": $scope.info.powerfactor.data[1].x,
                "y": $scope.info.powerfactor.data[1].y
              },
            ],
            label: "",
            fill: false,
            hidden: false,
            lineTension: 0,
            borderWidth: 0.5,
            pointRadius: [5, 0],
            pointHitRadius: [5, 0]
          });

          break;
        default:

      }


      var minMax = getOffsets(chartObj.datasets, true);

      options.scales.xAxes[0].ticks.min = minMax.xmin;
      options.scales.xAxes[0].ticks.max = minMax.xmax;
      options.scales.yAxes[0].ticks.min = minMax.ymin;
      options.scales.yAxes[0].ticks.max = minMax.ymax;

      if ($scope.curve === 'vrt' || $scope.curve === 'frt' || $scope.curve === 'ss' || $scope.curve === 'rr') {
        addInfinitePointsToEnd(chartObj, minMax);
      }

      if ($scope.curve === 'qv' || $scope.curve === 'pf' || $scope.curve === 'pw') {
        addInfinitePointsToEnd(chartObj, minMax);
        addInfinitePointsToBeginning(chartObj, minMax);
      }

      if ($scope.curve === 'powerfactor') {
        options.scales.xAxes[0].ticks.min = -110;
        options.scales.xAxes[0].ticks.max = 110;
        options.scales.yAxes[0].ticks.min = -110;
        options.scales.yAxes[0].ticks.max = 110;
      }


      $scope.myChart = {
        type: 'line',
        'data': chartObj,
        'options': options,
        'title': $scope.curve,
        'date': moment($scope.date).format('MMMM DD, YYYY'),
        'hideExport': true
      };
    }

    function addInfinitePointsToEnd(chartObj, minMax) {
      for (var index = 0; index < chartObj.datasets.length; index++) {
        var points = chartObj.datasets[index].data;
        var lastPoint = points[points.length - 1];
        chartObj.datasets[index].data.push({
          'x': minMax.xmax + 10,
          'y': lastPoint.y
        });
      }
    }

    function addInfinitePointsToBeginning(chartObj, minMax) {
      for (var index = 0; index < chartObj.datasets.length; index++) {
        var points = chartObj.datasets[index].data;
        var firstPoint = points[0];
        chartObj.datasets[index].data.unshift({
          'x': minMax.xmin - 10,
          'y': firstPoint.y
        });
      }
    }

    $scope.export = function() {
      var settings = {};
      $scope.disableAll = true;
      gridCodesService.getCurveData(deviceId).then(function(data) {
        for (var field in data) {
          if (data.hasOwnProperty(field)) {
            if (field === 'region') {
              settings[field] = {};
              settings[field].value = data[field].value;
              continue;
            }

            settings[field] = {};
            if (field !== 'ss' && field !== 'rr') {
              settings[field].enabled = data[field].enabled;
            } else {
              settings[field].slope = data[field].slope;
            }

            if (data[field].hasOwnProperty('value')) {
              settings[field].value = data[field].value;
            }
            settings[field].data = [];
            for (var xy in data[field].data) {
              if (data[field].data.hasOwnProperty(xy)) {
                settings[field].data.push({
                  "x": data[field].data[xy].x,
                  "y": data[field].data[xy].y,
                });
              }
            }
          }
        }

        var blob = new Blob(['\ufeff' + JSON.stringify(settings)], {
          type: "text/json"
        });

        var DISABLE_AUTO_BOM = true;
        saveAs(blob, "gridcodes.json", DISABLE_AUTO_BOM);
        $scope.disableAll = false;
      }, function() {
        $scope.disableAll = false;
      });
    };

    function filterNulls(data) {
      var newList = [];
      for (var index = 0; index < data.length; index++) {
        if (data[index].x !== null && data[index].y !== null) {
          newList.push(data[index]);
        }
      }
      return newList;
    }

    function getOffsets(data, isXpaddingNeeded) {
      var minMax = {
        xmin: null,
        xmax: null,
        ymin: null,
        ymax: null
      };

      for (var dataset in data) {
        if (data.hasOwnProperty(dataset)) {
          for (var index = 0; index < data[dataset].data.length; index++) {
            if (minMax.xmin === null) {
              minMax.xmin = data[dataset].data[index].x;
            } else if (minMax.xmin > data[dataset].data[index].x) {
              minMax.xmin = data[dataset].data[index].x;
            }

            if (minMax.ymin === null) {
              minMax.ymin = data[dataset].data[index].y;
            } else if (minMax.ymin > data[dataset].data[index].y) {
              minMax.ymin = data[dataset].data[index].y;
            }

            if (minMax.xmax === null) {
              minMax.xmax = data[dataset].data[index].x;
            } else if (minMax.xmax < data[dataset].data[index].x) {
              minMax.xmax = data[dataset].data[index].x;
            }

            if (minMax.ymax === null) {
              minMax.ymax = data[dataset].data[index].y;
            } else if (minMax.ymax < data[dataset].data[index].y) {
              minMax.ymax = data[dataset].data[index].y;
            }
          }
        }
      }

      var xOffeset = (minMax.xmax - minMax.xmin) * 0.1;
      var yOffeset = (minMax.ymax - minMax.ymin) * 0.1;

      if (isXpaddingNeeded) {
        minMax.xmin = Math.floor(minMax.xmin - xOffeset);
        minMax.xmax = Math.ceil(minMax.xmax + xOffeset);
      }

      minMax.ymin = Math.floor(minMax.ymin - yOffeset);
      minMax.ymax = Math.ceil(minMax.ymax + yOffeset);
      return minMax;
    }

    $scope.defaults = function() {
      $scope.disableAll = true;
      var modalInstance = $uibModal.open({
        templateUrl: 'app/xbgateway/GridCodes/gc_confirmation_modal.html',
        controller: 'GCConfirmationModalController',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          info: {
            title: $filter('translate')('xanbus.grid_codes.default_confirm'),
            description: $filter('translate')('xanbus.grid_codes.default_confirm_description')
          }
        }
      });
      modalInstance.result.then(
        // On success
        function() {
          $timeout(function() {
            $scope.regionChange();
            $scope.sequentiallySaveCurve();
          }, 500);
        },
        // On error
        function(error) {
          $scope.disableAll = false;
        }
      );
    };

    $scope.refresh = function() {
      $scope.disableAll = true;
      var modalInstance = $uibModal.open({
        templateUrl: 'app/xbgateway/GridCodes/gc_confirmation_modal.html',
        controller: 'GCConfirmationModalController',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          info: {
            title: $filter('translate')('xanbus.grid_codes.refresh_confirm'),
            description: $filter('translate')('xanbus.grid_codes.refresh_confirm_description')
          }
        }
      });
      modalInstance.result.then(
        // On success
        function() {
          $timeout(function() {
            $scope.message = null;
            getData();
            $scope.disableAll = false;
          }, 500);
        },
        // On error
        function(error) {
          $scope.disableAll = false;
        }
      );
    };

    $scope.import = function(content) {
      $scope.disableAll = true;
      try {
        var newSettings = JSON.parse(content);
        if (isValidObject(newSettings)) {
          $scope.info = newSettings;
          $scope.pfChanged();
          $scope.message = {
            "content": "xanbus.grid_codes.import_success",
            "class": "gc_warning"
          };
          switch (newSettings.region.value) {
            case '1':
              copyMinMax(gridCodesRegionService.getCaliforniaCodes());
              break;
            case '4':
              copyMinMax(gridCodesRegionService.getIEEECodes());
              break;
            case '2':
              copyMinMax(gridCodesRegionService.getPrepaCodes());
              break;
            default:
          }
          processChart();
        } else {
          $scope.message = {
            "content": "xanbus.grid_codes.import_failed",
            "class": "gc_error"
          };
        }
        $scope.disableAll = false;
      } catch (e) {
        $scope.message = {
          "content": "xanbus.grid_codes.import_failed",
          "class": "gc_error"
        };
        $scope.disableAll = false;
      }
    };

    function isValidObject(settings) {
      var result = true;
      if (!settings.hasOwnProperty('qv') ||
        !settings.hasOwnProperty('lfrt') ||
        !settings.hasOwnProperty('hfrt') ||
        !settings.hasOwnProperty('lvrt') ||
        !settings.hasOwnProperty('hvrt') ||
        !settings.hasOwnProperty('pf') ||
        !settings.hasOwnProperty('pw') ||
        !settings.hasOwnProperty('ss') ||
        !settings.hasOwnProperty('rr') ||
        !settings.hasOwnProperty('region') ||
        !settings.hasOwnProperty('powerfactor')) {
        result = false;
      } else {
        for (var setting in settings) {
          if (settings.hasOwnProperty(setting)) {
            if (setting === 'region') {
              continue;
            }

            if (setting === 'powerfactor' && !settings[setting].hasOwnProperty('value')) {
              result = false;
            }

            if (setting !== 'ss' && setting !== 'rr') {
              if (!settings[setting].hasOwnProperty('enabled') ||
                !settings[setting].hasOwnProperty('data')) {
                result = false;
              }
            } else {
              if (!settings[setting].hasOwnProperty('slope') ||
                !settings[setting].hasOwnProperty('data') ||
                !settings[setting].slope.hasOwnProperty('value')) {
                result = false;
              }
            }
          }
        }
      }
      return result;
    }

    getData();

    var dereg = $scope.$on("$destroy", function() {
      if (interval) {
        $interval.cancel(interval);
        requestPending = false;
        dereg();
      }
    });
  }
]);
