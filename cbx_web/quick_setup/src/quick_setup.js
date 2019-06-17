function QuicKSetup(path) {
  this.setDevices = qsSetDevices;
  this.setAssociationItems = qssetAssociationItems;

  var svgService = new SVGService(path);
  var deviceList;
  var associationItems;

  function qssetAssociationItems(items) {
    associationItems = items;
    svgService.drawAssociationItems(associationItems);
  }

  function qsSetDevices(devlist) {
    deviceList = devlist;
    svgService.drawDevices(deviceList);
  }

}
