"use strict";

angular.module('conext_gateway.utilities').factory('emailTestService', [
  'csbQuery', '$interval',
  function (csbQuery, $interval) {
    var service = {
      testEmail: testEmail
    };

    /*========================================================================*/
    //fn  testEmail
    /*!

    Send a test E-Mail

    This builds the Test Mail SysVar list.  It then sends the list to conext_gateway to
    update the SysVar values.  The change of SysVar values will trigger the
    Test E-Mail testing.

    @param[in]
      emailData
        The mail data information.

    @param[in]
      $scope
        HTML scope variables

    *//*
    REVISION HISTORY:

    Version: 1.01  Date: 5-Jan-2018  By: Eddie Leung
      - Revised SysVar names

    */
    /*========================================================================*/
    function testEmail(emailData, $scope, callback) {
      var requestObject = {};
      var ordering = [];
      var handler;

      /* Set Mailer test SysVars */
      requestObject["MAILER/TEST/SERVER_NAME"] = emailData.smtpServer;
      requestObject["MAILER/TEST/SERVERPORT"] = emailData.smtpPort;
      requestObject["MAILER/TEST/USERID"] = (emailData.emailUserName === null || emailData.emailUserName === undefined) ? " " : emailData.emailUserName;
      requestObject["MAILER/TEST/PASSWORD"] = (emailData.emailPassword === null || emailData.emailPassword === undefined) ? " " : emailData.emailPassword;
      requestObject["SENDMAIL/RECIPIENTS"] = emailData.testEmail;
      requestObject["MAILER/TEST_REQUEST"] = 1;

      /* Define SysVar ordering */
      ordering.push("MAILER/TEST/SERVER_NAME");
      ordering.push("MAILER/TEST/SERVERPORT");
      ordering.push("MAILER/TEST/USERID");
      ordering.push("MAILER/TEST/PASSWORD");
      ordering.push("SENDMAIL/RECIPIENTS");
      ordering.push("MAILER/TEST_REQUEST");

      /* Send the SysVar list to conext_gateway */
      csbQuery.setFromObject(requestObject, false, ordering).then(function() {
        /* Keep waiting for reply until success or failure */
        handler = $interval(function () {
          csbQuery.getObj("MAILER/TEST_REPLY").then(function (data) {
            if (data.MAILER_TEST_REPLY === 'eFail') {
              /* Failure return */
              $interval.cancel(handler);
              callback('Fail');
            }
            else if (data.MAILER_TEST_REPLY === 'eSuccess') {
              /* Success return */
              $interval.cancel(handler);
              callback('Success');
            }
          },
          /* Error reading Test Reply SysVar */
          function(error) {
            callback("Fail");
          });
        }, 5000);

        /* Cancel the interval handler */
        var dereg = $scope.$on("$destroy", function () {
          if (handler) {
            $interval.cancel(handler);
            handler = null;
            dereg();
          }
        });
      },
      /* Unable to set SysVars */
      function(error) {
        callback("Fail");
      });
    }

    return service;
  }
]);
