angular.module("conext_gateway.device_config")
.constant("PM32XX_device_config", {"PM32XX":{"DEV":[{"name":"/PM32XX/METER/CFG_ASSOCIATION","regtype":"uint16","access":"rw","type":"Config","shortname":"Device Association","inputType":"dropdown","scale":1,"offset":0,"read":["user01","user02","user03"],"write":["user01"],"basic":true,"enumRef":"PM32XX.METER.CFG_ASSOCIATION.ENUM","nameRef":"PM32XX.METER.CFG_ASSOCIATION.SHORTNAME","infoRef":"PM32XX.METER.CFG_ASSOCIATION.INFO","dataNotAvailable":65535},{"name":"/PM32XX/LPHD/CFG_DEVICE_NAME","regtype":"str16","access":"rw","type":"Config","shortname":"Device Name","inputType":"textbox","read":["user01","user02","user03"],"write":["user01"],"basic":true,"nameRef":"PM32XX.LPHD.CFG_DEVICE_NAME.SHORTNAME","infoRef":"PM32XX.LPHD.CFG_DEVICE_NAME.INFO"},{"name":"/PM32XX/LPHD/CFG_DEVICE_INSTANCE","regtype":"uint16","access":"rw","type":"Config","shortname":"Device Number","inputType":"textbox","scale":1,"offset":0,"read":["user01","user02","user03"],"write":["user01"],"basic":true,"nameRef":"PM32XX.LPHD.CFG_DEVICE_INSTANCE.SHORTNAME","infoRef":"PM32XX.LPHD.CFG_DEVICE_INSTANCE.INFO","dataNotAvailable":65535}]}});
