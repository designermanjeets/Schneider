
"use strict";

angular.module('conext_gateway.dashboard').controller("powerflowController", ['$scope', '$state', "powerFlowService",
  "$interval", "$uibModal", '$q', '$timeout', '$sessionStorage',
  function($scope, $state, powerFlowService, $interval, $uibModal, $q, $timeout, $sessionStorage) {
    var counter = 0;
    var interval;
    var requestPending = false;

    $scope.counter = 0;

    $scope.chargerClick = function(data) {
      if($sessionStorage.userName === 'Guest') {
        return;
      }

      var param = {
        type: ''
      };
      var page = ".status";
      if (data.length === 1) {
        param.device = data[0].name;
        param.id = data[0].instance;
        if(data[0].isActive === "false") {
          page = ".performance";
        }
        if (data[0].attributes.warnings === '1' || data[0].attributes.alarms === '1') {
          page = '.events';
        }
        $state.go('xbgateway.chg' + page, param);
      } else {
        param.type = 'chg';
        $state.go('xbgateway.xbdevlist', param);
      }
    };

    $scope.inverterClick = function(data) {
      if($sessionStorage.userName === 'Guest') {
        return;
      }

      var param = {
        type: ''
      };
      var page = ".status";
      if (data.length === 1) {
        param.device = data[0].name;
        param.id = data[0].instance;
        if(data[0].isActive === "false") {
          page = ".performance";
        }
        if (data[0].attributes.warnings === '1' || data[0].attributes.alarms === '1') {
          page = '.events';
        }
        $state.go('xbgateway.inverters' + page, param);
      } else {
        param.type = 'inverter';
        $state.go('xbgateway.xbdevlist', param);
      }
    };

    $scope.gridTieClick = function(data) {
      if($sessionStorage.userName === 'Guest') {
        return;
      }

      var param = {
        type: ''
      };
      var page = ".status";
      if (data.length === 1) {
        if(data[0].isActive === "false") {
          page = ".performance";
        }
        param.device = data[0].name;
        param.id = data[0].instance;
        if (data[0].attributes.warnings === '1' || data[0].attributes.alarms === '1') {
          page = '.events';
        }
        $state.go('xbgateway.inverters' + page, param);
      } else {
        param.type = 'inverter';
        $state.go('xbgateway.xbdevlist', param);
      }
    };


    $scope.inverterChargerClick = function(data) {
      if($sessionStorage.userName === 'Guest') {
        return;
      }

      var param = {
        type: ''
      };
      var page = ".status";
      if (data.length === 1) {
        param.device = data[0].name;
        param.id = data[0].instance;
        if(data[0].isActive === "false") {
          page = ".performance";
        }
        if (data[0].attributes.warnings === '1' || data[0].attributes.alarms === '1') {
          page = '.events';
        }
        $state.go('xbgateway.invchg' + page, param);
      } else {
        param.type = 'invchg';
        $state.go('xbgateway.xbdevlist', param);
      }
    };

    //Function which handles when batteries are clicked and they have a battmons
    //connected to them.  Redirects to the battmon info page
    $scope.battmonClick = function(data) {
      if($sessionStorage.userName === 'Guest') {
        return;
      }

      var param = {};
      var page = '.status';
      param.device = 'BATTMON';
      param.id = data.instance;
      if(data.isActive === "false") {
        page = ".performance";
      }
      if (data.attributes.warnings === '1' || data.attributes.alarms === '1') {
        page = '.events';
      }
      $state.go('xbgateway.oth' + page, param);
    };

    $scope.generatorClick = function(event, data) {
      if($sessionStorage.userName === 'Guest') {
        return;
      }
      
      var param = {
        type: ''
      };
      var page = ".status";
      if (data.length === 1) {
        param.device = data[0].name;
        param.id = data[0].instance;
        if(data[0].isActive === "false") {
          page = ".events";
        }
        if (data[0].attributes.warnings === '1' || data[0].attributes.alarms === '1') {
          page = '.events';
        }
        $state.go('xbgateway.oth' + page, param);
      } else {
        param.type = 'oth';
        $state.go('xbgateway.xbdevlist', param);
      }
    };

    //setting default values for the powerflow scope object
    $scope.powerflow = {
      "DEVLIST": [],
      "sysvars": {}
    };

    getPowerFlowData(false);

    interval = $interval(function() {
      if (!requestPending) {
        getPowerFlowData(false);
      }
    }, 1000);


    //function which retrieves the information for the powerflow diagram and the processGrid
    //the data into scope objects for the view to render
    function getPowerFlowData(noCountCheck) {
      requestPending = true;
      powerFlowService.getPowerFlow($scope.powerflow.DEVLIST).then(function(data) {
          $scope.powerflow.sysvars = data;

          if ((data.SCB_DEVSERVER_COUNTER !== $scope.counter || $scope.counter === 0) && !noCountCheck) {
            $scope.counter = data.SCB_DEVSERVER_COUNTER;
            powerFlowService.getDevList().then(function(devList) {
              $scope.powerflow.DEVLIST = devList.DEVLIST;
              getPowerFlowData(true);
            });
          } else {
            processAllDevices();
          }
          requestPending = false;
        },
        function(error) {
          requestPending = false;
        });
    }

    function processAllDevices() {
      $scope.$broadcast('powerFlow', $scope.powerflow);
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
