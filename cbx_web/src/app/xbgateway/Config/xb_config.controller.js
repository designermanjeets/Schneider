"use strict";
//This is the controller for displaying the settings for XW
angular.module('conext_gateway.xbgateway').controller("XBConfigController", [
  "$scope", "$stateParams", "xbConfigService", "$q", "$uibModal",
  "$interval", "$timeout", "$log", "sysvarFormatterService", "startsWith", "$filter",
  function($scope, $stateParams, xbConfigService, $q, $uibModal, $interval,
    $timeout, $log, sysvarFormatterService, startsWith, $filter) {

    var configTemplate;
    var requestPending = false;
    var refreshCountPending = false;
    var intervals = [];
    $scope.settingLevel = 'basic';
    $scope.forms = {};
    $scope.status = {};
    $scope.refreshingDevice = false;
    $scope.formDisabled = {
      all: false
    };
    $scope.verified = {
      "state": false,
      "message": "",
      "password": ""
    };

    $scope.passwordChange = function() {
      $scope.verified.message = "";
    };

    $scope.submit = function() {
      if ($scope.verified.password === "XWproGridCodes") {
        $scope.verified.state = true;
        $timeout(function() {
          $scope.$broadcast('rzSliderForceRender');
        });
      } else {
        $scope.verified.message = $filter('translate')('xanbus.grid_codes.incorrect_password');
      }
    };

    getConfigData();

    //initalizes the form disabled status if the sysvars are available
    if ($scope.devinfo && $scope.devinfo.CFG_INITIALIZED && $scope.devinfo.DEV_ACTIVE) {
      $scope.formDisabled.all = $scope.devinfo.CFG_INITIALIZED === 0 || $scope.devinfo.DEV_ACTIVE === 0;
    }

    //This is a watch to disable the forms if the device is refreshing config
    //data from the device.
    $scope.$watch('devinfo.CFG_INITIALIZED', function() {
      toggleFormDisabled();
    });

    //This is a watch to disable the forms if the device goes inactive
    $scope.$watch('devinfo.DEV_ACTIVE', function() {
      toggleFormDisabled();
    });

    $scope.settingLevelChanged = function() {
      $timeout(function() {
        $scope.$broadcast('rzSliderForceRender');
      });
    };

    //This function is used to set all the forms to disabled or enabled.  All
    //forms will be disabled if the device is deactive or if refresh from device
    //is in progress
    function toggleFormDisabled() {
      if ($scope.devinfo && ($scope.devinfo.DEV_ACTIVE === 0 || $scope.devinfo.CFG_INITIALIZED === 0)) {
        $scope.formDisabled.all = true;
        if ($scope.devinfo.CFG_INITIALIZED === 0 && !$scope.refreshProgress) {
          getRefreshProgress();
        }
      } else if ($scope.refreshingDevice === true) {
        $scope.formDisabled.all = true;
      } else {
        $scope.formDisabled.all = false;
      }
    }

    //This function is used to retreive all the config data for a form and also the
    //config template.
    function getConfigData() {
      xbConfigService.getDeviceConfiguration($stateParams.device).then(function(data) {
        configTemplate = data;
        xbConfigService.getConfigData($stateParams.device, $stateParams.id, configTemplate).then(function(configData) {
          for (var key in configTemplate[Object.keys(configTemplate)[0]]) {
            if (configTemplate[Object.keys(configTemplate)[0]].hasOwnProperty(key)) {
              $scope.formDisabled[key] = false;
            }
          }
          $scope.configData = {
            template: configTemplate,
            config: configData
          };
          toggleFormDisabled();
        });
      });
    }

    //This function is used the reset the forms.  It request the data and then
    //overides the existing data but only for the specific form
    $scope.reset = function(formName) {
      xbConfigService.getConfigData($stateParams.device, $stateParams.id, configTemplate).then(function(data) {
        clearForm(data, formName);
      });
    };

    //This function is used to handle when the element type of pushbutton is triggered.
    //When the pushbutton is hit it will set the sysvar to one and then apply the changes.
    $scope.pushButtonPress = function(key) {
      $scope.configData.config[key] = 1;
      $scope.applyControl(key);
    };

    //This function is used to apply control elements.
    $scope.applyControl = function(key, formName) {
      if ($scope.configData.config[key] !== "") {
        var value, name, sysVarName, formObject;
        var tabName = formName.split('_control')[0];
        var formTemplate = configTemplate[$stateParams.device][tabName];

        value = $scope.configData.config[key];
        $scope.status[key] = 'form-pending';
        $scope.forms[formName][key].$setPristine();

        for (var formElement in formTemplate) {
          if (formTemplate.hasOwnProperty(formElement)) {
            sysVarName = sysvarFormatterService.formatSysvar(formTemplate[formElement].name);
            if (key === sysVarName) {
              name = "[" + $stateParams.id + "]" + formTemplate[formElement].name;
              formObject = formTemplate[formElement];
            }
          }
        }
        sysVarName = $stateParams.device + '_' + key;

        xbConfigService.setControl(name, value, formObject).then(function() {
          var interval = $interval(function() {
            intervals.push(interval);
            if (!requestPending) {
              requestPending = true;
              xbConfigService.getControl(name).then(function(data) {

                  switch (data.META[sysVarName]) {
                    case 'W':
                      $scope.status[key] = 'form-pending';
                      break;
                    case 'F':
                      $scope.status[key] = 'form-failed';
                      $interval.cancel(interval);
                      break;
                    default:
                      $scope.status[key] = 'form-succeeded';
                      $interval.cancel(interval);
                  }
                  requestPending = false;
                },
                function(error) {
                  $interval.cancel(interval);
                  $scope.status[key] = 'form-failed';
                  requestPending = false;
                });
            }
          }, 1500);
        }, function(error) {
          $scope.status[key] = 'form-failed';
        });
      }
    };

    //This function is called when a form is to be saved
    $scope.applyChanges = function(formName) {
      var items = {};
      var changedItemsKeys = [];
      $scope.formDisabled[formName] = true;

      //In this loop a list of items is created which need to be saved.  The status
      //of the form item no longer becomes failed or edited,  but instead pending.
      for (var key in $scope.forms[formName]) {
        if ($scope.forms[formName].hasOwnProperty(key)) {
          if (!startsWith(key, '$') && $scope.forms[formName][key].$dirty || $scope.status[key] === 'form-failed') {
            items[key] = $scope.configData.config[key];
            $scope.status[key] = 'form-pending';
            $scope.forms[formName][key].$setPristine();
            changedItemsKeys.push(key);
          } else {
            $scope.status[key] = "";
          }
        }
      }

      //This section saves the sysVars and then pulls the sysVars to check the
      //status of the save
      xbConfigService.saveFormConfiguration(
          configTemplate[$stateParams.device][formName],
          items,
          $stateParams.id,
          $scope.configData.config)
        .then(function() {
            var interval = $interval(function() {
              intervals.push(interval);
              if (!requestPending) {
                requestPending = true;
                xbConfigService.getConfigData($stateParams.device, $stateParams.id, configTemplate).then(function(data) {
                    var filtered_items = [];
                    if (changedItemsKeys.length < 1) {
                      $interval.cancel(interval);
                      $scope.formDisabled[formName] = false;
                      requestPending = false;
                    }

                    //This section of the code checks the status of the quality bit
                    //to determine if the configuration set passed, failed or is
                    //pending
                    for (var index = 0; index < changedItemsKeys.length; index++) {
                      switch (data.META[changedItemsKeys[index]]) {
                        case 'W':
                          filtered_items.push(data.META[changedItemsKeys[index]]);
                          $scope.status[changedItemsKeys[index]] = 'form-pending';
                          break;
                        case 'F':
                          $scope.status[changedItemsKeys[index]] = 'form-failed';
                          $scope.forms[formName][changedItemsKeys[index]].$setDirty();
                          break;
                        default:
                          var isDate = data[changedItemsKeys[index]] instanceof Date;
                          if (data.META[changedItemsKeys[index]] === 'G') {
                            if (!isDate && $scope.configData.config[changedItemsKeys[index]] !=
                              data[changedItemsKeys[index]]) {
                              $scope.status[changedItemsKeys[index]] = 'form-failed';
                              $scope.forms[formName][changedItemsKeys[index]].$setDirty();
                            } else if (isDate && $scope.configData.config[changedItemsKeys[index]].valueOf() !=
                              data[changedItemsKeys[index]].valueOf()) {
                              $scope.status[changedItemsKeys[index]] = 'form-failed';
                              $scope.forms[formName][changedItemsKeys[index]].$setDirty();
                            } else {
                              $scope.status[changedItemsKeys[index]] = 'form-succeeded';
                            }
                          } else {
                            $scope.status[changedItemsKeys[index]] = 'form-failed';
                            $scope.forms[formName][changedItemsKeys[index]].$setDirty();
                          }
                      }
                    }
                    changedItemsKeys = filtered_items.slice();
                    requestPending = false;
                  },
                  function(error) {
                    $interval.cancel(interval);
                    handleSaveFailure(changedItemsKeys, formName);
                  });
              }
            }, 1500);

          },
          function(error) {
            handleSaveFailure(changedItemsKeys, formName);
          });
    };

    //Handles the error when the request to save fails,  not the actual
    //save but the request
    function handleSaveFailure(changedItemsKeys, formName) {
      $scope.formDisabled[formName] = false;
      for (var index = 0; index < changedItemsKeys.length; index++) {
        $scope.status[changedItemsKeys[index]] = 'form-failed';
      }
    }

    function getRefreshProgress() {

      var interval = $interval(function() {
        intervals.push(interval);
        if (!refreshCountPending) {
          refreshCountPending = true;
          xbConfigService.getRefreshProgress($stateParams.id, $stateParams.device).then(function(data) {
            refreshCountPending = false;
            $scope.refreshProgress = data;
            if (data.status !== 'inprogress') {
              $scope.devinfo.CFG_INITIALIZED = data.initialized;
              $interval.cancel(interval);
              xbConfigService.getConfigData($stateParams.device, $stateParams.id, configTemplate).then(function(devConfig) {
                for (var formName in configTemplate[$stateParams.device]) {
                  if (configTemplate[$stateParams.device].hasOwnProperty(formName) && showR21(formName)) {
                    clearForm(devConfig, formName);
                  }
                }
                $scope.refreshingDevice = false;
                toggleFormDisabled();
              }, function(error) {
                handleRefreshFailure();
              });
            }
          }, function(error) {
            handleRefreshFailure();
          });
        }
      }, 1500);
    }

    //This function is used to refresh the config data on conext_gateway from the actual
    //device.  First step is to get the refreshCount sysVar. next step is to start
    //the refresh.  After starting the refresh the refrechCount is pulled and used
    //to determine when the refresh is complete.  Once completed, the config data
    //is requested and the view is updated.
    $scope.refreshDevice = function() {
      if (!$scope.refreshingDevice) {
        $scope.refreshingDevice = true;
        toggleFormDisabled();

        xbConfigService.refreshDeviceConfig($stateParams.id, $stateParams.device).then(function() {
          getRefreshProgress();
        }, function(error) {
          handleRefreshFailure();
        });
      }
    };

    function showR21(key) {
      return !startsWith(key, 'R21') || ($scope.isGridCodesPresent() && key === 'R21_GridSupport');
    }
    //This function is used to handle request failures during
    //the device configuration reset process
    function handleRefreshFailure() {
      $scope.refreshingDevice = false;
      refreshCountPending = false;
      toggleFormDisabled();
    }

    //This function is used to remove the meta data from the form
    //items, Examples are the status and the dirty bit.  These are used
    //to determine which color border should surround the item in the form.
    function clearForm(data, formName) {
      var templateObject;
      var sysVarName;
      for (var key in configTemplate[$stateParams.device][formName]) {
        if (configTemplate[$stateParams.device][formName].hasOwnProperty(key)) {
          templateObject = configTemplate[$stateParams.device][formName][key];
          sysVarName = sysvarFormatterService.formatSysvar(templateObject.name);
          $scope.configData.config[sysVarName] = data[sysVarName];
          $scope.status[sysVarName] = '';
          if ($scope.forms[formName] && $scope.forms[formName][sysVarName]) {
            $scope.forms[formName][sysVarName].$setPristine();
          }
        }
      }
    }

    //This function is used to trigger the information modal when
    //the information icon for form elements are clicked
    $scope.information = function(shortname, description) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/xbgateway/Config/information_modal.html',
        controller: 'InformationModalController',
        resolve: {
          shortname: function() {
            return shortname;
          },
          information: function() {
            return description;
          }
        },
        backdrop: 'static',
        keyboard: false
      });

      modalInstance.result.then(
        // On success
        function() {},
        // On error
        function(error) {
          $log.error(error);
        }
      );
    }

    //This function is a callback which is triggered when the panel is opened.
    //This is used to re-render the slides because they will not work properly
    //if they were loaded in closed panels
    $scope.panelToggled = function() {
      $timeout(function() {
        $scope.$broadcast('rzSliderForceRender');
      });
    }

    //This function is used to set the dirty bit on the form element.
    //The id of the element is used to determine what form it belongs to
    //and what sysVar it represents
    $scope.setDirty = function(id) {
      var formSysvarId = id.split('.');
      var formId = formSysvarId[0];
      var sysVarId = formSysvarId[1];
      if (!$scope.formDisabled.all && !$scope.formDisabled[formId]) {
        $scope.forms[formId][sysVarId].$dirty = true;
        $scope.status[sysVarId] = '';
      }
    }

    var dereg = $scope.$on("$destroy", function() {
      for (var interval in intervals) {
        if (intervals[interval]) {
          $interval.cancel(intervals[interval]);
        }
      }
      dereg();
    });

  }
]);
