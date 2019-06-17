// Turn of linting, because this is old code ported from Linux and we don't have
// capacity to bring it up to standards.
/* eslint-disable */

$(document).ready(function() {
  var deviceDetectionStartStatus = null;
  var deviceDetectionStart = null;
  var deviceDetectionStop = null;
  var detectDeviceInterval = null;
  var setTimeFlagSIApp = 0;
  var setTimezoneFlagSIApp = 0;
  var setPlantCapacityFlagSIApp = 0;
  $("#btnSmrtDevDetStopApp").hide();
  $("#loader").hide();
  $('#sendTestMailLoaderApp').hide();
  $('#testConextInsightLoaderApp').hide();
  $('#plantSetupErrorMessageSIApp').hide();
  $('#detectedSummaryIdApp tbody tr').remove();
  $(".successMessagePlantSetupSIApp").hide();
  $('#plantSetupErrorMessageSIApp').hide();
  $('#plantSetupLoaderSIApp').hide();

  $("#radioDeviceTimeSIApp, #radioNetworkTimeSIApp").change(function() {

    if ($("#radioDeviceTimeSIApp").is(":checked") == true) {

      //$("#txtSNTPServerNameSIApp").attr("disabled", true);
      //$("#txtPollIntervalSIApp").attr("disabled", true);
      //$("#txtDeviceCurrentTimeSIApp").attr("disabled", false);
      // alert($("#radioDeviceTime").is(":checked"));
      $.ajax({
        url : "/cgi-bin/SntpConfiguration.cgi?option=2",
        beforeSend : function(xhr) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        },
        success : function(data) {
          $('#plantSetupLoaderSIApp').hide();
          $("#plantSetupErrorMessageSIApp").hide();
          $(".plantSetupErrorSIApp").html("");
          $(".successMessagePlantSetupSIApp").show();
          $("#plantSetupSuccessSIApp").html(" SNTP disabled successfully. ");
          setTimeout(function() {
            $(".successMessagePlantSetupSIApp").hide();
            $("#plantSetupSuccessSIApp").html("");
          }, 10000);
        },
        error : function(xhr) {
          console.log('SNTP Configuration Status' + xhr.status);
          if (xhr.status == 404 || xhr.status == 500 || xhr.status == 501) {
            $('#plantSetupLoaderSIApp').hide();
            $(".successMessagePlantSetupSIApp").hide();
            $("#plantSetupSuccessSIApp").html("");
            $("#plantSetupErrorMessageSIApp").show();
            $("#plantSetupErrorSIApp").html(" SNTP disabling failed ");
            setTimeout(function() {
              $("#plantSetupErrorMessageSIApp").hide();
              $("#plantSetupErrorSIApp").html("");
            }, 10000);
          } else {
            $(".successMessagePlantSetupSIApp").hide();
            $("#plantSetupSuccessSIApp").html("");
            $('#plantSetupLoaderSIApp').hide();
            $("#plantSetupErrorMessageSIApp").show();
            $("#plantSetupErrorSIApp").html(" SNTP disabling failed ");
            setTimeout(function() {
              $("#plantSetupErrorMessageSIApp").hide();
              $("#plantSetupErrorSIApp").html("");
            }, 10000);
          }
        }
      });
    }
    if ($("#radioNetworkTimeSIApp").is(":checked")) {

      //$("#txtSNTPServerNameSIApp").attr("disabled", false);
      //$("#txtPollIntervalSIApp").attr("disabled", false);
      //$("#txtDeviceCurrentTimeSIApp").attr("disabled", true);
    }
  });

  $("#btnPlantSetupApplySIApp").unbind('click').click(function() {
    // code to hide error and success messages
    $(".successMessagePlantSetupSIApp").hide();
    $("#plantSetupSuccessSIApp").html("");
    $('#plantSetupErrorMessageSIApp').hide();
    $('#plantSetupErrorSIApp').html('');

    var dateTimeRegEx = '/^(\d{4})-(\d{1,2})-(\d{1,2})$/';
    if ($("#radioDeviceTimeSIApp").is(":checked") == true) {

      var formDeviceCurrentTime = $("#txtDeviceCurrentTimeSIApp").val();
      var formTimeZone = $('#ddlTimeZoneSIApp option:selected').text();
      if (formDeviceCurrentTime.length == 0) {
        $(".successMessagePlantSetupSIApp").hide();
        $("#plantSetupSuccessSIApp").html("");
        $('#plantSetupLoaderSIApp').hide();
        $('#plantSetupErrorMessageSIApp').show();
        $('#txtDeviceCurrentTimeSIApp').addClass('borderRed');
        $('#plantSetupErrorSIApp').html('Please select Conext Gateway Date and Time');
        return false;
      } else if (formTimeZone.length == 0 || formTimeZone == "Select Timezone" || formTimeZone == "") {
        $(".successMessagePlantSetupSIApp").hide();
        $("#plantSetupSuccessSIApp").html("");
        $('#plantSetupErrorMessageSIApp').show();
        $('#plantSetupErrorSIApp').html('Please select Conext Gateway Timezone');
        return false;
      } else if ($('#installedACCapacityIdSIApp').val().length == 0) {
        $(".successMessagePlantSetupSIApp").hide();
        $("#plantSetupSuccessSIApp").html("");
        $('#plantSetupErrorMessageSIApp').show();
        $('#installedACCapacityIdSIApp').addClass('borderRed');
        $('#plantSetupErrorSIApp').html('Please enter installed AC capacity');
        return false;
      } else if (parseInt($('#installedACCapacityIdSIApp').val()) > 10000) {
        $(".successMessagePlantSetupSIApp").hide();
        $("#plantSetupSuccessSIApp").html("");
        $('#plantSetupErrorMessageSIApp').show();
        $('#installedACCapacityIdSIApp').addClass('borderRed');
        $('#plantSetupErrorSIApp').html('Please enter installed AC capacity maximum of 10000kW');
        return false;
      } else if (!validatePower($('#installedACCapacityIdSIApp').val())) {
        $(".successMessagePlantSetupSIApp").hide();
        $("#plantSetupSuccessSIApp").html("");
        $('#plantSetupErrorMessageSIApp').show();
        $('#installedACCapacityIdSIApp').addClass('borderRed');
        $('#plantSetupErrorSIApp').html('Please enter installed AC capacity in positive numbers with one decimal point and should not contain special characters');
        return false;
      } else {
        $('#ddlTimeZoneSIApp').prop("disabled", "disabled");
        $("#radioNetworkTimeSIApp").prop('disabled', 'disabled');
        $('#btnPlantSetupApplySIApp').attr("disabled", "disabled");
        $('#plantSetupLoaderSIApp').show();
        console.log('SystemDeviceTime:' + formDeviceCurrentTime);
        var date = formDeviceCurrentTime.split(" ");
        console.log("Date after split" + date);
        $('#txtDeviceCurrentTimeSIApp').removeClass('borderRed');
        $("#plantSetupErrorMessageSIApp").hide();
        var customDate = new Date(formDeviceCurrentTime);
        console.log('Custom Date after format' + customDate);

        var customYear = customDate.getFullYear();
        var customMonth = customDate.getMonth();
        var customDay = customDate.getDate();
        var customHours = customDate.getHours();
        var customMinutes = customDate.getMinutes();
        // Prefix 0 if month value <=9

        if ((customDate.getMonth() + 1) <= 9) {
          customMonth = "0" + (parseInt(customDate.getMonth()) + 1);
          // customMonth=customDate.getMonth()+1;
        } else {
          customMonth = customDate.getMonth() + 1;
        }

        // Prefix 0 if date value <=9

        if (customDate.getDate() <= 9) {
          customDay = "0" + customDate.getDate();
        } else {
          customDay = customDate.getDate();
        }

        // Prefix 0 if hours value <=9

        if (customDate.getHours() <= 9) {
          customHours = "0" + customDate.getHours();
        } else {
          customHours = customDate.getHours();
        }

        // Prefix 0 if minutes value <=9

        if (customDate.getMinutes() <= 9) {
          customMinutes = "0" + customDate.getMinutes();
        } else {
          customMinutes = customDate.getMinutes();
        }

        console.log("URL" + "/cgi-bin/set.lua?SNTP/ON=0&TIME/LOCAL_ISO_STR=" + customYear + "/" + customMonth + "/" + customDay + " " + customHours + ":" + customMinutes + "&TIMEZONE=" + $('#ddlTimeZoneSIApp option:selected').text());
        $.ajax({
          url : "/cgi-bin/set.lua?SNTP/ON=0&TIME/LOCAL_ISO_STR=" + customYear + "/" + customMonth + "/" + customDay + " " + customHours + ":" + customMinutes + "&TIMEZONE=" + $('#ddlTimeZoneSIApp option:selected').text(),
          dataType : "json",
          success : function(sntpOnOffData) {
            var jsonObj = JSON.stringify(sntpOnOffData);
            jsonArray = JSON.parse(jsonObj);

            $.each(jsonArray, function(index, jsonDataObj) {
              $.each(jsonDataObj, function(key, val) {
                if (key === 'SNTP/ON') {
                  sntpOnOffStatus = val;
                  if (sntpOnOffStatus === "OK") {
                    setTimeFlagSIApp = 1;
                  }
                }
              });
            });
          }
        });

        console.log('CustomYear:' + customYear + '-Custom Month:' + customMonth + '-CustomDay:' + customDay + '-Custom Hours:' + customHours + '-Custom Minutes: ' + customMinutes);
        console.log("DateTimeCGI:" + "/cgi-bin/ConextGatewayDatetimeSettings.cgi?sflag=1&dd=" + customYear + customMonth + customDay + "&tm=" + customHours + customMinutes + "&tzone=" + $('#ddlTimeZoneSIApp').val());
        $.ajax({
          url : "/cgi-bin/ConextGatewayDatetimeSettings.cgi?sflag=1&dd=" + customYear + customMonth + customDay + "&tm=" + customHours + customMinutes + "&tzone=" + $('#ddlTimeZoneSIApp').val(),
          beforeSend : function(xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          },
          success : function(data) {
            console.log('data:' + data);
            if (data.indexOf('SUCCESS') != -1) {
              setTimeFlagSIApp = 1;
              $('#plantSetupLoaderSIApp').hide();
              $(".successMessagePlantSetupSIApp").show();
              $("#plantSetupSuccessSIApp").html('Plant Setup data updated successfully. Please wait you will be redirected to next step... ');
              setTimeout(function() {
                $('#ddlTimeZoneSIApp').prop("disabled", false);
                $("#radioNetworkTimeSIApp").prop('disabled', false);
                $('#btnPlantSetupApplySIApp').attr("disabled", false);
                $(".successMessagePlantSetupSIApp").hide();
                $("#plantSetupSuccessSIApp").html('');
                sessionStorage.setItem("Step2StatusApp", "success");
                window.location.href = "#smartInstallAppDetectDevices";
              }, 3000);
            } else if (data.indexOf('FAILURE') != -1) {
              $('#ddlTimeZoneSIApp').prop("disabled", false);
              $('#btnPlantSetupApplySIApp').attr("disabled", false);
              $("#radioNetworkTimeSIApp").prop('disabled', false);
              $('#plantSetupLoaderSIApp').hide();
              $(".successMessagePlantSetupSIApp").hide();
              $("#plantSetupSuccessSIApp").html("");
              $('#plantSetupErrorMessageSIApp').show();
              $('#plantSetupErrorSIApp').html('Conext Gateway Date and Time updation failed');
              setTimeout(function() {
                $("#plantSetupErrorMessageSIApp").hide();
                $(".plantSetupErrorSIApp").html("");
              }, 10000);

            }
          },
          error : function(xhr) {
            $('#setTimeLoader').hide();
            console.log('SNTP COnfiguration Status' + xhr.status);
            if (xhr.status == 404 || xhr.status == 500 || xhr.status == 501) {
              $('#ddlTimeZoneSIApp').prop("disabled", false);
              $('#btnPlantSetupApplySIApp').attr("disabled", false);
              $("#radioNetworkTimeSIApp").prop('disabled', false);
              $('#plantSetupLoaderSIApp').hide();
              $(".successMessagePlantSetupSIApp").hide();
              $("#plantSetupSuccessSIApp").html("");
              $('#plantSetupErrorMessageSIApp').show();
              $('#plantSetupErrorSIApp').html('Conext Gateway Date and Time updation failed');
              setTimeout(function() {
                $("#plantSetupErrorMessageSIApp").hide();
                $(".plantSetupErrorSIApp").html("");
              }, 10000);
            } else {
              $('#ddlTimeZoneSIApp').prop("disabled", false);
              $('#btnPlantSetupApplySIApp').attr("disabled", false);
              $("#radioNetworkTimeSIApp").prop('disabled', false);
              $('#plantSetupLoaderSIApp').hide();
              $(".successMessagePlantSetupSIApp").hide();
              $("#plantSetupSuccessSIApp").html("");
              $('#plantSetupErrorMessageSIApp').show();
              $('#plantSetupErrorSIApp').html('Conext Gateway Date and Time updation failed');
              setTimeout(function() {
                $("#plantSetupErrorMessageSIApp").hide();
                $(".plantSetupErrorSIApp").html("");
              }, 10000);
            }
          }
        });
        $('#plantSetupErrorMessageSIApp').hide();
        $('#installedACCapacityIdSIApp').removeClass('borderRed');
        var plantQuery = "/cgi-bin/set.lua?MBSYS/INSTALLED_AC/CAPACITY=" + $('#installedACCapacityIdSIApp').val();
        console.log('PlantQuery:' + plantQuery);
        $.ajax({
          url : plantQuery,
          dataType : "json",
          success : function(plantSetupStatusData) {
            var jsonObj = JSON.stringify(plantSetupStatusData);
            var jsonArray = JSON.parse(jsonObj);
            $.each(jsonArray, function(index, jsonDataObj) {
              $.each(jsonDataObj, function(key, val) {
                if (key == 'MBSYS/INSTALLED_AC/CAPACITY') {
                  /*
                   * setPlantCapacityFlagSIApp=1;
                   * $(".successMessagePlantSetupSIApp"
                   * ).show();
                   * $("#plantSetupSuccessSIApp").html('Plant
                   * Installed AC Capacity data saved
                   * successfully'); setTimeout(function(){
                   * $(".successMessagePlantSetupSIApp"
                   * ).hide();
                   * $("#plantSetupSuccessSIApp").html('');
                   * },10000);
                   */
                }
              });
            });
          }
        });

      }
    } else if ($("#radioNetworkTimeSIApp").is(":checked") == true) {

      var formSNTPServerName = $("#txtSNTPServerNameSIApp").val();
      var formPollInterval = $("#txtPollIntervalSIApp").val();
      var formTimeZone = $('#ddlTimeZoneSIApp option:selected').text();
      // var formRadioSetTime= $('input[name=setTime]:checked').val()
      if (formSNTPServerName.length == 0) {
        $("#plantSetupErrorMessageSIApp").show();
        $('#txtSNTPServerNameSIApp').addClass('borderRed');
        $("#plantSetupErrorSIApp").html('Please enter SNTP server name');
        return false;
      } else if (formSNTPServerName.length > 30) {
        $("#plantSetupErrorMessageSIApp").show();
        $('#txtSNTPServerNameSIApp').addClass('borderRed');
        $("#plantSetupErrorSIApp").html('SNTP Server name should contain below 30 characters');
        return false;
      } else if (!validateFQDN(formSNTPServerName)) {
        $("#plantSetupErrorMessageSIApp").show();
        $('#txtSNTPServerNameSIApp').addClass('borderRed');
        $("#plantSetupErrorSIApp").html('Please enter SNTP server name either in Fully Qualified Domain name format');
        return false;
      } else if (formPollInterval.length == 0) {
        $("#plantSetupErrorMessageSIApp").show();
        $('#txtSNTPServerNameSIApp').removeClass('borderRed');
        $('#txtPollIntervalSIApp').addClass('borderRed');
        $("#plantSetupErrorSIApp").html('Please enter poll interval');
        return false;
      } else if (!checkSNTPInterval(formPollInterval)) {
        $("#plantSetupErrorMessageSIApp").show();
        $('#txtPollIntervalSIApp').val('');
        $('#txtPollIntervalSIApp').addClass('borderRed');
        $('#txtSNTPServerNameSIApp').removeClass('borderRed');
        $("#plantSetupErrorSIApp").html('Please enter integer poll interval in a valid range of between 1 to 1000');
        return false;
      } else if (parseInt(formPollInterval) < 1 || parseInt(formPollInterval) > 1000) {
        $("#plantSetupErrorMessageSIApp").show();
        $('#txtSNTPServerNameSIApp').removeClass('borderRed');
        $('#txtPollIntervalSIApp').addClass('borderRed');
        $("#plantSetupErrorSIApp").html('Please enter poll interval in a valid range of between 1 to 1000');
        return false;
      } else if (formTimeZone.length == 0 || formTimeZone == "Select Timezone" || formTimeZone == "") {
        $("#plantSetupErrorMessageSIApp").show();
        // $('#txtDeviceCurrentTime').addClass('borderRed');
        $("#plantSetupErrorSIApp").html('Please select Timezone');
        return false;
      } else if ($('#installedACCapacityIdSIApp').val().length == 0) {
        $('#plantSetupErrorMessageSIApp').show();
        $('#installedACCapacityIdSIApp').addClass('borderRed');
        $('#plantSetupErrorSIApp').html('Please enter installed AC capacity');
        return false;
      } else if (parseInt($('#installedACCapacityIdSIApp').val()) > 10000) {
        $('#plantSetupErrorMessageSIApp').show();
        $('#installedACCapacityIdSIApp').addClass('borderRed');
        $('#plantSetupErrorSIApp').html('Please enter installed AC capacity maximum of 10000kW');
        return false;
      } else if (!validatePower($('#installedACCapacityIdSIApp').val())) {
        $('#plantSetupErrorMessageSIApp').show();
        $('#installedACCapacityIdSIApp').addClass('borderRed');
        $('#plantSetupErrorSIApp').html('Please enter installed AC capacity in positive numbers with one decimal point and should not contain special characters');
        return false;
      } else {
        $("#radioDeviceTimeSIApp").prop('disabled', 'disabled');
        $('#ddlTimeZoneSIApp').prop("disabled", "disabled");
        $('#btnPlantSetupApplySIApp').attr("disabled", "disabled");
        $('#plantSetupLoaderSIApp').show();
        $('#txtPollIntervalSIApp').removeClass('borderRed');
        $('#txtSNTPServerNameSIApp').removeClass('borderRed');
        $("#plantSetupErrorMessageSIApp").hide();
        $('#sntpUpdateLoader').show();
        formPollInterval = (formPollInterval * 60 * 60);
        updateSNTPSynchronization(formSNTPServerName, formPollInterval, $('#ddlTimeZoneSIApp').val());
        $.ajax({
          url : "/cgi-bin/set.lua?SNTP.ON=1&SNTP.SERVER_NAME=" + formSNTPServerName + "&SNTP.POLL_INTERVAL=" + formPollInterval + "&TIMEZONE=" + $('#ddlTimeZoneSIApp option:selected').text(),
          dataType : "json",
          success : function(networkTimeUpdateData) {
            var jsonObj = JSON.stringify(networkTimeUpdateData);
            jsonArray = JSON.parse(jsonObj);

            $.each(jsonArray, function(index, jsonDataObj) {
              $.each(jsonDataObj, function(key, val) {
                if ((key === 'SNTP.SERVER_NAME')) {
                  networkTimeSetupStatus = val;
                  if (networkTimeSetupStatus === "OK") {
                    $("#smtpErrorMessage").hide();

                    $('#txtPollIntervalSIApp').removeClass('borderRed');

                  }
                }
              });
            });
          }
        });
        $('#plantSetupErrorMessageSIApp').hide();
        $('#installedACCapacityIdSIApp').removeClass('borderRed');
        var plantQuery = "/cgi-bin/set.lua?MBSYS/INSTALLED_AC/CAPACITY=" + $('#installedACCapacityIdSIApp').val();
        console.log('PlantQuery:' + plantQuery);
        $.ajax({
          url : plantQuery,
          dataType : "json",
          success : function(plantSetupStatusData) {
            var jsonObj = JSON.stringify(plantSetupStatusData);
            var jsonArray = JSON.parse(jsonObj);
            $.each(jsonArray, function(index, jsonDataObj) {
              $.each(jsonDataObj, function(key, val) {
                if (key == 'MBSYS/INSTALLED_AC/CAPACITY') {
                  /*
                   * setPlantCapacityFlagSIApp=1;
                   * $(".successMessagePlantSetupSIApp"
                   * ).show();
                   * $("#plantSetupSuccessSIApp").html('Plant
                   * Installed AC Capacity data saved
                   * successfully'); setTimeout(function(){
                   * $(".successMessagePlantSetupSIApp"
                   * ).hide();
                   * $("#plantSetupSuccessSIApp").html('');
                   * },10000);
                   */
                }
              });
            });
          }
        });
      }
    }
  });

  // Function that validates email address through a regular expression.
  function validateEmail(sEmail) {
    var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
    if (filter.test($.trim(sEmail))) {
      return true;
    } else {
      return false;
    }
  }

  // Function that validates IPAddress address through a regular expression.
  function validateIpAddress(ipAddress) {
    var filter = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (filter.test($.trim(ipAddress))) {
      return true;
    } else {
      return false;
    }
  }

  // Java script function to check password with regular expression //
  function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[A-Z]).{6,12}$/;
    return re.test($.trim(str));
  }
  // Java script function to check entered value is an integer or not using
  // regular expression //
  function checkInteger(str) {
    var re = /^[-+]?[0-9]+$/;
    return re.test($.trim(str));
  }
  // Function that validates SMTP Server address through a regular expression.
  function checkSMTPServerAddress(deviceName) {
    var filter = /^[a-zA-Z0-9-.]+$/;
    if (filter.test($.trim(deviceName))) {
      return true;
    } else {
      return false;
    }
  }

  // Function that validates Numbers upto 3 digits through a regular
  // expression.
  function checkSNTPInterval(sntpPollInterval) {
    var filter = /^[0-9]{1,4}$/;
    if (filter.test($.trim(sntpPollInterval))) {
      return true;
    } else {
      return false;
    }
  }
  // Function that validates Numbers upto 3 digits through a regular
  // expression.
  function checkWhiteSpace(testString) {
    var filter = /^\S+$/;
    if (filter.test($.trim(testString))) {
      return true;
    } else {
      return false;
    }
  }

  // Function that validates FQDN address through a regular expression.
  function validateFQDN(fqdnString) {
    var fqdnregex = /^(?=^.{1,254}$)(^(?:(?!\d+\.)[a-zA-Z0-9_\-]{1,63}\.?)+(?:[a-zA-Z]{2,})$)$/;
    var ipregex = /^((^|\.)(1[0-9]{2}|[1-9][0-9]|[0-9]|2[0-4][0-9]|25[0-5])){4}$/;
    var isError = 0;

    var parts = fqdnString.split(".");
    if (parts.length == 1) {
      isError = 1;
    } else if ((parts[0] == "") || (parts[parts.length - 1] == "")) {
      isError = 1;
    } else if (parts.length >= 2 && parts.length <= 3) {
      if (fqdnregex.test($.trim(fqdnString))) {
        isError = 0;
      } else {
        isError = 1;
      }
    } else {
      if (parts[0] < 1 || parts[0] > 247 || parts[1] < 1 || parts[1] > 247 || parts[2] < 1 || parts[2] > 247 || parts[3] < 1 || parts[3] > 247) {
        isError = 1;
      } else if ((ipregex.test($.trim(fqdnString))) || (fqdnregex.test($.trim(fqdnString)))) {
        isError = 0;
      } else {
        isError = 1;
      }

    }
    if (isError == 0) {
      return true;
    } else {
      return false;
    }
  }
  function validatePower(string) {
    var positiveRegEx = /^\d+(\.\d{1})?$/;// \d(?=.*\d)*(?:\.\d\d)?//^[0-9]*(\.[0-9]{1,2})?$
    if (positiveRegEx.test($.trim(string))) {
      return true;
    } else {
      return false;
    }
  }

  // Function to update SNTP Synchronization
  function updateSNTPSynchronization(formSNTPServerName, formPollInterval, ddlTimezoneIndex) {
    console.log("/cgi-bin/SntpConfiguration.cgi?option=1&ntpsername=" + formSNTPServerName + "&poll=" + formPollInterval + "&option=1&tzone=" + $('#ddlTimeZoneSIApp').val());
    $.ajax({
      url : "/cgi-bin/SntpConfiguration.cgi?option=1&ntpsername=" + formSNTPServerName + "&poll=" + formPollInterval + "&option=1&tzone=" + $('#ddlTimeZoneSIApp').val(),
      beforeSend : function(xhr) {
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
      },
      success : function(data) {
        console.log(data);
        if (data.indexOf('SUCCESS-SNTP') != -1 && data.indexOf('SUCCESS-SYS') != -1) {
          $('#plantSetupLoaderSIApp').hide();
          $(".successMessagePlantSetupSIApp").show();
          $("#plantSetupSuccessSIApp").html("Plant Setup data updated successfully. Please wait you will be redirected to next step... ");
          setTimeout(function() {
            $('#ddlTimeZoneSIApp').prop("disabled", false);
            $('#btnPlantSetupApplySIApp').attr("disabled", false);
            $("#radioDeviceTimeSIApp").prop('disabled', false);
            $(".successMessagePlantSetupSIApp").hide();
            $("#plantSetupSuccessSIApp").html("");
            sessionStorage.setItem("Step2StatusApp", "success");
            window.location.href = "#smartInstallAppDetectDevices";
          }, 3000);
        } else if (data.indexOf('SUCCESS-SNTP') != -1 && data.indexOf('FAILURE-SYS') != -1) {
          $('#plantSetupLoaderSIApp').hide();
          $(".successMessagePlantSetupSIApp").show();
          $("#plantSetupSuccessSIApp").html("Plant Setup data updated successfully. Please wait you will be redirected to next step... ");
          setTimeout(function() {
            $('#ddlTimeZoneSIApp').prop("disabled", false);
            $('#btnPlantSetupApplySIApp').attr("disabled", false);
            $("#radioDeviceTimeSIApp").prop('disabled', false);
            $(".successMessagePlantSetupSIApp").hide();
            $("#plantSetupSuccessSIApp").html("");
            sessionStorage.setItem("Step2StatusApp", "success");
            window.location.href = "#smartInstallAppDetectDevices";
          }, 3000);
        } else if (data.indexOf("FAILURE-SNTP") != -1 && data.indexOf("SUCCESS-SYS") != -1) {
          $('#ddlTimeZoneSIApp').prop("disabled", false);
          $("#radioDeviceTimeSIApp").prop('disabled', false);
          $('#btnPlantSetupApplySIApp').attr("disabled", false);
          $('#plantSetupLoaderSIApp').hide();
          $("#plantSetupErrorMessageSIApp").show();
          $("#plantSetupErrorSIApp").html("SNTP Synchronization failed. To fix this issue: please ensure that the SNTP Sever Name is correct and Conext Gateway is connected to the internet or please set device time manually");
          setTimeout(function() {
            $("#plantSetupErrorMessageSIApp").hide();
            $("#plantSetupErrorSIApp").html("");
          }, 10000);
        } else if (data.indexOf("FAILURE-SNTP") != -1 && data.indexOf("FAILURE-SYS") != -1) {
          $('#ddlTimeZoneSIApp').prop("disabled", false);
          $("#radioDeviceTimeSIApp").prop('disabled', false);
          $('#btnPlantSetupApplySIApp').attr("disabled", false);
          $('#plantSetupLoaderSIApp').hide();
          $("#plantSetupErrorMessageSIApp").show();
          $("#plantSetupErrorSIApp").html("SNTP Synchronization failed. To fix this issue: please ensure that the SNTP Sever Name is correct and Conext Gateway is connected to the internet or please set device time manually");
          setTimeout(function() {
            $("#plantSetupErrorMessageSIApp").hide();
            $("#plantSetupErrorSIApp").html("");
          }, 10000);
        } else if (data.indexOf("FAILURE-SNTP") != -1) {
          $('#ddlTimeZoneSIApp').prop("disabled", false);
          $("#radioDeviceTimeSIApp").prop('disabled', false);
          $('#btnPlantSetupApplySIApp').attr("disabled", false);
          $('#plantSetupLoaderSIApp').hide();
          $("#plantSetupErrorMessageSIApp").show();
          $("#plantSetupErrorSIApp").html("SNTP Synchronization failed. To fix this issue: please ensure that the SNTP Sever Name is correct and Conext Gateway is connected to the internet or please set device time manually");
          setTimeout(function() {
            $("#plantSetupErrorMessageSIApp").hide();
            $("#plantSetupErrorSIApp").html("");
          }, 10000);
        } else {
          $('#ddlTimeZoneSIApp').prop("disabled", false);
          $("#radioDeviceTimeSIApp").prop('disabled', false);
          $('#btnPlantSetupApplySIApp').attr("disabled", false);
          $('#plantSetupLoaderSIApp').hide();
          $("#plantSetupErrorMessageSIApp").show();
          $("#plantSetupErrorSIApp").html("SNTP Synchronization failed. To fix this issue: please ensure that the SNTP Sever Name is correct and Conext Gateway is connected to the internet or please set device time manually");
          setTimeout(function() {
            $("#plantSetupErrorMessageSIApp").hide();
            $("#plantSetupErrorSIApp").html("");
          }, 10000);
        }
      },
      error : function(xhr) {
        console.log('SNTP COnfiguration Status' + xhr.status);
        console.log('SNTP COnfiguration StatusText' + xhr.statusText);
        if (xhr.status == 0) {
          updateSNTPSynchronization(formSNTPServerName, formPollInterval, ddlTimezoneIndex);
        } else if (xhr.status == 2 || xhr.status == 101 || xhr.status == 102 || xhr.status == 104 || xhr.status == 105 || xhr.status == 324) {
          alert(xhr.st)
        } else if (xhr.status == 404 || xhr.status == 500 || xhr.status == 501) {
          $('#ddlTimeZoneSIApp').prop("disabled", false);
          $("#radioDeviceTimeSIApp").prop('disabled', false);
          $('#btnPlantSetupApplySIApp').attr("disabled", false);
          $('#plantSetupLoaderSIApp').hide();
          $("#plantSetupErrorMessageSIApp").show();
          $("#plantSetupErrorSIApp").html(" Network Time (SNTP) synchronization failed.To fix this issue:Please ensure that Conext Gateway is connected to the internet or Please set device time manually");
          setTimeout(function() {
            $("#plantSetupErrorMessageSIApp").hide();
            $("#plantSetupErrorSIApp").html("");
          }, 10000);
        } else {
          $('#ddlTimeZoneSIApp').prop("disabled", false);
          $("#radioDeviceTimeSIApp").prop('disabled', false);
          $('#btnPlantSetupApplySIApp').attr("disabled", false);
          $('#plantSetupLoaderSIApp').hide();
          $("#plantSetupErrorMessageSIApp").show();
          $("#plantSetupErrorSIApp").html(" Network Time (SNTP) synchronization failed.To fix this issue:Please ensure that Conext Gateway is connected to the internet or Please set device time manually");
          setTimeout(function() {
            $("#plantSetupErrorMessageSIApp").hide();
            $("#plantSetupErrorSIApp").html("");
          }, 10000);

        }
      }
    });

  }

});
