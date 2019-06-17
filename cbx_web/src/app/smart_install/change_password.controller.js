/* eslint angular/angularelement:0, angular/no-services:0, no-undef:0, angular/document-service:0, angular/timeout-service:0 */

"use strict";

angular.module('conext_gateway.smart_install').controller('smartInstallChangePasswordController',
  ["$scope", "$http", "csbQuery", "$window", "$log", "$state", "emailTestService", "$filter",
  function ($scope, $http, csbQuery, $window, $log, $state, emailTestService, $filter) {
    $scope.status = {
      processing: false
    }
    csbQuery.getObj("AUTHMAIL/RECIPIENT,MAILER/SERVER_NAME,MAILER/USERID,MAILER/SERVERPORT")
            .then(function (data) {
              $log.debug(JSON.stringify(data));
              $scope.txtPasswordRecoveryEmailApp = data.AUTHMAIL_RECIPIENT.replace(/%20/g, "");
              $scope.txtSmtpServerNameApp = data.MAILER_SERVER_NAME.replace(/%20/g, "");
              $scope.txtSMTPUserNameApp = data.MAILER_USERID.replace(/%20/g, "");
              $scope.txtSmtpPortApp = parseInt(data.MAILER_SERVERPORT);
              $scope.txtSMTPPasswordApp = '........';
            },
            function (error) {
              $log.error(error);
            }); //TODO: Error handling when this failed to get data

    $scope.nextClicked = function () {
      var requestObject = {};
      requestObject["MAILER/ENABLE"] = 1;
      requestObject["AUTHMAIL/RECIPIENT"] = $("#txtPasswordRecoveryEmail").val();
      requestObject["MAILER/SERVER_NAME"] = $("#txtSmtpServerName").val();
      requestObject["MAILER/SERVERPORT"] = $('#txtSmtpPort').val();
      requestObject["MAILER/USERID"] = $('#txtSMTPUserName').val();
      if ($("#txtSMTPPassword").val() !== '........') {
        requestObject["MAILER/PASSWORD"] = $("#txtSMTPPassword").val();
      }
      csbQuery.setFromObject(requestObject, true);
      /*TODO:
        What happen when set function failed?
        sessionStorage.setItem("Step5StatusApp", "failed");
      */
      $window.sessionStorage.setItem("Step5StatusApp", "success");
      //$window.location.href = "#/smartInstallAppSummary";
      $state.go("^.summary")
    };

    $scope.skipClicked = function () {
      $window.sessionStorage.setItem("Step5StatusApp", "skipped");
      $("#pwdRcvryErrMsgApp").hide();
      $('#txtPasswordRecoveryEmail').val('');
      $('#txtSmtpServerName').val('');
      $('#txtSMTPUserName').val('');
      $('#txtSMTPPassword').val('');
      $('#txtSmtpPort').val('');

      //$window.location.href = "#/smartInstallAppSummary";
      $state.go("^.summary");
    };

    $scope.sendTestMailClicked = function () {
      //code to hide error message
      document.getElementById("smartInstallErrMsgBar").style.display = 'none';
      document.getElementById("smartInstallErrMsgBar").style.display = 'none';

      var emailData = {};
      emailData.testEmail = $('#txtPasswordRecoveryEmail').val();
      emailData.smtpServer = $('#txtSmtpServerName').val();
      emailData.smtpPort = $('#txtSmtpPort').val();
      emailData.emailUserName = $('#txtSMTPUserName').val();
      emailData.emailPassword = $("#txtSMTPPassword").val();
      $scope.status.processing = true;
      emailTestService.testEmail(emailData, $scope, function (data) {
        $scope.status.processing = false;
        if (data === 'Success') {
          $('#smartInstallErrMsgBar').addClass('borderGreen');
          $("#pwdRcvryError").html($filter('translate')('smart_install.change_password.test_email_sent'));
          document.getElementById("smartInstallErrMsgBar").style.display = 'flex';
          setTimeout(function () {
            document.getElementById("smartInstallErrMsgBar").style.display = 'none';
            $("#pwdRcvryError").html("");
            $('#smartInstallErrMsgBar').removeClass('borderGreen');
          }, 10000);
        } else {
          $("#pwdRcvryError").html($filter('translate')('smart_install.change_password.test_email_failed'));
          document.getElementById("smartInstallErrMsgBar").style.display = 'flex';
        }
      },
      function (error) {
        $scope.status.processing = false;
        $("#pwdRcvryError").html($filter('translate')('smart_install.change_password.test_email_failed'));
        document.getElementById("smartInstallErrMsgBar").style.display = 'flex';
      });

    };

  }]);
