describe("Devlist Processor test", function() {
  var devListProcessor = new DevListProcessor();

  it("Process DevList with MPPT charger only", function() {
    var DEVLIST = [{
      "name": "MPPT",
      "isActive": "false",
      "instance": 262217,
      "attributes": {
        "warnings": "0",
        "alarms": "0"
      }
    }];
    var result = devListProcessor.processDeviceList(DEVLIST);
    expect(result.powerflow.charger.isPresent).toBe(true);
    expect(result.powerflow.charger.type).toEqual("MPPT");
    expect(result.devices.chargers.length).toEqual(1);
    expect(result.devices.chargers[0].name).toEqual("MPPT");
    expect(result.devices.chargers[0].instance).toEqual(262217);
  });

  it("Process DevList with HVMPPT charger only", function() {
    var DEVLIST = [{
      "name": "HVMPPT",
      "isActive": "false",
      "instance": 1205422,
      "attributes": {
        "warnings": "1",
        "alarms": "1"
      }
    }];
    var result = devListProcessor.processDeviceList(DEVLIST);
    expect(result.powerflow.charger.isPresent).toBe(true);
    expect(result.powerflow.charger.type).toEqual("HVMPPT");
    expect(result.devices.chargers.length).toEqual(1);
    expect(result.devices.chargers[0].name).toEqual("HVMPPT");
    expect(result.devices.chargers[0].instance).toEqual(1205422);
  });

  it("Process DevList with HVMPPT and MPPT charger only", function() {
    var DEVLIST = [{
      "name": "MPPT",
      "isActive": "false",
      "instance": 262217,
      "attributes": {
        "warnings": "0",
        "alarms": "0"
      }
    }, {
      "name": "HVMPPT",
      "isActive": "false",
      "instance": 1205422,
      "attributes": {
        "warnings": "1",
        "alarms": "1"
      }
    }];
    var result = devListProcessor.processDeviceList(DEVLIST);
    expect(result.powerflow.charger.isPresent).toBe(true);
    expect(result.powerflow.charger.type).toEqual("HVMPPT");
    expect(result.devices.chargers.length).toEqual(2);
    expect(result.devices.chargers[0].name).toEqual("MPPT");
    expect(result.devices.chargers[0].instance).toEqual(262217);
    expect(result.devices.chargers[1].name).toEqual("HVMPPT");
    expect(result.devices.chargers[1].instance).toEqual(1205422);
  });

  it("Process DevList with CSW inverter charger only", function() {
    var DEVLIST = [{
      "name": "CSW",
      "isActive": "false",
      "instance": 262217,
      "attributes": {
        "warnings": "0",
        "alarms": "0"
      }
    }];
    var result = devListProcessor.processDeviceList(DEVLIST);
    expect(result.powerflow.inverterCharger.isPresent).toBe(true);
    expect(result.powerflow.inverterCharger.type).toEqual("CSW");
    expect(result.devices.inverterChargers.length).toEqual(1);
    expect(result.devices.inverterChargers[0].name).toEqual("CSW");
    expect(result.devices.inverterChargers[0].instance).toEqual(262217);
  });

  it("Processes with XW inverter charger only", function() {
    var DEVLIST = [{
      "name": "XW",
      "isActive": "false",
      "instance": 262117,
      "attributes": {
        "warnings": "0",
        "alarms": "0"
      }
    }];
    var result = devListProcessor.processDeviceList(DEVLIST);
    expect(result.powerflow.inverterCharger.isPresent).toBe(true);
    expect(result.powerflow.inverterCharger.type).toEqual("XW");
    expect(result.devices.inverterChargers.length).toEqual(1);
    expect(result.devices.inverterChargers[0].name).toEqual("XW");
    expect(result.devices.inverterChargers[0].instance).toEqual(262117);
  });

  it("Processe DevList with XW and CSW inverter charger only", function() {
    var DEVLIST = [{
      "name": "CSW",
      "isActive": "false",
      "instance": 262217,
      "attributes": {
        "warnings": "0",
        "alarms": "0"
      }
    }, {
      "name": "XW",
      "isActive": "false",
      "instance": 262117,
      "attributes": {
        "warnings": "0",
        "alarms": "0"
      }
    }];
    var result = devListProcessor.processDeviceList(DEVLIST);
    expect(result.powerflow.inverterCharger.isPresent).toBe(true);
    expect(result.powerflow.inverterCharger.type).toEqual("XW");
    expect(result.devices.inverterChargers.length).toEqual(2);
    expect(result.devices.inverterChargers[0].name).toEqual("CSW");
    expect(result.devices.inverterChargers[0].instance).toEqual(262217);
    expect(result.devices.inverterChargers[1].name).toEqual("XW");
    expect(result.devices.inverterChargers[1].instance).toEqual(262117);
  });

  it("Process inverter", function() {
    var inverter = {
      flow: "",
      lineColor: '',
      text: "",
      isPresent: false,
      imageColor: "",
      alarms: false,
      warnings: false,
      type: ''
    };
    devListProcessor.processInverter(inverter, {
      'SYS_PV_AC_P': 300
    });

    expect(inverter.flow).toEqual("forward");
    expect(inverter.text).toEqual("300w");
    expect(inverter.lineColor).toEqual("pf-line-green");
    expect(inverter.imageColor).toEqual("pf-green");
  });

  it("Process inverter with no flow", function() {
    var inverter = {
      flow: "",
      lineColor: '',
      text: "",
      isPresent: false,
      imageColor: "",
      alarms: false,
      warnings: false,
      type: ''
    };
    devListProcessor.processInverter(inverter, {
      'SYS_PV_AC_P': 0
    });

    expect(inverter.flow).toEqual("none");
    expect(inverter.text).toEqual("");
    expect(inverter.lineColor).toEqual("pf-line-grey");
    expect(inverter.imageColor).toEqual("pf-grey");
  });

  it("Process generator with no ACTIVE_LIFETIME", function() {
    var generator = {
      flow: "",
      lineColor: 'pf-line-grey',
      text: "",
      isPresent: true,
      imageColor: "pf-grey"
    };

    var sysvars = {
      "SYS_GEN_ACTIVE_LIFETIME": 0
    };
    devListProcessor.processGenerator(generator, sysvars);
    expect(generator.isPresent).toBe(false);
  });

  it("Process generator with ACTIVE_LIFETIME", function() {
    var generator = {
      flow: "",
      lineColor: 'pf-line-grey',
      text: "",
      isPresent: false,
      imageColor: "pf-grey"
    };

    var sysvars = {
      "SYS_GEN_ACTIVE_LIFETIME": 1
    };
    devListProcessor.processGenerator(generator, sysvars);
    expect(generator.isPresent).toBe(true);
  });

  it("Process generator with flow", function() {
    var generator = {
      flow: "",
      lineColor: '',
      text: "",
      isPresent: false,
      imageColor: ""
    };

    var sysvars = {
      "SYS_GEN_ACTIVE_LIFETIME": 1,
      "SYS_GEN_P": 300
    };

    devListProcessor.processGenerator(generator, sysvars);
    expect(generator.isPresent).toBe(true);
    expect(generator.flow).toEqual("forward");
    expect(generator.text).toEqual("300w");
    expect(generator.lineColor).toEqual("pf-line-green");
    expect(generator.imageColor).toEqual("pf-green");
  });

  it("Process generator with flow", function() {
    var generator = {
      flow: "",
      lineColor: '',
      text: "",
      isPresent: false,
      imageColor: ""
    };

    var sysvars = {
      "SYS_GEN_ACTIVE_LIFETIME": 1,
      "SYS_GEN_P": 0
    };

    devListProcessor.processGenerator(generator, sysvars);
    expect(generator.isPresent).toBe(true);
    expect(generator.flow).toEqual("none");
    expect(generator.text).toEqual("");
    expect(generator.lineColor).toEqual("pf-line-grey");
    expect(generator.imageColor).toEqual("pf-grey");
  });

  it("Process charger with flow", function() {
    var charger = {
      isPresent: false,
      flow: "",
      lineColor: '',
      text: "",
      imageColor: "",
      alarms: false,
      warnings: false,
      type: ''
    };

    var sysvars = {
      "SYS_PV_P": 300
    };

    devListProcessor.processCharger(charger, sysvars);
    expect(charger.flow).toEqual("forward");
    expect(charger.text).toEqual("300w");
    expect(charger.lineColor).toEqual("pf-line-green");
    expect(charger.imageColor).toEqual("pf-green");
  });

  it("Process charger with no flow", function() {
    var charger = {
      isPresent: false,
      flow: "",
      lineColor: '',
      text: "",
      imageColor: "",
      alarms: false,
      warnings: false,
      type: ''
    };

    var sysvars = {
      "SYS_PV_P": 0
    };

    devListProcessor.processCharger(charger, sysvars);
    expect(charger.flow).toEqual("none");
    expect(charger.text).toEqual("");
    expect(charger.lineColor).toEqual("pf-line-grey");
    expect(charger.imageColor).toEqual("pf-grey");
  });

  it("Process gridTie with flow", function() {
    var gridTie = {
      flow: "",
      lineColor: '',
      text1: "",
      text2: "",
      isPresent: false,
      imageColor: "",
      alarms: false,
      warnings: false,
      type: ''
    };

    var sysvars = {
      "SYS_GT_PV_P": 100,
      "SYS_GT_GRID_P": 200
    };

    devListProcessor.processGridTieInverter(gridTie, sysvars);
    expect(gridTie.flow).toEqual("forward");
    expect(gridTie.text1).toEqual("100w");
    expect(gridTie.text2).toEqual("200w");
    expect(gridTie.lineColor).toEqual("pf-line-green");
    expect(gridTie.imageColor).toEqual("pf-green");
  });

  it("Process GridTie with no flow", function() {
    var gridTie = {
      flow: "",
      lineColor: '',
      text1: "100",
      text2: "200",
      isPresent: false,
      imageColor: "",
      alarms: false,
      warnings: false,
      type: ''
    };

    var sysvars = {
      "SYS_GT_PV_P": 0,
      "SYS_GT_GRID_P": 200
    };

    devListProcessor.processGridTieInverter(gridTie, sysvars);
    expect(gridTie.flow).toEqual("none");
    expect(gridTie.text1).toEqual("");
    expect(gridTie.text2).toEqual("");
    expect(gridTie.lineColor).toEqual("pf-line-grey");
    expect(gridTie.imageColor).toEqual("pf-grey");
  });

  it("Process load with no ACTIVE_LIFETIME", function() {
    var devices = {
      load: {
        flow: "",
        lineColor: 'pf-line-grey',
        text: "",
        isPresent: true,
        imageColor: "pf-grey"
      },
      inverterCharger: {
        isPresent: false
      },
      inverter: {
        isPresent: false
      }
    };

    var sysvars = {
      "SYS_LOAD_ACTIVE_LIFETIME": 0,
      "SYS_LOAD_P": 0,
      "SYS_PV_AC_P": 0
    };

    devListProcessor.processLoad(devices, sysvars);
    expect(devices.load.isPresent).toBe(false);
  });

  it("Process load with ACTIVE_LIFETIME", function() {
    var devices = {
      load: {
        flow: "",
        lineColor: 'pf-line-grey',
        text: "",
        isPresent: false,
        imageColor: "pf-grey"
      },
      inverterCharger: {
        isPresent: false
      },
      inverter: {
        isPresent: false
      }
    };

    var sysvars = {
      "SYS_LOAD_ACTIVE_LIFETIME": 10,
      "SYS_LOAD_P": 0,
      "SYS_PV_AC_P": 0
    };

    devListProcessor.processLoad(devices, sysvars);
    expect(devices.load.isPresent).toBe(true);
  });

  it("Process load with no load", function() {
    var devices = {
      load: {
        flow: "",
        lineColor: '',
        text: "abc",
        isPresent: false,
        imageColor: ""
      },
      inverterCharger: {
        isPresent: false
      },
      inverter: {
        isPresent: false
      }
    };

    var sysvars = {
      "SYS_LOAD_ACTIVE_LIFETIME": 10,
      "SYS_LOAD_P": 0,
      "SYS_PV_AC_P": 0
    };

    devListProcessor.processLoad(devices, sysvars);
    expect(devices.load.isPresent).toBe(true);
    expect(devices.load.flow).toEqual("none");
    expect(devices.load.lineColor).toEqual("pf-line-grey");
    expect(devices.load.imageColor).toEqual("pf-grey");
    expect(devices.load.text).toEqual("");
  });

  it("Process load with inverterCharger load", function() {
    var devices = {
      load: {
        flow: "",
        lineColor: '',
        text: "abc",
        isPresent: false,
        imageColor: ""
      },
      inverterCharger: {
        isPresent: false
      },
      inverter: {
        isPresent: false
      }
    };

    var sysvars = {
      "SYS_LOAD_ACTIVE_LIFETIME": 10,
      "SYS_LOAD_P": 100,
      "SYS_PV_AC_P": 0
    };

    devListProcessor.processLoad(devices, sysvars);
    expect(devices.load.isPresent).toBe(true);
    expect(devices.load.flow).toEqual("reverse");
    expect(devices.load.lineColor).toEqual("pf-line-green");
    expect(devices.load.imageColor).toEqual("pf-green");
    expect(devices.load.text).toEqual("100w");
  });

  it("Process load with invert load", function() {
    var devices = {
      load: {
        flow: "",
        lineColor: '',
        text: "abc",
        isPresent: false,
        imageColor: ""
      },
      inverterCharger: {
        isPresent: false
      },
      inverter: {
        isPresent: true
      }
    };

    var sysvars = {
      "SYS_LOAD_ACTIVE_LIFETIME": 10,
      "SYS_LOAD_P": 0,
      "SYS_PV_AC_P": 100
    };

    devListProcessor.processLoad(devices, sysvars);
    expect(devices.load.isPresent).toBe(true);
    expect(devices.load.flow).toEqual("reverse");
    expect(devices.load.lineColor).toEqual("pf-line-green");
    expect(devices.load.imageColor).toEqual("pf-green");
    expect(devices.load.text).toEqual("100w");
  });

  it("Process grid with no ACTIVE_LIFETIME", function() {
    var devices = {
      grid: {
        flow: "",
        lineColor: '',
        text: "",
        isPresent: true,
        imageColor: ""
      },
      inverterCharger: {
        isPresent: false
      },
      gridTieInverter: {
        isPresent: false
      }
    };

    var sysvars = {
      "SYS_GRID_IN_ACTIVE_LIFETIME": 0,
      "SYS_GRID_OUT_ACTIVE_LIFETIME": 0,
      "SYS_GRID_NET_P": 0,
      "SYS_GT_GRID_P": 0
    };

    devListProcessor.processGrid(devices, sysvars);
    expect(devices.grid.isPresent).toBe(false);
  });

  it("Process grid with ACTIVE_LIFETIME", function() {
    var devices = {
      grid: {
        flow: "",
        lineColor: '',
        text: "",
        isPresent: false,
        imageColor: ""
      },
      inverterCharger: {
        isPresent: false
      },
      gridTieInverter: {
        isPresent: false
      }
    };

    var sysvars = {
      "SYS_GRID_IN_ACTIVE_LIFETIME": 100,
      "SYS_GRID_OUT_ACTIVE_LIFETIME": 0,
      "SYS_GRID_NET_P": 0,
      "SYS_GT_GRID_P": 0
    };

    devListProcessor.processGrid(devices, sysvars);
    expect(devices.grid.isPresent).toBe(true);
    devices.grid.isPresent = false;
    sysvars.SYS_GRID_IN_ACTIVE_LIFETIME = 0;
    sysvars.SYS_GRID_OUT_ACTIVE_LIFETIME = 100;
    devListProcessor.processGrid(devices, sysvars);
    expect(devices.grid.isPresent).toBe(true);
  });

  it("Process grid with InverterCharger and flow", function() {
    var devices = {
      grid: {
        flow: "",
        lineColor: '',
        text: "",
        isPresent: false,
        imageColor: ""
      },
      inverterCharger: {
        isPresent: false
      },
      gridTieInverter: {
        isPresent: false
      }
    };

    var sysvars = {
      "SYS_GRID_IN_ACTIVE_LIFETIME": 100,
      "SYS_GRID_OUT_ACTIVE_LIFETIME": 0,
      "SYS_GRID_NET_P": 100,
      "SYS_GT_GRID_P": 0
    };

    devListProcessor.processGrid(devices, sysvars);
    expect(devices.grid.isPresent).toBe(true);
    expect(devices.grid.flow).toEqual("reverse");
    expect(devices.grid.lineColor).toEqual("pf-line-green");
    expect(devices.grid.imageColor).toEqual("pf-green");
    expect(devices.grid.text).toEqual("100w");
  });

  it("Process grid with InverterCharger and no flow", function() {
    var devices = {
      grid: {
        flow: "",
        lineColor: '',
        text: "",
        isPresent: false,
        imageColor: ""
      },
      inverterCharger: {
        isPresent: false
      },
      gridTieInverter: {
        isPresent: false
      }
    };

    var sysvars = {
      "SYS_GRID_IN_ACTIVE_LIFETIME": 100,
      "SYS_GRID_OUT_ACTIVE_LIFETIME": 0,
      "SYS_GRID_NET_P": 0,
      "SYS_GT_GRID_P": 0
    };

    devListProcessor.processGrid(devices, sysvars);
    expect(devices.grid.isPresent).toBe(true);
    expect(devices.grid.flow).toEqual("none");
    expect(devices.grid.lineColor).toEqual("pf-line-grey");
    expect(devices.grid.imageColor).toEqual("pf-grey");
    expect(devices.grid.text).toEqual("");
  });

  it("Process grid with InverterCharger and negative flow", function() {
    var devices = {
      grid: {
        flow: "",
        lineColor: '',
        text: "",
        isPresent: false,
        imageColor: ""
      },
      inverterCharger: {
        isPresent: false
      },
      gridTieInverter: {
        isPresent: false
      }
    };

    var sysvars = {
      "SYS_GRID_IN_ACTIVE_LIFETIME": 100,
      "SYS_GRID_OUT_ACTIVE_LIFETIME": 0,
      "SYS_GRID_NET_P": -100,
      "SYS_GT_GRID_P": 0
    };

    devListProcessor.processGrid(devices, sysvars);
    expect(devices.grid.isPresent).toBe(true);
    expect(devices.grid.flow).toEqual("forward");
    expect(devices.grid.lineColor).toEqual("pf-line-green");
    expect(devices.grid.imageColor).toEqual("pf-green");
    expect(devices.grid.text).toEqual("100w");
  });

  it("Process grid with inverter and flow", function() {
    var devices = {
      grid: {
        flow: "",
        lineColor: '',
        text: "",
        isPresent: false,
        imageColor: ""
      },
      inverterCharger: {
        isPresent: false
      },
      gridTieInverter: {
        isPresent: true
      }
    };

    var sysvars = {
      "SYS_GRID_IN_ACTIVE_LIFETIME": 100,
      "SYS_GRID_OUT_ACTIVE_LIFETIME": 0,
      "SYS_GRID_NET_P": 0,
      "SYS_GT_GRID_P": 100
    };

    devListProcessor.processGrid(devices, sysvars);
    expect(devices.grid.isPresent).toBe(true);
    expect(devices.grid.flow).toEqual("reverse");
    expect(devices.grid.lineColor).toEqual("pf-line-green");
    expect(devices.grid.imageColor).toEqual("pf-green");
    expect(devices.grid.text).toEqual("100w");
  });

  it("Process grid with inverter and no flow", function() {
    var devices = {
      grid: {
        flow: "",
        lineColor: '',
        text: "",
        isPresent: false,
        imageColor: ""
      },
      inverterCharger: {
        isPresent: false
      },
      gridTieInverter: {
        isPresent: true
      }
    };

    var sysvars = {
      "SYS_GRID_IN_ACTIVE_LIFETIME": 100,
      "SYS_GRID_OUT_ACTIVE_LIFETIME": 0,
      "SYS_GRID_NET_P": 200,
      "SYS_GT_GRID_P": 0
    };

    devListProcessor.processGrid(devices, sysvars);
    expect(devices.grid.isPresent).toBe(true);
    expect(devices.grid.flow).toEqual("none");
    expect(devices.grid.lineColor).toEqual("pf-line-grey");
    expect(devices.grid.imageColor).toEqual("pf-grey");
    expect(devices.grid.text).toEqual("");
  });

  it("Relocate Inverters gt as gt", function() {
    var devices = {
      inverter: {
        isPresent: true
      },
      gridTieInverter: {
        isPresent: false
      }
    };

    var inverterLists = {
      inverters: [],
      gts: [{
        "name": "GT",
        "instance": "1234",
        "attributes": {
          "alarms": false,
          "warnings": false
        }
      }]
    };

    var sysvars = {
      "1234_GT_ASSOC_CFG_AC_OUTPUT": 67
    };

    devListProcessor.relocateInverters(devices, sysvars, inverterLists);
    expect(devices.gridTieInverter.isPresent).toBe(true);
    expect(devices.inverter.isPresent).toBe(false);
    expect(inverterLists.gts.length).toEqual(1);
    expect(inverterLists.inverters.length).toEqual(0);
    expect(devices.gridTieInverter.type).toEqual("GT");

    inverterLists = {
      inverters: [{
        "name": "GT",
        "instance": "1234",
        "attributes": {
          "alarms": false,
          "warnings": false
        }
      }],
      gts: []
    };

    devListProcessor.relocateInverters(devices, sysvars, inverterLists);
    expect(devices.gridTieInverter.isPresent).toBe(true);
    expect(devices.inverter.isPresent).toBe(false);
    expect(inverterLists.gts.length).toEqual(1);
    expect(inverterLists.inverters.length).toEqual(0);
    expect(devices.gridTieInverter.type).toEqual("GT");
  });

  it("Relocate Inverters gt as inverter", function() {
    var devices = {
      inverter: {
        isPresent: true
      },
      gridTieInverter: {
        isPresent: false
      }
    };

    var inverterLists = {
      inverters: [{
        "name": "GT",
        "instance": "1234",
        "attributes": {
          "alarms": false,
          "warnings": false
        }
      }],
      gts: []
    };

    var sysvars = {
      "1234_GT_ASSOC_CFG_AC_OUTPUT": 36
    };

    devListProcessor.relocateInverters(devices, sysvars, inverterLists);
    expect(devices.gridTieInverter.isPresent).toBe(false);
    expect(devices.inverter.isPresent).toBe(true);
    expect(inverterLists.gts.length).toEqual(0);
    expect(inverterLists.inverters.length).toEqual(1);
    expect(devices.inverter.type).toEqual("GT");

    inverterLists = {
      inverters: [],
      gts: [{
        "name": "GT",
        "instance": "1234",
        "attributes": {
          "alarms": false,
          "warnings": false
        }
      }]
    };

    devListProcessor.relocateInverters(devices, sysvars, inverterLists);
    expect(devices.gridTieInverter.isPresent).toBe(false);
    expect(devices.inverter.isPresent).toBe(true);
    expect(inverterLists.gts.length).toEqual(0);
    expect(inverterLists.inverters.length).toEqual(1);
    expect(devices.inverter.type).toEqual("GT");
  });

  it("Relocate Inverters gt no alarms no warings", function() {
    var devices = {
      inverter: {
        isPresent: true,
        alarms: true,
        warnings: true
      },
      gridTieInverter: {
        isPresent: false,
        alarms: true,
        warnings: true
      }
    };

    var inverterLists = {
      inverters: [],
      gts: [{
        "name": "GT",
        "instance": "1234",
        "attributes": {
          "alarms": "0",
          "warnings": "0"
        }
      }]
    };

    var sysvars = {
      "1234_GT_ASSOC_CFG_AC_OUTPUT": 67
    };

    devListProcessor.relocateInverters(devices, sysvars, inverterLists);
    expect(devices.gridTieInverter.alarms).toBe(false);
    expect(devices.gridTieInverter.warnings).toBe(false);
    expect(devices.inverter.alarms).toBe(false);
    expect(devices.inverter.warnings).toBe(false);

    sysvars = {
      "1234_GT_ASSOC_CFG_AC_OUTPUT": 36
    };

    inverterLists = {
      inverters: [{
        "name": "GT",
        "instance": "1234",
        "attributes": {
          "alarms": "0",
          "warnings": "0"
        }
      }],
      gts: []
    };

    devices = {
      inverter: {
        isPresent: true,
        alarms: true,
        warnings: true
      },
      gridTieInverter: {
        isPresent: false,
        alarms: true,
        warnings: true
      }
    };

    devListProcessor.relocateInverters(devices, sysvars, inverterLists);
    expect(devices.gridTieInverter.alarms).toBe(false);
    expect(devices.gridTieInverter.warnings).toBe(false);
    expect(devices.inverter.alarms).toBe(false);
    expect(devices.inverter.warnings).toBe(false);
  });

  it("Relocate Inverters gt alarms warings", function() {
    var devices = {
      inverter: {
        isPresent: true,
        alarms: false,
        warnings: false
      },
      gridTieInverter: {
        isPresent: false,
        alarms: false,
        warnings: false
      }
    };

    var inverterLists = {
      inverters: [],
      gts: [{
        "name": "GT",
        "instance": "1234",
        "attributes": {
          "alarms": "1",
          "warnings": "1"
        }
      }]
    };

    var sysvars = {
      "1234_GT_ASSOC_CFG_AC_OUTPUT": 67
    };

    devListProcessor.relocateInverters(devices, sysvars, inverterLists);
    expect(devices.gridTieInverter.alarms).toBe(true);
    expect(devices.gridTieInverter.warnings).toBe(true);
    expect(devices.inverter.alarms).toBe(false);
    expect(devices.inverter.warnings).toBe(false);

    sysvars = {
      "1234_GT_ASSOC_CFG_AC_OUTPUT": 36
    };

    inverterLists = {
      inverters: [{
        "name": "GT",
        "instance": "1234",
        "attributes": {
          "alarms": "1",
          "warnings": "1"
        }
      }],
      gts: []
    };

    devListProcessor.relocateInverters(devices, sysvars, inverterLists);
    expect(devices.gridTieInverter.alarms).toBe(false);
    expect(devices.gridTieInverter.warnings).toBe(false);
    expect(devices.inverter.alarms).toBe(true);
    expect(devices.inverter.warnings).toBe(true);
  });

});
