function SVGClassService() {
  this.applyChargerClasses = applyChargerClasses;
  this.applyInverterClasses = applyInverterClasses;
  this.applyBatteryClasses = applyBatteryClasses;
  this.applyLoadClasses = applyLoadClasses;
  this.applyMCClasses = applyMCClasses;
  this.applyGeneratorClasses = applyGeneratorClasses;
  this.applyGridClasses = applyGridClasses;
  this.applyGridTieClasses = applyGridTieClasses;
  this.applyInverterChargerClasses = applyInverterChargerClasses;


  function applyInverterChargerClasses(inverterCharger, powerflow, powerflowObj, sysvars) {
    setHidden(!powerflow.inverterCharger.isPresent, inverterCharger.group);
    setHidden(!powerflow.load.isPresent || sysvars.SYS_LSYS_MULTI_CLUSTER_MODE === 1, inverterCharger.loadLinesGroup);
    setHidden(!powerflow.inverter.isPresent || sysvars.SYS_LSYS_MULTI_CLUSTER_MODE === 1, inverterCharger.lineToLoadBusGroup);
    setLineColor(powerflow.inverterCharger.load.lineColor, inverterCharger.lineToLoadBusGroup);
    setHidden(powerflow.inverter.isPresent || sysvars.SYS_LSYS_MULTI_CLUSTER_MODE === 1, inverterCharger.lineToLoadGroup);
    setLineColor(powerflow.inverterCharger.load.lineColor, inverterCharger.lineToLoadGroup);
    setHidden(!powerflow.grid.isPresent, inverterCharger.gridLinesGroup);
    setHidden(powerflow.gridTieInverter.isPresent || sysvars.SYS_LSYS_MULTI_CLUSTER_MODE === 1, inverterCharger.lineToGridGroup);
    setLineColor(powerflow.grid.lineColor, inverterCharger.lineToGridGroup);
    setHidden(!powerflow.gridTieInverter.isPresent && sysvars.SYS_LSYS_MULTI_CLUSTER_MODE === 0, inverterCharger.lineToGridBusGroup);
    setLineColor(powerflow.inverterCharger.grid.lineColor, inverterCharger.lineToGridBusGroup);
    setHidden(!powerflow.charger.isPresent, inverterCharger.lineToBatteryGroup);
    setLineColor(powerflow.inverterCharger.battery.lineColor, inverterCharger.lineToBatteryGroup);
    setHidden(powerflow.inverterCharger.type !== 'XW', inverterCharger.xwImage);
    setHidden(powerflow.inverterCharger.type !== 'CSW', inverterCharger.cswImage);
    setHidden(powerflow.inverterCharger.type !== 'FSW', inverterCharger.fswImage);
    setHidden(!powerflow.inverterCharger.alarms, inverterCharger.alarmGroup);
    setHidden(!powerflow.inverterCharger.warnings, inverterCharger.warningGroup);
    setHidden(!powerflow.charger.isPresent, inverterCharger.batteryText);
    setText(powerflow.inverterCharger.battery.text, inverterCharger.batteryText);
    setHidden(!powerflow.gridTieInverter.isPresent && sysvars.SYS_LSYS_MULTI_CLUSTER_MODE === 0, inverterCharger.gridText);
    setText(powerflow.inverterCharger.grid.text, inverterCharger.gridText);
    setHidden(!powerflow.inverter.isPresent, inverterCharger.loadText);
    setText(powerflow.inverterCharger.load.text, inverterCharger.loadText);
    document.getElementById("inverterChargerImage").onclick = function() {
      powerflowObj.inverterChargerClick();
    };
  }

  function applyGridTieClasses(gridTie, powerflow, powerflowObj) {
    setHidden(powerflow.gridTieInverter.type !== 'CL25', gridTie.cl25Image);
    setHidden(powerflow.gridTieInverter.type !== 'CL36', gridTie.cl36Image);
    setHidden(powerflow.gridTieInverter.type !== 'CL60', gridTie.cl60Image);
    setHidden(powerflow.gridTieInverter.type !== 'GT', gridTie.gtImage);
    setHidden(!powerflow.gridTieInverter.isPresent, gridTie.group);
    setImageColor(powerflow.gridTieInverter.imageColor, gridTie.image);
    setHidden(!powerflow.inverterCharger.isPresent, gridTie.lineToBus);
    setLineColor(powerflow.gridTieInverter.lineColor, gridTie.lineToBusGroup);
    setHidden(powerflow.inverterCharger.isPresent && powerflow.grid.isPresent, gridTie.lineToGridGroup);
    setLineColor(powerflow.gridTieInverter.lineColor, gridTie.lineToGridGroup);
    setHidden(!powerflow.gridTieInverter.alarms, gridTie.alarmGroup);
    setHidden(!powerflow.gridTieInverter.warnings, gridTie.warningGroup);
    setText(powerflow.gridTieInverter.text1, gridTie.text1);
    setText(powerflow.gridTieInverter.text1, gridTie.text2);
    setHidden(!powerflow.inverterCharger.isPresent, gridTie.text2);
    document.getElementById("inverterImageGT").onclick = function() {
      powerflowObj.gridTieInverterClick();
    };
  }

  function applyGridClasses(grid, powerflow, sysvars) {
    setHidden(!powerflow.gridTieInverter.isPresent && (!powerflow.inverterCharger.isPresent || !powerflow.grid.isPresent), grid.group);
    setImageColor(powerflow.grid.imageColor, grid.image);
    setHidden(!powerflow.inverterCharger.isPresent || (!powerflow.gridTieInverter.isPresent && sysvars.SYS_LSYS_MULTI_CLUSTER_MODE === 0) || !powerflow.grid.isPresent, grid.lineGroup);
    setLineColor(powerflow.grid.lineColor, grid.lineGroup);
    setHidden(!powerflow.inverterCharger.isPresent, grid.text);
    setText(powerflow.grid.text, grid.text);
  }

  function applyGeneratorClasses(generator, powerflow, powerflowObj, devices, sysvars) {
    setHidden(!powerflow.generator.isPresent || !powerflow.inverterCharger.isPresent, generator.group);
    setImageColor(powerflow.generator.imageColor, generator.image);
    setHidden(!powerflow.generator.isPresent || sysvars.SYS_LSYS_MULTI_CLUSTER_MODE !== 1, generator.lineToMCGroup);
    setHidden(!powerflow.generator.isPresent || sysvars.SYS_LSYS_MULTI_CLUSTER_MODE === 1, generator.lineToInverterChargerGroup);
    setLineColor(powerflow.generator.lineColor, sysvars.SYS_LSYS_MULTI_CLUSTER_MODE === 1 ? generator.lineToMCGroup : generator.lineToInverterChargerGroup);
    setText(powerflow.generator.text, generator.text);
    for (var index = 0; index < devices.ags.length; index++) {
      if (devices.ags[index].isActive === 'true') {
        setClickable(true, generator.imageGroup);
        document.getElementById("generatorImageGroup").onclick = function() {
          powerflowObj.generatorClick();
        };
      }
    }
  }

  function applyLoadClasses(load, powerflow, sysvars) {
    setHidden(!powerflow.inverterCharger.isPresent && !powerflow.inverter.isPresent && sysvars.SYS_LSYS_MULTI_CLUSTER_MODE !== 1, load.group);
    setHidden(!powerflow.load.isPresent && !powerflow.inverter.isPresent, load.image);
    setHidden(!powerflow.load.isPresent && !powerflow.inverter.isPresent, load.text);
    setImageColor(powerflow.load.imageColor, load.image);
    setHidden(!powerflow.inverter.isPresent || !powerflow.inverterCharger.isPresent || !powerflow.load.isPresent || sysvars.SYS_LSYS_MULTI_CLUSTER_MODE === 1, load.lineToBusGroup);
    setHidden(!powerflow.load.isPresent || sysvars.SYS_LSYS_MULTI_CLUSTER_MODE !== 1, load.lineToMCGroup);
    setLineColor(powerflow.load.lineColor, sysvars.SYS_LSYS_MULTI_CLUSTER_MODE !== 1 ? load.lineToBusGroup : load.lineToMCGroup);
    setText(powerflow.load.text, load.text);
  }

  function applyMCClasses(mc, sysvars) {
    setHidden(sysvars.SYS_LSYS_MULTI_CLUSTER_MODE !== 1, mc.group);
  }

  function applyBatteryClasses(battery, powerflow, powerflowObj) {
    setHidden(!powerflow.batteries.isPresent || (!powerflow.charger.isPresent && !powerflow.inverterCharger.isPresent), battery.group);
    setHidden(!powerflow.inverterCharger.isPresent, battery.linesGroup);
    setHidden(!powerflow.charger.isPresent, battery.lineToBusGroup);
    setLineColor(powerflow.batteries.lineColor, battery.lineToBusGroup);
    setHidden(powerflow.charger.isPresent, battery.lineToChargerGroup);
    setLineColor(powerflow.batteries.lineColor, battery.lineToChargerGroup);
    setText(powerflow.batteries.text, battery.text);

    setHidden(!powerflow.batteries.battery1.isPresent, battery.one.group);
    setClickable(powerflow.batteries.battery1.id, battery.one.imageGroup);
    setImageColor(powerflow.batteries.battery1.imageColor, battery.one.line1);
    setImageColor(powerflow.batteries.battery1.imageColor, battery.one.line2);
    setHidden(!powerflow.batteries.battery1.id, battery.one.text1);
    battery.one.text1.node.textContent = powerflow.batteries.battery1.text1;
    battery.one.text2.node.textContent = powerflow.batteries.battery1.text2;
    document.getElementById("batteryImage1Group").onclick = function() {
      powerflowObj.battmonClick(powerflow.batteries.battery1.id);
    };

    setHidden(!powerflow.batteries.battery2.isPresent, battery.two.group);
    setClickable(powerflow.batteries.battery2.id, battery.two.imageGroup);
    setImageColor(powerflow.batteries.battery2.imageColor, battery.two.line1);
    setImageColor(powerflow.batteries.battery2.imageColor, battery.two.line2);
    setHidden(!powerflow.batteries.battery2.id, battery.two.text1);
    battery.two.text1.node.textContent = powerflow.batteries.battery2.text1;
    battery.two.text2.node.textContent = powerflow.batteries.battery2.text2;
    document.getElementById("batteryImage2Group").onclick = function() {
      powerflowObj.battmonClick(powerflow.batteries.battery2.id);
    };

    setHidden(!powerflow.batteries.battery3.isPresent, battery.three.group);
    setClickable(powerflow.batteries.battery3.id, battery.three.imageGroup);
    setImageColor(powerflow.batteries.battery3.imageColor, battery.three.line1);
    setImageColor(powerflow.batteries.battery3.imageColor, battery.three.line2);
    setHidden(!powerflow.batteries.battery3.id, battery.three.text1);
    battery.three.text1.node.textContent = powerflow.batteries.battery3.text1;
    battery.three.text2.node.textContent = powerflow.batteries.battery3.text2;
    document.getElementById("batteryImage3Group").onclick = function() {
      powerflowObj.battmonClick(powerflow.batteries.battery3.id);
    };

    setHidden(!powerflow.batteries.battery4.isPresent, battery.four.group);
    setClickable(powerflow.batteries.battery4.id, battery.four.imageGroup);
    setImageColor(powerflow.batteries.battery4.imageColor, battery.four.line1);
    setImageColor(powerflow.batteries.battery4.imageColor, battery.four.line2);
    setHidden(!powerflow.batteries.battery4.id, battery.four.text1);
    battery.four.text1.node.textContent = powerflow.batteries.battery4.text1;
    battery.four.text2.node.textContent = powerflow.batteries.battery4.text2;
    document.getElementById("batteryImage4Group").onclick = function() {
      powerflowObj.battmonClick(powerflow.batteries.battery4.id);
    };

    setHidden(!powerflow.batteries.battery5.isPresent, battery.five.group);
    setClickable(powerflow.batteries.battery5.id, battery.five.imageGroup);
    setImageColor(powerflow.batteries.battery5.imageColor, battery.five.line1);
    setImageColor(powerflow.batteries.battery5.imageColor, battery.five.line2);
    setHidden(!powerflow.batteries.battery5.id, battery.five.text1);
    battery.five.text1.node.textContent = powerflow.batteries.battery5.text1;
    battery.five.text2.node.textContent = powerflow.batteries.battery5.text2;
    document.getElementById("batteryImage5Group").onclick = function() {
      powerflowObj.battmonClick(powerflow.batteries.battery5.id);
    };
  }

  function applyInverterClasses(inverter, powerflow, powerflowObj) {
    setHidden(!powerflow.inverter.isPresent, inverter.group);
    setImageColor(powerflow.inverter.imageColor, inverter.panelImage);
    setHidden(!powerflow.inverterCharger.isPresent, inverter.lineToBusGroup);
    setLineColor(powerflow.inverter.lineColor, inverter.lineToBusGroup);
    setHidden(powerflow.inverterCharger.isPresent && powerflow.load.isPresent, inverter.lineToLoadGroup);
    setLineColor(powerflow.inverter.lineColor, inverter.lineToLoadGroup);
    setHidden(powerflow.inverter.type !== 'CL25', inverter.cl25Image);
    setHidden(powerflow.inverter.type !== 'CL36', inverter.cl36Image);
    setHidden(powerflow.inverter.type !== 'CL60', inverter.cl60Image);
    setHidden(powerflow.inverter.type !== 'GT', inverter.gtImage);
    setHidden(!powerflow.inverter.alarms, inverter.alarmGroup);
    setHidden(!powerflow.inverter.warnings, inverter.warningGroup);
    setText(powerflow.inverter.text, inverter.text);
    document.getElementById("inverterImage").onclick = function() {
      powerflowObj.inverterClick();
    };
  }

  function applyChargerClasses(charger, powerflow, powerflowObj) {

    setHidden(!powerflow.charger.isPresent, charger.group);
    setImageColor(powerflow.charger.imageColor, charger.panelImage);

    if (powerflow.inverterCharger.isPresent || powerflow.inverter.isPresent || powerflow.gridTieInverter.isPresent) {
      setHidden(true, charger.lineToBatteryGroup);
    } else {
      setHidden(false, charger.lineToBatteryGroup);
    }
    setLineColor(powerflow.charger.lineColor, charger.lineToBatteryGroup);

    if (powerflow.inverterCharger.isPresent || (!powerflow.inverter.isPresent && !powerflow.gridTieInverter.isPresent)) {
      setHidden(true, charger.pathToBatteryGroup);
    } else {
      setHidden(false, charger.pathToBatteryGroup);
    }
    setLineColor(powerflow.charger.lineColor, charger.pathToBatteryGroup);

    if (!powerflow.inverterCharger.isPresent) {
      setHidden(true, charger.lineToBusGroup);
    } else {
      setHidden(false, charger.lineToBusGroup);
    }
    setLineColor(powerflow.charger.lineColor, charger.lineToBusGroup);

    if (powerflow.charger.type !== 'HVMPPT') {
      setHidden(true, charger.HVMPPTImage);
    } else {
      setHidden(false, charger.HVMPPTImage);
    }

    if (powerflow.charger.type !== 'MPPT') {
      setHidden(true, charger.MPPTImage);
    } else {
      setHidden(false, charger.MPPTImage);
    }

    setHidden(!powerflow.charger.alarms, charger.alarmGroup);
    setHidden(!powerflow.charger.warnings, charger.warningGroup);
    setText(powerflow.charger.text, charger.text);
    document.getElementById("chargerImage").onclick = function() {
      powerflowObj.chargerClick();
    };
  }

  function setText(value, element) {
    element.attr({
      text: value
    });
  }

  function setHidden(hidden, element) {
    if (hidden) {
      if (!element.hasClass('pf-hide')) {
        element.addClass('pf-hide');
      }
    } else {
      if (element.hasClass('pf-hide')) {
        element.removeClass('pf-hide');
      }
    }
  }

  function setClickable(clickable, element) {
    if (clickable) {
      if (!element.hasClass('pf-clickable')) {
        element.addClass('pf-clickable');
      }
    } else {
      if (element.hasClass('pf-clickable')) {
        element.removeClass('pf-clickable');
      }
    }
  }

  function setLineColor(linColor, element) {
    if (linColor === 'pf-line-green') {
      if (!element.hasClass('pf-line-green')) {
        element.addClass('pf-line-green');
      }
      if (element.hasClass('pf-line-grey')) {
        element.removeClass('pf-line-grey');
      }
    } else {
      if (!element.hasClass('pf-line-grey')) {
        element.addClass('pf-line-grey');
      }
      if (element.hasClass('pf-line-green')) {
        element.removeClass('pf-line-green');
      }
    }
  }

  function setImageColor(imageColor, element) {
    if (imageColor === 'pf-green') {
      if (!element.hasClass('pf-green')) {
        element.addClass('pf-green');
      }
      if (element.hasClass('pf-grey')) {
        element.removeClass('pf-grey');
      }
    } else {
      if (!element.hasClass('pf-grey')) {
        element.addClass('pf-grey');
      }
      if (element.hasClass('pf-green')) {
        element.removeClass('pf-green');
      }
    }
  }

}
