
"use strict";

angular.module('conext_gateway.setup').controller('RebootConfirmationController', ['$scope', '$log', '$uibModalInstance',
  function($scope, $log, $uibModalInstance) {
    $scope.apply = apply;
    $scope.cancel = cancel;

    $scope.messages = {};
    $scope.$watch('restartType', function() {
      switch ($scope.restartType) {
        case 'Config':
          $scope.messages.title_id = 'setup.configuration.confirm_config_title';
          $scope.messages.confirmation_id = 'setup.configuration.confirm_config_message';
          $scope.messages.apply_id = 'setup.configuration.reset_configuration';
          $scope.messages.apply_class = ['btn', 'btn-danger'];
          break;

        case 'Factory':
          $scope.messages.title_id = 'setup.configuration.confirm_factory_title';
          $scope.messages.confirmation_id = 'setup.configuration.confirm_factory_message';
          $scope.messages.apply_id = 'setup.configuration.reset_factory';
          $scope.messages.apply_class = ['btn', 'btn-danger'];
          break;

        case 'Reboot':
          $scope.messages.title_id = 'setup.configuration.confirm_restart_title';
          $scope.messages.confirmation_id = 'setup.configuration.confirm_restart_message';
          $scope.messages.apply_id = 'setup.configuration.restart';
          $scope.messages.apply_class = ['btn', 'btn-default'];
          break;

        case 'Shutdown':
          $scope.messages.title_id = 'setup.configuration.confirm_shutdown_title';
          $scope.messages.confirmation_id = 'setup.configuration.confirm_shutdown_message';
          $scope.messages.apply_id = 'setup.configuration.shutdown';
          $scope.messages.apply_class = ['btn', 'btn-default'];
          break;

        default:
          $log.error("Unknown restartType: " + $scope.restartType);
          // fall through
      }
    });

    return;

    function apply() {
      $uibModalInstance.close(true);
    }

    function cancel() {
      $uibModalInstance.dismiss(false);
    }
  }
]);
