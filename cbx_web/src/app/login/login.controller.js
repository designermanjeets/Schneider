
/*==============================================================================

Copyright (c) 2016 Schneider Electric.

All Rights Reserved. All trademarks are owned by
Schneider Electric Industries SAS or its affiliated companies.

==============================================================================*/

/*!
 * @defgroup login
 *
 * @brief
 * Log in page functions
 *
 * @{
 */


/*============================================================================*/
/*!
 @file login.controller.js

 @brief
 Controller function for the login in web page.

 @details
 This is an Angular controller module for the login page.  It includes two
 controllers. One associates services to the login page.  The other manages
 modal html for locking the login after number of incorrect login attempts.

*/
/*============================================================================*/

// Old code uses the $inject style of di
/*eslint angular/di: [2,"$inject"]*/

/** Execute in strict mode */
"use strict";

/* login application module and dependence definitions */
angular.module('conext_gateway.login')
  .controller("loginController", loginController)
  .controller("lockTimeModalController", lockTimeModalController);

/* Services injected */
loginController.$inject = ["$scope", "$q", "$timeout", "$window", "$uibModal",
  "csbQuery", "loginService", "csbModal", "$log", "languageService", "redirectService"
];

lockTimeModalController.$inject = ['$scope', '$uibModalInstance', '$timeout',
  'lockTime'
];


/*============================================================================*/
//fn  loginController
/*!

Controller for the login page

This include functions to update data display on the login page. It also has
function to handle user events.

@param
  $scope
    Angular service for HTML variable matching

@param
  $q
    Angular service for process synchronization.

@param
  $timeout
    Time out processing.

@param
  $window
    Url page redirection services.

@param
  csbQuery
    Conext Gateway query processing.

@param
  loginService
    Login service functions.

@param
  csbModal
    Popup message processing.

*/
/*
REVISION HISTORY:

Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
  -Created
*/
/*============================================================================*/
function loginController($scope, $q, $timeout, $window, $uibModal, csbQuery,
  loginService, csbModal, $log, languageService, redirectService) {
  $log.debug("login controller start");

  /* User account lock out time */
  var lockTime = 0;
  /* Timer to clear error message */
  var errorTimer = null;
  /* Constant for error timeout */
  var ERROR_TIMEOUT = 10000;

  var modalInstance = null;
  $scope.isCloud = false;
  $scope.logintype = {
    'name': 'username'
  };

  $scope.changeRadio = function(value) {
    $scope.logintype.name = value;
  };
  /* Destroy all timer as page close */
  $scope.$on("$destroy", function(event) {
    $timeout.cancel(errorTimer);
    if (modalInstance) {
      modalInstance.dismiss("cancel ");
    }
  });

  /* Language pull down menu selected item */
  $scope.selectedLanguage = languageService.getCurrentLanguage();
  /* Language pull down menu list */
  $scope.languages = languageService.getAllLanguages();
  $scope.$watch('selectedLanguage', function() {
    languageService.changeLanguage($scope.selectedLanguage);
  });

  /* User pull down menu selected item */
  $scope.selectedUserName = null;

  $scope.ipaddr = "";
  $scope.txtSession = "";

  /* User pull down menu name list */
  $scope.users = [];

  /* Product serial number */
  $scope.productsn = null;

  /* Initialize processing message */
  $scope.loginMessage = "loading";

  /* Disable password */
  $scope.txtPasswordDisabled = true;

  /* Disable button */
  $scope.btnLoginDisabled = true;

  /* Clear password class */
  $scope.passwordClass = "";

  /* Get all user name */
  //var users = csbQuery.getUsers()
  //  .then(function (data) {
  //    $scope.users = data;
  //    $scope.selectedUserName = data[0];
  //  },
  //  function (error) {
  //    $log.error(error);
  //    return $q.reject("Failed to retrieve list of users");
  //  });

  ///* Get the serial number */
  //var serial = csbQuery.getSerialNum()
  //  .then(function (data) {
  //    $scope.lblProductId = data.SERIALNUM;
  //  },
  //  function (error) {
  //    $log.error(error);
  //    return $q.reject("Failed to retreive serial number");
  //  });

  ///* Get the number of login attempts */
  //var loginAttempts = csbQuery.getLoginAttempts()
  //  .then(function (data) {
  //    lockTime = loginService.getUserAccountLockTime(data.LOGIN_ATTEMPTS);
  //    $log.debug("Lock time: " + lockTime);
  //  },
  //  function (error) {
  //    $log.error(error);
  //    return $q.reject("Failed to retreive login attempts");
  //  });

  loginService.getLoginPageInfo().then(function(data) {
      $log.debug(JSON.stringify(data));
      //TODO enable other users after release
      $scope.users = [data.AUTH_ACCTNAME0, data.AUTH_ACCTNAME1, data.AUTH_ACCTNAME2];
      $scope.selectedUserName = data.AUTH_ACCTNAME0;
      $scope.lblProductId = data.SERIALNUM;
      $scope.friendlyName = data.FRIENDLYNAME;
      if(data.CLOUD) {
        $scope.isCloud = true;
      }
      lockTime = loginService.getUserAccountLockTime(data.LOGIN_ATTEMPTS);
      if (lockTime > 0) {
        /* User account lock out in effect, keep login disable until timeout */
        startLockOutTimer(lockTime);
      } else {
        /* Enable login */
        enableLogin();
      }

      /* Hide processing message */
      $scope.loginMessage = "";
    },
    function(error) {
      $log.error(error);
      $scope.loginMessage = "dataloaderror";
    });


  /* Wait for all query done */
  //$q.all([users, serial, loginAttempts]).then(function () {
  //  $log.debug("Got all data, lockTime: " + lockTime);
  //  if (lockTime > 0) {
  //    /* User account lock out in effect, keep login disable until timeout */
  //    startLockOutTimer(lockTime);
  //  }
  //  else {
  //    /* Enable login */
  //    enableLogin();
  //  }

  //  /* Hide processing message */
  //  $scope.loginMessage = "";

  //}, function (error) {
  //  /* Unable to load data */
  //  $log.error(error);
  //  $scope.loginMessage = "dataloaderror";
  //});


  /*========================================================================*/
  //fn  loginButtonClicked
  /*!

  Process the login in button clicked

  This performs the authentication as the login button clicked.  It calls
  service function to handle the authentication failure.  It calls another
  function to handle the success. The successful handling redirects to
  different pages according to user status.

  @param[in]
    userName
      User name.

  @param[in]
    password
      Password string.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  $scope.loginButtonClicked = function(userName, password) {

    if ($scope.isCloud && $scope.logintype.name === 'session') {
      loginService.processSessionLogin(userName, password).then(function(data) {
        if (data.result === "success") {
          if (data.alert) {
            csbModal.alert(data.alert).then(function() {
                if (data.nextPage) {
                  redirectService.redirectTo(data.nextPage);
                }
              },
              function(error) {
                $log.error("Failed to open alert modal");
              });
          } else {
            if (data.nextPage) {
              redirectService.redirectTo(data.nextPage);
            }
          }
        } else {
          setLoginFailure(data.lockTime, data.result);
        }
      });
    } else {
      loginService.processLogin(userName, password).then(function(data) {
        if (data.result === "success") {
          if (data.alert) {
            csbModal.alert(data.alert).then(function() {
                if (data.nextPage) {
                  redirectService.redirectTo(data.nextPage);
                }
              },
              function(error) {
                $log.error("Failed to open alert modal");
              });
          } else {
            if (data.nextPage) {
              redirectService.redirectTo(data.nextPage);
            }
          }
        } else {
          setLoginFailure(data.lockTime, data.result);
        }
      }, function(error) {
        $log.error("Error: " + error);
      });
    }

  };


  /*========================================================================*/
  //fn  forgotPasswordClicked
  /*!

  Process forgot password

  This manages the forgot password popup window.

  @param[in]
    userName
      User name.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  $scope.forgotPasswordClicked = function() {
    /* Get the email recipient email address */
    csbQuery.getMailerInfo()
      .then(function(data) {
          $log.debug(JSON.stringify(data));
          if (data.AUTHMAIL_RECIPIENT) {
            /* Prompt for recipient email address */
            csbModal.forgotPassword(data.AUTHMAIL_RECIPIENT)
              .then(function(result) {
                  $log.debug(result);
                  /* Clear error message */
                  $scope.loginMessage = "";
                  /* Show recovery mail loader */
                  $scope.pwdRecoveryMailLoader = true;
                  if (data.MAILER_ENABLE) {
                    /* Request to send password recovery Email */
                    csbQuery.sendPasswordRecoveryMail(
                        $scope.selectedUserName)
                      .then(function() {
                        /* email successfully sent */
                        csbModal.alert("passwordRecoveryMailSent");
                        $scope.loginMessage = "";
                        $scope.pwdRecoveryMailLoader = false;
                      }, function() {
                        /* Show email sending error */
                        failSendingRecoveryEmail("emailsenderror");
                      });
                  } else {
                    /* Mailer is not enabled */
                    failSendingRecoveryEmail("smtpdisabled");
                  }
                },
                function(error) {
                  $log.error(error);
                });
          } else {
            /* Email address required */
            csbModal.alert("passwordRecoveryMailRequired");
          }
        },
        function(error) {
          $log.error("Failed to get mailer info");
        });
  };


  /*========================================================================*/
  //fn  failSendingRecoveryEmail
  /*!

  Show error message for sending Recovery Email

  Display the error message and set up a timer to cancel the message after
  a certain time.

  @param[in]
    message
      The error message

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function failSendingRecoveryEmail(message) {
    $scope.loginMessage = message;
    $timeout.cancel(errorTimer);
    errorTimer = $timeout(function() {
      $scope.loginMessage = "";
    }, ERROR_TIMEOUT);
  }


  /*========================================================================*/
  //fn  setLoginFailure
  /*!

  Show login failure message.

  This displays the login error message.  Change the style of the login
    field, and setup timer to clear the message after a certain time.

  @param[in]
    lockTime
      The lock time to not allow the login.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  // Old code has shadowed variables, and we haven't got time to fix it
  // eslint-disable-next-line no-shadow
  function setLoginFailure(lockTime, error) {

    if (lockTime > 0) {
      /* Reset the account lock out timer */
      startLockOutTimer(lockTime);
    }

    /* Show error on login page */
    $scope.passwordClass = "borderRedLogin";
    $scope.txtpasswordStr = "";
    $scope.loginMessage = error;

    $timeout.cancel(errorTimer);
    errorTimer = $timeout(function() {
      $scope.passwordClass = "";
      $scope.loginMessage = "";
    }, ERROR_TIMEOUT);

  }


  /*========================================================================*/
  //fn  startLockOutTimer
  /*!

  Start the lock out count down.

  This shows a pop-up time to indicate lock out after some failure login
  attempts.  The pop-up includes a count down timer.

  @param[in]
    lockTime
      The lock time to not allow the login.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  // Old code has shadowed variables, and we haven't got time to fix it
  // eslint-disable-next-line no-shadow
  function startLockOutTimer(lockTime) {

    /* Disable the login */
    disableLogin();

    /* Open a Mobal window instance */
    modalInstance = $uibModal.open({
      animation: true,
      backdrop: "static",
      keyboard: false,
      templateUrl: "app/login/lockTimeModal.html",
      controller: lockTimeModalController,
      scope: $scope,
      resolve: {
        'lockTime': function() {
          return lockTime;
        }
      }
    });

    /* Lock out timeout processing */
    modalInstance.result.then(function() {
      /* At timeout, reset the number of attempts */
      csbQuery.setLoginAttempts();
      /* Delete the user account lock time */
      loginService.deleteUserAccountLockTime();
      /* Enable the login */
      enableLogin();
    }, function() {
      $log.error("Lock time modal dissmissed.");
    });

  }

  /*========================================================================*/
  //fn  enable Login
  /*!

  Enable login

  Clear any error message, enable the password field and the login button.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function enableLogin() {
    $scope.errorMessage = "";
    $scope.txtPasswordDisabled = false;
    $scope.btnLoginDisabled = false;
  }

  /*========================================================================*/
  //fn  Disable login field
  /*!

  Disable the login

  Disable the password entry field and login button.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function disableLogin() {
    $scope.txtPasswordDisabled = true;
    $scope.btnLoginDisabled = true;
  }

  $log.debug("login controller end");
}


/*===========================================================================*/
//fn  lockTimeModalController
/*!

Account lock up modal window controller.

@param[in]
  $scope
    HTML variable matching
@param[in]
  $uibModalInstance
    Angular service for modal instance management.

@param[in]
  $timeout
    Timeout management

@param[in]
   lockTime
     Start time for lock out count down


*/
/*
REVISION HISTORY:

Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
  -Created
*/
/*===========================================================================*/
function lockTimeModalController($scope, $uibModalInstance, $timeout,
  lockTime) {

  /* Counter start value */
  var counter = parseInt(lockTime / 1000);

  /* Timeout timer */
  var timer = null;

  /* The count down recursive function */
  var countdown = function() {

    if (counter > 0) {
      /* Keep counting */
      timer = $timeout(countdown, 1000);
      /* Count down */
      counter--;
      /* Update the count down value on popup */
      $scope.countdown = counter;
      $scope.$apply();
    } else {
      /* Close the pop up window and return success */
      $uibModalInstance.close("close");
    }

  };

  /* Destroy the timer when the browser refresh */
  $scope.$on("$destroy", function(event) {
    $timeout.cancel(timer);
  });

  /* Initialize the count down value on pop up window */
  $scope.countdown = counter;

  /* Start the count down */
  timer = $timeout(countdown, 1000);

}


/*! @}
 * end of login group */
