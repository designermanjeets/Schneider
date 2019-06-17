"use strict";

angular.module('conext_gateway.xbgateway').factory('xbdevdetailService',
  ['queryService','$log',
  function (queryService, $log) {
    var service = {
      getDevInfo       : getDevInfo,
      getDevSts        : getDevSts,
      getDevCfg        : getDevCfg,
      getCfgMode       : getCfgMode
    };

    function getCfgMode(device, instanceId) {
      var sysVars = ['[' + instanceId + ']/' + device + '/INV/CFG_MODE'];
      return queryService.getSysvars(sysVars, {});
    }
    // Return all the devices
    function getDevInfo(device, instanceId) {
        var options = {};
        options.prefix = device;
        options.lang = 'en';

        return queryService.getSysvarsByInstance(instanceId, options)
    }

    // return the status of a device using a saved query.  If the saved query does not
    // exist, then construct it for next time
    function getDevSts( device, instanceID, queryID ) {
        var match = { tags: ['sts:'], inst: instanceID, id: queryID };
        var options = {};
        options.prefix = device;

        if( queryID === undefined ){
            return queryService.getMatchingSysvars( match, options );
        } else {
            return queryService.runSavedQuery( queryID, options ).then(function(data){
                var size = Object.keys(data).length;
                if( size <= 1 ) {
                    return queryService.getMatchingSysvars( match, options );
                } else {
                    return data;
                }
            });
        }
    }

    function getDevCfg( device, instanceID, queryID ) {
        var match = { tags: ['cfg:'], inst: instanceID, id: queryID };
        var options = {};
        options.prefix = device;

        if( queryID === undefined ){
            return queryService.getMatchingSysvars( match, options );
        } else {
            return queryService.runSavedQuery( queryID, options ).then(function(data){
                var size = Object.keys(data).length;
                if( size <= 1 ) {
                    return queryService.getMatchingSysvars( match, options );
                } else {
                    return data;
                }
            });
        }
    }

    return service;
  }

]);
