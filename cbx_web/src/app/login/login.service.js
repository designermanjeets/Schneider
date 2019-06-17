
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
 @file login.service.js

 @brief
 Service functions for login processing

 @details
 This provides service function required for login processing.  The processing
 includes login query, success and failure.  It also has functions to manage
 the lock out time after many incorrect attempts for login.

 REVISION HISTORY:

  Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
    -Created
  Version: 2.00  Date: 02-Feb-2016  By: Francesco Anzovino
    -Removed checkPassword from the login process

*/
/*============================================================================*/

// Turn of linting, because this is old code ported from Linux and we don't have
// capacity to bring it up to standards.
/* eslint-disable */

/** Execute in strict mode */
'use strict';

/** Angular module definitions */
angular
  .module('conext_gateway.login')
  .factory('loginService', loginService);

/** Service injection */
loginService.$inject = ['$sessionStorage',
  'queryService',
  '$q',
  'csbQuery',
  '$log',
  'objectFormatterService'
];


/*============================================================================*/
//fn  loginService
/*!

Service function for login

This service function returns an object that contains all the methods for
  login page start up and event processing.

@param
  $sessionStorage
    Angular service for local data storage

@param
  $q
    Angular service to handle asynchronous processing.

@param
  csbQuery
     Conext Gateway data query

@retval an object for all public methods.


*/
/*
REVISION HISTORY:

Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
-Created
*/
/*============================================================================*/
function loginService($sessionStorage, queryService, $q, csbQuery,
  $log, objectFormatterService) {

  /*! Maximum number of attempts */
  var MAX_NUM_ATTEMPTS = 3;
  /*! Account lock time */
  var ACCOUNT_LOCK_TIME = 60000;

  /* Returns object containing all public methods */
  var service = {
    processLogin: processLogin,
    checkPassword: checkPassword,
    deleteUserAccountLockTime: deleteUserAccountLockTime,
    setUserAccountLockTime: setUserAccountLockTime,
    getUserAccountLockTime: getUserAccountLockTime,
    getLoginPageInfo: getLoginPageInfo,
    processSessionLogin: processSessionLogin
  };

  return service;


  /*========================================================================*/
  //fn  processLogin
  /*!

  Process the login in

  This performs the login authentication .  It verifies the password and make
  the login query.  Then, it processes according to success or failure
  result.

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
  function processLogin(userName, password) {

    /* Initialize the return object */
    var retObj = {
      result: "success",
      lockTime: 0,
      alert: null,
      nextPage: null
    };

    /* Make the login query */
    return csbQuery.login(userName, password)
      .then(function(sessionId) {
        $log.debug("User: " + userName + ", password: " +
          password + ", session: " + sessionId);

        /* Processing the login success */
        return processLoginSuccess(userName, password)
          .then(function(data) {
              $log.debug(JSON.stringify(data));
              /* Assign the alert message and the redirect page */
              retObj.alert = data.alert;
              retObj.nextPage = data.nextPage;
              return retObj;
            },
            function(error) {
              $log.error(error);
              return $q.reject("Failed to process login success");
            });

      }, function(error) {
        /* Authentication error */
        $log.error("Authentication error");
        return processLoginFailure()
          .then(function(lockTime) {
              $log.debug("Lock time =" + lockTime);
              /* Assign the lock time and error message */
              retObj.lockTime = lockTime;
              retObj.result = "loginerror";
              return retObj;
            },
            function(error) {
              $log.error(error);
              return $q.reject("Failed to process login Failure");
            });
      });

  }

  function processSessionLogin(ipaddr, session) {
    /* Initialize the return object */
    var retObj = {
      result: "success",
      lockTime: 0,
      alert: null,
      nextPage: null
    };

    /* Make the login query */
    return csbQuery.login(ipaddr, session, true)
      .then(function(sessionId) {

        return processLoginSuccess("Admin", "")
          .then(function(data) {
              $log.debug(JSON.stringify(data));
              /* Assign the alert message and the redirect page */
              retObj.alert = data.alert;
              retObj.nextPage = data.nextPage;
              return retObj;
            },
            function(error) {
              $log.error(error);
              return $q.reject("Failed to process login success");
            });

      }, function(error) {
        /* Authentication error */
        $log.error("Authentication error");
        return processLoginFailure()
          .then(function(lockTime) {
              $log.debug("Lock time =" + lockTime);
              /* Assign the lock time and error message */
              retObj.lockTime = lockTime;
              retObj.result = "loginerror";
              return retObj;
            },
            function(error) {
              $log.error(error);
              return $q.reject("Failed to process login Failure");
            });
      });
  }



  /*========================================================================*/
  //fn  processLoginFailure
  /*!

  Log in failure processing

  This processes the authentication failure.  It manages the incorrect login
  attempts and decides on the account lock out time.

  retval object to indicate success of failure result from server.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function processLoginFailure() {

    /* Account lockout time */
    var lockTime = 0;

    /* Defer promise */
    var queryResult = $q.defer();

    /* Query the number of login attempts */
    csbQuery.getLoginAttemptsTime().then(function(data) {
      if (data.LOGIN_ATTEMPTS < MAX_NUM_ATTEMPTS) {
        /* Increment the login attempts */
        data.LOGIN_ATTEMPTS++;
      }

      if (data.LOGIN_ATTEMPTS >= MAX_NUM_ATTEMPTS) {
        /* Too many login attempts, set the lock out time to maximum */
        lockTime = ACCOUNT_LOCK_TIME;
        setUserAccountLockTime();
      }

      /* Set the new login number of attempts */
      csbQuery.setLoginAttempts(data.LOGIN_ATTEMPTS,
        data.TIME_LOCAL_ISO_STR).then(function(response) {
        /* Return the lockout time */
        queryResult.resolve(lockTime);
      }, function(error) {
        /* Return failure */
        $log.error(error);
        queryResult.reject(error);
      });

    }, function(error) {
      $log.error(error);
      /* Cannot get the number of attempts, return error */
      queryResult.reject(error);
    });

    /* Return the deferred promise */
    return queryResult.promise;

  }


  /*========================================================================*/
  //fn  processLoginSuccess
  /*!

  Log in success processing

  This processes the authentication success result.  It acquires the user
  status and determines the action after.

  @param[in]
    userName
      User name.

  @param[in]
    password
      Password string.


  retval function to determine to get the next alert and/or page redirection
    action.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function processLoginSuccess(userName, password) {

    /* Record the user name for other html page */
    $sessionStorage.userName = userName;
    $log.debug("------ UserName : " + userName);
    $log.debug("------ Session Username : " + $sessionStorage.userName);
    var userStatus = {};

    /* Reset the login attempts to 0 */
    var resetLoginAttempts = csbQuery.setLoginAttempts();

    var getUserStatus = analyzeUserStatus(userName, password);

    /* Wait for http processing done and return object for user info */
    return $q.all([resetLoginAttempts, getUserStatus])
      .then(function(response) {
          $log.debug(JSON.stringify(response));
          return getUserAction(response[1]);
        },
        function(error) {
          $log.error(error);
          return $q.reject("Failed to reset login attempts and get user status");
        });
  }



  /*========================================================================*/
  //fn  getUserStatus
  /*!

  Get the user login status.

  The acquires and summaries user status for password default, SmartInstall,
    disclaimer, device count, etc.

  @param[in]
    userName
      User name.


  retval object summaries all the user status.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created

    Version: 1.01  Date: 17-Nov-2017  By: Trevor Monk
      - Changed system variable names to use slashes instead of dots

    */
  /*========================================================================*/
  function analyzeUserStatus(userName, password) {
    var deferred = $q.defer();
    /* Initialize the return user status object */
    var userStatus = {
      userName: userName,
      defaultPassword: false,
      disclaimer: false,
      smartInstall: false
    };

    delete $sessionStorage.userStatus;

    /* Assign the user status */
    /* Calculate total device count */


    csbQuery.getObj('/SCB/PASSWD/CHANGEREQ').then(function(defaultPasswords) {
      if (defaultPasswords) {
        userStatus.defaultPassword = true;
        $sessionStorage.userStatus = userStatus;
        deferred.resolve(userStatus);
      } else {
        csbQuery.getUserStatus(userName).then(function(data) {
          var totalDeviceCount = data.TOTAL_DEVICE_COUNT_PORTA +
            data.TOTAL_DEVICE_COUNT_PORTB;

          /* Disclaimer flag */
          if (data.ADMIN_WARNING_CHECK === 0) {
            userStatus.disclaimer = true;
          }

          /* Smart install status */
          if (data.SMARTINSTALL_STATUS === 0) {
            userStatus.smartInstall = true;
          }
          $sessionStorage.userStatus = userStatus;
          deferred.resolve(userStatus);
        }, function(error) {
          deferred.reject(error);
        });
      }
    });
    return deferred.promise;
  }


  /*========================================================================*/
  //fn  getUserAction
  /*!

  Get the required action after a successful login

  This determines the action based on the user status. Actions include the
  alert message and the page redirection.


  @param[in]
    userStatus
      User status summary info.


  retval object including alert mesage and redirection page.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function getUserAction(userStatus) {
    var userAction = {
      alert: null,
      nextPage: null
    };

    if (userStatus.defaultPassword) {
      userAction.alert = "defaultLoginPassword";
      userAction.nextPage = "/#/change_password";
      return userAction;
    }

    if (userStatus.userName === 'Guest' && userStatus.smartInstall) {
      userAction.alert = "smartInstallSetup";
      userAction.nextPage = "/";
      return userAction;
    }

    if (userStatus.userName === 'User' && userStatus.smartInstall) {
      userAction.alert = "smartInstallSetup";
      if (userStatus.disclaimer) {
        userAction.nextPage = "/#/disclaimer";
      } else {
        userAction.nextPage = "/";
      }
      return userAction;
    }


    if (userStatus.disclaimer) {
      userAction.nextPage = "/#/disclaimer";
    } else if (userStatus.smartInstall) {
      if (userStatus.userName !== "Admin") {
        userAction.alert = "smartInstallSetup";
      } else {
        userAction.nextPage =
          "/#/smart_install/home";
      }
    } else {
      userAction.nextPage = "/";
    }

    return userAction;
  }


  /*========================================================================*/
  //fn  CheckPassword
  /*!

  Check for valid password

  This uses regular expresssion to validate the password.


  @param[in]
    str
      The password string.

  retval true or false.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function checkPassword(str) {
    if (str === undefined) {
      return false;
    }

    /* /^       Start
    /* (?.=*\d)   Must contain one digit from 0-9 */
    /* (?=.*[A-Z])  Must contain one upper case character */
    /* .      Match anything with previous condition checking */
    /* {6,20}     Length at least 6 characters and maximum of 20 */
    /* $/       End */
    var re = /^(?=.*\d)(?=.*[A-Z]).{6,12}$/;
    return re.test(str);
  }


  /*========================================================================*/
  //fn  deleteUserAccountLockTime
  /*!

  Delete the Lock time variable from storage

  This removes the user lock time variable from the local storage.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function deleteUserAccountLockTime() {
    delete $sessionStorage.userAccountLockTime;
  }


  /*========================================================================*/
  //fn  setUserAccountLockTime
  /*!

  Set the user account lock time

  This set the user accout lock time to the current time.  The lock time is
    saved in the local storage.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function setUserAccountLockTime() {
    var nowTime = (new Date().valueOf());
    $sessionStorage.userAccountLockTime = nowTime;
  }


  /*========================================================================*/
  //fn  getUserAccountLockTime
  /*!

  Get user account lock time

  The checks the number of incorrect login in, compare the difference between
    the stored time and the current time, the return time left for locking.

  retval lock time left in ms.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/


  /**
   *
   * Get the user account lock time
   *
   * @param   numAttempts Number of attempts.
   *
   */
  function getUserAccountLockTime(numAttempts) {
    /* Get the account lock time only if the number of attempts exceeds the maximum */
    if (numAttempts >= MAX_NUM_ATTEMPTS) {

      /* The current time */
      var nowTime = (new Date().valueOf());

      if ($sessionStorage.userAccountLockTime === undefined) {
        /* Variable is not in the local storage */

        /* Set to the current time */
        $sessionStorage.userAccountLockTime = nowTime;

        /* Return the maximum lock time */
        return ACCOUNT_LOCK_TIME;
      } else {
        /* Get the lock time from local storage */
        var storedTime = $sessionStorage.userAccountLockTime;
        $log.debug("Now: " + nowTime + ", Last: " + storedTime);

        /* Calculate time passed */
        var timePassed = nowTime - storedTime;

        $log.debug("Time passed: ", timePassed);

        if (timePassed > ACCOUNT_LOCK_TIME) {
          /* Time passed exceeds the maximum */
          return 0;
        } else {
          /* Return the time difference */
          return ACCOUNT_LOCK_TIME - timePassed;
        }

      }
    } else {
      return 0;
    }
  }

  /*========================================================================*/
  //fn  getLoginPageInfo
  /*!

  Get login page information

  The getLoginPageInfo function gets the information used to populate the
  login page via the ns_fcgi query interface.

  @return an object containing the following data items:
            LOGIN_ATTEMPTS
            TIME_LOCAL_ISO_STR
            SERIALNUM
            FRIENDLYNAME
            AUTH_ACCTNAME0
            AUTH_ACCTNAME1
            AUTH_ACCTNAME2

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created

    Version: 1.01  Date: 13-Dec-2017  By: Trevor Monk
      - Modified to use the queryService

    */
  /*========================================================================*/
  function getLoginPageInfo() {
    var queryVars = ['LOGIN/ATTEMPTS', 'TIME/LOCAL_ISO_STR', 'SERIALNUM',
      'FRIENDLYNAME', 'AUTH/ACCTNAME0', 'AUTH/ACCTNAME1',
      'AUTH/ACCTNAME2'
    ];

    return queryService.getSysvars(queryVars, {
      authenticate: false,
      cloudCheck: true
    });
  }

}
