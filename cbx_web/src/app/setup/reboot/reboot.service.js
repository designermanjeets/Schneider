"use strict";

angular.module('conext_gateway.setup').factory('rebootService',
  ['$timeout', '$uibModal', '$log', '$rootScope', 'loginService', 'csbQuery', '$window', 'connectionCheckService', 'redirectService',
  function ($timeout, $uibModal, $log, $rootScope, loginService, csbQuery, $window, connectionCheckService, redirectService) {
    // Give the device time to restart before polling begins
    var INITIAL_POLL_DELAY    = 20 * 1000;
    // Subsequent polling happens more often
    var SUBSEQUENT_POLL_DELAY = 2 * 1000;

    return {
      reboot: function() {
        doRestart('Reboot', '/SCB/LSYS/REBOOT' )
      },
      resetConfiguration: function() {
        doRestart('Config', '/SCB/LSYS/CONFIGRESET' );
      },
      resetToFactory: function() {
        doRestart('Factory', '/SCB/LSYS/FACTORYRESET' );
      },
      shutdown: function() {
        showConfirmation("Shutdown")
          // wait for user to click OK
          // If click cancel, nothing else to do
          .result
          .then(function () {
            csbQuery
              .set("/SCB/LSYS/SHUTDOWN= 1", '/set')
              .then(function() {
                showShutdown();
              });
          });


      }
    };

    function doRestart(restartType, triggervar ) {
      showConfirmation(restartType)
        // wait for user to click OK
        // If click cancel, nothing else to do
        .result
        .then(function () {
          connectionCheckService.setRebooting(true);
          showWaiting()
            .opened // wait for all resources to load
            .then(function() {

              csbQuery
                .set(triggervar + '= 1', '/set')
                .then(function() {
                  waitForRestart();
                })
                .catch(function(error) {
                  // TODO: Verify that this is only ever a system error, not a user-facing
                  // error.
                  $log.error(error);
                })
            })
        })
    }

    function waitForRestart() {
      $timeout(poll, INITIAL_POLL_DELAY);
    }

    function poll() {
      csbQuery
        .hasRebootFinished()
        .then(function() {
          redirectService.redirectToLogin();
        })
        .catch(function() {
          // Not ready yet. Try again.
          //$log.log("Not rebooted");
          $timeout(poll, SUBSEQUENT_POLL_DELAY);
        });
    }

    function showConfirmation(restartType) {
      var modalScope = $rootScope.$new();
      modalScope.restartType = restartType;

      return $uibModal.open({
        templateUrl: 'app/setup/reboot/reboot_confirmation.html',
        controller: 'RebootConfirmationController',
        backdrop: 'static',
        keyboard: false,
        scope: modalScope,
      });
    }

    function showShutdown() {
      return $uibModal.open({
        templateUrl: 'app/setup/reboot/shutdown_in_progress.html',
        size: 'sm',
        backdrop: 'static',
        keyboard: false
      });
    }

    function showWaiting() {
      return $uibModal.open({
        templateUrl: 'app/setup/reboot/reboot_in_progress.html',
        size: 'sm',
        controller: 'RebootInProgressController',
        backdrop: 'static',
        keyboard: false
      });
    }
  }
]);
