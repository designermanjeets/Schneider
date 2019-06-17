/**
 *
 * @copyright (c) 2015 Schneider Electric. All Rights Reserved.
 *   All trademarks are owned by  Schneider Electric Industries SAS or its affiliated companies.
 *
 * @fileOverview
 *
 * @description  A factory module to handle all the popup messages for Conext Gateway.
 *
 * @version 0.1 Dec 14, 2015   Eddie Leung
 *   created
 *
*/

// Turn of linting, because this is old code ported from Linux and we don't have
// capacity to bring it up to standards.
/* eslint-disable angular/di */

/** Execute in strict mode */
"use strict";

/** Angular module and injection definitions */
angular
  .module( "csbModal", ["ngAnimate", "ui.bootstrap"])
  .factory( "csbModal", csbModal );

csbModal.$inject = ["$uibModal", "$log"];

/**
 *
 * This factory function returns an object that contains all the methods to
 *   modal windows
 *
 * @param $uibModal Angular service to manage modals
 *
 * @returns an object for all public methods.
 *
 */
function csbModal($uibModal, $log) {

  /* Returns object containing all public methods */
  var service = {
    alert: alert,
    forgotPassword: forgotPassword
  };

  return service;

  /**
   *
   * This shows a modal popup for alert type message
   *
   * @param   message Message key
   *
   * @returns promise for the new modal window
   *
   */
  function alert( message, title) {
    var options={};

    if (title !== undefined) {
      options.title = title;
    }
    /* Put message key into option list */
    options.message = message;
    return open( options );

  }

  /**
   *
   * This shows a modal popup for the forget password modal window
   *
   * @param   eMail address
   *
   * @returns promise for the new modal window
   *
   */
  function forgotPassword( emailAddress ){
    var options={};

    /* Put eMail address into option list */
    options.email = emailAddress;

    /* Open a modal window */
    var modalInstance =$uibModal.open({
      animation: true,
      templateUrl: "app/change_password/csbForgotPasswordModal.html",
      controller: "csbForgotPasswordModalController",
      size:"sm",
      resolve: {
        options: function() {
          return options;
        }
      },
      backdrop: 'static',
      keyboard: false
    });

    /* Return the modal window promise */
    return modalInstance.result;

  }

  /**
   *
   * This shows a modal popup for general message type modal window
   *
   * @param   Options List of modal window properties.
   *
   * @returns promise for the new modal window
   *
   */
  function open( options ) {

    /* Open a modal window */
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: "app/csb/csbmodal.html",
      controller: "csbMessageModalController",
      size:"sm",
      resolve: {
        options: function() {
          return options;
        }
      },
      backdrop: 'static',
      keyboard: false
    });

    /* Return the modal window promise */
    return modalInstance.result;

  }

}


/** Controller module and injection definitions */
angular
  .module( "csbModal")
  .controller( "csbMessageModalController", csbMessageModalController );

csbMessageModalController.$inject=["$scope", "$uibModalInstance", "options", "$filter"];


/**
 *
 * This controller matches variables and functions to the html template.
 *
 * @param $scope Angular service for HTML variable matching
 *
 * @param $uibModalInstance  Angular service for modal instanace management.
 *
 * @param options  variable list passed from Modal creation.
 *
 */
function csbMessageModalController( $scope, $uibModalInstance, options, $filter) {

  /* Assign the message title */
  $scope.title = options.title || $filter('translate')('csb.modal.message');

  /* Assign the message key */
  $scope.message = options.message;

  /**
   *
   * Close the modal window and return success for promise.
   *
   */
  $scope.ok = function() {
    $uibModalInstance.close("ok");
  };

  /**
   *
   * Close the modal window and return failure for promise.
   *
   */
  $scope.cancel = function() {
    $uibModalInstance.dismiss("cancel");
  };

}


/** Controller module and injection definitions */
angular
  .module( "csbModal")
  .controller( "csbForgotPasswordModalController", csbForgotPasswordModalController );

csbForgotPasswordModalController.$inject = ["$scope", "$uibModalInstance", "options", "$log"];


/**
 *
 * This controller matches variables and functions to the forgot password html template.
 *
 * @param $scope Angular service for HTML variable matching
 *
 * @param $uibModalInstance  Angular service for modal instance management.
 *
 * @param options  variable list passed from Modal creation.
 *
 */
function csbForgotPasswordModalController( $scope, $uibModalInstance, options, $log) {

  /* Assign the eMail address */
  $scope.forgotPasswordMailAddress = options.email;

  $log.debug( $scope.forgotPasswordMailAddress );

  /**
   *
   * Close the modal window and return success for promise.
   *
   */
  $scope.submit = function() {
    $uibModalInstance.close("submit");
  };


  /**
   *
   * Close the modal window and return failure for promise.
   *
   */
  $scope.cancel = function() {
    $uibModalInstance.dismiss("cancel");
  };

}
