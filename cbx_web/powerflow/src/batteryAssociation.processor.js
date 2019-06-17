function BatteryAssociationProcessor() {
  this.processAssociations = processAssociations;


  var BATTERY_ASSOCIATION_MAPPING = {
    HouseBatBank1: 3,
    HouseBatBank2: 4,
    HouseBatBank3: 5,
    HouseBatBank4: 6,
    HouseBatBank5: 7
  };

  //function for mapping the correct battmon ids to the appropriate batteries
  function processAssociations(associations, battmons) {
    var formated_associations = {
      battery1: null,
      battery2: null,
      battery3: null,
      battery4: null,
      battery5: null,
    };

    for (var key in associations) {
      if (key !== 'META' && associations.hasOwnProperty(key) && endsWith(key, "BATTMON_ASSOC_CFG_DC_INPUT_OUTPUT")) {
        var words = key.split('_');
        var deviceId = '';
        if (words.length !== 0) {
          deviceId = words[0];
          for (var battmon in battmons) {
            if (battmons.hasOwnProperty(battmon) && "" + battmons[battmon].instance === deviceId && battmons[battmon].isActive === 'true') {
              switch (associations[key]) {
                case BATTERY_ASSOCIATION_MAPPING.HouseBatBank1:
                  formated_associations.battery1 = deviceId;
                  break;
                case BATTERY_ASSOCIATION_MAPPING.HouseBatBank2:
                  formated_associations.battery2 = deviceId;
                  break;
                case BATTERY_ASSOCIATION_MAPPING.HouseBatBank3:
                  formated_associations.battery3 = deviceId;
                  break;
                case BATTERY_ASSOCIATION_MAPPING.HouseBatBank4:
                  formated_associations.battery4 = deviceId;
                  break;
                case BATTERY_ASSOCIATION_MAPPING.HouseBatBank5:
                  formated_associations.battery5 = deviceId;
                  break;
                default:
              }
            }
          }
        }
      }
    }

    return formated_associations;
  }

  function endsWith(string, prefix) {
    return string.substr(string.length - prefix.length, string.length) === prefix;
  }
}
