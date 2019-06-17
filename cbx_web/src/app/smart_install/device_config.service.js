"use strict";

angular.module('conext_gateway.smart_install').factory('deviceConfigService', [
  'queryService', "$q", "sysvar_metadata", "$filter", "xbConfigUtilityService",
  function (queryService, $q, sysvar_metadata, $filter, xbConfigUtilityService) {
    var devices = null;
    var currentIndex = 0;
    return {
      getCurrentDevice: getCurrentDevice,
      getNextDevice: getNextDevice
    };

    function getCurrentDevice() {
      var defered = $q.defer();
      if(!devices) {
        $q.all({
          devlist: queryService.getSysvars(['DEVLIST']),
          associations: queryService.getMatchingSysvars({ 'match': 'ASSOC'}, { 'keepDeviceId': true}),
        }).then(function(data) {
          devices = [];
            var associations = {};
            for(var key in data.associations) {
              var association = {};
              var parts = key.split("_");
              if(data.associations.hasOwnProperty(key)  && key !== "META") {
                association.key = "/" + parts.slice(1,3).join("/") + "/" + parts.slice(3).join("_");
                association.value = "" + data.associations[key];
                association.config = sysvar_metadata[association.key];
                association.name = $filter('translate')(association.config.nameRef);
                association.options = xbConfigUtilityService.splitEnums($filter('translate')(association.config.enumRef));

                if(!associations[parts[0]]) {
                  associations[parts[0]] = [];
                }
                associations[parts[0]].push(association);
              }
            }

            for(var index = 0; index < data.devlist.DEVLIST.length; index++) {
              data.devlist.DEVLIST[index].associations = associations["" + data.devlist.DEVLIST[index].instance];
              devices.push(data.devlist.DEVLIST[index]);
            }
          defered.resolve(devices[currentIndex]);
        }, function(error) {
          defered.reject(error);
        });
      } else {
        defered.resolve(devices[currentIndex]);
      }
      return defered.promise;
    }

    function getNextDevice() {
      currentIndex++;
      return devices[currentIndex];
    }

  }
]);
