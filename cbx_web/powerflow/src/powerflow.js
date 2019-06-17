function Powerflow(path) {
  this.update = pfUpdate;
  this.onChargerClick = pfOnChargerClick;
  this.onInverterClick = pfOnInverterClick;
  this.onGridTieInverterClick = pfOnGridTieInverterClick;
  this.onInverterChargerClick = pfOnInverterChargerClick;
  this.onBattmonClick = pfOnBattmonClick;
  this.onGeneratorClick = pfOnGeneratorClick;
  this.chargerClick = pfChargerClick;
  this.inverterClick = pfInverterClick;
  this.gridTieInverterClick = pfGridTieInverterClick;
  this.inverterChargerClick = pfInverterChargerClick;
  this.battmonClick = pfBattomClick;
  this.generatorClick = pfGeneratorClick;
  this.stopAnimation = pfStopAnimation;

  var devListProcessor = new DevListProcessor();
  var batteryAssociationProcessor = new BatteryAssociationProcessor();
  var svgService = new SVGService(path);
  var deviceInfo;

  function pfUpdate(info) {
    var sysvars = info.sysvars;
    deviceInfo = devListProcessor.processDeviceList(info.DEVLIST);
    devListProcessor.relocateInverters(deviceInfo.powerflow, sysvars, deviceInfo.devices);
    devListProcessor.processGenerator(deviceInfo.powerflow.generator, sysvars);
    devListProcessor.processBatteries(deviceInfo.powerflow.batteries, sysvars, batteryAssociationProcessor.processAssociations(sysvars, deviceInfo.devices.battmons));
    devListProcessor.processCharger(deviceInfo.powerflow.charger, sysvars);
    devListProcessor.processInverterCharger(deviceInfo.powerflow.inverterCharger, sysvars);
    devListProcessor.processGridTieInverter(deviceInfo.powerflow.gridTieInverter, sysvars);
    devListProcessor.processInverter(deviceInfo.powerflow.inverter, sysvars);
    devListProcessor.processLoad(deviceInfo.powerflow, sysvars);
    devListProcessor.processGrid(deviceInfo.powerflow, sysvars);
    svgService.updateSVG(deviceInfo, this, sysvars);
  }

  function pfStopAnimation() {
    svgService.stopAnimation();
  }

  function pfOnChargerClick(callback) {
    this.pfChargerCallback = callback;
  }

  function pfOnInverterClick(callback) {
    this.pfInverterCallback = callback;
  }

  function pfOnGridTieInverterClick(callback) {
    this.pfGridTieInverterCallback = callback;
  }

  function pfOnInverterChargerClick(callback) {
    this.pfInverterChargerCallback = callback;
  }

  function pfOnBattmonClick(callback) {
    this.pfBattmonCallback = callback;
  }

  function pfOnGeneratorClick(callback) {
    this.pfGeneratorCallback = callback;
  }

  function pfChargerClick() {
    var chargers = null;
    if (deviceInfo && deviceInfo.devices) {
      chargers = deviceInfo.devices.chargers;
    }
    if (this.pfChargerCallback) {
      this.pfChargerCallback(chargers);
    }
  }

  function pfInverterClick() {
    var inverters = null;
    if (deviceInfo && deviceInfo.devices) {
      inverters = deviceInfo.devices.inverters;
    }
    if (this.pfInverterCallback) {
      this.pfInverterCallback(inverters);
    }
  }

  function pfGridTieInverterClick() {
    var gts = null;
    if (deviceInfo && deviceInfo.devices) {
      gts = deviceInfo.devices.gts;
    }
    if (this.pfGridTieInverterCallback) {
      this.pfGridTieInverterCallback(gts);
    }
  }

  function pfInverterChargerClick() {
    var inverterChargers = null;
    if (deviceInfo && deviceInfo.devices) {
      inverterChargers = deviceInfo.devices.inverterChargers;
    }
    if (this.pfInverterChargerCallback) {
      this.pfInverterChargerCallback(inverterChargers);
    }
  }

  function pfBattomClick(battmonId) {
    if (this.pfBattmonCallback) {
      var battmon;
      for(var index = 0;index < deviceInfo.devices.battmons.length; index++) {
        if(deviceInfo.devices.battmons[index].instance + "" === battmonId) {
          battmon = deviceInfo.devices.battmons[index];
        }
      }
      this.pfBattmonCallback(battmon);
    }
  }

  function pfGeneratorClick() {
    var ags = null;
    if (deviceInfo && deviceInfo.devices) {
      ags = deviceInfo.devices.ags;
    }
    if (this.pfGeneratorCallback) {
      this.pfGeneratorCallback(ags);
    }
  }

  function processSysvars(sysvars) {
    var result = {};
    for (var index = 0; index < sysvars.length; index++) {
      result[sysvars[index].name.substr(1, sysvars[index].name.length).split("/").join("_")] = sysvars[index].value;
    }
    return result;
  }
}
