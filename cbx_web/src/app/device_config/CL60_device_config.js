angular.module("conext_gateway.device_config")
.constant("CL60_device_config", {"CL60":{"DEV":[{"name":"/CL60/ASSOC/CFG_AC_OUTPUT","regtype":"uint16","access":"rw","type":"Config","shortname":"Device Association","inputType":"dropdown","scale":1,"offset":0,"read":["user01","user02","user03"],"write":["user01"],"basic":true,"enumRef":"CL60.ASSOC.CFG_AC_OUTPUT.ENUM","nameRef":"CL60.ASSOC.CFG_AC_OUTPUT.SHORTNAME","infoRef":"CL60.ASSOC.CFG_AC_OUTPUT.INFO","dataNotAvailable":65535},{"name":"/CL60/LPHD/CFG_DEVICE_NAME","regtype":"str16","access":"rw","type":"Config","shortname":"Device Name","inputType":"textbox","scale":1,"offset":0,"read":["user01","user02","user03"],"write":["user01"],"basic":true,"nameRef":"CL60.LPHD.CFG_DEVICE_NAME.SHORTNAME","infoRef":"CL60.LPHD.CFG_DEVICE_NAME.INFO"},{"name":"/CL60/LPHD/CFG_DEVICE_INSTANCE","regtype":"uint16","access":"rw","type":"Config","shortname":"Device Number","inputType":"textbox","scale":1,"offset":0,"read":["user01","user02","user03"],"write":["user01"],"basic":true,"nameRef":"CL60.LPHD.CFG_DEVICE_INSTANCE.SHORTNAME","infoRef":"CL60.LPHD.CFG_DEVICE_INSTANCE.INFO","dataNotAvailable":65535}]}});
