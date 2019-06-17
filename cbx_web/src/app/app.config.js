
"use strict";

angular.module('conext_gateway').config(
  ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$logProvider', 'ngGaugeProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider, $logProvider, ngGaugeProvider) {

      $logProvider.debugEnabled(false);
      ngGaugeProvider.setOptions({
        duration: 100
      });

      $httpProvider.interceptors.push('httpInterceptorService');

      $urlRouterProvider.otherwise("/dashboard");
      $urlRouterProvider.when('/dashboard', '/dashboard/powerflow');
      $urlRouterProvider.when('/xbgateway', '/xbgateway/xbdevlist/all');
      $urlRouterProvider.when('/events', '/events/active');
      $urlRouterProvider.when('/gateway', '/gateway/configuration');
      $urlRouterProvider.when('/about', '/about/gateway_info');
      $urlRouterProvider.when('/smart_install', 'smart_install/home');
      $urlRouterProvider.when('/smart_install_tab', 'smart_install_tab/home');

      $stateProvider
        .state('index', {
          views: {
            'homeview': {
              templateUrl: "app/layout/master_layout.html",
              controller: "masterLayoutController"
            }
          }
        });

      $stateProvider
        .state('dashboard', {
          url: "/dashboard",
          templateUrl: "app/dashboard/dashboard.html",
          parent: "index"
        })
        .state('dashboard.powerflow', {
          url: "/powerflow",
          templateUrl: "app/dashboard/powerflow/powerflow.html",
          controller: "powerflowController"
        })
        .state('dashboard.battery_summary', {
          url: "/battery_summary",
          templateUrl: "app/dashboard/battery_summary/battery_summary.html",
          controller: "batterySummaryController"
        })
        .state('dashboard.battery_comparison', {
          url: "/battery_comparison",
          templateUrl: "app/dashboard/battery_comparison/battery_comparison.html",
          controller: "batteryComparisonController"
        })
        .state('dashboard.energy', {
          url: "/energy",
          templateUrl: "app/dashboard/energy/energy.html",
          controller: "energyController"
        })
        .state('dashboard.energy_comparison', {
          url: "/energy_comparison",
          templateUrl: "app/dashboard/energy_comparison/energy_comparison.html",
          controller: "energyComparisonController"
        });


      // Xanbus Device routes
      $stateProvider
        .state('xbgateway', {
          url: "/xbgateway",
          templateUrl: "app/xbgateway/SideMenu/sidemenu_xbgateway.html",
          controller: "xbgatewayController",
          parent: "index"
        })
        .state('xbgateway.xbdevlist', {
          url: "/xbdevlist/{type:[A-Za-z0-9]+}",
          views: {
            'xbgateway': {
              templateUrl: "app/xbgateway/DeviceList/xbdevlist.html",
              controller: "xbdevlistController"
            }
          }
        })
        .state('xbgateway.oth', {
          url: "/xbdevlist/oth/{device:[A-Za-z0-9]+}/{id:[0-9]+}",
          views: {
            'xbgateway': {
              templateUrl: "app/xbgateway/DevDetails/xbdevdetail.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.oth.events', {
          url: "/events",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/DevDetails/xbevents.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.oth.status', {
          url: "/status",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Status/xbdevstatus_detail.html",
              controller: "xbdevStatusDetailController"
            }
          }
        })
        .state('xbgateway.oth.config', {
          url: "/config",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Config/xb_config.html",
              controller: "XBConfigController"
            }
          }
        })
        .state('xbgateway.oth.diag', {
          url: "/diag",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/xbdevdiag.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.oth.firmware', {
          url: "/firmware",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/FirmwareUpdate/firmware_update.html",
              controller: "firmwareUpdateController"
            }
          }
        })
        .state('xbgateway.chg', {
          url: "/xbdevlist/chg/{device:[A-Za-z0-9]+}/{id:[0-9]+}",
          views: {
            'xbgateway': {
              templateUrl: "app/xbgateway/DevDetails/xbdevdetail.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.chg.events', {
          url: "/events",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/DevDetails/xbevents.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.chg.status', {
          url: "/status",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Status/xbdevstatus_detail.html",
              controller: "xbdevStatusDetailController"
            }
          }
        })
        .state('xbgateway.chg.config', {
          url: "/config",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Config/xb_config.html",
              controller: "XBConfigController"
            }
          }
        })
        .state('xbgateway.chg.diag', {
          url: "/diag",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/xbdevdiag.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.chg.firmware', {
          url: "/firmware",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/FirmwareUpdate/firmware_update.html",
              controller: "firmwareUpdateController"
            }
          }
        })
        .state('xbgateway.chg.performance', {
          url: "/performance",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Performance/performance.html",
              controller: "performanceController"
            }
          }
        })
        .state('xbgateway.invchg', {
          url: "/xbdevlist/invchg/{device:[A-Za-z0-9]+}/{id:[0-9]+}",
          views: {
            'xbgateway': {
              templateUrl: "app/xbgateway/DevDetails/xbdevdetail.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.invchg.events', {
          url: "/events",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/DevDetails/xbevents.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.invchg.status', {
          url: "/status",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Status/xbdevstatus_detail.html",
              controller: "xbdevStatusDetailController"
            }
          }
        })
        .state('xbgateway.invchg.config', {
          url: "/config",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Config/xb_config.html",
              controller: "XBConfigController"
            }
          }
        })
        .state('xbgateway.invchg.diag', {
          url: "/diag",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/xbdevdiag.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.invchg.firmware', {
          url: "/firmware",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/FirmwareUpdate/firmware_update.html",
              controller: "firmwareUpdateController"
            }
          }
        })
        .state('xbgateway.invchg.gridcodes', {
          url: "/grid_codes",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/GridCodes/grid_codes.html",
              controller: "gridCodesController",
            }
          }
        })
        .state('xbgateway.invchg.performance', {
          url: "/performance",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Performance/performance.html",
              controller: "performanceController"
            }
          }
        })
        .state('xbgateway.inverters.events', {
          url: "/events",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/DevDetails/xbevents.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.inverters.status', {
          url: "/status",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Status/xbdevstatus_detail.html",
              controller: "xbdevStatusDetailController"
            }
          }
        })
        .state('xbgateway.inverters.config', {
          url: "/config",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Config/xb_config.html",
              controller: "XBConfigController"
            }
          }
        })
        .state('xbgateway.inverters.diag', {
          url: "/diag",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/xbdevdiag.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.inverters.firmware', {
          url: "/firmware",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/FirmwareUpdate/firmware_update.html",
              controller: "firmwareUpdateController"
            }
          }
        })
        .state('xbgateway.inverters.performance', {
          url: "/performance",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Performance/performance.html",
              controller: "performanceController"
            }
          }
        })
        .state('xbgateway.inverters', {
          url: "/xbdevlist/inverters/{device:[A-Za-z0-9]+}/{id:[0-9]+}",
          views: {
            'xbgateway@xbgateway': {
              templateUrl: "app/xbgateway/DevDetails/xbdevdetail.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.meters', {
          url: "/xbdevlist/meters/{device:[A-Za-z0-9]+}/{id:[0-9]+}",
          views: {
            'xbgateway': {
              templateUrl: "app/xbgateway/DevDetails/xbdevdetail.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.meters.events', {
          url: "/events",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/DevDetails/xbevents.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.meters.status', {
          url: "/status",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Status/xbdevstatus_detail.html",
              controller: "xbdevStatusDetailController"
            }
          }
        })
        .state('xbgateway.meters.config', {
          url: "/config",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Config/xb_config.html",
              controller: "XBConfigController"
            }
          }
        })
        .state('xbgateway.meters.diag', {
          url: "/diag",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/xbdevdiag.html",
              controller: "xbdevdetailController"
            }
          }
        })
        .state('xbgateway.meters.firmware', {
          url: "/firmware",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/FirmwareUpdate/firmware_update.html",
              controller: "firmwareUpdateController"
            }
          }
        })
        .state('xbgateway.meters.performance', {
          url: "/performance",
          views: {
            'xbdevdetail': {
              templateUrl: "app/xbgateway/Performance/performance.html",
              controller: "performanceController"
            }
          }
        })
        .state('xbgateway.sensors', {
          url: "/xbdevlist/sensors",
          params: {
            obj: null
          },
          views: {
            'xbgateway': {
              templateUrl: "app/devices/sensors.html",
              controller: "SensorsController"
            }
          }
        })
        .state('xbgateway.sensors.unknown_sensor', {
          url: "/--/:sensorName",
          views: {
            'xbgateway@xbgateway': {
              templateUrl: "app/devices/details/unknown_sensor_setup.html",
              controller: "UnknownSensorController"
            }
          }
        })
        .state('xbgateway.sensors.details', {
          url: "/:sensorId/:sensorName",
          views: {
            'xbgateway@xbgateway': {
              templateUrl: "app/devices/details/sensor_details.html",
              controller: "SensorDetailsController"
            }
          }
        });

      //Events routes
      $stateProvider
        .state('events', {
          url: "/events",
          templateUrl: "app/events/sidemenu_events.html",
          parent: 'index'
        })
        .state('events.active', {
          url: "/active",
          templateUrl: "app/events/fault_warning.html",
          controller: "activeController"
        })
        .state('events.historical', {
          url: "/historical",
          templateUrl: "app/events/fault_warning.html",
          controller: "historicalController"
        });

      $stateProvider
        .state('gateway', {
          url: "/gateway",
          templateUrl: "app/setup/sidemenu_setup.html",
          parent: 'index'
        })
        .state('gateway.configuration', {
          url: "/configuration",
          templateUrl: "app/setup/configuration.html",
          controller: "configurationController"
        })
        .state('gateway.data_export', {
          url: "/data_export",
          templateUrl: "app/setup/data_export.html",
          controller: "dataExportController"
        })
        .state('gateway.manage_passwords', {
          url: "/manage_passwords",
          templateUrl: "app/setup/manage_passwords/manage_passwords.html",
          controller: "managePasswordsController"
        })
        .state('gateway.network', {
          url: "/network",
          templateUrl: "app/setup/network.html",
          controller: "networkController"
        })
        .state('gateway.notifications', {
          url: "/notifications",
          templateUrl: "app/setup/notifications/notifications.html",
          controller: "notificationsController"
        })
        .state('gateway.detection', {
          url: "/detection",
          templateUrl: "app/devices/detection/detection.html",
          controller: "DetectionController"
        });

      $stateProvider
        .state('about', {
          url: "/about",
          templateUrl: "app/about/sidemenu.html",
          parent: 'index'
        })
        .state('about.gateway_info', {
          url: "/gateway_info",
          templateUrl: "app/about/gateway_info.html",
          controller: "gatewayInfoController"
        })
        .state('about.gateway_manifest', {
          url: "/gateway_manifest",
          templateUrl: "app/about/manifest/gateway_manifest.html",
          controller: "gatewayManifestController"
        });


      //Smart Install routes: For the wizard (not contained in tabs)
      $stateProvider
        .state("smart_install", {
          url: "/smart_install",
          views: {
            'homeview': {
              template: "<div ui-view></div>"
            }
          }
          // Don't set parent here, because it's not contained in tabs
        })
        .state('smart_install.home', {
          url: "/home",
          templateUrl: "app/smart_install/home.html",
          controller: "smartInstallHomeController",
          data: {
            pageTitle: 'titles.smart_install'
          }
        })
        .state('smart_install.device_config', {
          url: "/device_config",
          templateUrl: "app/smart_install/device_config.html",
          controller: "deviceConfigController",
          data: {
            pageTitle: 'titles.smart_install'
          }
        })
        .state('smart_install.plant_setup', {
          url: "/plant_setup",
          templateUrl: "app/smart_install/plant_setup.html",
          controller: "smartInstallPlantSetupController",
          data: {
            pageTitle: 'titles.smart_install_plant_setup'
          }
        })
        .state('smart_install.detect_devices', {
          url: "/detect_devices",
          templateUrl: "app/smart_install/detect_devices.html",
          controller: "smartInstallDetectDevicesController",
          data: {
            pageTitle: 'titles.smart_install_detect_devices'
          }
        })
        .state('smart_install.test_conext_insight', {
          url: "/test_conext_insight",
          templateUrl: "app/smart_install/test_conext_insight.html",
          controller: "smartInstallTestConnectInsightController",
          data: {
            pageTitle: 'titles.smart_install_conext_insight'
          }
        })
        .state('smart_install.change_password', {
          url: "/change_password",
          templateUrl: "app/smart_install/change_password.html",
          controller: "smartInstallChangePasswordController",
          data: {
            pageTitle: 'titles.smart_install_change_password'
          }
        })
        .state('smart_install.summary', {
          url: "/summary",
          templateUrl: "app/smart_install/summary.html",
          controller: "smartInstallSummaryController",
          data: {
            pageTitle: 'titles.smart_install_summary'
          }
        });


      //Smart Install routes: Contained inside of the tab
      $stateProvider
        .state("smart_install_tab", {
          url: "/smart_install_tab",
          template: "<div ui-view></div>",
          parent: "index",
        })
        .state('smart_install_tab.home', {
          url: "/home",
          templateUrl: "app/smart_install/home.html",
          controller: "smartInstallHomeController",
          data: {
            pageTitle: 'titles.smart_install'
          }
        })
        .state('smart_install_tab.plant_setup', {
          url: "/plant_setup",
          templateUrl: "app/smart_install/plant_setup.html",
          controller: "smartInstallPlantSetupController",
          data: {
            pageTitle: 'titles.smart_install_plant_setup'
          }
        })
        .state('smart_install_tab.detect_devices', {
          url: "/detect_devices",
          templateUrl: "app/smart_install/detect_devices.html",
          controller: "smartInstallDetectDevicesController",
          data: {
            pageTitle: 'titles.smart_install_detect_devices'
          }
        })
        .state('smart_install_tab.test_conext_insight', {
          url: "/test_conext_insight",
          templateUrl: "app/smart_install/test_conext_insight.html",
          controller: "smartInstallTestConnectInsightController",
          data: {
            pageTitle: 'titles.smart_install_conext_insight'
          }
        })
        .state('smart_install_tab.change_password', {
          url: "/change_password",
          templateUrl: "app/smart_install/change_password.html",
          controller: "smartInstallChangePasswordController",
          data: {
            pageTitle: 'titles.smart_install_change_password'
          }
        })
        .state('smart_install_tab.summary', {
          url: "/summary",
          templateUrl: "app/smart_install/summary.html",
          controller: "smartInstallSummaryController",
          data: {
            pageTitle: 'titles.smart_install_summary'
          }
        });


      $stateProvider
        .state('disclaimer', {
          url: "/disclaimer",
          views: {
            'homeview': {
              templateUrl: "app/disclaimer/disclaimer.html",
              controller: 'disclaimerController'
            }
          },
          data: {
            pageTitle: 'titles.disclaimer'
          }
        });

      $stateProvider
        .state('changePassword', {
          url: "/change_password",
          views: {
            'homeview': {
              templateUrl: "app/change_password/change_password.html",
              controller: 'changePasswordController'
            }
          },
          data: {
            pageTitle: 'titles.change_password'
          }
        });

      $stateProvider
        .state('resetCode', {
          url: "/reset_code/:user/:hash",
          views: {
            'homeview': {
              templateUrl: "app/password_recovery/reset_password.html",
              controller: 'passwordRecoveryController',
            }
          },
          data: {
            pageTitle: 'titles.reset_password'
          }
        });
    }
  ]);
