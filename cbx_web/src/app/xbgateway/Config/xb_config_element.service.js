"use strict";

//This service is used for saving and retreiveing device configurations
angular.module('conext_gateway.xbgateway').factory('xbConfigElementService', ['sysvarFormatterService', '$filter', 'xbConfigUtilityService',
  function(sysvarFormatterService, $filter, xbConfigUtilityService) {

    var service = {
      createInputBox: createInputBox,
      createSlider: createSlider,
      createDropdown: createDropdown,
      createSwitch: createSwitch,
      createReadOnlyElement: createReadOnlyElement,
      createOpeningForm: createOpeningForm,
      createClosingForm: createClosingForm,
      createFormButtons: createFormButtons,
      createTimeOfDayPicker: createTimeOfDayPicker,
      createPushButton: createPushButton,
      createRule21OpeningTab: createRule21OpeningTab,
      createOpeningTab: createOpeningTab,
      createSliderDisable: createSliderDisable,
      createClosingTab: createClosingTab
    };

    //function for create the apply and reset buttons at the end of the form
    function createFormButtons(key) {
      var html;
      html = "<div class='row' >";
      html += "<div class='panel-controls'>";
      html += "<div class='panel-controls__message'></div>";
      html += "<div class='panel-controls__buttons'>";
      html += "<input type='submit' id='btn-save-" + key + "' ng-disabled='formDisabled.all || formDisabled." + key + "' class='btn btn-default' value=\"{{'xanbus.config.apply' | translate}}\">";
      html += "<input type='button' id='btn-reset-" + key + "' ng-disabled='formDisabled.all || formDisabled." + key + "' class='btn btn-default' value=\"{{'xanbus.config.reset' | translate}}\" ng-click=\"reset('" + key + "')\">";
      html += "</div>";
      html += "</div>";
      html += "</div>";
      return html;
    }

    //function for creating the closing tabs for the form and panel
    function createClosingForm() {
      var html;
      html = "</div>";
      html += "</form>";
      return html;
    }

    function createClosingTab() {
      var html = '';
      html += "</se-panel>";
      return html;
    }

    //function for creating the opening tags for the panel and the form
    function createOpeningForm(key) {
      var html = "";
      html += "<form name='forms." + key + "' ng-submit=\"applyChanges('" + key + "')\">";
      html += "<div class='container-fluid'>";
      return html;
    }

    function createOpeningTab(deviceType, key, advancedTab) {
      var html = '';
      html = "<se-panel callback='true' value=\"{{ '" + deviceType + "_" + key + "' | translate }}\" ";
      if (advancedTab) {
        html += "ng-hide=\"settingLevel === 'basic'\" ";
      }
      html += ">";
      return html;
    }

    function createRule21OpeningTab(deviceType, key, advancedTab) {
      var html = '';
      html = "<se-panel callback='true' value=\"{{ '" + deviceType + "_" + key + "' | translate }}\" ";
      if (advancedTab) {
        html += "ng-hide=\"settingLevel === 'basic'\" ";
      }
      html += ">";
      html += "<div ng-hide=\"verified.state\">";
      html += "<table class=\"settings-controls\">";
      html += "<tr><td translate=\"xanbus.grid_codes.password\"></td>";
      html += "<td><input type=\"password\" ng-model=\"verified.password\" ng-change=\"passwordChange()\" ng-keyup=\"$event.keyCode == 13 ?  submit(): null\" />";
      html += "</td></tr>";
      html += "<tr><td></td>";
      html += "<td><button class=\"btn btn-default\" translate=\"xanbus.grid_codes.submit\" ng-click=\"submit()\"></button></td></tr>";
      html += "</table>";
      html += "<div class=\"col-md-12 gc_error\" ng-if=\"verified.message !== ''\">";
      html += "<div class=\"col-md-12\">{{verified.message}}</div></div>";
      html += "</div>";
      html += "<div ng-show=\"verified.state\">";
      return html;
    }

    //Function for creating the html for the sysVar shortname
    function createTitle(nameRef) {
      var html = "<div class='col-md-4'>";
      html += "{{ '" + nameRef + "' | translate }}";
      html += "</div>";
      return html;
    }

    //Function for creating the html for the information Icon
    function createInformationIcon(templateObject) {
      var html = "<div class='col-md-1'>";
      //html += "<div class='icon-blue_icon information-icon' ng-click='information(\"" + templateObject.nameRef + "\", \"" + templateObject.infoRef + "\")'></div>";
      html += "</div>";
      return html;
    }

    //Function used to create the html for pushbutton elements
    function createPushButton(templateObject, formId) {
      var pushButton = "";
      var sysVarName = sysvarFormatterService.formatSysvar(templateObject.name);

      var enumRef = $filter('translate')(templateObject.enumRef);
      var options = xbConfigUtilityService.splitEnums(enumRef);

      pushButton = createTitle(templateObject.nameRef);
      pushButton += createInformationIcon(templateObject);
      pushButton += "<div class='col-md-6 pull-right'>";
      pushButton += "<input type='text' ng-hide='true' name='" + sysVarName + "' ng-model='configData.config." + sysVarName + "' />";
      pushButton += "<input type='button' id='btn-apply-" + sysVarName + " ng-disabled='formDisabled.all || formDisabled." + formId + "' class='btn btn-default apply_button pull-right' value=\"{{'xanbus.config.apply' | translate}}\" ng-click=\"pushButtonPress('" + sysVarName + "')\">";
      pushButton += "</div>";
      return pushButton;
    }
    //function for creating the html for input boxes
    function createInputBox(templateObject, configData, formId) {
      var inputBox = "";
      var sysVarName = sysvarFormatterService.formatSysvar(templateObject.name);

      inputBox = createTitle(templateObject.nameRef);
      inputBox += createInformationIcon(templateObject);
      inputBox += "<div class='col-md-6 pull-right text-right'>";
      inputBox += "<input id='ipb-" + sysVarName + "' ng-disabled='formDisabled.all || formDisabled." + formId;
      inputBox += getDisabledConditions(templateObject);
      inputBox += "'class='xb-input-box' name='" + sysVarName + "' type='text' ng-model='configData.config." + sysVarName + "' ng-change='setDirty(\"" + formId + "." + sysVarName + "\")' ></input>";
      inputBox += "</div>";
      inputBox += addButtonsIfControl(templateObject, formId, 12);
      return inputBox;
    }

    //Function for creating the html for time picker elements
    function createTimeOfDayPicker(templateObject, formId) {
      var sysVarName = sysvarFormatterService.formatSysvar(templateObject.name);

      var timePicker = createTitle(templateObject.nameRef);
      timePicker += createInformationIcon(templateObject);
      timePicker += "<div class='col-md-6 pull-right text-right'>";
      timePicker += "<div class='pull-right' ";
      timePicker += "ng-show='formDisabled.all || formDisabled." + formId;
      timePicker += getDisabledConditions(templateObject) + "'";
      timePicker += " >{{configData.config." + sysVarName + ".toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })}}</div>";
      timePicker += "<div class='pull-right' ";
      timePicker += "ng-hide='formDisabled.all || formDisabled." + formId;
      timePicker += getDisabledConditions(templateObject) + "' >";
      timePicker += "<div class='pull-right' uib-timepicker id='tp-" + sysVarName + "' ng-model='configData.config." + sysVarName;
      timePicker += "' name='" + sysVarName + "' ng-change='setDirty(\"" + formId + "." + sysVarName + "\")' hour-step='1' minute-step='1' show-meridian='true' ";
      timePicker += " ></div>";
      timePicker += "</div></div>";
      return timePicker;
    }

    //Function for creating the html for slider elements
    function createSlider(templateObject, configData, formId) {
      var slider = "";
      var sysVarName = sysvarFormatterService.formatSysvar(templateObject.name);
      var minMaxObj = {
        sysVarMin: isNaN(templateObject.min) ? configData[sysvarFormatterService.formatSysvar(templateObject.min)] : templateObject.min,
        sysVarMax: isNaN(templateObject.max) ? configData[sysvarFormatterService.formatSysvar(templateObject.max)] : templateObject.max
      };

      swapMinAndMixWhenScaleNegative(templateObject.scale, minMaxObj);

      if (isReadOnlyElement(minMaxObj.sysVarMin, minMaxObj.sysVarMax)) {
        return createReadOnlyElement(templateObject, sysVarName);
      }

      var options = "{ ";
      options += "id: \"" + formId + "." + sysVarName + "\", ";
      options += "floor: " + minMaxObj.sysVarMin + ", ";
      options += "ceil: " + minMaxObj.sysVarMax + ", ";
      options += "step: " + templateObject.sliderStep + ", ";
      options += "precision: " + xbConfigUtilityService.getPrecision(templateObject.scale) + ", ";
      options += "enforceStep: false,";
      options += "hidePointerLabels: true, ";
      options += "hideLimitLabels: true, ";
      options += "onChange: setDirty, ";
      options += "disabled: formDisabled.all || formDisabled." + formId;
      options += getDisabledConditions(templateObject);
      options += "}";

      slider = createTitle(templateObject.nameRef);
      slider += createInformationIcon(templateObject);
      slider += "<div class='col-md-4'>";
      slider += "<rzslider id='sld-" + sysVarName + "' rz-slider-model='configData.config." + sysVarName + "' rz-slider-options='" + options + "' ></rzslider >";
      slider += "</div>";
      slider += "<div class='col-md-2 no-padding' >";
      slider += "<input class='slider-input-box' ng-model-options=\"{ allowInvalid: true }\" id='ipb-" + sysVarName + "' name='" + sysVarName + "' min='" + minMaxObj.sysVarMin + "' max='" + minMaxObj.sysVarMax + "' step='" + templateObject.sliderStep + "' ng-disabled='formDisabled.all || formDisabled." + formId;
      slider += getDisabledConditions(templateObject);
      slider += "' type='number' ng-model='configData.config." + sysVarName + "' step='any' ></input>";
      slider += "</div>";
      slider += "<div class='col-md-1 text-right slider-units' >";
      if (templateObject.units) {
        slider += templateObject.units.replace('deg', '&deg');
      }
      slider += "</div>";
      slider += addButtonsIfControl(templateObject, formId, 12);
      return slider;
    }

    //Function for creating the html for slider elements
    function createSliderDisable(templateObject, configData, formId) {
      var slider = "";
      var sysVarName = sysvarFormatterService.formatSysvar(templateObject.name);
      var minMaxObj = {
        sysVarMin: isNaN(templateObject.min) ? configData[sysvarFormatterService.formatSysvar(templateObject.min)] : templateObject.min,
        sysVarMax: isNaN(templateObject.max) ? configData[sysvarFormatterService.formatSysvar(templateObject.max)] : templateObject.max
      };
      swapMinAndMixWhenScaleNegative(templateObject.scale, minMaxObj);

      if (isReadOnlyElement(minMaxObj.sysVarMin, minMaxObj.sysVarMax)) {
        return createReadOnlyElement(templateObject, sysVarName);
      }

      var options = "{ ";
      options += "id: \"" + formId + "." + sysVarName + "\", ";
      options += "floor: " + minMaxObj.sysVarMin + ", ";
      options += "ceil: " + minMaxObj.sysVarMax + ", ";
      options += "step: " + templateObject.sliderStep + ", ";
      options += "precision: " + xbConfigUtilityService.getPrecision(templateObject.scale) + ", ";
      options += "enforceStep: false,";
      options += "hidePointerLabels: true, ";
      options += "hideLimitLabels: true, ";
      options += "onChange: setDirty, ";
      options += "disabled: formDisabled.all || formDisabled." + formId;
      options += getDisabledConditions(templateObject);
      options += "}";

      slider = createTitle(templateObject.nameRef);
      slider += createInformationIcon(templateObject);
      slider += "<div class='col-md-4'>";
      slider += "<rzslider id='sld-" + sysVarName + "' rz-slider-model='configData.config." + sysVarName + "' rz-slider-options='" + options + "' ></rzslider >";
      slider += "</div>";
      slider += "<div class='col-md-2 no-padding' >";
      slider += "<input class='slider-input-box' ng-hide='" + minMaxObj.sysVarMin + " === configData.config." + sysVarName + "' ng-model-options=\"{ allowInvalid: true }\" id='ipb-" + sysVarName + "' name='" + sysVarName + "' min='" + minMaxObj.sysVarMin + "' max='" + minMaxObj.sysVarMax + "' step='" + templateObject.sliderStep + "' ng-disabled='formDisabled.all || formDisabled." + formId;
      slider += getDisabledConditions(templateObject);
      slider += "' type='number' ng-model='configData.config." + sysVarName + "' step='any' ></input>";
      slider += "<span ng-hide='" + minMaxObj.sysVarMin + " !== configData.config." + sysVarName + "' translate='xanbus.config.disabled'></span>";
      slider += "</div>";
      slider += "<div class='col-md-1 text-right slider-units' >";
      if (templateObject.units) {
        slider += "<span ng-hide='" + minMaxObj.sysVarMin + " === configData.config." + sysVarName + "'>" + templateObject.units.replace('deg', '&deg') + "</span>";
      }
      slider += "</div>";
      slider += addButtonsIfControl(templateObject, formId, 12);
      return slider;
    }

    //function for creating the html element for drop down menus
    function createDropdown(templateObject, configData, formId) {

      var sysVarName = sysvarFormatterService.formatSysvar(templateObject.name);
      var enumRef = $filter('translate')(templateObject.enumRef);
      var dropdown = "";
      var options = xbConfigUtilityService.splitEnums(enumRef);

      dropdown = createTitle(templateObject.nameRef);
      dropdown += createInformationIcon(templateObject);
      dropdown += "<div class='col-md-6 pull-right text-right'>";
      dropdown += "<select id='dd-" + sysVarName + "' class='xb-selector'ng-disabled='formDisabled.all || formDisabled." + formId;
      dropdown += getDisabledConditions(templateObject);
      dropdown += "' name='" + sysVarName + "' ng-model='configData.config." + sysVarName + "'";
      dropdown += optionsContains(options, configData[sysVarName]) ? "" : " ng-init='configData.config." + sysVarName + " = \"\"'";
      dropdown += " ng-change='setDirty(\"" + formId + "." + sysVarName + "\")'>";
      dropdown += "<option value='' hidden translate='xanbus.config.option_select'></option>";
      for (var index = 0; index < options.length; index++) {
        dropdown += "<option value='" + options[index].key + "' >" + options[index].value + "</option>";
      }
      dropdown += "</select>";
      dropdown += "</div>";
      dropdown += addButtonsIfControl(templateObject, formId, 12);

      return dropdown;
    }

    //function for creating the html element for switch menus
    function createSwitch(templateObject, formId) {
      var switchObj = "";
      var sysVarName = sysvarFormatterService.formatSysvar(templateObject.name);

      var enumRef = $filter('translate')(templateObject.enumRef);
      var options = xbConfigUtilityService.splitEnums(enumRef);

      switchObj = createTitle(templateObject.nameRef);
      switchObj += createInformationIcon(templateObject);
      switchObj += "<div class='col-md-6'>";
      switchObj += "<switch id='sw-" + sysVarName + "' name='" + sysVarName + "' disabled='formDisabled.all || formDisabled." + formId;
      switchObj += getDisabledConditions(templateObject);
      switchObj += "' ng-model='configData.config." + sysVarName + "' ng-change='setDirty' form-Id='" + formId + "." + sysVarName + "' ></switch>";
      for (var index = 0; index < options.length; index++) {
        switchObj += "<div class='switch-description text-right' ng-show='configData.config." + sysVarName + " == " + options[index].key + "' >" + options[index].value + "</div>";
      }
      switchObj += "</div>";
      switchObj += addButtonsIfControl(templateObject, formId, 12);
      return switchObj;

    }

    //function for create elements which are read only
    function createReadOnlyElement(templateObject, sysVarName) {
      var readOnly;

      readOnly = createTitle(templateObject.nameRef);
      readOnly += createInformationIcon(templateObject);
      readOnly += "<div class='col-md-7 text-right slider-units'>";
      readOnly += "{{ configData.config." + sysVarName + "}}";
      if (templateObject.hasOwnProperty('units')) {
        readOnly += " " + templateObject.units.replace('deg', '&deg');
      }
      readOnly += "</div>";
      return readOnly;
    }

    //function for checking if the value is present in the list of options
    function optionsContains(options, value) {
      var result = false;
      for (var key in options) {
        if (options.hasOwnProperty(key) && options[key].key == value) {
          result = true;
        }
      }
      return result;
    }

    //function for creating apply button for control elements
    function createApplyButton(templateObject, key, col_size) {
      var sysVarName = sysvarFormatterService.formatSysvar(templateObject.name);
      var html;
      html = "<div class='col-md-" + col_size + "'>";
      html += "<input type='button' id='btn-apply-" + sysVarName + "' ng-disabled='formDisabled.all || formDisabled." + key + "' class='btn btn-default apply_button pull-right' value=\"{{'xanbus.config.apply' | translate}}\" ng-click=\"applyControl('" + sysVarName + "', '" + key + "')\">";
      html += "</div>";
      return html;
    }

    //function which adds apply button if the form element is type control
    function addButtonsIfControl(templateObject, formId, col_size) {
      var result = "";
      if (templateObject.type === "Control") {
        result = createApplyButton(templateObject, formId, col_size);
      }
      return result;
    }

    //function which swaps the min and max values if the scale is negative
    //and the max is smaller then the min
    function swapMinAndMixWhenScaleNegative(scale, minMaxObj) {
      if (scale < 0 && minMaxObj.sysVarMin > minMaxObj.sysVarMax) {
        var tempHolder = minMaxObj.sysVarMax;
        minMaxObj.sysVarMax = minMaxObj.sysVarMin;
        minMaxObj.sysVarMin = tempHolder;
      }
    }

    //function for checking if the element is a ReadOnly element
    function isReadOnlyElement(sysVarMin, sysVarMax) {
      return sysVarMin === sysVarMax || sysVarMin > sysVarMax;
    }

    //function for writing variable checking conditions for disabling the element
    function getDisabledConditions(templateObject) {
      var disabledConditions = "";
      var i;

      disabledConditions += (templateObject.safeMode) ? " || configData.config.DEV_CFG_OPMODE != 2" : "";

      //if the following conditions are TRUE this input should be disabled
      if (templateObject.hideConditions) {
        var condlist = templateObject.hideConditions.split(",");

        for (i = 0; i < condlist.length; i++) {
          var condStr = getConditionalString(condlist[i], " == ");
          if (condStr != "") {
            disabledConditions += " || configData.config." + condStr;
          }
        }
      }

      //if the following conditions are FALSE, this input should be disabled
      if (templateObject.showConditions) {
        var condlist = templateObject.showConditions.split(",");
        var count = 0;
        for (i = 0; i < condlist.length; i++) {
          var condStr = getConditionalString(condlist[i], " != ");
          if (condStr != "") {
            disabledConditions += (count == 0 ? " || ( configData.config." + condStr : " && configData.config." + condStr);
            count++;
          }
        }

        disabledConditions += (count > 0 ? " )" : "");
      }

      return disabledConditions;
    }

    // convert the condition statement into a conditional string
    // "BATT/CFG_TYPE=3" -> "BATT_CFG_TYPE == 3"
    function getConditionalString(condItems, operator) {
      var condStr = "";
      var items = condItems.split("=");
      if (items.length == 2) {
        var nameparts = items[0].split("/");
        condStr = nameparts.join("_") + operator + items[1];
      }
      return condStr;
    }

    return service;

  }
]);
