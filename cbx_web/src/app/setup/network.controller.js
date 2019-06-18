"use strict";
angular.module('conext_gateway.setup').controller("networkController", ['$scope', 'gatewayNetworkService', 'formSuccessMessageService', 'conextInsightService', 'emailTestService', '$uibModal', 'csbModal', '$filter', '$log', '$interval', 'moment', "$http",
  function($scope, gatewayNetworkService, formSuccessMessageService, conextInsightService, emailTestService, $uibModal, csbModal, $filter, $log, $interval, moment, $http) {
    $scope.forms = {};
    $scope.successMessage = {};
    $scope.ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    $scope.hostNameRegex = /^[a-zA-Z0-9\.-]+$/;
    $scope.emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    $scope.connectionStatus = null;
    $scope.emailTest = {
      "status": false
    };
    $scope.errorMessage = {};

    var interval;
    var requestPending = false;

    gatewayNetworkService.getNetworkData().then(function(data) {
        data.sftp_settings.FTPLOG_PASSWORD = "*****";
        data.ap_settings.SCB_AP_PASSWORD = "*****";
        data.cloud_settings.SCB_CNM_PROXY_PASSWORD = "*****";
        data.lan_settings.ETH0_TCPIP_DHCP_DNS = data.lan_settings.ETH0_TCPIP_DHCP_DNS.split(" ")[0];

        // Despite having DHCP in its name, this sysvar always returns the current IP address,
        // even if DHCP is off.
        data.ftp_server.ip_address = data.lan_settings.SCB_NETWORK_DM0IPSHOW;

        $scope.lan_settings = data.lan_settings;
        $scope.sftp_settings = data.sftp_settings;
        $scope.conext_insight = data.conext_insight;
        $scope.ap_settings = data.ap_settings;
        getRemoteDiagID(data.remote_diagnostics);
        $scope.ftp_server = data.ftp_server;
        $scope.remote_diagnostics.SCB_IOT_LAST_TRANSFER_TIME = (data.remote_diagnostics.SCB_IOT_LAST_TRANSFER_TIME === "0" || data.remote_diagnostics.SCB_IOT_LAST_TRANSFER_TIME === "") ? 'N/A' : moment(data.remote_diagnostics.SCB_IOT_LAST_TRANSFER_TIME).format('YYYY/MM/DD h:mm:ss a');
        getCloudSettings(data.cloud_settings);

        interval = $interval(function() {
          if (!requestPending) {
            requestPending = true;
            refreshStatusSysvars();
          }
        }, 3000);
      },
      function(error) {
        $log.error(error);
        $log.error("failed to refresh data");
      });

    $scope.openDisclaimer = function() {
      /* Open Modal */
      $uibModal.open({
        animation: true,
        backdrop: "static",
        keyboard: false,
        templateUrl: "app/disclaimer/monitoring_disclaimer.html",
        controller: "disclaimerMonitoringController",
        scope: $scope,
        size: "lg"
      }).result.then(function(data) {
        $scope.conext_insight.ADMIN_DISCLCHECK = data;
        $scope.conext_insight.WEBPORTAL_ENABLE = data;
        $scope.remote_diagnostics.SCB_IOT_ENABLE = data;
      });
    };

    $scope.applyLanSettings = function() {
      if ($scope.errorMessage.lan_settings) {
        delete $scope.errorMessage.lan_settings;
      }
      if ($scope.forms.lan_settings.$valid) {
        gatewayNetworkService.saveLanSettings($scope.lan_settings).then(function() {
            $scope.forms.lan_settings.$setPristine();
            formSuccessMessageService.show($scope, "lan_settings");
          },
          function() {
            $scope.errorMessage.lan_settings = $filter('translate')('setup.network.save_failed');
          });
      }
    };

    $scope.applySFTPSettings = function() {
      if ($scope.errorMessage.sftp_settings) {
        delete $scope.errorMessage.sftp_settings;
      }
      if ($scope.forms.sftp_settings.$valid) {
        gatewayNetworkService.saveSFTPSettings($scope.sftp_settings).then(function() {
            $scope.forms.sftp_settings.$setPristine();
            formSuccessMessageService.show($scope, "sftp_settings");
          },
          function() {
            $scope.errorMessage.sftp_settings = $filter('translate')('setup.network.save_failed');
          });
      }
    };

    $scope.applyRemoteDiagnostics = function() {
      if ($scope.errorMessage.remote_diagnostics) {
        delete $scope.errorMessage.remote_diagnostics;
      }
      if ($scope.forms.remote_diagnostics.$valid) {
        gatewayNetworkService.saveRemoteDiagnostics($scope.remote_diagnostics).then(function() {
            reset("remote_diagnostics");
            formSuccessMessageService.show($scope, "remote_diagnostics");
          },
          function() {
            $scope.errorMessage.remote_diagnostics = $filter('translate')('setup.network.save_failed');
          });
      }
    };

    $scope.applyAPSettings = function() {
      if ($scope.errorMessage.ap_settings) {
        delete $scope.errorMessage.ap_settings;
      }
      if ($scope.forms.ap_settings.ssid_password.$viewValue && $scope.forms.ap_settings.ssid_password.$viewValue !== "*****" && $scope.forms.ap_settings.ssid_password.$viewValue.length < 10) {
        $scope.errorMessage.ap_settings = $filter('translate')('setup.network.password_length');
      } else if ($scope.forms.ap_settings.$valid) {
        gatewayNetworkService.saveAPSettings($scope.ap_settings).then(function() {
            reset("ap_settings");
            formSuccessMessageService.show($scope, "ap_settings");
          },
          function() {
            $scope.errorMessage.ap_settings = $filter('translate')('setup.network.save_failed');
          });
      }
    };

    $scope.applyFTPServer = function() {
      if ($scope.errorMessage.ftp_server) {
        delete $scope.errorMessage.ftp_server;
      }
      gatewayNetworkService.saveFTPServer($scope.ftp_server).then(function() {
          formSuccessMessageService.show($scope, "ftp_server");
        },
        function() {
          $scope.errorMessage.ftp_server = $filter('translate')('setup.network.save_failed');
        });
    };

    $scope.applyConextInsightSettings = function() {
      if ($scope.errorMessage.conext_insight) {
        delete $scope.errorMessage.conext_insight;
      }
      if ($scope.forms.conext_insight.$valid) {
        gatewayNetworkService.saveConextInsightSettings($scope.conext_insight).then(function() {
            reset("conext_insight");
            $scope.forms.conext_insight.$setPristine();
            formSuccessMessageService.show($scope, "conext_insight");
          },
          function() {
            $scope.errorMessage.conext_insight = $filter('translate')('setup.network.save_failed');
          });
      }
    };

    $scope.applyCloudSettings = function() {
      if ($scope.errorMessage.cloud_settings) {
        delete $scope.errorMessage.cloud_settings;
      }
      if ($scope.forms.cloud_settings.$valid) {
        gatewayNetworkService.saveCloudSettings($scope.cloud_settings).then(function() {
            reset("cloud_settings");
            formSuccessMessageService.show($scope, "cloud_settings");
          },
          function() {
            $scope.errorMessage.cloud_settings = $filter('translate')('setup.network.save_failed');
          });
      }
    };

    $scope.learnMore = function() {
      csbModal.alert("syncronization", "Syncronization");
    };

    $scope.resetLanSettings = function() {
      reset("lan_settings");
    };

    $scope.resetFTPServer = function() {
      reset("ftp_server");
    };

    $scope.resetSFTPSettings = function() {
      reset("sftp_settings");
    };

    $scope.resetConextInsightSettings = function() {
      reset("conext_insight");
    };

    $scope.resetRemoteDiagnostics = function() {
      reset("remote_diagnostics");
    };

    $scope.resetCloudSettings = function() {
      reset("cloud_settings");
    };

    $scope.resetAPSettings = function() {
      reset("ap_settings");
    };

    $scope.cancelSessionDiag = function() {
      gatewayNetworkService.setSessionDiagCancel();
    };

    function reset(formName) {
      if ($scope.errorMessage[formName]) {
        delete $scope.errorMessage[formName];
      }
      gatewayNetworkService.getNetworkData().then(function(data) {
        data.sftp_settings.FTPLOG_PASSWORD = "*****";
        data.ap_settings.SCB_AP_PASSWORD = "*****";
        data.cloud_settings.SCB_CNM_PROXY_PASSWORD = "*****";

        if (!angular.isUndefined(data[formName])) {
          $scope[formName] = data[formName];
        }
        $scope.forms[formName].$rollbackViewValue();
        $scope.forms[formName].$setPristine();
      });
    }

    $scope.testConnection = function() {
      $scope.connectionStatus = 'Processing';
      conextInsightService.testConnection(function(data) {
        $scope.connectionStatus = data;
      }, $scope);
    }

    function refreshStatusSysvars() {
      gatewayNetworkService.getStatusSysvars().then(function(data) {

          $scope.remote_diagnostics.SESSION_DIAG_ACTIVE = data.SESSION_DIAG_ACTIVE;
          $scope.remote_diagnostics.SESSION_DIAG_ID = data.SESSION_DIAG_ID;

          $scope.cloud_settings.SCB_CNM_ISCONNECTED = data.SCB_CNM_ISCONNECTED;
          $scope.cloud_settings.SCB_CNM_TX_COUNT = data.SCB_CNM_TX_COUNT;
          $scope.cloud_settings.SCB_CNM_RX_COUNT = data.SCB_CNM_RX_COUNT;
          $scope.cloud_settings.SCB_CNM_TX_ERR_COUNT = data.SCB_CNM_TX_ERR_COUNT;

          remoteDiagID();
          getLastTransferTime();
          requestPending = false;
        },
        function(error) {
          requestPending = false;
          $log.error(error);
        })
    }

    function remoteDiagID() {
      if ($scope.remote_diagnostics.SESSION_DIAG_ID == "") {
        $scope.remote_diagnostics.SESSION_DIAG_ID = $filter("translate")("setup.network.no_active_session");
      }
    }

    function getLastTransferTime() {
      if ($scope.cloud_settings.SCB_CNM_LAST_TRANSFER_TIME == "") {
        $scope.cloud_settings.SCB_CNM_LAST_TRANSFER_TIME = "--:--:--"
      }
    }

    function getRemoteDiagID(remoteDiagData) {
      $scope.remote_diagnostics = remoteDiagData;
      remoteDiagID();
    }

    function getCloudSettings(cloudSettingData) {
      $scope.cloud_settings = cloudSettingData;
      getLastTransferTime();
    }

    $scope.openDisclaimer = function() {
      /* Open Modal */
      $uibModal.open({
        animation: true,
        backdrop: "static",
        keyboard: false,
        templateUrl: "app/disclaimer/upgrade_disclaimer.html",
        controller: "disclaimerUpgradeController",
        scope: $scope,
        size: "lg"
      }).result.then(function(data) {
        $scope.cloud_settings.SCB_CNM_ENABLED = data;
        $scope.cloud_settings.ADMIN_DISCLCHECK = data;
      });
    };

    /* delete the interval timer when we exit the page */
    var dereg = $scope.$on("$destroy", function() {
      if (interval) {
        $interval.cancel(interval);
        requestPending = false;
        dereg();
      }
    });

    
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // Network Mode
    
    $scope.netwrkData = [];

      $http.get('http://localhost:3500/availableOptions')
      .then(function successCallback(response) { 
          $scope.netwrkData.availableOptions = response.data; 
          // $scope.netwrkData.selectedOption = response.data[0]; //This sets the default value of the select in the ui
      });
 
      $interval(function() {
        $http.get('http://localhost:3500/availableConnections')
        .then(function successCallback(response) {
            if($scope.netwrkData.netConnected) {
                if(response.data[$scope.netwrkData.connectedIndex].item !== $scope.netwrkData.availableConnections[$scope.netwrkData.connectedIndex].item){
                    console.log('!!Disconnected!')
                    $scope.onDisconnect();
                    $scope.netwrkData.showDisconnectErr = true;
                }
            }
            $scope.netwrkData.availableConnections = response.data;
        });
    },2000);
 
    $http.get('http://localhost:3500/availableNetworks')
    .then(function successCallback(response) {
        $scope.netwrkData.availableNetworks = response.data;
    });

    $scope.onConnect = function($index){
      if(!$scope.netwrkData.netConnected){
          $scope.netwrkData.connectedIndex = $index;
          $scope.active = $scope.active == $index ? '': $index;
      } else {
          $scope.onDisconnect($index);
      }
      $scope.toggleNetworkScreen = true;
      $scope.toggleManualScreen = false;
  };

    $scope.onDisconnect = function($index){
        $scope.netwrkData.netConnected = false;
        $scope.active = null;
    };

    $scope.submitSelectNetwrk = function(selectNetwrkForm){
        $scope.netwrkData.netConnected = true;
        if(selectNetwrkForm.$valid){
          if(selectNetwrkForm.networkOpt){
              var networkname = selectNetwrkForm.networkOpt.$viewValue.item;
              var password = selectNetwrkForm.networkpassword.$viewValue;
              $scope.netwrkData.selectNetwrkFormData = { 'networkname': networkname, 'password': password }
          } else if(selectNetwrkForm.ssid.$viewValue) {
              var ssid = selectNetwrkForm.ssid.$viewValue;
              var password = selectNetwrkForm.networkpassword.$viewValue;
              $scope.netwrkData.selectNetwrkFormData = { 'ssid': ssid, 'password': password }
          }
    
            var req = { method: 'POST', url: 'http://localhost:3500/checkNetworks', headers: { 'Content-Type': 'text/json' },
                data: $scope.netwrkData.selectNetwrkFormData
            }
               
            $http(req).then(function(res){
                console.log(res.data);
                $scope.netwrkData.netConnected = true;
                $scope.reset();
                
            }, function(){
                
            });
            $scope.reset = function() {
                $scope.netwrkData.selectNetwrkFormData = {};
                selectNetwrkForm.$setPristine();
                $scope.netwrkData.selectNetwrkForm = angular.copy($scope.netwrkData.selectNetwrkFormData);
                $scope.toggleNetworkScreen = false;
            };
        }
    }

    // Reset selectNetwrkForm from outside function
    /* $scope.resetSelectNetwrkForm = function() {
        $scope.netwrkData.selectNetwrkForm = angular.copy($scope.netwrkData.selectNetwrkFormData);
        vm.selectNetwrkForm.$setPristine();
    } */

    $scope.addManully = function() {
        $scope.toggleManualScreen = true;;
    }

    $scope.selectNtwrk = function() {
        $scope.toggleManualScreen = false;
    } 

    $scope.submitManualNetwrk = function(manualForm){
        console.log(manualForm);
        if(manualForm.$valid){
            var ipaddress = manualForm.ipaddress.$viewValue;
            var networkdhcp = manualForm.networkdhcp.$viewValue;
            var subnetmask = manualForm.subnetmask.$viewValue;
            var gateway = manualForm.gateway.$viewValue;
            var dnserver = manualForm.dnserver.$viewValue;
            var hostname = manualForm.hostname.$viewValue;
            $scope.netwrkData.manualNetwrkFormData = { 
                'ipaddress': ipaddress, 
                'networkdhcp': networkdhcp ,
                'subnetmask': subnetmask ,
                'gateway': gateway ,
                'dnserver': dnserver ,
                'hostname': hostname ,
            }
    
            var req = { method: 'POST', url: 'http://localhost:3500/checkManualNetworks', headers: { 'Content-Type': 'text/json' },
                data: $scope.netwrkData.manualNetwrkFormData
            }
               
            $http(req).then(function(res){
                console.log(res.data);
                $scope.reset();
                
            }, function(){
                
            });
            
            $scope.reset = function() {
                $scope.netwrkData.manualNetwrkFormData = {};
                manualForm.$setPristine();
                $scope.netwrkData.manualForm = angular.copy($scope.netwrkData.manualNetwrkFormData);
                // $scope.toggleNetworkScreen = false;
              };

        }
    }


  }
]);
