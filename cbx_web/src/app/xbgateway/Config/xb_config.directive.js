"use strict";

//This directive creates forms for the configuration tabs and
//creates elements based on the JSON template
angular.module('conext_gateway.xbgateway').directive("xbconfig", ["$timeout", "$compile", "$log",
  "sysvarFormatterService", "xbConfigElementService", "endsWith", "sysvarPermissionService", "startsWith",
  'xbConfigUtilityService', '$filter',
  function($timeout, $compile, $log, sysvarFormatterService, xbConfigElementService,
     endsWith, sysvarPermissionService, startsWith, xbConfigUtilityService, $filter) {
    var deviceType = "";
    var htmlArray = [];
    //Link function which is called when the directive is rendered
    var link = function($scope, element, attributes) {
      var init = function() {
        deviceType = Object.keys($scope.configData.template)[0];
        if ($scope.configData !== undefined) {
          createForms($scope);
          $scope.rendered = true;
          element.append($compile(htmlArray.join(""))($scope));

        }
      };
      $timeout(init, 0);
    };

    //function which is used to dynamically create the form elements for the
    //configuration pages
    function createForms($scope) {
      htmlArray = [];
      for (var key in $scope.configData.template[deviceType]) {
        if ($scope.configData.template[deviceType].hasOwnProperty(key) && showR21(key, $scope)) {
          var formElements = createFormItems($scope, key);
          //If there are no elements to show then dont show the panel
          if (formElements.controls.text !== "" || formElements.configs.text !== "") {
            if (startsWith(key, 'R21')) {
              htmlArray.push(xbConfigElementService.createRule21OpeningTab(deviceType, key, formElements.controls.advancedTab && formElements.configs.advancedTab));
            } else {
              htmlArray.push(xbConfigElementService.createOpeningTab(deviceType, key, formElements.controls.advancedTab && formElements.configs.advancedTab));
            }
            htmlArray.push(formElements.controls.text);
            htmlArray.push(formElements.divider);
            htmlArray.push(formElements.configs.text);
            htmlArray.push(xbConfigElementService.createClosingTab());

            if (startsWith(key, 'R21')) {
              htmlArray.push("</div>");
            }
          }
        }
      }
    }

    function showR21(key, $scope) {
      return !startsWith(key, 'R21') || ($scope.isGridCodesPresent() && key === 'R21_GridSupport');
    }

    //function form creating html elements for the form
    function createFormItems($scope, key) {
      var result = {
        controls: {
          text: "",
          advancedTab: true
        },
        configs: {
          text: "",
          advancedTab: true
        },
        divider: ""
      };
      var controlItems = [];
      var renderedItems = [];
      var panels;
      var controlPanels;
      var elementCreator;
      for (var index in $scope.configData.template[deviceType][key]) {
        if ($scope.configData.template[deviceType][key].hasOwnProperty(index)) {
          var templateObject = $scope.configData.template[deviceType][key][index];
          var formKey = (templateObject.type === "Control") ? key + "_control": key;
          var html = "";
          var sysvarName = sysvarFormatterService.formatSysvar(templateObject.name);

          if ($scope.configData.config.hasOwnProperty(sysvarName) &&
            isSysVarDisplayable(templateObject, $scope.configData.config) &&
            !endsWith(templateObject.name, "CFG/REFRESH")) {

            html += "<div class='row form-row' ng-class=\"[{ 'form-failed': forms." +
              formKey + "." + sysvarName + ".$invalid }, status." + sysvarName +
              ", { 'form-edited': forms." + formKey + "." + sysvarName + ".$dirty }]\" ";
            if (!templateObject.basic) {
              html += "ng-hide=\"settingLevel === 'basic'\" ";
            } else {
              result.configs.advancedTab = false;
            }

            html += ">";

            if (sysvarPermissionService.hasWritePermission(templateObject)) {
              switch (templateObject.inputType) {
                case 'textbox':
                  html += xbConfigElementService.createInputBox(templateObject, $scope.configData.config, formKey);
                  break;
                case 'slider':
                  html += xbConfigElementService.createSlider(templateObject, $scope.configData.config, formKey);
                  break;
                case 'dropdown':
                  html += xbConfigElementService.createDropdown(templateObject, $scope.configData.config, formKey);
                  break;
                case 'switch':
                  html += xbConfigElementService.createSwitch(templateObject, formKey);
                  break;
                case 'timeofday':
                  html += xbConfigElementService.createTimeOfDayPicker(templateObject, formKey);
                  break;
                case 'pushbutton':
                  html += xbConfigElementService.createPushButton(templateObject, formKey);
                  break;
                case 'sliderdisable':
                  html += xbConfigElementService.createSliderDisable(templateObject, $scope.configData.config, formKey);
                  break;

                default:
                  $log.debug("Missing Item type: " + templateObject.inputType);
              }
            } else {
              html += xbConfigElementService.createReadOnlyElement(templateObject, formKey);
            }
            html += "</div>";
            if (templateObject.type === "Control") {
              if(templateObject.basic) {
                result.controls.advancedTab = false;
              }
              controlItems.push(html);
            } else {
              renderedItems.push(html);
            }
          } else if (!$scope.configData.config.hasOwnProperty(sysvarName)) {
            $log.warn("Missing sysVar: " + sysvarName);
          }
        }
      }
      panels = splitIntoPanels(renderedItems);
      controlPanels = splitIntoPanels(controlItems);

      if (controlPanels.leftPanel.length > 2) {
        result.controls.text += xbConfigElementService.createOpeningForm(key + "_control");
        result.controls.text += "<div class='row' " +
        ((result.controls.advancedTab) ? "ng-hide=\"settingLevel === 'basic'\" >" : ">");
        if (panels.leftPanel.length > 2) {
          result.controls.text += "<div class='col-md-12 config-divider-text' ";
          result.controls.text += ((result.controls.advancedTab || result.configs.advancedTab) ? "ng-hide=\"settingLevel === 'basic'\" >" : ">");
          result.controls.text += $filter('translate')('xanbus.config.controls') + '</div>';
        }
        result.controls.text += controlPanels.leftPanel.join('') + controlPanels.rightPanel.join('');
        result.controls.text += "</div>";
        result.controls.text += xbConfigElementService.createClosingForm();
      }

      if (controlPanels.leftPanel.length > 2 && panels.leftPanel.length > 2) {
        result.divider += "<div class='row' " +
        ((result.controls.advancedTab || result.configs.advancedTab) ? "ng-hide=\"settingLevel === 'basic'\" >" : ">");
        result.divider += "<div class='col-md-12 config-line-break'></div>";
        result.divider += "</div>";
      }

      if (panels.leftPanel.length > 2) {
        result.configs.text += xbConfigElementService.createOpeningForm(key);
        result.configs.text += "<div class='row' " +
        ((result.configs.advancedTab) ? "ng-hide=\"settingLevel === 'basic'\" >" : ">");
        if (controlPanels.leftPanel.length > 2) {
          result.configs.text += "<div class='col-md-12 config-divider-text' ";
          result.configs.text += ((result.controls.advancedTab || result.configs.advancedTab) ? "ng-hide=\"settingLevel === 'basic'\" >" : ">");
          result.configs.text += $filter('translate')('xanbus.config.configs') + '</div>';
        }
        result.configs.text += panels.leftPanel.join('') + panels.rightPanel.join('');
        result.configs.text += "</div>";
        result.configs.text += xbConfigElementService.createFormButtons(key);
        result.configs.text += xbConfigElementService.createClosingForm();
      }
      return result;
    }

    function splitIntoPanels(items) {
      var leftPanel = ["<div class='col-md-6'>"];
      var rightPanel = ["<div class='col-md-6'>"];
      var rightPanelCount = Math.ceil(items.length / 2);
      var index;
      for (index = 0; index < rightPanelCount; index++) {
        leftPanel.push(items[index]);
      }

      for (index = rightPanelCount; index < items.length; index++) {
        rightPanel.push(items[index]);
      }

      rightPanel.push("</div>");
      leftPanel.push("</div>");
      return {
        rightPanel: rightPanel,
        leftPanel: leftPanel
      };
    }

    //function checks if the Sysvar is displayable.  If the min and max are
    //equal or if the min is greater than max and the value is zero, the sysVar
    //is not displayable
    function isSysVarDisplayable(templateObject, configData) {
      var displayable = true;
      var sysVarName = sysvarFormatterService.formatSysvar(templateObject.name);

      if (templateObject.inputType === 'slider' || templateObject.inputType === 'sliderdisable') {
        var sysVarMin = isNaN(templateObject.min) ? sysvarFormatterService.formatSysvar(templateObject.min) : templateObject.min;
        var sysVarMax = isNaN(templateObject.max) ? sysvarFormatterService.formatSysvar(templateObject.max) : templateObject.max;
        sysVarMin = configData[sysVarMin];
        sysVarMax = configData[sysVarMax];
        displayable = !(
          (sysVarMin === sysVarMax || sysVarMin > sysVarMax) &&
          configData[sysVarName] === 0 &&
          templateObject.scale >= 0
        );
      }

      return sysvarPermissionService.hasPermission(templateObject) && displayable && !isMaxValue(configData[sysVarName], templateObject);
    }

    function isMaxValue(data, template) {
      var scaled_dna = xbConfigUtilityService.scaleValue(template.dataNotAvailable, template);
      return data === scaled_dna;
    }

    return {
      restrict: "E",
      replace: true,
      link: link
    };
  }
]);
