/*==============================================================================

Copyright (c) 2016 Schneider Electric.

All Rights Reserved. All trademarks are owned by
Schneider Electric Industries SAS or its affiliated companies.

==============================================================================*/

/*!
 * @defgroup CSB Idle Timer
 *
 * @brief
 * Client side idle timer, log out user if inactivity timeout occurs.
 *
 * @{
 */

/*============================================================================*/
/*!
 @file csbidletimer.js

 @brief
 Client idle timer

 @details
 This implements the idle timer and the timeout warning count down popup window.
 The implementation includes Angular controller functions for the idle
 timer and the timeout popup window. The counting is done every 1 min.  It sends
 a query to server to maintain the session connection. If there is no user
 interaction for a certain period of time, timeout occurs.  Then, it opens a
 popup window with count down for 20 sec.  If it still does not detect any
 user actions, it will log out the session.  To us the idle timer, simply add
 the controller to the html page.

*/
/*============================================================================*

// Turn of linting, because this is old code ported from Linux and we don't have
// capacity to bring it up to standards.

/* eslint angular/di:0 */
/* eslint no-unused-vars:0, angular/typecheck-object:0, angular/di:0 */

/** Execute in strict mode */
"use strict";

/*! number of seconds in 1 min */
var MINUTE = 60;                /* 1 min */
/*! Change minute to second for debug purpose */
//var MINUTE = 1
/*! Maximum idle time */
var MAX_IDLE_TIME = (30 * MINUTE);
/*! Count down delay */
var WARNING_DELAY = 20;


/*! Angular module and injection definitions */
angular
  .module("csbIdleTimer", ["ngIdle", "ngAnimate", "ui.bootstrap", "csbQueryModule", "ngStorage"])
  .controller( "csbIdleTimer", csbIdleTimer )
  .controller( "idleTimerModal", idleTimerModal )
  .config( configIdleTimer )
  .run(['Idle', 'Keepalive', '$sessionStorage', '$log', function (Idle, Keepalive, $sessionStorage, $log) {
    if ($sessionStorage.userName && $sessionStorage.userName.toUpperCase() === 'GUEST') {
      Keepalive.start();
    } else {
      runIdleTimer(Idle, $log);
    }
  }]);

csbIdleTimer.$inject = ["$scope", "$uibModal", "$window", "csbQuery", "$sessionStorage", "$log", "$q", "redirectService"];


/*============================================================================*/
//fn  csbIdleTimer
/*!

Idle timer controller

This controller contains all methods for inactivity timeout processing.  In
normal operation the keep alive function make a query to server to keep session
alive. If idle timeout occurs, the idle start function opens a popup down for
logout count down. Any user interaction invokes the idle end function that
close the popup window and the timeout restart. If user has no interaction at
idle end, the Idle timeout function logs out the session.

@param
  $scope
    connection between controller and view

@param
  $uibModal
    Angular service to manage modal

@param
  $window
    URL page redirection services.

@param
  csbQuery
    Conext Gateway query processing.


*//*
REVISION HISTORY:

Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
  -Created
*/
/*============================================================================*/
function csbIdleTimer($scope, $uibModal, $window, csbQuery, $sessionStorage, $log, $q, redirectService) {

  /* Modal windonw instance */
  var modalInstance = null;

  $log.debug( "idle timer start");

  $scope.redirectToLogin = function() {
    redirectService.redirectToLogin();
  };

  /* Idle start, open the pop up */
  $scope.$on( "IdleStart", function() {
    $log.debug( "IdleStart, " + new Date() );
    /* Open Modal */
    modalInstance = $uibModal.open( {
      animation: true,
      templateUrl: "app/csb/idle_timer.html",
      controller: "idleTimerModal",
      scope: $scope,
    });

  });

  /* Idle end, close the popup */
  $scope.$on( "IdleEnd", function() {
    $log.debug( "IdleEnd, " + new Date() );
    /* Close Modal */
    modalInstance.close("Idle End");
  });


  /* Idle Timeout, log out session */
  $scope.$on( "IdleTimeout", function() {
    $log.debug( "IdleTimeout, " + new Date() );
    /* Close Modal */
    modalInstance.close("Idle timeout");
    /* Log out from system */
    csbQuery.logout().then(function() {
      delete $sessionStorage.userName;
      /* Redirect to login page*/
      redirectService.redirectToLogin();
    },
    function(error) {
      $log.error(error);
      delete $sessionStorage.userName;
      /* Redirect to login page*/
      redirectService.redirectToLogin();
    });


  });

  /* Keep alive, Heart beat to keep the server session */
  $scope.$on( "Keepalive", function() {
    /* CSB Query */
    csbQuery.getObj("SERIALNUM").then(function(){},function(){
      $log.error("Error sending keepalive query");
      return $q.reject("Error sending keepalive query");
    });

  });


}


/* Module injected to the controller */
idleTimerModal.$inject=["$scope", "$uibModalInstance", "$log"];

/*============================================================================*/
//fn  idleTimerModal
/*!

Controller for timeout warning modal.

This controller includes a count down function that keeps updating the counter
on the modal window. It has also a modal close function to close the popup if
there is any user interaction.


@param $scope  connection between controller and view

@param $uibModalInstance  Modal instance module.

*//*
REVISION HISTORY:

Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
-Created
*/
/*============================================================================*/
function idleTimerModal( $scope, $uibModalInstance, $log) {

  /* Assign the eMail address */
  $scope.countdown = WARNING_DELAY;

  /* Count down timer */
  $scope.$on( "IdleWarn", function(e, countdown ) {
    $log.debug( "IdleWarn " + countdown + ", "+ new Date() );
    /* Update Modal */
    $scope.countdown = countdown;
    $scope.$apply();
  });


  $log.debug( "Idle popup start" );

  /* Close the modal window */
  $scope.ok = function() {
    $uibModalInstance.close("close");
  };


}


configIdleTimer.$inject = ["IdleProvider", "KeepaliveProvider"];

/*============================================================================*/
//fn  configIdleTimer
/*!

Idle timer configuration.

This uses the ngIdle modules to configure the idle timer.


@param
  IdleProvider
    ngIdle module for idle time configuration

@param
  KeepaliveProvider
    ngIdle module for keep alive interval

*//*
REVISION HISTORY:

Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
-Created
*/
/*============================================================================*/
function configIdleTimer( IdleProvider, KeepaliveProvider ) {
  /* Idle time in seconds */
  IdleProvider.idle(MAX_IDLE_TIME);

  /* Waiting to timeout */
  IdleProvider.timeout(WARNING_DELAY);

  /* Keep alive interval */
  KeepaliveProvider.interval(MINUTE);
}


/*============================================================================*/
//fn  runIdleTimer
/*!

Run the idle timer

This simply start the idle watch function to monitor and user interaction on
the browser.


@param
  Idle
    ngIdle module for Idle timer.


*//*
REVISION HISTORY:

Version: 1.00  Date: 11-Jan-2016  By: Eddie Leung
-Created
*/
/*============================================================================*/
function runIdleTimer( Idle , $log ) {

  /* Monitor mouse movement and key board activities. */
  Idle.watch();
  $log.debug( "Idle watch start");
}



/*! @}
 * end of CSB Idle Timer group */
