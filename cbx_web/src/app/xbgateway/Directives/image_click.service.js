"use strict";

angular.module('conext_gateway.xbgateway').factory('imageClickService', ['$state',
  function($state) {
    var service = {
      imageClicked: imageClicked
    };

    function imageClicked(device) {
      var name = device.name;
      var id = device.instance;
      var page = ".status";
      if (device.attributes.warnings === '1' || device.attributes.alarms === '1') {
        page = ".events";
      }
      var param = {
        type: ''
      };
      switch (name) {
        case 'CL25':
          if (page !== ".events" && device.isActive === "false") {
            page = ".performance";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.inverters' + page, param);
          break;
        case 'CL36':
          if (page !== ".events" && device.isActive === "false") {
              page = ".performance";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.inverters' + page, param);
          break;
        case 'CL60':
          if (page !== ".events" && device.isActive === "false") {
              page = ".performance";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.inverters' + page, param);
          break;
        case 'EM3500':
          if (page !== ".events" && device.isActive === "false") {
            page = ".events";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.meters' + page, param);
          break;
        case 'PM2XXX':
          if (page !== ".events" && device.isActive === "false") {
            page = ".events";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.meters' + page, param);
          break;
        case 'PM8XX':
          if (page !== ".events" && device.isActive === "false") {
            page = ".events";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.meters' + page, param);
          break;
        case 'PM32XX':
          if (page !== ".events" && device.isActive === "false") {
            page = ".events";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.meters' + page, param);
          break;
        case 'IEM32XX':
          if (page !== ".events" && device.isActive === "false") {
            page = ".events";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.meters' + page, param);
          break;
        case 'GT':
          if (page !== ".events" && device.isActive === "false") {
            page = ".performance";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.inverters' + page, param);
          break;
        case 'AGS':
          if (page !== ".events" && device.isActive === "false") {
            page = ".events";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.oth' + page, param);
          break;
        case 'BATTMON':
          if (page !== ".events" && device.isActive === "false") {
            page = ".performance";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.oth' + page, param);
          break;
        case 'SCP':
          if (page !== ".events" && device.isActive === "false") {
            page = ".events";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.oth' + page, param);
          break;
        case 'SCP2':
          if (page !== ".events" && device.isActive === "false") {
            page = ".events";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.oth' + page, param);
          break;
        case 'MPPT':
          if (page !== ".events" && device.isActive === "false") {
            page = ".performance";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.chg' + page, param);
          break;
        case 'HVMPPT':
          if (page !== ".events" && device.isActive === "false") {
            page = ".performance";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.chg' + page, param);
          break;
        case 'XW':
          if (page !== ".events" && device.isActive === "false") {
            page = ".performance";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.invchg' + page, param);
          break;
        case 'CSW':
          if (page !== ".events" && device.isActive === "false") {
            page = ".performance";
          }
          param.device = name;
          param.id = id;
          $state.go('xbgateway.invchg' + page, param);
          break;
        default:
      }
    }

    return service;
  }
]);
