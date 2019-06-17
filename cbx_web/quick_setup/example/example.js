var quickSetup = new QuicKSetup("../dist/");
var devices = [{
    "name": "XW",
    "isActive": "false",
    "instance": 262217,
    "attributes": {
      "warnings": "0",
      "alarms": "0"
    }
  },
  {
    "name": "MPPT",
    "isActive": "true",
    "instance": 248853,
    "attributes": {
      "warnings": "0",
      "alarms": "0"
    }
  },
  {
    "name": "CSW",
    "isActive": "true",
    "instance": 288585,
    "attributes": {
      "warnings": "0",
      "alarms": "0"
    }
  },
  {
    "name": "SCP2",
    "isActive": "true",
    "instance": 179669,
    "attributes": {
      "warnings": "0",
      "alarms": "0"
    }
  },
  {
    "name": "AGS",
    "isActive": "true",
    "instance": 204622,
    "attributes": {
      "warnings": "0",
      "alarms": "0"
    }
  },
  {
    "name": "BATTMON",
    "isActive": "true",
    "instance": 384868,
    "attributes": {
      "warnings": "0",
      "alarms": "0"
    }
  },
  {
    "name": "GT",
    "isActive": "true",
    "instance": 468513,
    "attributes": {
      "warnings": "0",
      "alarms": "0"
    }
  },
  {
    "name": "GT",
    "isActive": "true",
    "instance": 468512,
    "attributes": {
      "warnings": "0",
      "alarms": "0"
    }
  },
  {
    "name": "HVMPPT",
    "isActive": "false",
    "instance": 1205422,
    "attributes": {
      "warnings": "1",
      "alarms": "1"
    }
  },
  {
    "name": "AGS",
    "isActive": "false",
    "instance": 144629,
    "attributes": {
      "warnings": "1",
      "alarms": "0"
    }
  }
];

var items = [{
    'name': 'Battery 1'
  },
  {
    'name': 'Battery 2'
  },
  {
    'name': 'Grid 1'
  },
  {
    'name': 'Generator 1'
  },
  {
      'name': 'Battery 1'
    },
    {
      'name': 'Battery 2'
    },
    {
      'name': 'Grid 1'
    },
    {
      'name': 'Generator 1'
    },
];
quickSetup.setAssociationItems(items);
quickSetup.setDevices(devices);
