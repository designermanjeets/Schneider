
"use strict";

angular.module('conext_gateway.utilities')
  .constant('MAX_AC_CAPACITY_KW', 10000);

// length in characters
angular.module('conext_gateway.utilities').constant('MAX_SNTP_SERVER_NAME_LEN', 30);

// ndash character. Wider than a regular dash.
angular.module('conext_gateway.utilities').constant('NDASH', '\u2013');

// Use for W/m² in paces where we can't use the HTML <sup> tag
angular.module('conext_gateway.utilities').constant('SUPERSCRIPT_TWO', '\u00B2');

// Format of the sysvar TIME.LOCAL_ISO_STR
angular.module('conext_gateway.utilities').constant('TIME_LOCAL_FORMAT', "YYYY/MM/DD HH:mm:ss");

// Schneider colors for UI elements
// Source: "UI design guidelines - PC - Technical space" (v. 1.2 / 2015-05) page 83
angular.module('conext_gateway.utilities').constant('SE_COLORS', {
  dark_spruce_green: "#007626",
  dark_lady_fern_green: "#408700",
  spruce_green: "#009530",
  light_spruce_green: "#32AD3C",
  lady_fern_green: "#4FA600",
  light_lady_fern_green: "#59BA00",
  super_light_spruce_green: "#00C35E",
  seeding_green: "#87D200",

  dark_sky_blue: "#0087CD",
  medium_blue: "#219BFD",
  sky_blue: "#42B4E6",

  fuscia_red: "#B10043",
  red: "#DC0A0A",
  warm_red: "#DC3212",
  honeysuckle_orange: "#E47F00",
  sunflower_yellow: "#FFD100",

  sky_blue_10p: "#ECF7FC",
  red_10p: "#FCEAE7",

  true_black: "#000000",
  black: "#0f0f0f",
  anthracite_grey: "#333",
  ultra_dark_grey: "#434343",
  super_dark_grey: "#505559",
  dark_grey: "#626469",
  //transparent_grey: rgba(0, 0, 0, 0.5),
  medium_grey: "#9FA0A4",
  light_grey: "#CBCBCB",
  super_light_grey: "#E6E6E6",
  ultra_light_grey_1: "#EDEDED",
  ultra_light_grey_2: "#F7F7F7",
  white: "#fff",
});

// Colors for graphs
angular.module('conext_gateway.utilities').constant('GRAPH_COLORS', [
  // Start with the Schneider colours
  // Source: "UI design guidelines - PC - Technical space" (v. 1.2 / 2015-05) page 86
  //
  // Note: We re-ordered these colors, because the default ordering has a lot of blues
  // together at the same time.
  'rgb(228, 127, 0)', // honeysuckle orange
  'rgb(26, 121, 169)', // untitled
  'rgb(220, 10, 10)', // red
  'rgb(135, 210, 0)', // seeding green

  'rgb(66, 180, 230)',
  'rgb(113, 203, 244)',
  'rgb(177, 0, 67)',
  'rgb(159, 160, 164)',
  'rgb(98, 100, 105)',
  'rgb(255, 209, 0)',
  'rgb(223, 55, 116)',
  'rgb(219, 194, 0)',

  // Inverter Comparison screen can have up to 24 colors (really!)
  // so also add in the default colors from Highcharts v4.x:
  '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
  '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1',

  // Round out with a few more colors
  '#A47D7C', // from Highcharts 2.x defaults
  '#89a54e', // From Highcharts 2.x defaults
]);

// Maintenance note: This should match $font-family-sans-serif in _conext_gateway-variables.scss
angular.module('conext_gateway.utilities').constant('FONT_FAMILY', 'Arial, "Helvetica Neue", Helvetica, sans-serif');

/* global moment */
angular.module('conext_gateway.utilities').constant('moment', moment);

/* global browserDetection */
angular.module('conext_gateway.utilities').constant('browserDetection', browserDetection);

/* global CSV */
angular.module('conext_gateway.utilities').constant('CSV', CSV);

/* global saveAs */
angular.module('conext_gateway.utilities').constant('saveAs', saveAs);

angular.module('conext_gateway.utilities').constant('startsWith', function(string, prefix) {
  if (string && typeof string.substr === 'function') {
    return string.substr(0, prefix.length) === prefix;
  } else {
    return false;
  }
});

angular.module('conext_gateway.utilities').constant('endsWith', function(string, prefix) {
  if (string && typeof string.substr === 'function') {
    return string.substr(string.length - prefix.length, string.length) === prefix;
  } else {
    return false;
  }
});
