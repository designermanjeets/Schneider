angular.module("conext_gateway.device_config")
.constant("CL25_device_config", {"CL25":{"DEV":[{"name":"/CL25/ASSOC/CFG_AC_OUTPUT","regtype":"uint16","access":"rw","type":"Config","shortname":"Device Association","inputType":"dropdown","scale":1,"offset":0,"read":["user01","user02","user03"],"write":["user01"],"basic":true,"enumRef":"CL25.ASSOC.CFG_AC_OUTPUT.ENUM","nameRef":"CL25.ASSOC.CFG_AC_OUTPUT.SHORTNAME","infoRef":"CL25.ASSOC.CFG_AC_OUTPUT.INFO","dataNotAvailable":65535},{"name":"/CL25/LPHD/CFG_DEVICE_NAME","regtype":"str16","access":"rw","type":"Config","shortname":"Device Name","inputType":"textbox","read":["user01","user02","user03"],"write":["user01"],"basic":true,"nameRef":"CL25.LPHD.CFG_DEVICE_NAME.SHORTNAME","infoRef":"CL25.LPHD.CFG_DEVICE_NAME.INFO"},{"name":"/CL25/LPHD/CFG_DEVICE_INSTANCE","regtype":"uint16","access":"rw","type":"Config","shortname":"Device Number","inputType":"textbox","scale":1,"offset":0,"read":["user01","user02","user03"],"write":["user01"],"basic":true,"nameRef":"CL25.LPHD.CFG_DEVICE_INSTANCE.SHORTNAME","infoRef":"CL25.LPHD.CFG_DEVICE_INSTANCE.INFO","dataNotAvailable":65535}]}});
