/**
 *
 * @copyright (c) 2015 Schneider Electric. All Rights Reserved.
 *   All trademarks are owned by  Schneider Electric Industries SAS or its affiliated companies.
 *
 * @fileOverview
 *
 * @description  This is the controller for the disclaimer HTML page.
 *
 * @version 0.1 Dec 21, 2015   Eddie Leung
 *   created
 *
*/

// Turn of linting, because this is old code ported from Linux and we don't have
// capacity to bring it up to standards.
/* eslint no-redeclare: 0, angular/di: 0, angular/angularelement: 0 */

/** Execute in strict mode */
"use strict";

var AUTHENTICATON_ERROR = 403;

/* Module dependency definitions */
angular
  .module("conext_gateway.disclaimer")
  .controller("disclaimerController", ["$scope", "$sessionStorage", "$window", "csbModal", "csbQuery", "$log", "$q", "redirectService",
  function ($scope, $sessionStorage, $window, csbModal, csbQuery, $log, $q, redirectService) {

    var warningCheck = false;
    var remoteUpgradeDisclaimer = false;
    var remoteMonitoringDisclaimer = false;
    var userName = "";
    var targetUrl = "/";

    /* Redirect to login page if user session is not active */
    if ($sessionStorage.userName) {
      userName = $sessionStorage.userName;
    } else {
      redirectService.redirectToLogin();
    }

    /* Administrator processing */
    if (userName === "Admin") {
      csbQuery.getObj("SERIALNUM,FRIENDLYNAME,ADMIN/WARNING/CHECK,ADMIN/DISCLCHECK,/REMOTEUPGRADE/DISCLAIMER")
        .then(function (data) {
          /* Assign system variables */
          $scope.productId = data.SERIALNUM;
          $scope.deviceName = data.FRIENDLYNAME;
          warningCheck = data.ADMIN_WARNING_CHECK ? true : false;
          remoteUpgradeDisclaimer = data.REMOTEUPGRADE_DISCLAIMER ? true : false;
          remoteMonitoringDisclaimer = data.ADMIN_DISCLCHECK ? true : false;

          /* Turn on and off disclaimer page */
          $scope.hazardWarning = !warningCheck;
          $scope.remoteUpgrade = (!remoteUpgradeDisclaimer || !warningCheck);
          $scope.remoteUpgradeChecked = remoteUpgradeDisclaimer;
          $scope.remoteMonitoring = !remoteMonitoringDisclaimer;
          $scope.remoteMonitorChecked = remoteMonitoringDisclaimer;

        }, function (error) {
          $log.error(error);
          /* Redirect to login page for authentication error */
          if (error.status === AUTHENTICATON_ERROR) {
            redirectService.redirectToLogin();
          }

        });
    } else {
      csbQuery.getObj("SERIALNUM,FRIENDLYNAME,USER/WARNING/CHECK,USER/DISCLCHECK")
        .then(function (data) {
          /* Assign system variables */
          $scope.productId = data.SERIALNUM;
          $scope.deviceName = data.FRIENDLYNAME;
          warningCheck = data.USER_WARNING_CHECK ? true : false;

          /* Turn on and off disclaimer page */
          $scope.hazardWarning = !warningCheck;
          $scope.remoteUpgrade = false;
          $scope.remoteMonitoring = false;

        }, function (error) {
          $log.error(error);
        });

    }

    /*========================================================================*/
    //fn  disclaimerAcceptClicked
    /*!

    This process the event when the disclamer acceptance button pressed.

    @return  null

    *//*
    REVISION HISTORY:

    Version: 1.01  Date: 19-Jan-2018   By: Eddie Leung
      - Changed SysVar name
    */
    /*========================================================================*/
    $scope.disclaimerAcceptClicked = function () {
      var requestObject = {};
      var defaultPassword = false;
      var smartInstall = false;

      if ($sessionStorage.userStatus) {
        defaultPassword = $sessionStorage.userStatus.defaultPassword;
        smartInstall = $sessionStorage.userStatus.smartInstall;
      }


      if (userName === "Admin") {
        /* Redirect according to warning check and Smart Install status */
        if (defaultPassword) {
          targetUrl = "/#/change_password";
        } else if (smartInstall) {
          targetUrl = "/#/smart_install/home";
        } else {
          targetUrl = "/";
        }

        /* Set the user acceptance check status before redirect */
        requestObject["ADMIN/WARNING/CHECK"] = 1;
        if ($scope.remoteMonitoring) {
          var remoteMonitorSysvarVal = $("#chkDisclaimer").prop('checked') === true ? 1 : 0;
          requestObject["ADMIN/DISCLCHECK"] = remoteMonitorSysvarVal;
          requestObject["/SCB/CNM/ENABLED"] = remoteMonitorSysvarVal;
        }
        if ($scope.remoteUpgrade) {
          var remoteUpgradeSysvarVal = $("#chkRemoteDisclaimer").prop('checked') === true ? 1 : 0;
          requestObject["REMOTEUPGRADE/DISCLAIMER"] = remoteUpgradeSysvarVal;
          requestObject["REMOTEUPGRADE/ENABLE"] = remoteUpgradeSysvarVal;
        }
      } else {

        if (defaultPassword) {
          targetUrl = "/#/change_password";
        } else {
          targetUrl = "/";
        }

        /* Set the user acceptance check status before redirect */
        requestObject["USER/WARNING/CHECK"] = 1;
      }
      /* Set the user acceptance status */
      csbQuery.setFromObject(requestObject, true).then(function (success) {
        redirectService.redirectTo(targetUrl);
      }, function (error) {
        $log.error(error);
      });

    };


  }]);

/* Services injected */


/**
 *
 * This controller function handles login page event processing and matches
 *   variables and functions to the login html.
 *
 * @param $scope  Angular service for HTML variable matching
 *
 * @param $sessionStorage   Angular service for local data storage
 *
 * @param $window   Url page redirection services.
 *
 * @param csbModal  Popup message processing.
 *
 * @param csbQuery  Conext Gateway query processing.
 *
 */


/**
 *
 * Disclaimer controller code end
 *
 */
