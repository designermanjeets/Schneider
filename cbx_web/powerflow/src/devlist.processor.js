function DevListProcessor() {
  this.processDeviceList = processDeviceList;
  this.processInverter = processInverter;
  this.processGenerator = processGenerator;
  this.processCharger = processCharger;
  this.processGridTieInverter = processGridTieInverter;
  this.processLoad = processLoad;
  this.processGrid = processGrid;
  this.relocateInverters = relocateInverters;
  this.processBatteries = processBatteries;
  this.processInverterCharger = processInverterCharger;

  //function used to process the batteries object for the frontend to bind too
  function processBatteries(batteries, data, batteryAssociations) {
    var activeBatteries = getActiveBatteries(data);
    batteries.numberOfBatteries = activeBatteries.length;
    if (batteries.numberOfBatteries === 0) {
      batteries.isPresent = false;
    } else {
      batteries.isPresent = true;
    }

    if (data.SYS_BATT_P >= 50) {
      setLineColor(batteries, "green");
      batteries.flow = "reverse";
      batteries.text = scaleValue(Math.abs(data.SYS_BATT_P)) + scaleUnit('W', Math.abs(data.SYS_BATT_P));
    } else if (data.SYS_BATT_P <= -50) {
      setLineColor(batteries, "green");
      batteries.flow = "forward";
      batteries.text = scaleValue(Math.abs(data.SYS_BATT_P)) + scaleUnit('W', Math.abs(data.SYS_BATT_P));
    } else {
      setLineColor(batteries, "grey");
      batteries.flow = "none";
      batteries.text = '';
    }

    if (activeBatteries.length === 1) {
      processBattery(batteries.battery3, data, activeBatteries[0], batteryAssociations['battery' + activeBatteries[0]]);
      batteries.battery1.isPresent = false;
      batteries.battery2.isPresent = false;
      batteries.battery4.isPresent = false;
      batteries.battery5.isPresent = false;
    } else if (activeBatteries.length === 2) {
      processBattery(batteries.battery2, data, activeBatteries[0], batteryAssociations['battery' + activeBatteries[0]]);
      processBattery(batteries.battery3, data, activeBatteries[1], batteryAssociations['battery' + activeBatteries[1]]);
      batteries.battery1.isPresent = false;
      batteries.battery4.isPresent = false;
      batteries.battery5.isPresent = false;
    } else if (activeBatteries.length === 3) {
      processBattery(batteries.battery2, data, activeBatteries[0], batteryAssociations['battery' + activeBatteries[0]]);
      processBattery(batteries.battery3, data, activeBatteries[1], batteryAssociations['battery' + activeBatteries[1]]);
      processBattery(batteries.battery4, data, activeBatteries[2], batteryAssociations['battery' + activeBatteries[2]]);
      batteries.battery1.isPresent = false;
      batteries.battery5.isPresent = false;
    } else if (activeBatteries.length === 4) {
      processBattery(batteries.battery1, data, activeBatteries[0], batteryAssociations['battery' + activeBatteries[0]]);
      processBattery(batteries.battery2, data, activeBatteries[1], batteryAssociations['battery' + activeBatteries[1]]);
      processBattery(batteries.battery3, data, activeBatteries[2], batteryAssociations['battery' + activeBatteries[2]]);
      processBattery(batteries.battery4, data, activeBatteries[3], batteryAssociations['battery' + activeBatteries[3]]);
      batteries.battery5.isPresent = false;
    } else if (activeBatteries.length === 5) {
      processBattery(batteries.battery1, data, activeBatteries[0], batteryAssociations['battery' + activeBatteries[0]]);
      processBattery(batteries.battery2, data, activeBatteries[1], batteryAssociations['battery' + activeBatteries[1]]);
      processBattery(batteries.battery3, data, activeBatteries[2], batteryAssociations['battery' + activeBatteries[2]]);
      processBattery(batteries.battery4, data, activeBatteries[3], batteryAssociations['battery' + activeBatteries[3]]);
      processBattery(batteries.battery5, data, activeBatteries[4], batteryAssociations['battery' + activeBatteries[4]]);
    }
  }

  //function which returns the active battieries based on if they have a voltage
  //greater than zero
  function getActiveBatteries(data) {
    var batteries = [];
    if (data.SYS_BATT1_V !== 0) {
      batteries.push(1);
    }
    if (data.SYS_BATT2_V !== 0) {
      batteries.push(2);
    }
    if (data.SYS_BATT3_V !== 0) {
      batteries.push(3);
    }
    if (data.SYS_BATT4_V !== 0) {
      batteries.push(4);
    }
    if (data.SYS_BATT5_V !== 0) {
      batteries.push(5);
    }
    return batteries;
  }

  //function used to process the inverter charger object for the frontend to bind too
  function processInverterCharger(inverterCharger, data) {
    if (data.SYS_INVCHG_BATT_P >= 50) {
      setLineColor(inverterCharger.battery, "green");
      inverterCharger.battery.flow = 'reverse';
      inverterCharger.battery.text = scaleValue(Math.abs(data.SYS_INVCHG_BATT_P)) + scaleUnit('W', Math.abs(data.SYS_INVCHG_BATT_P));
    } else if (data.SYS_INVCHG_BATT_P <= -50) {
      setLineColor(inverterCharger.battery, "green");
      inverterCharger.battery.flow = 'forward';
      inverterCharger.battery.text = scaleValue(Math.abs(data.SYS_INVCHG_BATT_P)) + scaleUnit('W', Math.abs(data.SYS_INVCHG_BATT_P));
    } else {
      setLineColor(inverterCharger.battery, "grey");
      inverterCharger.battery.flow = 'none';
      inverterCharger.battery.text = '';
    }

    if (data.SYS_INVCHG_GRID_P >= 50) {
      setLineColor(inverterCharger.grid, "green");
      inverterCharger.grid.flow = 'reverse';
      inverterCharger.grid.text = scaleValue(Math.abs(data.SYS_INVCHG_GRID_P)) + scaleUnit('W', Math.abs(data.SYS_INVCHG_GRID_P));
    } else if (data.SYS_INVCHG_GRID_P <= -50) {
      setLineColor(inverterCharger.grid, "green");
      inverterCharger.grid.flow = 'forward';
      inverterCharger.grid.text = scaleValue(Math.abs(data.SYS_INVCHG_GRID_P)) + scaleUnit('W', Math.abs(data.SYS_INVCHG_GRID_P));
    } else {
      setLineColor(inverterCharger.grid, "grey");
      inverterCharger.grid.flow = 'none';
      inverterCharger.grid.text = '';
    }

    if (data.SYS_INVCHG_LOAD_P >= 50) {
      setLineColor(inverterCharger.load, "green");
      inverterCharger.load.flow = 'reverse';
      inverterCharger.load.text = scaleValue(Math.abs(data.SYS_INVCHG_LOAD_P)) + scaleUnit('W', Math.abs(data.SYS_INVCHG_LOAD_P));
    } else if (data.SYS_INVCHG_LOAD_P <= -50) {
      setLineColor(inverterCharger.load, "green");
      inverterCharger.load.flow = 'forward';
      inverterCharger.load.text = scaleValue(Math.abs(data.SYS_INVCHG_LOAD_P)) + scaleUnit('W', Math.abs(data.SYS_INVCHG_LOAD_P));
    } else {
      setLineColor(inverterCharger.load, "grey");
      inverterCharger.load.flow = 'none';
      inverterCharger.load.text = '';
    }
  }

  //function used to process the battery object for the frontend to bind too
  function processBattery(battery, data, number, id) {
    if (data["SYS_BATT" + number + "_V"] !== 0) {
      battery.isPresent = true;
      if (data["SYS_BATT" + number + "_P"] >= 50) {
        battery.imageColor = "pf-green";
      } else if (data["SYS_BATT" + number + "_P"] <= -50) {
        battery.imageColor = "pf-green";
      } else {
        battery.imageColor = "pf-grey";
      }
      battery.text1 = data["SYS_BATT" + number + "_SOC"] + "%";
      battery.text2 = (data["SYS_BATT" + number + "_V"] / 1000).toFixed(1) + "V";
      battery.id = id;
    } else {
      battery.isPresent = false;
    }
    battery.soc = data["SYS_BATT" + number + "_SOC"];
  }

  //Function which move the inverters to the correct location based on its associationValue.
  //inverters can either be connected to the grid or the load
  function relocateInverters(powerflow, data, devices) {
    var index;
    var associationValue;
    var inverterLists = {
      inverters: [],
      gts: []
    };

    powerflow.inverter.isPresent = false;
    powerflow.inverter.type = "";
    powerflow.inverter.alarms = false;
    powerflow.inverter.warnings = false;
    powerflow.gridTieInverter.isPresent = false;
    powerflow.gridTieInverter.type = "";
    powerflow.gridTieInverter.alarms = false;
    powerflow.gridTieInverter.warnings = false;

    for (index = 0; index < devices.gts.length; index++) {
      associationValue = data[devices.gts[index].instance + "_" + devices.gts[index].name + "_ASSOC_CFG_AC_OUTPUT"];
      if (devices.gts[index].name === "GT") {
        if (associationValue >= 36 && associationValue <= 44) {
          powerflow.inverter.isPresent = true;
          powerflow.inverter.type = devices.gts[index].name;
          powerflow.inverter.alarms = powerflow.inverter.alarms || devices.gts[index].attributes.alarms !== "0";
          powerflow.inverter.warnings = powerflow.inverter.warnings || devices.gts[index].attributes.warnings !== "0";
          inverterLists.inverters.push(devices.gts[index]);
        } else if (associationValue >= 67 && associationValue <= 76) {
          powerflow.gridTieInverter.isPresent = true;
          powerflow.gridTieInverter.type = devices.gts[index].name;
          powerflow.gridTieInverter.alarms = powerflow.gridTieInverter.alarms || devices.gts[index].attributes.alarms !== "0";
          powerflow.gridTieInverter.warnings = powerflow.gridTieInverter.warnings || devices.gts[index].attributes.warnings !== "0";
          inverterLists.gts.push(devices.gts[index]);
        }
      } else if (devices.gts[index].name === "CL25" ||
        devices.gts[index].name === "CL36" ||
        devices.gts[index].name === "CL60") {
        if (associationValue === 2) {
          powerflow.gridTieInverter.isPresent = true;
          powerflow.gridTieInverter.type = devices.gts[index].name;
          powerflow.gridTieInverter.alarms = powerflow.gridTieInverter.alarms || devices.gts[index].attributes.alarms !== "0";
          powerflow.gridTieInverter.warnings = powerflow.gridTieInverter.warnings || devices.gts[index].attributes.warnings !== "0";
          inverterLists.gts.push(devices.gts[index]);
        } else if (associationValue === 1) {
          powerflow.inverter.isPresent = true;
          powerflow.inverter.type = devices.gts[index].name;
          powerflow.inverter.alarms = powerflow.inverter.alarms || devices.gts[index].attributes.alarms !== "0";
          powerflow.inverter.warnings = powerflow.inverter.warnings || devices.gts[index].attributes.warnings !== "0";
          inverterLists.inverters.push(devices.gts[index]);
        }
      }
    }

    for (index = 0; index < devices.inverters.length; index++) {
      associationValue = data[devices.inverters[index].instance + "_" + devices.inverters[index].name + "_ASSOC_CFG_AC_OUTPUT"];
      if (devices.inverters[index].name === "GT") {
        if (associationValue >= 36 && associationValue <= 44) {
          powerflow.inverter.isPresent = true;
          powerflow.inverter.type = devices.inverters[index].name;
          powerflow.inverter.alarms = powerflow.inverter.alarms || devices.inverters[index].attributes.alarms !== "0";
          powerflow.inverter.warnings = powerflow.inverter.warnings || devices.inverters[index].attributes.warnings !== "0";
          inverterLists.inverters.push(devices.inverters[index]);
        } else if (associationValue >= 67 && associationValue <= 76) {
          powerflow.gridTieInverter.isPresent = true;
          powerflow.gridTieInverter.type = devices.inverters[index].name;
          powerflow.gridTieInverter.alarms = powerflow.gridTieInverter.alarms || devices.inverters[index].attributes.alarms !== "0";
          powerflow.gridTieInverter.warnings = powerflow.gridTieInverter.warnings || devices.inverters[index].attributes.warnings !== "0";
          inverterLists.gts.push(devices.inverters[index]);
        }
      } else if (devices.inverters[index].name === "CL25" ||
        devices.inverters[index].name === "CL36" ||
        devices.inverters[index].name === "CL60") {
        if (associationValue === 2) {
          powerflow.gridTieInverter.isPresent = true;
          powerflow.gridTieInverter.type = devices.inverters[index].name;
          powerflow.gridTieInverter.alarms = powerflow.gridTieInverter.alarms || devices.inverters[index].attributes.alarms !== "0";
          powerflow.gridTieInverter.warnings = powerflow.gridTieInverter.warnings || devices.inverters[index].attributes.warnings !== "0";
          inverterLists.gts.push(devices.inverters[index]);
        } else if (associationValue === 1) {
          powerflow.inverter.isPresent = true;
          powerflow.inverter.type = devices.inverters[index].name;
          powerflow.inverter.alarms = powerflow.inverter.alarms || devices.inverters[index].attributes.alarms !== "0";
          powerflow.inverter.warnings = powerflow.inverter.warnings || devices.inverters[index].attributes.warnings !== "0";
          inverterLists.inverters.push(devices.inverters[index]);
        }
      }
    }

    devices.gts = inverterLists.gts;
    devices.inverters = inverterLists.inverters;

    if (data.SYS_LSYS_MULTI_CLUSTER_MODE === 1) {
      devices.inverters = [];
      devices.gts = inverterLists.gts.concat(inverterLists.inverters);

      powerflow.gridTieInverter.type = powerflow.gridTieInverter.isPresent ? powerflow.gridTieInverter.type : powerflow.inverter.type;
      powerflow.gridTieInverter.isPresent = powerflow.gridTieInverter.isPresent || powerflow.inverter.isPresent;
      powerflow.gridTieInverter.alarms = powerflow.gridTieInverter.alarms || powerflow.inverter.alarms;
      powerflow.gridTieInverter.warnings = powerflow.gridTieInverter.warnings || powerflow.inverter.warnings;

      powerflow.inverter.isPresent = false;
      powerflow.inverter.type = "";
      powerflow.inverter.alarms = false;
      powerflow.inverter.warnings = false;
    }
  }

  function processInverter(inverter, data) {
    if (data.SYS_INV_LOAD_P >= 50) {
      setLineColor(inverter, 'green');
      inverter.flow = 'forward';
      inverter.text = scaleValue(Math.abs(data.SYS_INV_LOAD_P)) + scaleUnit('W', Math.abs(data.SYS_INV_LOAD_P));
      inverter.imageColor = "pf-green";
    } else {
      setLineColor(inverter, 'grey');
      inverter.flow = 'none';
      inverter.text = '';
      inverter.imageColor = "pf-grey";
    }
  }

  //function used to process the grid object for the frontend to bind too
  function processGrid(powerflow, data) {
    if (data.SYS_GRID_IN_ACTIVE_LIFETIME > 0 || data.SYS_GRID_OUT_ACTIVE_LIFETIME > 0) {
      powerflow.grid.isPresent = true;
    } else {
      powerflow.grid.isPresent = false;
    }

    if (data.SYS_GRID_NET_P >= 50) {
      setLineColor(powerflow.grid, "green");
      powerflow.grid.flow = 'reverse';
      powerflow.grid.text = scaleValue(Math.abs(data.SYS_GRID_NET_P)) + scaleUnit('W', Math.abs(data.SYS_GRID_NET_P));
      powerflow.grid.imageColor = "pf-green";
    } else if (data.SYS_GRID_NET_P <= -50) {
      setLineColor(powerflow.grid, "green");
      powerflow.grid.flow = 'forward';
      powerflow.grid.text = scaleValue(Math.abs(data.SYS_GRID_NET_P)) + scaleUnit('W', Math.abs(data.SYS_GRID_NET_P));
      powerflow.grid.imageColor = "pf-green";
    } else {
      setLineColor(powerflow.grid, "grey");
      powerflow.grid.flow = 'none';
      powerflow.grid.text = '';
      powerflow.grid.imageColor = "pf-grey";
    }

    if ((!powerflow.inverterCharger.isPresent && powerflow.gridTieInverter.isPresent) ||
      (powerflow.inverterCharger.isPresent && powerflow.gridTieInverter.isPresent && !powerflow.grid.isPresent)) {
      if (data.SYS_INV_GRID_P >= 50) {
        setLineColor(powerflow.grid, "green");
        powerflow.grid.flow = 'reverse';
        powerflow.grid.text = scaleValue(Math.abs(data.SYS_INV_GRID_P)) + scaleUnit('W', Math.abs(data.SYS_INV_GRID_P));
        powerflow.grid.imageColor = "pf-green";
      } else {
        setLineColor(powerflow.grid, "grey");
        powerflow.grid.flow = 'none';
        powerflow.grid.text = '';
        powerflow.grid.imageColor = "pf-grey";
      }
    }
  }

  //function used to process the load object for the frontend to bind too
  function processLoad(powerflow, data) {
    if (data.SYS_LOAD_ACTIVE_LIFETIME !== 0) {
      powerflow.load.isPresent = true;
    } else {
      powerflow.load.isPresent = false;
    }
    var loadPower = data.SYS_LSYS_MULTI_CLUSTER_MODE === 1 ? data.SYS_MLT_LOAD_P : data.SYS_LOAD_P;
    if (loadPower >= 50) {
      setLineColor(powerflow.load, 'green');
      powerflow.load.flow = 'reverse';
      powerflow.load.text = scaleValue(Math.abs(loadPower)) + scaleUnit('W', Math.abs(loadPower));
      powerflow.load.imageColor = "pf-green";
    } else if (loadPower <= -50) {
      setLineColor(powerflow.load, 'green');
      powerflow.load.flow = 'forward';
      powerflow.load.text = scaleValue(Math.abs(loadPower)) + scaleUnit('W', Math.abs(loadPower));
      powerflow.load.imageColor = "pf-green";
    } else {
      setLineColor(powerflow.load, '');
      powerflow.load.flow = 'none';
      powerflow.load.text = "";
      powerflow.load.imageColor = "pf-grey";
    }

    if ((!powerflow.inverterCharger.isPresent && powerflow.inverter.isPresent) ||
      (powerflow.inverterCharger.isPresent && powerflow.inverter.isPresent && !powerflow.load.isPresent)) {
      if (data.SYS_INV_LOAD_P >= 50) {
        setLineColor(powerflow.load, 'green');
        powerflow.load.flow = 'reverse';
        powerflow.load.text = scaleValue(Math.abs(data.SYS_INV_LOAD_P)) + scaleUnit('W', Math.abs(data.SYS_INV_LOAD_P));
        powerflow.load.imageColor = "pf-green";

      } else {
        setLineColor(powerflow.load, '');
        powerflow.load.flow = 'none';
        powerflow.load.text = "";
        powerflow.load.imageColor = "pf-grey";
      }
    }
  }

  //function used to process the genertator object for the frontend to bind too
  function processGenerator(generator, data) {
    if (data.SYS_GEN_ACTIVE_LIFETIME !== 0) {
      generator.isPresent = true;
    } else {
      generator.isPresent = false;
    }

    if (data.SYS_GEN_P >= 50) {
      setLineColor(generator, "green");
      generator.flow = 'forward';
      generator.text = scaleValue(Math.abs(data.SYS_GEN_P)) + scaleUnit('W', Math.abs(data.SYS_GEN_P));
      generator.imageColor = "pf-green";
    } else {
      setLineColor(generator, "grey");
      generator.flow = 'none';
      generator.text = '';
      generator.imageColor = "pf-grey";
    }
  }

  //function used to process the charger object for the frontend to bind too
  function processCharger(charger, data) {
    if (data.SYS_PV_P >= 50) {
      setLineColor(charger, 'green');
      charger.flow = 'forward';
      charger.text = scaleValue(Math.abs(data.SYS_PV_P)) + scaleUnit('W', Math.abs(data.SYS_PV_P));
      charger.imageColor = "pf-green";
    } else {
      setLineColor(charger, 'grey');
      charger.flow = 'none';
      charger.text = "";
      charger.imageColor = "pf-grey";
    }
  }

  //function used to process the grid tie object for the frontend to bind too
  function processGridTieInverter(gridTieInverter, data) {
    if (data.SYS_INV_GRID_P >= 50) {
      setLineColor(gridTieInverter, 'green');
      gridTieInverter.flow = 'forward';
      gridTieInverter.text1 = scaleValue(Math.abs(data.SYS_INV_GRID_P)) + scaleUnit('W', Math.abs(data.SYS_INV_GRID_P));
      gridTieInverter.text2 = scaleValue(Math.abs(data.SYS_INV_GRID_P)) + scaleUnit('W', Math.abs(data.SYS_INV_GRID_P));
      gridTieInverter.imageColor = "pf-green";
    } else {
      setLineColor(gridTieInverter, 'grey');
      gridTieInverter.flow = 'none';
      gridTieInverter.text1 = '';
      gridTieInverter.text2 = '';
      gridTieInverter.imageColor = "pf-grey";
    }
  }

  function setLineColor(item, color) {
    switch (color) {
      case 'green':
        item.lineColor = "pf-line-green";
        break;
      case 'blue':
        item.lineColor = "pf-line-blue";
        break;
      default:
        item.lineColor = "pf-line-grey";
    }
  }

  function scaleValue(value) {
    if (!value && value !== 0) {
      return null;
    }

    if (value >= 1e9) {
      value = value / 1e9;
    } else if (value >= 1e6) {
      value = value / 1e6;
    } else {
      value = value / 1e3;
    }

    return roundToOne(value);
  }

  function scaleUnit(baseUnit, value) {
    if (value >= 1e9) {
      return "G" + baseUnit;
    } else if (value >= 1e6) {
      return "M" + baseUnit;
    }
    return "k" + baseUnit;
  }

  function roundToOne(num) {
    return +(Math.round(num + "e+1") + "e-1");
  }

  function processDeviceList(devlist) {
    var powerflow = {
      inverter: {
        flow: "",
        lineColor: 'pf-line-grey',
        text: "",
        isPresent: false,
        imageColor: "pf-grey",
        alarms: false,
        warnings: false,
        type: ''
      },
      load: {
        flow: "",
        lineColor: 'pf-line-grey',
        text: "",
        isPresent: false,
        imageColor: "pf-grey"
      },
      gridTieInverter: {
        flow: "",
        lineColor: 'pf-line-grey',
        text1: "",
        text2: "",
        isPresent: false,
        imageColor: "pf-grey",
        alarms: false,
        warnings: false,
        type: ''
      },
      grid: {
        flow: "",
        lineColor: 'pf-line-grey',
        text: "",
        isPresent: false,
        imageColor: "pf-grey"
      },
      generator: {
        flow: "",
        lineColor: 'pf-line-grey',
        text: "",
        isPresent: false,
        imageColor: "pf-grey"
      },
      inverterCharger: {
        battery: {
          flow: "",
          lineColor: 'pf-line-grey',
          text: ""
        },
        load: {
          flow: "",
          lineColor: 'pf-line-grey',
          text: ""
        },
        grid: {
          flow: "",
          lineColor: 'pf-line-grey',
          text: ""
        },
        isPresent: false,
        type: '',
        alarms: false,
        warnings: false
      },
      charger: {
        isPresent: false,
        flow: "",
        lineColor: 'pf-line-grey',
        text: "",
        imageColor: "pf-grey",
        alarms: false,
        warnings: false,
        type: ''
      },
      batteries: {
        flow: "",
        lineColor: 'pf-line-grey',
        text: "",
        isPresent: false,
        numberOfBatteries: 0,
        battery1: {
          text1: "",
          text2: "",
          soc: 0,
          imageColor: "pf-grey",
          isPresent: false,
          id: null
        },
        battery2: {
          text1: "",
          text2: "",
          numberOfBars: 0,
          soc: 0,
          imageColor: "pf-grey",
          isPresent: false,
          id: null
        },
        battery3: {
          text1: "",
          text2: "",
          numberOfBars: 0,
          soc: 0,
          imageColor: "pf-grey",
          isPresent: false,
          id: null
        },
        battery4: {
          text1: "",
          text2: "",
          numberOfBars: 0,
          soc: 0,
          imageColor: "pf-grey",
          isPresent: false,
          id: null
        },
        battery5: {
          text1: "",
          text2: "",
          numberOfBars: 0,
          soc: 0,
          imageColor: "pf-grey",
          isPresent: false,
          id: null
        }
      },
    };

    var devices = {
      inverters: [],
      chargers: [],
      battmons: [],
      inverterChargers: [],
      gts: [],
      ags: [],
      gridTieInverters: []
    };

    powerflow.inverterCharger.isPresent = false;
    powerflow.inverterCharger.type = '';
    powerflow.inverterCharger.warnings = false;
    powerflow.inverterCharger.alarms = false;
    powerflow.gridTieInverter.isPresent = false;
    powerflow.gridTieInverter.warnings = false;
    powerflow.gridTieInverter.alarms = false;
    powerflow.gridTieInverter.type = '';
    powerflow.inverter.isPresent = false;
    powerflow.inverter.warnings = false;
    powerflow.inverter.alarms = false;
    powerflow.inverter.type = '';
    powerflow.charger.isPresent = false;
    powerflow.charger.type = '';
    powerflow.charger.warnings = false;
    powerflow.charger.alarms = false;

    for (var index = 0; index < devlist.length; index++) {
      if (isDisplayable(devlist[index])) {
        switch (devlist[index].name) {
          case 'XW':
            powerflow.inverterCharger.type = 'XW';
            powerflow.inverterCharger.isPresent = true;
            powerflow.inverterCharger.alarms = powerflow.inverterCharger.alarms || devlist[index].attributes.alarms !== "0";
            powerflow.inverterCharger.warnings = powerflow.inverterCharger.warnings || devlist[index].attributes.warnings !== "0";
            devices.inverterChargers.push(devlist[index]);
            break;
          case 'CSW':
            if (powerflow.inverterCharger.type !== 'XW') {
              powerflow.inverterCharger.type = 'CSW';
              powerflow.inverterCharger.isPresent = true;
              powerflow.inverterCharger.alarms = powerflow.inverterCharger.alarms || devlist[index].attributes.alarms !== "0";
              powerflow.inverterCharger.warnings = powerflow.inverterCharger.warnings || devlist[index].attributes.warnings !== "0";
            }
            devices.inverterChargers.push(devlist[index]);
            break;
          case 'FSW':
            if (powerflow.inverterCharger.type !== 'XW') {
              powerflow.inverterCharger.type = 'FSW';
              powerflow.inverterCharger.isPresent = true;
              powerflow.inverterCharger.alarms = powerflow.inverterCharger.alarms || devlist[index].attributes.alarms !== "0";
              powerflow.inverterCharger.warnings = powerflow.inverterCharger.warnings || devlist[index].attributes.warnings !== "0";
            }
            devices.inverterChargers.push(devlist[index]);
            break;
          case 'GT':
            devices.gts.push(devlist[index]);
            break;
          case 'HVMPPT':
            powerflow.charger.type = 'HVMPPT';
            powerflow.charger.isPresent = true;
            powerflow.charger.alarms = powerflow.charger.alarms || devlist[index].attributes.alarms !== "0";
            powerflow.charger.warnings = powerflow.charger.warnings || devlist[index].attributes.warnings !== "0";
            devices.chargers.push(devlist[index]);
            break;
          case 'MPPT':
            if (powerflow.charger.type !== 'HVMPPT') {
              powerflow.charger.type = 'MPPT';
              powerflow.charger.isPresent = true;
              powerflow.charger.alarms = powerflow.charger.alarms || devlist[index].attributes.alarms !== "0";
              powerflow.charger.warnings = powerflow.charger.warnings || devlist[index].attributes.warnings !== "0";
            }
            devices.chargers.push(devlist[index]);
            break;
          case 'BATTMON':
            devices.battmons.push(devlist[index]);
            break;
          case 'AGS':
            devices.ags.push(devlist[index]);
            break;
          case 'CL25':
            devices.inverters.push(devlist[index]);
            break;
          case 'CL36':
            devices.inverters.push(devlist[index]);
            break;
          case 'CL60':
            devices.inverters.push(devlist[index]);
            break;
          default:
        }
      }
    }

    return {
      "devices": devices,
      "powerflow": powerflow
    };
  }

  function isDisplayable(device) {
    var displayable = true;

    if (device.isActive === 'false' || device.isUpgrading === 'true') {
      displayable = false;
    }

    if (device.attributes.interface === "xanbus" && (device.attributes.opMode !== "Operating" || device.attributes.inBootloader !== "0")) {
      displayable = false;
    }

    return displayable;
  }

}
