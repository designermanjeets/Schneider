function SVGCenterService() {
  this.getOffset = getOffset;
  this.alignBatteries = alignBatteries;


  var SVG_HEIGHT = 720;
  var SVG_WIDTH = 1920;

  //Default loactions for all the element groups on the powerflow diagram
  var defaultLocations = {
    inverter: {
      left: 595,
      right: 960,
      top: 10,
      bottom: 330
    },
    inverterCharger: {
      left: 960,
      right: 960,
      top: 10,
      bottom: 435
    },
    charger: {
      left: 240,
      right: 240,
      top: 10,
      bottom: 670
    },
    gridTieInverter: {
      left: 1320,
      right: 1680,
      top: 10,
      bottom: 360
    },
    generator: {
      left: 1680,
      right: 1680,
      top: 540,
      bottom: 635
    },
    grid: {
      left: 1680,
      right: 1680,
      top: 265,
      bottom: 360
    },
    batteries: {
      left: 600,
      right: 600,
      top: 540,
      bottom: 670
    }
  };

  //function used to recalulate the dimensions based on how many batteries
  //are present
  function alignBatteries(powerflow) {
    if (!powerflow.grid.isPresent &&
      !powerflow.generator.isPresent &&
      !powerflow.inverterCharger.isPresent &&
      !powerflow.inverter.isPresent &&
      !powerflow.gridTieInverter.isPresent &&
      powerflow.charger.isPresent) {
      defaultLocations.batteries.left = 240;
      defaultLocations.batteries.right = 240;
      defaultLocations.batteries.bottom = 10;
      defaultLocations.batteries.top = 670;
    } else {
      defaultLocations.batteries.left = 600;
      defaultLocations.batteries.right = 600;
      defaultLocations.batteries.top = 540;
      defaultLocations.batteries.bottom = 670;
      if (powerflow.batteries.numberOfBatteries === 3) {
        defaultLocations.batteries.left = 600 - 100;
        defaultLocations.batteries.right = 600 + 100;
      } else if (powerflow.batteries.numberOfBatteries === 5) {
        defaultLocations.batteries.left = 600 - 200;
        defaultLocations.batteries.right = 600 + 200;
      }
    }
  }


  //function used to calculated the dimensions of the displayed svg groups and
  //returns the offset.
  function getOffset(powerflow) {
    var dimensions = {
      left: null,
      right: null,
      top: null,
      bottom: null
    };

    if (powerflow.inverter.isPresent) {
      setDimenstions(dimensions, defaultLocations.inverter);
    }

    if (powerflow.gridTieInverter.isPresent) {
      setDimenstions(dimensions, defaultLocations.gridTieInverter);
    }

    if (powerflow.inverterCharger.isPresent) {
      setDimenstions(dimensions, defaultLocations.inverterCharger);
      if (powerflow.grid.isPresent) {
        setDimenstions(dimensions, defaultLocations.grid);
      }

      if (powerflow.generator.isPresent) {
        setDimenstions(dimensions, defaultLocations.generator);
      }
    }

    if ((dimensions.left !== null &&
        dimensions.right !== null &&
        dimensions.bottom !== null &&
        dimensions.top !== null) &&
        powerflow.batteries.isPresent &&
      (powerflow.charger.isPresent || powerflow.inverterCharger.isPresent)) {
      setDimenstions(dimensions, defaultLocations.batteries);
    }

    if (powerflow.charger.isPresent) {
      setDimenstions(dimensions, defaultLocations.charger);
    }

    return calculateOffSet(dimensions);
  }

  //function which gets the offset between the absolute center of the images
  //and the center of the currently displayed items
  function calculateOffSet(dimensions) {
    if(!dimensions.right || !dimensions.left || !dimensions.top || !dimensions.bottom) {
      return {
        x:2000,
        y:2000
      };
    }
    var absoluteXCenter = SVG_WIDTH / 2;
    var absoluteYCenter = SVG_HEIGHT / 2;
    var currentXCenter = (dimensions.right - dimensions.left) / 2 + dimensions.left;
    var currentYCenter = (dimensions.top - dimensions.bottom) / 2 + dimensions.bottom;

    return {
      x: absoluteXCenter - currentXCenter,
      y: absoluteYCenter - currentYCenter
    };
  }

  //function used to adjust the dimension based on the dimensions of the svg gtoup
  function setDimenstions(dimensions, group) {
    if (dimensions.left === null) {
      dimensions.left = group.left;
    } else if (dimensions.left > group.left) {
      dimensions.left = group.left;
    }

    if (dimensions.right === null) {
      dimensions.right = group.right;
    } else if (dimensions.right < group.right) {
      dimensions.right = group.right;
    }

    if (dimensions.top === null) {
      dimensions.top = group.top;
    } else if (dimensions.top > group.top) {
      dimensions.top = group.top;
    }

    if (dimensions.bottom === null) {
      dimensions.bottom = group.bottom;
    } else if (dimensions.bottom < group.bottom) {
      dimensions.bottom = group.bottom;
    }
  }
}
