var fs = require('fs')

function login(req, res, next) {
  var data = ''
  if (req.url.startsWith('/ns/get')) {
    req.on('data', function(chunk) {
      data += chunk
    });

    req.on('end', function() {
      response(res, 'data/login.json');
    });
  } else {
    next()
  }
}

function loginok(req, res, next) {
  if (req.url.startsWith('/ns/set')) {
    response(res, 'data/loginok.json');
  } else {
    next()
  }
}

function auth(req, res, next) {
  var session = '43dc5a6f9216fe2345'

  if (req.url.startsWith('/auth')) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Status', '200');
    res.setHeader('Set-Cookie', 'session=' + session)
    res.end('{"session" : "' + session + '"}');
  } else {
    next()
  }
}

function vars(req, res, next) {
  var data = ''
  if (req.url.startsWith('/vars')) {
    req.on('data', function(chunk) {
      data += chunk
    });

    req.on('end', function() {
      console.log(data)
      if (data.includes('/SCB/NETWORK/FEC0DHCP')) {
        response(res, 'data/network.json')
      } else if (data.includes('ADMIN/DISCLCHECK')) {
        response(res, 'data/admin_disclcheck.json')
      } else if (data.includes('/SCB/RESETPW/DEFAULT')) {
        response(res, 'data/resetpw.json')
      } else if (data.includes('XBDEVLIST')) {
        response(res, 'data/xbdevlist.json')
      } else if (data.includes('inst=20098') || data.includes('id=XW20098sts')) {
        response(res, 'data/inst20098.json')
      } else if (data.includes('inst=20099') || data.includes('id=XW20099sts')) {
        response(res, 'data/inst20099.json')
      } else if (data.includes('inst=1328371') || data.includes('id=MPPT1328371sts')) {
        response(res, 'data/inst1328371.json')
      } else if (data.includes('inst=151639') || data.includes('id=SCP2151639sts')) {
        response(res, 'data/inst151639.json')
      } else if (data.includes('inst=200031') || data.includes('id=AGS200031sts')) {
        response(res, 'data/inst200031.json')
      } else if (data.includes('inst=259586') || data.includes('id=BATTMON259586sts')) {
        response(res, 'data/inst259586.json')
      } else if (data.includes('inst=835209') || data.includes('id=GT835209sts')) {
        response(res, 'data/inst835209.json')
      } else if (data.includes('inst=838217') || data.includes('id=HVMPPT838217')) {
        response(res, 'data/inst838217.json')
      } else if (data.includes('tag=Combox:Info')) {
        response(res, 'data/comboxinfo.json')
      } else if (data.includes('HMI/WINDSPEED/UNIT')) {
        response(res, 'data/configtab.json')
      } else if (data.includes('MANIFEST')) {
        response(res, 'data/manifest.json')
      } else if (data.includes('TIMEZONE')) {
        response(res, 'data/timezone.json')
      } else if (data.includes('tag=Inverter:DeviceInfo,Inverter:CurrentValue&match=BUS1_ConextCL_5')) {
        response(res, 'data/conextCL5DevInfoCurrentValue.json')
      } else if (data.includes('name=/BUS1/MBM/DEVS,HMI/TEMPERATURE/UNIT,/BUS1_CONEXTCL_5/LAST_POLL_TS')) {
        response(res, 'data/conextCL5LastPoll.json')
      } else if (data.includes('tag=Sensor:DeviceInfo,Sensor:CurrentValue&match=BUS1_IMTSOLAR_8')) {
        response(res, 'data/imtsolar8DevInfoCurrentValue.json')
      } else if (data.includes('name=/BUS1/MBM/DEVS,/BUS1_IMTSOLAR_8/LAST_POLL_TS,HMI/TEMPERATURE/UNIT')) {
        response(res, 'data/imtsolar8LastPoll.json')
      } else if (data.includes('tag=Meter:DeviceInfo,Meter:CurrentValue,Meter:Setting&match=BUS1_EM3555_3')) {
        response(res, 'data/em3555infoCurrentValueSetting3.json')
      } else if (data.includes('name=/BUS1/MBM/DEVS,/BUS1_EM3555_3/LAST_POLL_TS')) {
        response(res, 'data/em3555Address3LastPoll.json')
      } else if (data.includes('name=SERIALNUM')) {
        response(res, 'data/serialnum.json')
      } else if (data.includes('xbconfig')) {
        response(res, 'data/xbdevconfig.json');
      } else if (data.includes('name=/SYS/GRID_IN/P,/SYS/GRID_OUT/P,/SYS/GRID/V')) {
        response(res, 'data/powerflow.json');
      } else if (data.includes('name=/SCB/PASSWD/CHANGEREQ')) {
        response(res, 'data/changepasswordrequest.json');
      }
    });
  } else {
    next()
  }
}

function getdeviceoverviewitems(req, res, next) {
  var data = ''
  if (req.url.startsWith('/SB/getDeviceOverviewItems')) {
    req.on('data', function(chunk) {
      data += chunk
    });

    req.on('end', function() {
      console.log(data)
      if (data.includes('deviceType=Inverter')) {
        response(res, 'data/overviewInverter.json')
      } else if (data.includes('deviceType=Meter')) {
        response(res, 'data/overviewMeter.json')
      } else if (data.includes('deviceType=Sensor')) {
        response(res, 'data/overviewSensor.json')
      }
    });
  } else if (req.url.startsWith('/SB/getAlarmWarningInfo')) {
    req.on('data', function(chunk) {
      data += chunk
    });

    req.on('end', function() {
      console.log(data)
      if (data.includes('PageType=active')) {
        response(res, 'data/activeAlarms.json')
      }
    });

  } else {
    next()
  }
}

function response(res, filename) {
  var data

  console.log("sending response from " + filename)
  data = fs.readFileSync(filename)

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end(data);
}

module.exports = {
  login: login,
  loginok: loginok,
  auth: auth,
  vars: vars,
  getdeviceoverviewitems: getdeviceoverviewitems
};
