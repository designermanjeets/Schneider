"use strict";

// Take a base unit (e.g., "W") and return kW, MW, or GW,
// depending on the value.
angular.module('conext_gateway.utilities').filter('kiloUnits', [function () {

  return function (baseUnit, kiloValue) {
    if (kiloValue === undefined || kiloValue === null || kiloValue === "") {
      return "k" + baseUnit;
    }

    // These cutoffs come from SRS: SRS_PDB_001, REQ-15
    if (kiloValue > 1e7) {
      return "G" + baseUnit;
    }
    else if (kiloValue > 1e4) {
      return "M" + baseUnit;
    }
    else {
      return "k" + baseUnit;
    }
  }
}]);

angular.module('conext_gateway.utilities').filter('scaleValue', [function () {
  return function (value) {
    var tempValue = Math.abs(value);
    if(!tempValue && tempValue !== 0) {
      return null;
    }
    if (tempValue >= 1e9) {
      tempValue = tempValue / 1e9;
    } else if (tempValue >= 1e6) {
      tempValue = tempValue / 1e6;
    } else if (tempValue >= 1e3) {
      tempValue = tempValue / 1e3;
    }

    if(value < 0) {
      tempValue = tempValue * -1;
    }
    return roundToOne(tempValue);
  };
}]);

function roundToOne(num) {
    return +(Math.round(num + "e+1")  + "e-1");
}

angular.module('conext_gateway.utilities').filter('scaleUnit', [function () {
  return function (baseUnit, value) {
    var tempValue = Math.abs(value);

    if (tempValue >= 1e9) {
      return "G" + baseUnit;
    } else if (tempValue >= 1e6) {
      return "M" + baseUnit;
    } else if (tempValue >= 1e3) {
      return "k" + baseUnit;
    }
    return baseUnit;
  };
}]);

angular.module('conext_gateway.utilities').filter('degFormatter', [function () {
  return function (value) {
    var result = value;
    if (value !== undefined) {
      result = value.split('degC').join('°C');
    }
    return result;
  };
}]);

// Take a number, and scale it so that it matches the units from kiloUnits
angular.module('conext_gateway.utilities').filter('kiloScale', ['$filter', function($filter) {
  // kiloFractionSize: Number of decimal points to use when showing kilo-range numbers
  // megaGigaFractionSize: Number of decimal points for mega- and giga-range numbers
  return function(kiloValue, kiloFractionSize, megaGigaFractionSize) {
    var scaledValue;
    var fractionSize;

    if (kiloValue === undefined || kiloValue === null || kiloValue === "") {
      return kiloValue;
    }

    if (kiloValue > 1e7) {
      scaledValue = kiloValue / 1e6;

      fractionSize = angular.isDefined(megaGigaFractionSize) ?
        megaGigaFractionSize : 2;
    }
    else if (kiloValue > 1e4) {
      scaledValue = kiloValue / 1e3;
      fractionSize = angular.isDefined(megaGigaFractionSize) ?
        megaGigaFractionSize : 2;
    }
    else {
      scaledValue = kiloValue;
      fractionSize = angular.isDefined(kiloFractionSize) ?
        kiloFractionSize : 0;
    }

    return $filter('number')(scaledValue, fractionSize);
  }
}]);

angular.module('conext_gateway.utilities').filter('unitFormatter', ['$filter', function ($filter) {
  return function (kiloValue, unitValue, hasHour) {
    var scaledValue;
    var fractionSize;
    var unit = getUnit(kiloValue);
    var showUnit = false;

    if (kiloValue === undefined || kiloValue === null || kiloValue === "") {
      return kiloValue;
    }

    if (kiloValue < .05) {
      return 0;
    }

    if (unitValue === 'G' && canFitScale(kiloValue, unitValue)) {
      scaledValue = kiloValue / 1e6;
      fractionSize = 2;
    }
    else if (unitValue === 'G' && unit === 'M') {
      scaledValue = kiloValue / 1e3;
      fractionSize = 2;
      showUnit = true;
    }
    else if (unitValue === 'M' && canFitScale(kiloValue, unitValue)) {
      scaledValue = kiloValue / 1e3;
      fractionSize = 2;
    }
    else if (unitValue === 'k') {
      scaledValue = kiloValue;
      fractionSize = 1;
    } else {
      scaledValue = kiloValue;
      fractionSize = 1;
      unit = 'k';
      showUnit = true;
    }

    return (showUnit) ? $filter('number')(scaledValue, fractionSize) + " " + unit + ((hasHour) ? "Wh" : "W") : $filter('number')(scaledValue, fractionSize);
  }
}]);


function canFitScale(kiloValue, scale) {
  var unit = "k";
  if (kiloValue >= 1e4) {
    unit = "G";
  }
  else if (kiloValue >= 1e1) {
    unit = "M";
  }
  return unit === scale || (unit === 'G' && scale === 'M') || (unit === 'M' && scale === 'k');
}

function getUnit(kiloValue) {


  var unit = 'k';
  if (kiloValue > 1e7) {
    unit = "G";
  }
  if (kiloValue > 1e4 && unit !== "G") {
    unit = "M";
  }
  return unit;
}
