function SVGService(path) {
  var svgCenterService = new SVGCenterService();
  var svgLoadService = new SVGLoadService();
  this.updateSVG = updateSVG;
  this.stopAnimation = stopAnimation;
  document.getElementById('powerflow').innerHTML = svgLoadService.getPowerflow();

  var OFFSET_LENGTH = 115;
  var BATTERY_HEIGHT = 49;
  var BATTERY_Y_POSTION_BOTTOM = 93;
  var powerflow = {};
  var animation;
  var battery = {
    lineToBus: null,
    lineToCharger: null,
    group: null,
    linesGroup: null,
    lineToBusGroup: null,
    lineToChargerGroup: null,
    text: null,
    one: {
      group: null,
      image: null,
      line1: null,
      line2: null,
      line3: null,
      line4: null,
      text1: null,
      text2: null,
    },
    two: {
      group: null,
      image: null,
      line1: null,
      line2: null,
      line3: null,
      line4: null,
      text1: null,
      text2: null,
    },
    three: {
      group: null,
      image: null,
      line1: null,
      line2: null,
      line3: null,
      line4: null,
      text1: null,
      text2: null,
    },
    four: {
      group: null,
      image: null,
      line1: null,
      line2: null,
      line3: null,
      line4: null,
      text1: null,
      text2: null,
    },
    five: {
      group: null,
      image: null,
      line1: null,
      line2: null,
      line3: null,
      line4: null,
      text1: null,
      text2: null,
    }
  };

  var generator = {
    lineToInverterCharger: null,
    lineToMC: null,
    group: null,
    image: null,
    text: null,
    lineToInverterChargerGroup: null,
    lineToMCGroup: null
  };

  var load = {
    lineToBus: null,
    lineToMC: null,
    group: null,
    image: null,
    lineToBusGroup: null,
    lineToMCGroup: null,
    text: null,
  };

  var mc = {
    group: null
  };

  var charger = {
    group: null,
    lineToBattery: null,
    pathToBattery: null,
    lineToBus: null,
    panelImage: null,
    lineToBatteryGroup: null,
    pathToBatteryGroup: null,
    lineToBusGroup: null,
    image: null,
    HVMPPTImage: null,
    MPPTImage: null,
    alarmGroup: null,
    warningGroup: null,
  };

  var inverter = {
    group: null,
    lineToBus: null,
    lineToLoad: null,
    panelImage: null,
    lineToBusGroup: null,
    lineToLoadGroup: null,
    cl25Image: null,
    cl36Image: null,
    cl60Image: null,
    gtImage: null,
    alarmGroup: null,
    warningGroup: null,
    text: null,
    image: null
  };

  var gridTieInverter = {
    lineToBus: null,
    lineToLoad: null,
    group: null,
    image: null,
    lineToBusGroup: null,
    lineToGridGroup: null,
    gtImage: null,
    cl25Image: null,
    cl36Image: null,
    cl60Image: null,
    alarmGroup: null,
    warningGroup: null,
    text1: null,
    text2: null,
  };

  var grid = {
    line: null,
    group: null,
    image: null,
    lineGroup: null,
    text: null,
  };

  var inverterCharger = {
    group: null,
    image: null,
    lineToBattery: null,
    lineToLoadBus: null,
    lineToLoad: null,
    lineToGrid: null,
    lineToGridBus: null,
    loadLinesGroup: null,
    lineToLoadBusGroup: null,
    lineToLoadGroup: null,
    gridLinesGroup: null,
    lineToGridGroup: null,
    lineToGridBusGroup: null,
    lineToBatteryGroup: null,
    xwImage: null,
    cswImage: null,
    fswImage: null,
    text: null,
    alarmGroup: null,
    warningGroup: null,
    batteryText: null,
    gridText: null,
    loadText: null
  };

  var powerflowGroup;
  var clipPath_rect_battery1;
  var clipPath_rect_battery2;
  var clipPath_rect_battery3;
  var clipPath_rect_battery4;
  var clipPath_rect_battery5;
  var animate;
  var svgClassService = new SVGClassService();
  var snap = new Snap('#powerflow');
  setElements();

  function stopAnimation() {
    if (animation) {
      animation.stop();
    }
  }

  function setElements() {
    battery.group = snap.select('#batteryGroup');
    battery.lineToBus = snap.select('#batteryLineToBus');
    battery.lineToCharger = snap.select('#batteryLineToCharger');
    battery.linesGroup = snap.select('#batteryLinesGroup');
    battery.lineToBusGroup = snap.select('#batteryLineToBusGroup');
    battery.lineToChargerGroup = snap.select('#batteryLineToChargerGroup');
    battery.text = snap.select('#batteryText');
    battery.one.group = snap.select('#batteryGroup1');
    battery.one.imageGroup = snap.select('#batteryImage1Group');
    battery.one.image = snap.select('#batteryImage1');
    battery.one.line1 = snap.select('#battery1Line1');
    battery.one.line2 = snap.select('#battery1Line2');
    battery.one.text1 = snap.select('#battery1Text1');
    battery.one.text2 = snap.select('#battery1Text2');

    battery.two.group = snap.select('#batteryGroup2');
    battery.two.imageGroup = snap.select('#batteryImage2Group');
    battery.two.image = snap.select('#batteryImage2');
    battery.two.line1 = snap.select('#battery2Line1');
    battery.two.line2 = snap.select('#battery2Line2');
    battery.two.text1 = snap.select('#battery2Text1');
    battery.two.text2 = snap.select('#battery2Text2');

    battery.three.group = snap.select('#batteryGroup3');
    battery.three.imageGroup = snap.select('#batteryImage3Group');
    battery.three.image = snap.select('#batteryImage3');
    battery.three.line1 = snap.select('#battery3Line1');
    battery.three.line2 = snap.select('#battery3Line2');
    battery.three.text1 = snap.select('#battery3Text1');
    battery.three.text2 = snap.select('#battery3Text2');

    battery.four.group = snap.select('#batteryGroup4');
    battery.four.imageGroup = snap.select('#batteryImage4Group');
    battery.four.image = snap.select('#batteryImage4');
    battery.four.line1 = snap.select('#battery4Line1');
    battery.four.line2 = snap.select('#battery4Line2');
    battery.four.text1 = snap.select('#battery4Text1');
    battery.four.text2 = snap.select('#battery4Text2');

    battery.five.group = snap.select('#batteryGroup5');
    battery.five.imageGroup = snap.select('#batteryImage5Group');
    battery.five.image = snap.select('#batteryImage5');
    battery.five.line1 = snap.select('#battery5Line1');
    battery.five.line2 = snap.select('#battery5Line2');
    battery.five.text1 = snap.select('#battery5Text1');
    battery.five.text2 = snap.select('#battery5Text2');


    generator.lineToInverterCharger = snap.select('#generatorLineToInverterCharger');
    generator.lineToMC = snap.select('#generatorLineToMC');
    generator.group = snap.select('#generatorGroup');
    generator.imageGroup = snap.select('#generatorImageGroup');
    generator.image = snap.select('#generatorImage');
    generator.text = snap.select('#generatorText');
    generator.lineToInverterChargerGroup = snap.select('#generatorLineToInverterChargerGroup');
    generator.lineToMCGroup = snap.select('#generatorLineToMCGroup');

    load.lineToBus = snap.select('#loadLineToBus');
    load.lineToMC = snap.select('#loadLineToMC');
    load.group = snap.select('#loadGroup');
    load.image = snap.select('#loadImage');
    load.lineToBusGroup = snap.select('#loadLineToBusGroup');
    load.lineToMCGroup = snap.select('#loadLineToMCGroup');
    load.text = snap.select('#loadText');

    mc.group = snap.select('#multiClusterGroup');

    charger.group = snap.select('#chargerGroup');
    charger.lineToBattery = snap.select('#chargerLineToBattery');
    charger.pathToBattery = snap.select('#chargerPathToBattery');
    charger.lineToBus = snap.select('#chargerLineToBus');
    charger.panelImage = snap.select('#chargerPanelImage');
    charger.lineToBatteryGroup = snap.select('#chargerLineToBatteryGroup');
    charger.pathToBatteryGroup = snap.select('#chargerPathToBatteryGroup');
    charger.lineToBusGroup = snap.select('#chargerLineToBusGroup');
    charger.image = snap.select('#chargerImage');
    charger.HVMPPTImage = snap.select('#chargerHVMPPTImage');
    charger.MPPTImage = snap.select('#chargerMPPTImage');
    charger.alarmGroup = snap.select('#chargerAlarmGroup');
    charger.warningGroup = snap.select('#chargerWarningGroup');
    charger.text = snap.select('#chargerText');

    inverter.group = snap.select('#inverterGroup');
    inverter.lineToBus = snap.select('#inverterLineToBus');
    inverter.lineToLoad = snap.select('#inverterLineToLoad');
    inverter.panelImage = snap.select('#inverterPanelImage');
    inverter.lineToBusGroup = snap.select('#inverterLineToBusGroup');
    inverter.lineToLoadGroup = snap.select('#inverterLineToLoadGroup');
    inverter.cl25Image = snap.select('#inverterCL25Image');
    inverter.cl36Image = snap.select('#inverterCL36Image');
    inverter.cl60Image = snap.select('#inverterCL60Image');
    inverter.gtImage = snap.select('#inverterGTImage');
    inverter.alarmGroup = snap.select('#inverterAlarmGroup');
    inverter.warningGroup = snap.select('#inverterWarningGroup');
    inverter.text = snap.select('#inverterText');
    inverter.image = snap.select('#inverterImage');

    gridTieInverter.lineToBus = snap.select('#gridTieInverterLineToBus');
    gridTieInverter.lineToLoad = snap.select('#gridTieInverterLineToGrid');
    gridTieInverter.image = snap.select('#gridTieImage');
    gridTieInverter.imageGT = snap.select('#inverterImageGT');
    gridTieInverter.group = snap.select('#gridTieGroup');
    gridTieInverter.lineToBusGroup = snap.select('#gridTieInverterLineToBusGroup');
    gridTieInverter.lineToGridGroup = snap.select('#gridTieInverterLineToGridGroup');
    gridTieInverter.gtImage = snap.select('#gridTieGTImage');
    gridTieInverter.cl25Image = snap.select('#gridTieCL25Image');
    gridTieInverter.cl36Image = snap.select('#gridTieCL36Image');
    gridTieInverter.cl60Image = snap.select('#gridTieCL60Image');
    gridTieInverter.alarmGroup = snap.select('#gridTieAlarmGroup');
    gridTieInverter.warningGroup = snap.select('#gridTieWarningGroup');
    gridTieInverter.text1 = snap.select('#gridTieText1');
    gridTieInverter.text2 = snap.select('#gridTieText2');

    grid.line = snap.select('#gridLineToBus');
    grid.group = snap.select('#gridGroup');
    grid.image = snap.select('#gridImage');
    grid.lineGroup = snap.select('#gridLineToBusGroup');
    grid.text = snap.select('#gridText');


    inverterCharger.group = snap.select('#inverterChargerGroup');
    inverterCharger.lineToBattery = snap.select('#inverterChargerLineToBattery');
    inverterCharger.lineToLoadBus = snap.select('#inverterChargerLineToLoadBus');
    inverterCharger.lineToLoad = snap.select('#inverterChargerLineToLoad');
    inverterCharger.lineToGrid = snap.select('#inverterChargerLineToGrid');
    inverterCharger.lineToGridGroup = snap.select('#inverterChargerLineToGridGroup');
    inverterCharger.lineToGridBus = snap.select('#inverterChargerLineToGridBus');
    inverterCharger.loadLinesGroup = snap.select('#inverterChargerLoadLinesGroup');
    inverterCharger.lineToLoadBusGroup = snap.select('#inverterChargerLineToLoadBusGroup');
    inverterCharger.lineToLoadGroup = snap.select('#inverterChargerLineToLoadGroup');
    inverterCharger.gridLinesGroup = snap.select('#inverterChargerGridLinesGroup');
    inverterCharger.lineToGridBusGroup = snap.select('#inverterChargerLineToGridBusGroup');
    inverterCharger.lineToBatteryGroup = snap.select('#inverterChargerLineToBatteryGroup');
    inverterCharger.xwImage = snap.select('#inverterChargerXWImage');
    inverterCharger.cswImage = snap.select('#inverterChargerCSWImage');
    inverterCharger.fswImage = snap.select('#inverterChargerFSWImage');
    inverterCharger.text = snap.select('#inverterChargerText');
    inverterCharger.alarmGroup = snap.select('#inverterChargerAlarmGroup');
    inverterCharger.warningGroup = snap.select('#inverterChargerWarningGroup');
    inverterCharger.batteryText = snap.select('#inverterChargerBatteryText');
    inverterCharger.gridText = snap.select('#inverterChargerGridText');
    inverterCharger.loadText = snap.select('#inverterChargerLoadText');
    inverterCharger.image = snap.select('#inverterChargerImage');

    powerflowGroup = snap.select('#powerflow_group');
    clipPath_rect_battery1 = snap.select('#clipPath_rect_battery1');
    clipPath_rect_battery2 = snap.select('#clipPath_rect_battery2');
    clipPath_rect_battery3 = snap.select('#clipPath_rect_battery3');
    clipPath_rect_battery4 = snap.select('#clipPath_rect_battery4');
    clipPath_rect_battery5 = snap.select('#clipPath_rect_battery5');
  }

  function updateSVG(deviceInfo, powerflowObj, sysvars) {
    if (!svgClassService) {
      svgClassService = new svgClassService();
    }
    powerflow = deviceInfo.powerflow;
    //function used to animate all the lines on the SVG
    animate = function() {
      animation = Snap.animate(0, OFFSET_LENGTH, function(value) {
        battery.lineToBus.attr({
          'strokeDashoffset': getOffsetValue(value, 'batteries')
        });

        battery.lineToCharger.attr({
          'strokeDashoffset': getOffsetValue(value, 'batteries')
        });

        inverterCharger.lineToBattery.attr({
          'strokeDashoffset': getOffsetValue(value, 'inverterCharger.battery', 25)
        });

        inverterCharger.lineToLoadBus.attr({
          'strokeDashoffset': getOffsetValue(value, 'inverterCharger.load')
        });

        inverterCharger.lineToLoad.attr({
          'strokeDashoffset': getOffsetValue(value, 'inverterCharger.load')
        });

        inverterCharger.lineToGrid.attr({
          'strokeDashoffset': getOffsetValue(value, 'grid')
        });

        inverterCharger.lineToGridBus.attr({
          'strokeDashoffset': getOffsetValue(value, 'inverterCharger.grid', 35)
        });

        generator.lineToInverterCharger.attr({
          'strokeDashoffset': getOffsetValue(value, 'generator')
        });

        generator.lineToMC.attr({
          'strokeDashoffset': getOffsetValue(value, 'generator')
        });

        load.lineToBus.attr({
          'strokeDashoffset': getOffsetValue(value, 'load', -15)
        });

        load.lineToMC.attr({
          'strokeDashoffset': getOffsetValue(value, 'load', -15)
        });

        grid.line.attr({
          'strokeDashoffset': getOffsetValue(value, 'grid')
        });

        charger.lineToBattery.attr({
          'strokeDashoffset': getOffsetValue(value, 'charger')
        });

        charger.pathToBattery.attr({
          'strokeDashoffset': getOffsetValue(value, 'charger')
        });

        charger.lineToBus.attr({
          'strokeDashoffset': getOffsetValue(value, 'charger')
        });

        gridTieInverter.lineToBus.attr({
          'strokeDashoffset': getOffsetValue(value, 'gridTieInverter')
        });

        gridTieInverter.lineToLoad.attr({
          'strokeDashoffset': getOffsetValue(value, 'gridTieInverter')
        });

        inverter.lineToBus.attr({
          'strokeDashoffset': getOffsetValue(value, 'inverter')
        });

        inverter.lineToLoad.attr({
          'strokeDashoffset': getOffsetValue(value, 'inverter')
        });

      }, 2000, mina.linear, animate);
    };

    addClasses(powerflowObj, deviceInfo.devices, sysvars);
    //drawTextBackground();
    clipBatteries();
    transformImage();
    if (!animation) {
      animate();
    }

  }

  function addClasses(powerflowObj, devices, sysvars) {
    svgClassService.applyChargerClasses(charger, powerflow, powerflowObj);
    svgClassService.applyInverterClasses(inverter, powerflow, powerflowObj);
    svgClassService.applyBatteryClasses(battery, powerflow, powerflowObj);
    svgClassService.applyLoadClasses(load, powerflow, sysvars);
    svgClassService.applyGeneratorClasses(generator, powerflow, powerflowObj, devices, sysvars);
    svgClassService.applyGridClasses(grid, powerflow, sysvars);
    svgClassService.applyGridTieClasses(gridTieInverter, powerflow, powerflowObj);
    svgClassService.applyInverterChargerClasses(inverterCharger, powerflow, powerflowObj, sysvars);
    svgClassService.applyMCClasses(mc, sysvars);
  }

  //This function is called by the animate function which is used to calculate
  //the offset of the line dunamically
  function getOffsetValue(value, attributeName, offset) {
    if (getFlowLine(attributeName) === 'reverse') {
      return value + (offset ? offset : 0);
    } else if (getFlowLine(attributeName) === 'forward') {
      return OFFSET_LENGTH - value - (offset ? offset : 0);
    }
  }

  //Function used to apply an offset to the batteries and the entire
  //svg to center the visible objects
  function transformImage() {
    var coordinates = svgCenterService.getOffset(powerflow);
    if (!powerflow.inverterCharger.isPresent &&
      !powerflow.inverter.isPresent &&
      !powerflow.gridTieInverter.isPresent &&
      powerflow.charger.isPresent) {
      //Align batteries with charge controllers
      if (isTransformationRequired(battery.group, {
          x: -7.5,
          y: 540
        })) {
        battery.group.transform('T-7.5,540');
      }
    } else {
      //default battery location
      if (isTransformationRequired(battery.group, {
          x: 352.5,
          y: 540
        })) {
        battery.group.transform('T352.5,540');
      }
    }
    if (isTransformationRequired(powerflowGroup, coordinates)) {
      powerflowGroup.transform('T' + coordinates.x + ',' + coordinates.y);
    }
  }

  function isTransformationRequired(svg_element, coordinates) {
    var transformationRequired = true;
    var tranformation_matrix = svg_element.attr().transform;
    if (tranformation_matrix) {
      var oldCoordinates = getOldCoordinates(tranformation_matrix);
      if (oldCoordinates.x === coordinates.x && oldCoordinates.y === coordinates.y) {
        transformationRequired = false;
      }
    }
    return transformationRequired;
  }

  function getOldCoordinates(tranformation_matrix) {
    var coordinates = {
      x: 0,
      y: 0
    };
    var points = tranformation_matrix.replace("matrix(", "").replace(")", "").split(",");
    if (points.length === 6) {
      coordinates.x = parseFloat(points[4]);
      coordinates.y = parseFloat(points[5]);
    }
    return coordinates;
  }

  //function used to return the flow direction for a given line
  function getFlowLine(attributeName) {
    var attributeNames = attributeName.split('.');
    if (attributeNames.length > 1) {
      return powerflow[attributeNames[0]][attributeNames[1]].flow;
    } else {
      return powerflow[attributeName].flow;
    }
  }

  //Function used to draw a green backgroun to all texts fields without the id="schneider_text"
  function drawTextBackground() {
    var elements = document.getElementsByTagName("text");

    for (var index = 0; index < elements.length; index++) {
      if (elements[index].id !== "schneider_text") {
        try {
          var SVGRect = elements[index].getBBox();
          var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.setAttribute("x", SVGRect.x);
          rect.setAttribute("y", SVGRect.y);
          rect.setAttribute("rx", 3);
          rect.setAttribute("ry", 3);
          rect.setAttribute("width", SVGRect.width);
          rect.setAttribute("height", SVGRect.height);
          rect.setAttribute("id", elements[index].id + "Background");
          rect.setAttribute("class", "pfTextBackground");
          var background = elements[index].parentNode.querySelector("#" + elements[index].id + "Background");
          if (background !== null) {
            elements[index].parentNode.removeChild(background);
          }
          elements[index].parentNode.insertBefore(rect, elements[index]);
        } catch (error) {

        }
      }
    }
  }

  //function used to clip the battery image to show the appropiate state of charge
  function clipBatteries() {
    clipPath_rect_battery1.attr({
      'y': getClipXPosition(powerflow.batteries.battery1.soc)
    });
    clipPath_rect_battery2.attr({
      'y': getClipXPosition(powerflow.batteries.battery2.soc)
    });
    clipPath_rect_battery3.attr({
      'y': getClipXPosition(powerflow.batteries.battery3.soc)
    });
    clipPath_rect_battery4.attr({
      'y': getClipXPosition(powerflow.batteries.battery4.soc)
    });
    clipPath_rect_battery5.attr({
      'y': getClipXPosition(powerflow.batteries.battery5.soc)
    });
  }

  //function used to get the X postion of the clip.
  // 160 == absolute bottom of the image
  // 110 == hieght of the battery image
  function getClipXPosition(soc) {
    return BATTERY_Y_POSTION_BOTTOM - (BATTERY_HEIGHT * soc / 100);
  }
}
