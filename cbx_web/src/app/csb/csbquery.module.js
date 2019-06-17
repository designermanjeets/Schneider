
/*==============================================================================

Copyright (c) 2016 Schneider Electric.

All Rights Reserved. All trademarks are owned by
Schneider Electric Industries SAS or its affiliated companies.

==============================================================================*/

/*!
 * @defgroup csbquery
 *
 * @brief
 * factory module for functions to access data from Conext Gateway
 *
 * @{
 */

/*============================================================================*/
/*!
 @file csbquery.module.js

 @brief
 functions to query conext gateway data.

 @details
 This is a factory module that returns collection of functions for accessing
 Conext Gateway data through HTTP. This include the basic get and set functions.
 A higher level get function returns data in object form.  Other high level
 get and set function aimed to make easy the access the specific data.

*/
/*============================================================================*/

// Turn of linting, because this is old code ported from Linux and we don't have
// capacity to bring it up to standards.
/* eslint no-unused-vars:0, angular/typecheck-object:0, angular/di: 0 */


/** Execute in strict mode */
'use strict';

/*! Timeout waiting for HTTP reply */
var RETRY_TIMEOUT = 5000;

/*! Maximum number of retry */
var MAX_RETRY = 5;

/** Angular module and injection definitions */
angular
  .module('csbQueryModule', ['conext_gateway.utilities'])
  .factory('csbQuery', csbQuery);


csbQuery.$inject = ['$http', '$q', '$timeout', '$log', '$rootScope', 'responseErrorCheckerService', '$window', 'redirectService', 'otkService'];


/*============================================================================*/
//fn  nsfcgi_getSysVarNameFromFile
/*!

Factory class for Conext Gateway data query

This factory function returns an object that contains all the methods for
access Conext Gateway data and other functionality

@param[in]
  $http
    Angular service to read data from remote server

@param[in]
  $q
    Angular service to handle asynchronous processing.

@param[in]
  $timeout
    Angular service for timout processing.

@retval object for all public methods.

*/
/*
REVISION HISTORY:

Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
  -Created
*/
/*============================================================================*/

function csbQuery($http, $q, $timeout, $log, $rootScope, responseErrorCheckerService, $window, redirectService, otkService) {


  /* Returns object containing all public methods */
  var service = {
    login: login,
    logout: logout,
    getGraphData: getGraphData,
    changePassword: changePassword,
    setLoginAttempts: setLoginAttempts,
    getUserStatus: getUserStatus,
    getLoginAttemptsTime: getLoginAttemptsTime,
    getLoginAttempts: getLoginAttempts,
    getUsers: getUsers,
    getSerialNum: getSerialNum,
    getMailerInfo: getMailerInfo,
    sendPasswordRecoveryMail: sendPasswordRecoveryMail,
    set: set,
    get: get,
    getObj: getObj,
    getMatch: getMatch,
    getObjFromScript: getObjFromScript,
    checkConnection: checkConnection,
    hasRebootFinished: hasRebootFinished,
    setFromObject: setFromObject
  };

  return service;


  /*========================================================================*/
  //fn  login
  /*!

  Perform the login operation

  This sends user name and password to server for authentication

  @param[in]
    userName
      User name.

  @param[in]
    password
      Password string.

  @retval success: session Id.
  @retval failure: error message.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created

    */
  /*========================================================================*/
  function login(userName, password, isSessionLogin) {
    return request("/auth", "username=" + userName + "&password=" + password + ((isSessionLogin) ? "&session=true" : ""))
      .then(function(response) {
          /* Check for valid session ID */
          if (response.hasOwnProperty('session') === false) {
            /* Return error if session ID is not defined */
            return $q.reject("Session ID not defined");
          } else {
            /* Return the session ID */
            return response.session;
          }
        },
        function(error) {
          $log.error(error);
          return $q.reject("Login has failed");
        });
  }


  /*========================================================================*/
  //fn  logout
  /*!

  Request server to log out session.

  This makes a http request to the Conext Gateway to logout from the current
  active session.  User must log in before it can log out.


  @retval http request function result.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function logout() {
    return request("/logout", " ");
  }


  /*========================================================================*/
  //fn  getGraphData
  /*!

  Request graph data from data log file

  This makes a http request to Conext Gateway obtaining graph data from data log
  file.

  @param[in]
    file
      File name in the form of "filename.ext".  The "ext" specifies the
      data type; log, 15min, daily, monthly, yearly, etc.

  @param[in]
    fields
      Specifies parameters in a comma separated list.

  @param[in]
    start
      Start time in utc seconds

  @param[in]
      End time in utc seconds.


  @retval http request function result.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Feb-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/

  function getGraphData(deviceId, dataType, fields, startTime, endTime, startType) {
    var url = "/datalog";

    // Required fields
    var urlParams =
      "device=" + deviceId +
      "&type=" + dataType;

    // Optional fields
    if (angular.isArray(fields) && fields.length > 0) {
      // The API expects fields to NOT be URI encoded,
      // even though they contain spaces.
      urlParams += "&fields=" + fields.join(",")
    }

    if (angular.isDefined(startTime)) {
      switch (startType) {
        case 'onOrBefore':
          urlParams += "&startBefore=" + startTime;
          break;

        default:
          $log.error("Unknown start type: " + startType);
          // fall through
        case 'onOrAfter':
          urlParams += "&start=" + startTime;
          break;
      }
    }

    if (angular.isDefined(endTime)) {
      urlParams += "&end=" + endTime;
    }

    return request(url, urlParams);
  }


  /*========================================================================*/
  //fn  changePassword
  /*!

  Change the password.

  This sends a http request to change the password. The request includes the
  user name, old password and the new password. Server verifies the old
  password and then change to the new  password.

  @param[in]
    userName
      User name.

  @param[in]
    oldPassword
      The old password.

  @param[in]
    newPassword
      The new password.


  @retval success: the new session ID.
  @retval failure: http error message or password change failure.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created

    Version: 1.01  Date: 02-Feb-2016  By: Francesco Anzovino
      -Updated request string and removed check for new Session ID in reply

    Version: 1.02  Date: 17-Nov-2017  By: Trevor Monk
      -Changed variable name delimeter from dot to forward-slash

    */
  /*========================================================================*/
  function changePassword(userName, oldPassword, newPassword) {
    return getObj('/SCB/RESETPW/DEFAULT').then(function(data) {
      var defaults = setDefaultPasswordSysVar(userName, data.SCB_RESETPW_DEFAULT);


      return request("/changepassword", "username=" + userName + "&oldpassword=" +
        oldPassword + "&password=" + newPassword).then(function() {
        setFromObject({
          '/SCB/RESETPW/DEFAULT': defaults
        });
      });
    });


  }

  function setDefaultPasswordSysVar(username, sysvar) {
    if (username === 'Admin') {
      return '0' + sysvar.charAt(1) + sysvar.charAt(2);
    } else if (username === 'User') {
      return sysvar.charAt(0) + '0' + sysvar.charAt(2);
    } else {
      return sysvar.charAt(0) + sysvar.charAt(1) + '0';
    }
  }

  /*========================================================================*/
  //fn  setLoginAttempts
  /*!

  Reset the login attempts

  This sends a http request reset the login attempt count and failed attempt
  time stamp.

  To do: we need eliminate this Set function. Therefore, client should not
  able to set SysVar with authentication.  The attempt reset should be done
  on server.

  @param[in]
    loginAttempts
      Login attempt count.

  @param[in]
    timeStamp
      The last failed attempt timeStamp.

  @retval result from http request

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created

    Version: 1.01  Date: 17-Nov-2017  By: Trevor Monk
      -Changed variable name delimeter from dot to forward-slash

    */
  /*========================================================================*/
  function setLoginAttempts(loginAttemps, timeStamp) {

    /* Default number of log in attempts is 0 */
    if (loginAttemps === undefined) {
      loginAttemps = 0;
    }

    /* Default timeStamp string */
    if (timeStamp === undefined) {
      timeStamp = "none";
    }

    /* Return function call to set the login attempt without
       authentication */
    return set("LOGIN/ATTEMPTS=" + loginAttemps +
      "&FAILED_ATTEMPT/TIMESTAMP=" + timeStamp, "/ns/set");
  }


  /*========================================================================*/
  //fn  getUserStatus
  /*!

  Get the user's Disclaimer Acknowledgment and SmartInstall status as well as
  the device count.

  This build the sysvar list according to the user name. Only the Disclaimer
  Acknowledgment SysVar name is user specific. This SysVar includes also the
  SmartInstall status and device count on Port A and B.


  @param[in]
    userName
      User name.

  @retval success: SysVar name and value pair object.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created

    Version: 1.01  Date: 17-Nov-2017  By: Trevor Monk
      -Changed variable name delimeter from dot to forward-slash

    */
  /*========================================================================*/
  function getUserStatus(userName) {

    /* Determine the disclaimer SysVar name according to user name */
    var disclaimerCheckSysVar = "ADMIN/WARNING/CHECK,ADMIN/DISCLCHECK,REMOTEUPGRADE/DISCLAIMER";
    if (userName !== "Admin") {
      disclaimerCheckSysVar = "USER/WARNING/CHECK";
    }

    /* Request Disclaimer, SmartInstall and device count from Conext Gateway */
    var nameList = disclaimerCheckSysVar + ",SMARTINSTALL/STATUS,TOTAL/DEVICE/COUNT/PORTA,TOTAL/DEVICE/COUNT/PORTB";

    /* Return all requests SysVar name and value pairs in an object. */
    return getObj(nameList);
  }


  /*========================================================================*/
  //fn  getLoginAttemptsTime
  /*!

  Get the login attempt count and the current time.

  This makes a http request get the login attempt count and the current time


  @retval success: SysVar name and value pair object.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created

    Version: 1.01  Date: 16-Nov-2017  By: Trevor Monk
      - Replaced dots with slashes in variable names

    */
  /*========================================================================*/
  function getLoginAttemptsTime() {
    return nsGetObj("LOGIN/ATTEMPTS,TIME/LOCAL_ISO_STR");
  }


  /*========================================================================*/
  //fn  getUser
  /*!

  Get all user names from Conext Gateway

  This makes a http request for all the three user name from Conext Gateway.


  @retval success: array of user name (Not object!)
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created

    Version: 1.01  Date: 16-Nov-2017  By: Trevor Monk
      - Replaced dots with slashes in variable names

    */
  /*========================================================================*/
  function getUsers() {
    var numRetry = 5;
    return getByNameList("AUTH/ACCTNAME0,AUTH/ACCTNAME1,AUTH/ACCTNAME2",
      "/ns/get", "name", numRetry).then(function(data) {
        return data.values;
      },
      function(error) {
        $log.error(error);
        return $q.reject("Failed to retreive users");
      });
  }


  /*========================================================================*/
  //fn  getSerialNum
  /*!

  Get the serial number from Conext Gateway

  This makes a http request for the serial number without authentication.


  @retval success: SysVar name and value.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function getSerialNum() {
    return nsGetObj("SERIALNUM");
  }


  /*========================================================================*/
  //fn  getLoginAttempts
  /*!

  Get the login attempt count

  This makes a http request the login attempt count without authentication.

  @retval success: SysVar name and value.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created

    Version: 1.01  Date: 16-Nov-2017  By: Trevor Monk
      - Replaced dots with slashes in variable names

    */
  /*========================================================================*/
  function getLoginAttempts() {
    return nsGetObj("LOGIN/ATTEMPTS");
  }

  /*========================================================================*/
  //fn  getMailerInfo
  /*!

  Get recipient and mail settings for sending a password recovery e-mail.

  @retval success: SysVar name and value.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 8-Mar-2016  By: Evan Dickinson
      -Created

    Version: 1.01  Date: 16-Nov-2017  By: Trevor Monk
      - Replaced dots with slashes in variable names

    */
  /*========================================================================*/

  function getMailerInfo() {
    return nsGetObj("AUTHMAIL/RECIPIENT,MAILER/ENABLE");
  }


  /*========================================================================*/
  //fn  sendPasswordRecoveryMail
  /*!

  Request to send a password recovery mail.

  To do: Need a Lua script to send e-mail


  */
  /*========================================================================*/
  function sendPasswordRecoveryMail(userName) {
    $log.debug(userName);
    return $http.post('/generatehash', "username=" + userName);
  }


  /*========================================================================*/
  //fn  set
  /*!

  Set SysVar values.

  This takes a list of SysVar name and value pairs.  Then it sets the SysVar
  value accordingly. The argument "script" is optional and that allows to call
  different script for setting the SysVar.

  @param[in]
    nameValuePairs
      list of name value pairs.

  @param[in]
    script
      Name of the script to set the SysVar.

  @retval success: data indicate all the settings are OK.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function set(nameValuePairs, script) {
    if (script === undefined) {
      script = "/set";
    }

    return $http.post(script, nameValuePairs, {
      headers: {
        'otk': otkService.getOTK()
      }
    }).then(function(response) {
      if (response.data !== undefined && response.data.OTK !== undefined) {
        otkService.setOTK(response.data.OTK);
      }

      if (responseErrorCheckerService.hasError(response)) {
        return $q.reject("Failed to set sysvars");
      }
      return response;
    }, function(error) {
      if (error.status === 401) {
        redirectService.redirectToLogin();
      }
      $log.error(error);
      return $q.reject("Failed to set values: " + nameValuePairs);
    });
  }


  /*========================================================================*/
  //fn  get
  /*!

  Get SysVar value

  This takes a list of SysVar name get all the SysVar values from Conext Gateway.
  The argument "retry" is optional.

  @param[in]
    names
      list of SysVar name separated by comma

  @param[in]
    retry
      Number of retry, optional


  @retval success: data in array.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function get(names, retry) {

    return getByNameList(names, "/vars", "name", retry);

  }


  /*========================================================================*/
  //fn  getObj
  /*!

  Get SysVar value

  This takes a list of SysVar name get all the SysVar values from Conext Gateway.
  The return is in object form. The SysVar is the object key to access the
  value.

  @param[in]
    nameList
      list of SysVar name separated by comma

  @retval success: data in array.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function getObj(nameList) {
    return getObjByNameList(nameList);
  }


  /*========================================================================*/
  //fn  getMatch
  /*!

  Get SysVar by matching a keyword

  This requests all SysVar by matching the keyword to the SysVar name.

  The return is in object form. The full SysVar name is the object key to
  access the value.

  @param[in]
    keyword
      The keyword for matching the SysVar name.

  @retval success: data in json object form.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Feb-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function getMatch(keyword) {
    return getByNameList(keyword, "/vars", "match");
  }


  /*========================================================================*/
  //fn  nsGetObj
  /*!

  Get SysVar value without authentication.

  This takes a list of SysVar name get all the SysVar values from Conext Gateway.
  Authentication is not needed.  Though, only a limit number of SysVar can
  be accessed.

  @param[in]
    nameList
      list of SysVar name separated by comma
  @param[in]
    retry
      Number of rety attemps, optional.


  @retval success: object with SysVar name as key for value.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function nsGetObj(nameList, retry) {
    return getObjByNameList(nameList, "/ns/get", "name", retry);
  }


  /*========================================================================*/
  //fn  getObjByNameList
  /*!

  Get SysVar value in object form

  This takes a list of SysVar name get all the SysVar values from Conext Gateway.
  The argument script, action and retry are optional giving the call the
  flexibility.


  @param[in]
    nameList
      list of SysVar name separated by comma

  @param[in]
    script
      Script for the get operation, optional

  @param[in]
    action
      Type of operation, optional

  @param[in]
    retry
      Number of rety attemps, optional.


  @retval success: object with SysVar name as key for value.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created

    Version: 1.01  Date: 16-Nov-2017  By: Trevor Monk
      -replace '.' and '/' with '_' in the var name

    */
  /*========================================================================*/
  function getObjByNameList(nameList, script, action, retry) {
    return getByNameList(nameList, script, action, retry)
      .then(function(data) {
          if (data.count <= 0) {
            return null;
          }

          var retObj = {};
          var metaData = {};
          angular.forEach(data.values, function(item, key) {
            var name = item.name.replace(/[\.\/]/g, "_");
            name = name.replace(/^_/g, "");
            retObj[name] = item.value;
            metaData[name] = item.quality;
          });
          retObj['META'] = metaData;
          $log.debug(JSON.stringify(retObj));
          return retObj;
        },
        function(error) {
          $log.error(error);
          if (error.status === 401) {
            redirectService.redirectToLogin();
            return $q.reject("401");
          } else {
            return $q.reject("Failed to retreive object: " + nameList);
          }
        });
  }


  /*========================================================================*/
  //fn  getByNameList
  /*!

  Get SysVar value

  This takes a list of SysVar name get all the SysVar values from Conext Gateway.
  The argument script, action and retry are optional giving the call the
  flexibility.


  @param[in]
    nameList
      list of SysVar name separated by comma

  @param[in]
    script
      Script for the get operation, optional

  @param[in]
    action
      Type of operation, optional

  @param[in]
    retry
      Number of rety attemps, optional.


  @retval success: data array return from server.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function getByNameList(nameList, script, action, retry) {
    var maxRetry = 10;

    if (script === undefined) {
      script = "/vars";
    }

    if (action === undefined) {
      action = "name";
    }

    if ((retry === undefined) || (retry < 1)) {
      retry = 0;
    } else if (retry > maxRetry) {
      retry = maxRetry;
    }

    var urlParams = action + "=" + nameList;
    if (retry > 1) {
      return retryRequest(script, urlParams, retry);
    } else {
      return request(script, urlParams);
    }
  }


  /*========================================================================*/
  //fn  reTryRequest
  /*!

  Make http request with retry

  This makes http request. It retries the request for a maximum attempts
  in case of failure.  Note that this delays the return until all the
  retry attempts are done.


  @param[in]
    url
      The full url path for the request.

  @param[in]
    count
      The maximum number of retry.


  @retval success: data array return from server.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function retryRequest(url, urlParams, count) {
    if (typeof(urlParams) === 'undefined') {
      urlParams = " ";
    }
    /* Use the defer object to synchronize retry request */
    var queryResults = $q.defer();

    /* Query data with retry */
    function doQuery() {
      $log.debug("Retry: " + count);
      request(url, urlParams).then(function(data) {
        /* Success result */
        queryResults.resolve(data);
      }, function(response) {
        if (count > 0) {
          /* Keep trying until the count reach 0 */
          count--;
          $log.log("Timeout executed", Date.now());
          $timeout(function() {
            doQuery();
          }, RETRY_TIMEOUT);
        } else {
          /* Failure result */
          queryResults.reject(response);
        }
      });
    }

    /* Make the data request */
    doQuery();

    /* Return the query promise result */
    return queryResults.promise;
  }


  /*========================================================================*/
  //fn  request
  /*!

  Base http request.

  This the base HTTP request function. It sends the URL and wait for response.
  If the response data is not object, this considers that as error too.


  @param[in]
    url
      The full url path for the request.

  @retval success: data array return from server.
  @retval failure: http or data error.

  */
  /*
    REVISION HISTORY:

    Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
      -Created
    */
  /*========================================================================*/
  function request(url, urlParams) {
    $log.debug("url: " + url);
    if (typeof(urlParams) === 'undefined') {
      urlParams = " ";
    }
    /* Call the http get function */
    return safeApply(function() {
      return $http.post(url, urlParams, {
          headers: {
            'otk': otkService.getOTK()
          }
        })
        .then(function(response) {
          if (response.data !== undefined && response.data.OTK !== undefined) {
            otkService.setOTK(response.data.OTK);
          }

          if (url !== '/datalog') { // data log is too huge to print
            $log.debug(JSON.stringify(response.data));
          }

          /* Check the response data */
          if (typeof response.data === 'object') {
            /* Return data */
            return response.data;
          } else {
            /* Data is invalid, return failure */
            $log.debug("Data is not an object");
            return $q.reject(response);
          }
        }, function(response) {
          if (response.status === 401 && url !== "/auth") {
            redirectService.redirectToLogin();
          }
          /* Unable to get data */
          $log.error(JSON.stringify(response));
          return $q.reject(response);
        }).catch(function(error) {
          $log.error("error");
          return $q.reject(error);
        });
    });
  }

  function safeApply(fn) {
    // eslint-disable-next-line angular/no-private-call
    var phase = $rootScope.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && angular.isFunction(fn)) {
        return fn();
      }
    } else {
      return $rootScope.$apply(fn);
    }
  }

  function getFromScript(nameList, script, retry) {
    var maxRetry = 10;

    if (script === undefined) {
      script = "/vars";
    }

    if ((retry === undefined) || (retry < 1)) {
      retry = 0;
    } else if (retry > maxRetry) {
      retry = maxRetry;
    }

    if (retry > 1) {
      return retryRequest(script, nameList, retry);
    } else {
      return request(script, nameList);
    }
  }

  function getObjFromScript(names, script) {

    return getFromScript(names, script)
      .then(function(data) {
          if (data.count <= 0) {
            return [];
          }
          return data;
        },
        function(error) {

          if (error.status === 401) {
            redirectService.redirectToLogin();
          }
          $log.error(error);
          return $q.reject("Failed to get object from script");
        });
  }

  function hasRebootFinished() {
    var query = "name=TIME/LOCAL_ISO_STR";
    var options = {
      timeout: 20 * 1000,
      responseType: 'json',
    };
    return $http.post('/ns/get', query, options);
  }

  function checkConnection() {
    return getObj("TIME/LOCAL_ISO_STR,SW_VER,SW_BUILD_NUMBER,FRIENDLYNAME");
  }

  /*========================================================================*/
  //fn  setFromObject
  /*!

  Set SysVar from object list

  This takes a list of SysVar names and their values.  It then sends the list
  to Conext Gateway for the SysVar value change.


  @param[in]
    data
      list of SysVar name/value pairs

  @param[in]
    apply
      Set the APPLY sysVar or not

  @param[in]
    ordering
      SysVar ordering list.


  @retval success: SysVar setting successful.
  @retval failure: Unable to set SysVar.

  */
  /*
    REVISION HISTORY:

    Version: 1.01  Date: 05-Jan-2018  By: Eddie Leung
      - Change the APPLY sysvar name.

    Version: 1.02  Date: 05-Apr-2018  By: Trevor Monk
      - Change the APPLY sysvar name back

    */
  /*========================================================================*/
  function setFromObject(data, apply, ordering) {

    var requestObject = createRequestObject(data, ordering);

    if (apply === undefined) {
      apply = false;
    }

    if (apply) {
      requestObject.values.push({
        "name": "/SCB/CFG/APPLY",
        "value": 1
      });

      return $http.post("/setparams", requestObject, {
        headers: {
          'otk': otkService.getOTK()
        }
      }).then(function(response) {
          if (response.data !== undefined && response.data.OTK !== undefined) {
            otkService.setOTK(response.data.OTK);
          }
          if (responseErrorCheckerService.hasError(response)) {
            return $q.reject("Failed to set values: " + JSON.stringify(requestObject));
          }
          return $q.resolve(response);
        },
        function(error) {
          if (error.status === 401) {
            redirectService.redirectToLogin();
          }
          $log.error(error);
          return $q.reject("Failed to set sysvars");
        })
    } else {
      return $http.post("/setparams", requestObject, {
        headers: {
          'otk': otkService.getOTK()
        }
      }).then(function(response) {
          if (response.data !== undefined && response.data.OTK !== undefined) {
            otkService.setOTK(response.data.OTK);
          }

          if (responseErrorCheckerService.hasError(response)) {
            return $q.reject("Failed to set sysvars");
          }
          return $q.resolve(response);
        },
        function(error) {
          if (error.status === 401) {
            redirectService.redirectToLogin();
          }
          $log.error(error);
          return $q.reject("Failed to set sysvars");
        });
    }
  }

  function createRequestObject(data, ordering) {
    var requestObject = {
      values: []
    };
    if (ordering) {
      angular.forEach(ordering, function(value, key) {
        requestObject.values.push({
          "name": value,
          "value": data[value]
        });
      });
    } else {
      angular.forEach(data, function(value, key) {
        requestObject.values.push({
          "name": key,
          "value": value
        });
      });
    }
    return requestObject;
  }

  function applySysvars(response) {
    return $http.post("/apply", " ").then(function() {
        if (responseErrorCheckerService.hasError(response)) {
          return $q.reject("Failed to set sysvars");
        }
        return $q.resolve(response);
      },
      function(error) {
        if (error.status === 401) {
          redirectService.redirectToLogin();
        }
        $log.error(error);
        return $q.reject("Failed to apply");
      });
  }
}

/*! @}
 * end of csbquery group */
