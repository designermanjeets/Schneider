var pages = {
  //preformance
  "dashboard": "/#/performance/dashboard",
  "pv_plant_comparison": "/#/performance/pv_plant",
  //devices
  "device_overview": "/#/devices/devices_overview",
  "detection": "/#/devices/detection",
  "inverters": "/#/devices/inverters",
  "meters": "/#/devices/meters",
  "sensors": "/#/devices/sensors",
  //events
  "active_alarms": "/#/events/active_alarms",
  "active_warnings": "/#/events/active_warnings",
  "historical_alarms": "/#/events/historical_alarms",
  "historical_warnigns": "/#/events/historical_warnings",
  //smart box
  "gateway_info": "/#/gateway/gateway_info",
  "configuration": "/#/gateway/configuration",
  "network": "/#/gateway/network",
  "data_export": "/#/gateway/data_export",
  "notifications": "/#/gateway/notifications",
  "manage_passwords": "/#/gateway/manage_passwords"
}
var url = browser.baseUrl;

exports.navigate = function (page) {
  if (pages[page] !== undefined) {
    browser.get('http://' + url + pages[page]);
    browser.sleep(3000);
    browser.waitForAngular();
  }
}
