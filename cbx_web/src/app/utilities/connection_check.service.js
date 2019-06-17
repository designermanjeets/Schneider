"use strict";

angular.module('conext_gateway.utilities').factory('connectionCheckService', ['$uibModal', '$uibModalStack',
  function ($uibModal, $uibModalStack) {
    var rebooting = false;
    var modal;
    var opening = false;

    var service = {
      setRebooting: setRebooting,
      connectionLost: connectionLost,
      isConnectionLost: isModalOpen
    };

    return service;

    function setRebooting(value) {
      rebooting = value;
    }


    function isModalOpen() {
      var top = $uibModalStack.getTop();
      return modal && top && top.key === modal;
    }

    function connectionLost() {

      if (!rebooting && !isModalOpen()) {
        if (modal) {
          $uibModalStack.dismiss(modal);
        }
        openModal();
      }

    }

    /* TODO: Refactor as per CBPROF-412.  Temporarily disabling lint warning 'no-shadow' until CBPROF-412 is completed */
    /* eslint-disable no-shadow */
    function openModal() {
      if (!opening) {
        opening = true;
        modal = $uibModal.open({
          backdrop: 'static',
          keyboard: false,
          template: '<div ng-cloak>' +
            '<div class="modal-header">' +
            '<h3 class="modal-title" translate="utilities.connection_check.lost_connection"></h3>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p>' +
            '{{message}}' +
            '</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<div class="panel-controls">' +
            '<div class="panel-controls__message"></div>' +
            '<div class="panel-controls__buttons">' +
            '<button class="btn btn-default" ng-disabled="buttonDisabled" ng-click="connected()" translate="utilities.connection_check.test_connection">' +
            '</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
          size: 'sm',
          controller: [
            '$scope', '$uibModalStack', 'csbQuery', '$timeout', '$filter', '$sessionStorage', '$window', 'redirectService',
             function ($scope, $uibModalStack, csbQuery, $timeout, $filter, $sessionStorage, $window, redirectService) {
              $scope.message = $filter('translate')('utilities.connection_check.message');
              $scope.buttonDisabled = false;
              $scope.connected = function () {
                $scope.buttonDisabled = true;
                $scope.message = $filter('translate')('utilities.connection_check.checking_message');

                csbQuery.checkConnection().then(function () {
                  $uibModalStack.dismissAll();

                },
                function (error) {
                  if(error === "401") {
                    redirectService.redirectToLogin();
                  }
                  $scope.message = $filter('translate')('utilities.connection_check.failed_message');
                  $scope.buttonDisabled = false;
                });
              }

              $scope.$watch("buttonDisabled", function(newValue) {
                if (!newValue && $sessionStorage.userName === 'Guest') {
                  $scope.connected();
                }
              });
            }
          ]
        });
        opening = false;
      }
    }

  }
]);
