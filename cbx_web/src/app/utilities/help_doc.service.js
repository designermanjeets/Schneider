"use strict";

angular.module('conext_gateway.utilities').factory('helpDocService',
   [ '$state', "$window",
    function($state, $window) {

        var mapping = {

            /* To Be Finalized - Not all the Help doc sections are complete or indexed
               Once I get the finalized pages from JayVergara, mapping should be updated
               - LianneM 2018/08/29 */
            "index" : 2058,
            "dashboard" : 2004,
            "dashboard.powerflow" : 2070,
            "dashboard.battery_summary" : 2066,
            "dashboard.battery_comparison" : 1012,
            "dashboard.device_overview" : 2004,
            "dashboard.energy" : 2076,
            "dashboard.energy_comparison" : 2068,
            "xbgateway" : 2004,
            "xbgateway.xbdevlist" : 2001,
            "xbgateway.oth" : 2004,
            "xbgateway.oth.events" : 2076,
            "xbgateway.oth.status" : 2004,
            "xbgateway.oth.config" : 2004,
            "xbgateway.oth.diag" : 2004,
            "xbgateway.oth.firmware" : 2004,
            "xbgateway.chg" : 2004,
            "xbgateway.chg.events" : 2004,
            "xbgateway.chg.status" : 2004,
            "xbgateway.chg.config" : 2004,
            "xbgateway.chg.diag" : 2004,
            "xbgateway.chg.firmware" : 2004,
            "xbgateway.chg.performance" : 2004,
            "xbgateway.invchg" : 2004,
            "xbgateway.invchg.events" : 2004,
            "xbgateway.invchg.status" : 2004,
            "xbgateway.invchg.config" : 2004,
            "xbgateway.invchg.diag" : 2004,
            "xbgateway.invchg.firmware" : 2004,
            "xbgateway.invchg.performance" : 2004,
            "xbgateway.inverters.events" : 2004,
            "xbgateway.inverters.status" : 2004,
            "xbgateway.inverters.config" : 2004,
            "xbgateway.inverters.diag" : 2004,
            "xbgateway.inverters.firmware" : 2004,
            "xbgateway.inverters.performance" : 2004,
            "xbgateway.inverters" : 2004,
            "xbgateway.inverters.unknown_inverter" : 2004,
            "xbgateway.inverters.details" : 2004,
            "xbgateway.meters" : 2004,
            "xbgateway.meters.unknown_meter" : 2004,
            "xbgateway.meters.details" : 2004,
            "xbgateway.sensors" : 2004,
            "xbgateway.sensors.unknown_sensor" : 2004,
            "xbgateway.sensors.details" : 2004,
            "events" : 2004,
            "events.active" : 2079,
            "events.historical" : 2077,
            "gateway" : 2004,
            "gateway.configuration" : 2047,
            "gateway.data_export" : 2004,
            "gateway.manage_passwords" : 2044,
            "gateway.network" : 2043,
            "gateway.notifications" : 2041,
            "gateway.gateway_info" : 2004,
            "gateway.gateway_manifest" : 2004,
            "gateway.detection" : 2048,
            "smart_install" : 2004,
            "smart_install.home" : 2004,
            "smart_install.plant_setup" : 2004,
            "smart_install.detect_devices" : 2004,
            "smart_install.test_conext_insight" : 2004,
            "smart_install.change_password" : 2004,
            "smart_install.summary" : 2004,
            "smart_install_tab" : 2004,
            "smart_install_tab.home" : 2004,
            "smart_install_tab.plant_setup" : 2004,
            "smart_install_tab.detect_devices" : 2004,
            "smart_install_tab.test_conext_insight" : 2004,
            "smart_install_tab.change_password" : 2004,
            "smart_install_tab.summary" : 2004,
            "disclaimer" : 2004,
            "changePassword" : 2044,
            "resetCode" : 2059
        };

        var helpWindow;

        var service = {
          loadDoc : loadDoc
        };

        return service;

        function getId () {
            var source = $state.current.name;
            var id = 1000;

            console.log(source);
            if (mapping[source] != undefined) {
                id = mapping[source];
            }
            else {
                console.log(source + " not found in help doc mapping");
            }

            return id;
        }

        function loadDoc() {

            var url = "docs/userguide/" + "Default.htm#cshid=" + getId();
            console.warn('opening help doc', url);

            /* if the help window/tab is already open, use it */
            if (helpWindow && !helpWindow.closed) {
                helpWindow.location.href = url;
                helpWindow.focus();
            }
            /* otherwise, open a new window/tab */
            else {
                helpWindow = $window.open(url, "_blank");
            }
        }
    }
]);
